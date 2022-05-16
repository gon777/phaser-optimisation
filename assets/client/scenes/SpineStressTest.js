
// You can write more code here

/* START OF COMPILED CODE */

class SpineStressTest extends Phaser.Scene {
	
	constructor() {
		super("SpineStressTest");
		
		/* START-USER-CTR-CODE */
		// Write your code here.
		/* END-USER-CTR-CODE */
	}
	
	editorCreate() {
		
		// hihihi
		const hihihi = this.add.text(561, 350, "", {});
		hihihi.text = "New text";
	}
	
	/* START-USER-CODE */
	
	// Write your code here

	preload(){
		this.load.spine('blobble', 'assets/content/spine/Blobble_rig_artwork.json', [`assets/content/spine/Blobble_rig_artwork.atlas`], false);
	}
	
	create() {
	
		this.editorCreate();

		this.add.text(100, 25, 'ZOOM IN');
		this.add.text(200, 25, 'ZOOM OUT');
		this.add.text(100, 50, 'ADD');
		this.add.text(200, 50, 'REMOVE');
		this.add.text(500, 0, 'BLOBBLE COUNT: 0');

		console.log(window.SpinePlugin);

		let b = this.add.spine(1520/2, 960/2, 'blobble', 'idle_animation', true);
		b.setSkinByName(`default_1`);

	}
	
	/* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
