// You can write more code here

/* START OF COMPILED CODE */

class PathFindingTest extends Phaser.Scene {

	constructor() {
		super("PathFindingTest");

		/* START-USER-CTR-CODE */
		// Write your code here.
		/* END-USER-CTR-CODE */
	}

	/** @returns {void} */
	editorCreate() {

		this.events.emit("scene-awake");
	}

	/* START-USER-CODE */

	// Write your code here
	MAP_WIDTH = 50;
	MAP_HEIGHT = 50;
	TILE_WIDTH = 10;
	TILE_HEIGHT = 10;
	maze = [];


	REQUEST_PER_INTERVAL = 400;
	INTERVAL_LENGTH = 100; //ms

	easyStar = null;

	create() {

		this.editorCreate();

		//worker
		let pathFindingWorkers = [];
		let numCores = 7;
		let workerIndex = 0;
		for(let i=0; i<numCores; i++){
			let temp  = new Worker('assets/client/workers/PathFinder.js');
			temp.onmessage = (e) =>{
				// console.log(e.data);
				completed ++;
				statusText.setText(`${requested}/${completed}, diff: ${requested - completed - this.REQUEST_PER_INTERVAL}`);
			}
			pathFindingWorkers.push(temp);
		}

		// let pathFindingWorker = new Worker('assets/client/workers/PathFinder.js');
		// pathFindingWorker.onmessage = (e) =>{
		// 	console.log(e.data);
		// 	completed ++;
		// 	statusText.setText(`${requested}/${completed}, diff: ${requested - completed - this.REQUEST_PER_INTERVAL}`);
		// }

		//map creation
		let data = this.generateMap(this.MAP_WIDTH, this.MAP_HEIGHT);
		let mapData = data.mapData;
		let mazeWalkable = data.walkable;
		let mazeNonWalkable = data.nonWalkable;
		this.createMaze(mapData);

		//UI
		let tile = undefined;
		let isRunning = false;
		let interval = undefined;
		let requested = 0;
		let completed = 0;
		let conditionText = this.add.text(500, 50, 'condition');
		let statusText = this.add.text(500, 100, 'status');
		this.add.text(500, 0, 'Start').setInteractive().on('pointerdown', () => {
			if (!isRunning) {
				conditionText.setText(`worker=${numCores},${(1000 / this.INTERVAL_LENGTH) * this.REQUEST_PER_INTERVAL} requests per second`);
				isRunning = true;

				//set up workers
				for(let i=0; i<pathFindingWorkers.length; i++){
					pathFindingWorkers[i].postMessage({
						command: 'set',
						mapData: mapData,
						wokerID: i,
					});
				}

				//worker interval
				interval = setInterval(() => {
					//web worker
					// for(let i=0; i<this.REQUEST_PER_INTERVAL; i++){
					// 	requested ++;
					// 	tile = mazeWalkable[Math.floor(Math.random() * mazeWalkable.length)];
					// 	pathFindingWorkers[workerIndex].postMessage({
					// 		command: 'find',
					// 		start: {x: 0, y: 0},
					// 		end: {x: tile.x, y: tile.y},
					// 	});
					// 	workerIndex = (workerIndex + 1) % numCores;
						// console.log(workerIndex);
					// }

					// regular
					for(let i=0; i<this.REQUEST_PER_INTERVAL; i++){
						requested ++;
						tile = mazeWalkable[Math.floor(Math.random() * mazeWalkable.length)];
						this.easyStar.findPath(0, 0, tile.x, tile.y, (p) => {
							completed ++;
						});
						this.easyStar.calculate();
						statusText.setText(`${requested}/${completed}, diff: ${requested - completed - this.REQUEST_PER_INTERVAL}`);
					}
				}, this.INTERVAL_LENGTH);
			}
		});
		this.add.text(500, 25, 'Stop').setInteractive().on('pointerdown', () => {
			isRunning = false;
			// pathFindingWorker.terminate();
			clearInterval(interval);
		});


		//path finding
		this.easyStar = new EasyStar.js();
		this.easyStar.setGrid(mapData);
		this.easyStar.setAcceptableTiles([0]);
		this.easyStar.enableDiagonals();

		// this.easyStar.findPath(0,0, 7,1, (p)=>{console.log(p)});
		// this.easyStar.calculate();

		console.log(mazeWalkable);

		//mouse event
		this.input.on('pointerdown', (pointer) => {
			// console.log(pointer.x, pointer.y);
			// console.log();
			let tile = this.screenToTile(pointer.x, pointer.y);
			if (tile.x >= this.MAP_WIDTH) return;
			if (tile.y >= this.MAP_HEIGHT) return;
			this.easyStar.findPath(0, 0, tile.x, tile.y, (p) => {
				console.log(p)
			});
			this.easyStar.calculate();
		}, this);
	}

	generateMap(width, height) {
		let NON_WALKABLE_CHANCE = 0.2;
		let chance = 0;
		let mapData = [];
		let walkable = [];
		let nonWalkable = [];
		for (let y = 0; y < height; y++) {
			let row = [];
			for (let x = 0; x < width; x++) {
				chance = Math.random();
				if (chance < NON_WALKABLE_CHANCE) {
					nonWalkable.push({x: x, y: y});
					row.push(1);
				} else {
					walkable.push({x: x, y: y});
					row.push(0)
				}
			}
			mapData.push(row);
		}
		return {
			mapData: mapData,
			walkable: walkable,
			nonWalkable: nonWalkable,
		}
	}

	destroyMaze() {
		for (let i = this.maze.length - 1; i >= 0; i--) {
			this.maze[i].destroy();
		}
	}

	createMaze(mapData) {
		this.destroyMaze();
		let color = 0x000000;
		for (let y = 0; y < mapData.length; y++) {
			for (let x = 0; x < mapData[0].length; x++) {
				if (mapData[y][x] == 0) {
					color = 0xffffff;
				} else if (mapData[y][x] == 1) {
					color = 0xff0000;
				}
				let temp = this.add.rectangle(this.TILE_WIDTH / 2 + x * this.TILE_WIDTH, this.TILE_HEIGHT / 2 + y * this.TILE_HEIGHT, this.TILE_WIDTH - 2, this.TILE_HEIGHT - 2);
				temp.setStrokeStyle(1, color);
				this.maze.push(temp);
			}
		}
	}

	screenToTile(x, y) {
		return {x: Math.floor(x / this.TILE_WIDTH), y: Math.floor(y / this.TILE_HEIGHT)};
	}


	/* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
class Bot {

}