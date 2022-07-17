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
		
		// cobblewood
		const cobblewood = this.add.tilemap("Cobblewood");
		
		this.testTilemapLayer = testTilemapLayer;
		this.cobblewood = cobblewood;
	}
	
	/* START-USER-CODE */

	// Write your code here


	preload() {
		//load bobble spine
		this.load.spine('blobble', 'assets/content/spine/Blobble_rig_artwork.json', [`assets/content/spine/Blobble_rig_artwork.atlas`], false);

		//load tilemap
		this.load.image('testTileset', 'assets/content/tilemap/tileset.png', {
			frameWidth: 256,
			frameHeight: 192,
		});
		this.load.image('largeForest1', 'assets/content/tilemap/tile_object.png', {
			frameWidth: 256,
			frameHeight: 330,
		});
		this.load.image('dino', 'assets/content/dino.png');
		this.load.tilemapTiledJSON('testTilemapLayer', 'assets/content/tilemap/testTilemapLayer.json');
		this.load.tilemapTiledJSON('Cobblewood', 'assets/content/tilemap/Cobblewood.json');

		// this.events.on('render', ()=>{
		// 	fpsmeter.tick()
		// });

	}

	create() {
		this.editorCreate();


		this.createPlayer();
		this.createBot();
	}

	createPlayer() {
		this.player = new Player(this, 0, 0);
	}

	createBot(){

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
		}, this);

		//spine object
		this.spineObject = this.scene.add.spine(0, 0, 'blobble', 'world_idle_animation', true);
		this.spineObject .setSkinByName(`default_1`);
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

class Bot extends  Phaser.GameObjects.Container{
	constructor(scene, x ,y) {
		super(scene, x, y);
	}
}
