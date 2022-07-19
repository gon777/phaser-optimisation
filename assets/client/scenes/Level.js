// You can write more code here

/* START OF COMPILED CODE */

class Level extends Phaser.Scene {
	
	constructor() {
		super("Level");
		
		/* START-USER-CTR-CODE */
		// Write your code here.
		/* END-USER-CTR-CODE */
	}
	
	editorCreate() {
		
		// realThingMap
		const realThingMap = this.add.tilemap("realThingMap");
		realThingMap.addTilesetImage("realThingTileset", "tileset");
		realThingMap.addTilesetImage("realThingTilesetObject", "tilesetObejct");
		
		// dino
		const dino = this.add.image(0, 0, "dino");
		
		// text_1
		const text_1 = this.add.text(400, 460, "", {});
		text_1.setOrigin(0.5, 0.5);
		text_1.text = "Phaser 3 + Phaser Editor 2D";
		text_1.setStyle({"fontFamily":"Arial","fontSize":"30px"});
		
		// container_tilemap
		const container_tilemap = this.add.container(0, 0);
		
		// tl_floor
		const tl_floor = realThingMap.createLayer("tl_floor", ["realThingTileset"], 0, 0);
		container_tilemap.add(tl_floor);
		
		// tl_tree
		const tl_tree = realThingMap.createLayer("tl_tree", ["realThingTilesetObject"], 0, 0);
		container_tilemap.add(tl_tree);
		
		// dino (components)
		new PushOnClick(dino);
		dino.emit("components-awake");
		
		this.tl_floor = tl_floor;
		this.tl_tree = tl_tree;
		this.realThingMap = realThingMap;
	}
	
	/** @type {Phaser.Tilemaps.TilemapLayer} */
	tl_floor;
	/** @type {Phaser.Tilemaps.TilemapLayer} */
	tl_tree;
	
	/* START-USER-CODE */

	// Write more your code here
	preload() {
		// this.load.worker('workerPathFinder', 'PathFinder.js');
	}

	create() {
		if (window.Worker) {
			let worker = new Worker('assets/client/workers/PathFinder.js');
			worker.postMessage('hi');
			console.log(worker);
		}
		this.editorCreate();
	}

	/* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
