// You can write more code here

/* START OF COMPILED CODE */

class TilemapScene extends Phaser.Scene {

	constructor() {
		super("TilemapScene");

		/* START-USER-CTR-CODE */
		// Write your code here.
		/* END-USER-CTR-CODE */
	}

	/** @returns {void} */
	editorCreate() {

		// patchTestTilemap
		const patchTestTilemap = this.add.tilemap("patchTestTilemap");
		patchTestTilemap.addTilesetImage("medium_earth_tileset", "medium_earth_tileset");
		patchTestTilemap.addTilesetImage("large_earth_tileset", "large_earth_tileset");

		// image
		const image = this.add.image(0, 0, "dino");
		image.setOrigin(0.5, 1);

		// medium_only_1
		patchTestTilemap.createLayer("medium-only", ["medium_earth_tileset"], 0, 0);

		// large_only_1
		patchTestTilemap.createLayer("large-only", ["large_earth_tileset"], 0, 0);

		this.patchTestTilemap = patchTestTilemap;

		this.events.emit("scene-awake");
	}

	/** @type {Phaser.Tilemaps.Tilemap} */
	patchTestTilemap;

	/* START-USER-CODE */

	// Write your code here


	preload() {
		//load bobble spine
		this.load.spine('blobble', 'assets/content/spine/Blobble_rig_artwork.json', [`assets/content/spine/Blobble_rig_artwork.atlas`], false);

		//load tilemap
		// this.load.image('testTileset', 'assets/content/tilemap/tileset.png', {
		// 	frameWidth: 256,
		// 	frameHeight: 192,
		// });
		// this.load.image('largeForest1', 'assets/content/tilemap/tile_object.png', {
		// 	frameWidth: 256,
		// 	frameHeight: 330,
		// });
		// this.load.image('dino', 'assets/content/dino.png');
		// this.load.tilemapTiledJSON('realThingMap', 'assets/content/tilemap/realThing/realThingMap.tmx');
		// this.load.tilemapTiledJSON('Cobblewood', 'assets/content/tilemap/Cobblewood.json');

		this.events.on('render', () => {
			fpsmeter.tick()
		});

	}

	create() {
		this.editorCreate();

		this.cameras.main.zoom = 0.5;

		this.whattodo();
		this.createPlayer();
		this.createBot();
	}

	//getTileAtWorldX is bugged phaser@3.55.2
	whattodo() {
		console.log(this.realThingMap);

		//debug
		this.add.circle(0, 0, 10, 0x6666ff);

		// let graphics = this.add.graphics();
		// graphics.fillCircle(0, 0, 50);;;;
		// this.realThingMap.renderDebugFull(graphics, {
		// 	tileColor: new Phaser.Display.Color(255, 255, 255, 100),         // null
		// });
	}


	createPlayer() {
		this.player = new Player(this, 0, 0);
	}

	createBot() {

	}

	/* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
class Player extends Phaser.GameObjects.Container {

	MOVEMENT_SPEED = 300;
	isMoving = false;
	targetPosition = {x: 0, y: 0}

	constructor(scene, x, y) {
		super(scene, x, y);

		this.scene = scene;

		//scene events
		this.scene.events.on('update', this.onUpdate, this);

		//mouse input
		this.scene.input.on('pointerdown', function (pointer) {
			this.moveTo(pointer.worldX, pointer.worldY);
			// let tileFloor = this.scene.realThingMap.getTileAtWorldXY(pointer.worldX, pointer.worldY, false, this.scene.cameras.main, 'tl_floor');
			// console.log(tileFloor);

			// let tileTree = this.scene.realThingMap.getTileAtWorldXY(pointer.worldX, pointer.worldY, false, this.scene.cameras.main, 'tl_tree');
			// console.log(tileTree);
		}, this);

		//spine object
		this.spineObject = this.scene.add.spine(0, 0, 'blobble', 'world_idle_animation', true);
		this.spineObject.setSkinByName(`default_1`);
		this.spineObject.setScale(0.8);
		this.add(this.spineObject);

		//camera follow
		this.scene.cameras.main.startFollow(this, true, 0.09, 0.09);

		//
		this.scene.add.existing(this);
	}

	moveTo(x, y) {
		this.targetPosition = {x: x, y: y}
		this.isMoving = true;
		console.log(this.targetPosition);
	}

	move(delta) {
		if (!this.isMoving) return;

		//check distance
		let squareDistance = Math.pow(this.targetPosition.x - this.x, 2) + Math.pow(this.targetPosition.y - this.y, 2);
		if (squareDistance <= 1) {
			this.isMoving = false;
			return;
		}

		//move
		let distance = Math.sqrt(squareDistance);
		let dir = {x: this.targetPosition.x - this.x, y: this.targetPosition.y - this.y};
		let normalizedDir = {x: dir.x / distance, y: dir.y / distance};
		let movementDistance = Math.min(distance, this.MOVEMENT_SPEED * delta / 1000);
		let deltaMovement = {x: normalizedDir.x * movementDistance, y: normalizedDir.y * movementDistance};
		this.x += deltaMovement.x;
		this.y += deltaMovement.y;
	}

	onUpdate(time, delta) {
		this.move(delta);
	}

}

class Bot extends Phaser.GameObjects.Container {
	constructor(scene, x, y) {
		super(scene, x, y);
	}
}
