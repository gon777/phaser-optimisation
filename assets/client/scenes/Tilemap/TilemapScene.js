
// You can write more code here

/* START OF COMPILED CODE */

class TilemapScene extends Phaser.Scene {
	
	constructor() {
		super("TilemapScene");
		
		/* START-USER-CTR-CODE */
		// Write your code here.
		/* END-USER-CTR-CODE */
	}
	
	editorCreate() {
		
		// testTilemapLayer
		const testTilemapLayer = this.add.tilemap("testTilemapLayer");
		testTilemapLayer.addTilesetImage("testTileset", "testTileset");
		
		// cobblewood
		const cobblewood = this.add.tilemap("Cobblewood");
		cobblewood.addTilesetImage("forest_medium", "testTileset");
		cobblewood.addTilesetImage("forest_large", "largeForest1");
		
		// foundation_1
		const foundation_1 = cobblewood.createLayer("Foundation", ["forest_medium"], 0, 0);
		
		// floorBelowPlayer
		cobblewood.createLayer("FloorBelowPlayer", ["forest_medium"], 0, 0);
		
		// floorAbovePlayer
		cobblewood.createLayer("FloorAbovePlayer", ["forest_medium"], 0, 0);
		
		// clutter
		cobblewood.createLayer("clutter", ["forest_medium"], 0, 0);
		
		// obstacles
		cobblewood.createLayer("Obstacles", ["forest_medium"], 0, 0);
		
		// treesUpper
		cobblewood.createLayer("TreesUpper", ["forest_large"], 0, 0);
		
		// treesAbovePlayer
		cobblewood.createLayer("TreesAbovePlayer", [], 0, 0);
		
		// image
		this.add.image(798, 501, "dino");
		
		this.foundation_1 = foundation_1;
		this.testTilemapLayer = testTilemapLayer;
		this.cobblewood = cobblewood;
	}
	
	/** @type {Phaser.Tilemaps.TilemapLayer} */
	foundation_1;
	
	/* START-USER-CODE */
	
	// Write your code here


	preload(){
		this.load.image('testTileset', 'assets/content/tilemap/testTileset.png', {
			frameWidth: 256,
			frameHeight: 192,
		});
		this.load.image('largeForest1', 'assets/content/tilemap/largeForest1.png', {
			frameWidth: 256,
			frameHeight: 330,
		});
		this.load.image('dino', 'assets/content/dino.png');
		this.load.tilemapTiledJSON('testTilemapLayer', 'assets/content/tilemap/testTilemapLayer.json');
		this.load.tilemapTiledJSON('Cobblewood', 'assets/content/tilemap/Cobblewood.json');
	}
	
	create() {
	
		this.editorCreate();
		this.foundation_1.setCullPadding(0, 0);
		// const map = this.make.tilemap({ key: 'testTilemapLayer' });
		// const tileset = map.addTilesetImage('mediumForest1', 'mediumForest1')
		// map.createLayer('testTilemapLayer', tileset);
	}
	
	/* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
