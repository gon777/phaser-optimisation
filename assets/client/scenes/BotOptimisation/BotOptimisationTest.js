// You can write more code here

/* START OF COMPILED CODE */

class BotOptimisationTest extends Phaser.Scene {

	constructor() {
		super("BotOptimisationTest");

		/* START-USER-CTR-CODE */
		// Write your code here.
		/* END-USER-CTR-CODE */
	}

	/** @returns {void} */
	editorCreate() {

		// text_1
		const text_1 = this.add.text(444, 240, "", {});
		text_1.text = "New text";

		this.events.emit("scene-awake");
	}

	/* START-USER-CODE */

	// Write your code here
	botList = [];

	preload() {
		this.load.image('dino', 'assets/content/dino.png');
	}

	create() {
		this.editorCreate();
		this.spawnBot();
		// this.dino = this.add.sprite( 200, 200, 'dino');
	}

	spawnBot() {
		let bot = new Bot(this, 200, 200);
		this.botList.push(bot);
	}

	/* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
class Bot {

	scene = null;
	isAlive = true;
	positionStart = {x: 0, y: 0};

	MOVE_SPEED = 200; //per second
	MOVE_COOLDOWN = 2000;
	WONDER_DISTANCE = 200;
	targetPosition = {x:0, y:0};
	isMoving = false;
	timeNextMove = 0;

	constructor(scene, x, y) {
		this.scene = scene;
		this.scene.events.on('update', this.update, this);

		this.container = this.scene.add.container(x, y);
		this.dino = this.scene.add.sprite(0, 0, 'dino');
		this.container.add(this.dino);
		this.positionStart = {x: x, y: y};
	}

	update(time, delta) {
		if (!this.isAlive) return;

		if(this.isMoving)
		{
			//move
		}
		else
		{
			//wait
			this.timeNextMove -= delta;
			if(this.timeNextMove <= 0){
				this.isMoving = true;
			}
		}
	}

	setAlive(isAlive) {
		this.isAlive = isAlive;
	}


}