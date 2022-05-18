
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

	create() {

		this.editorCreate();
	}

	/* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
