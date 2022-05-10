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

	TILE_WIDTH = 10;
	TILE_HEIGHT = 10;
	maze = [];

	easyStar = null;

	create() {

		this.editorCreate();

		//map creation
		let data = this.generateMap(50, 50);
		let mapData = data.mapData;
		let mazeWalkable = data.walkable;
		let mazeNonWalkable = data.nonWalkable;
		this.createMaze(mapData);


		//path finding
		this.easyStar = new EasyStar.js();
		this.easyStar.setGrid(mapData);
		this.easyStar.setAcceptableTiles([0]);
		this.easyStar.enableDiagonals();

		// this.easyStar.findPath(0,0, 7,1, (p)=>{console.log(p)});
		// this.easyStar.calculate();

		console.log(mazeWalkable);

		//keyboard event
		let tile = undefined;
		let wKey = this.input.keyboard.addKey('W');
		let isRunning = false;
		let interval = undefined;
		let requested = 0;
		let completed = 0;
		wKey.on('down', (event) => {
			if (!isRunning) {
				isRunning = true;
				interval = setInterval(() => {
					for(let i=0; i<100; i++){
						requested ++;
						tile = mazeWalkable[Math.floor(Math.random() * mazeWalkable.length)];
						this.easyStar.findPath(0, 0, tile.x, tile.y, (p) => {
							// console.log(p)
							completed ++;
						});
						this.easyStar.calculate();
						console.log(`${requested}/${completed}, diff: ${requested - completed}`);
					}
				}, 10)
			} else {
				clearInterval(interval);
			}
		})

		//mouse event
		this.input.on('pointerdown', (pointer) => {
			console.log(pointer.x, pointer.y);
			console.log();
			let tile = this.screenToTile(pointer.x, pointer.y);
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
		// let mapData = [
		// 	[0, 1, 0, 0, 0, 0, 1, 1, 0],
		// 	[0, 1, 0, 0, 0, 0, 0, 0, 0],
		// 	[0, 1, 0, 0, 0, 0, 0, 0, 0],
		// 	[0, 0, 0, 0, 1, 0, 0, 0, 0],
		// 	[0, 0, 0, 0, 1, 0, 0, 0, 0],
		// ];
		// let walkable = [];
		// let nonWalkable = [];
		// for(let y=0; y<mapData.length; y++){
		// 	for(let x=0; x<mapData[0].length; x++){
		// 		if(mapData[y][x] == 0)
		// 			walkable.push({x: x, y:y});
		// 		else if(mapData[y][x] == 1)
		// 			nonWalkable.push({x: x, y:y});
		// 	}
		// }
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