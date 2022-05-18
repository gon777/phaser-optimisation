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
	}

	/* START-USER-CODE */

	// Write your code here
	inScreenBlobbles = [];
	outOfScreenBlobbles = [];

	preload() {
		this.load.spine('blobble', 'assets/content/spine/Blobble_rig_artwork.json', [`assets/content/spine/Blobble_rig_artwork.atlas`], false);
		this.load.image('dino', 'assets/content/dino.png');
	}

	create() {

		this.editorCreate();
		this.blobbleContainer = this.add.spineContainer(0, 0);
		this.uiContainer = this.add.container(0, 0);

		//in screen
		let addInScreenText = this.add.text(100, 150, 'ADD IN-SCREEN', {fontSize: `24px`, color: `#f00`})
			.setInteractive({useHandCursor: true})
			.on('pointerdown', () => {
				this.spawnInScreenBlobble();
			});
		let removeInScreenText = this.add.text(100, 175, 'REMOVE IN-SCREEN', {fontSize: `24px`, color: `#f00`})
			.setInteractive({useHandCursor: true})
			.on('pointerdown', () => {
				this.destroyInScreenBlobble();
			});
		let removeAllInScreenText = this.add.text(100, 200, 'REMOVE ALL', {fontSize: `24px`, color: `#f00`})
			.setInteractive({useHandCursor: true})
			.on('pointerdown', () => {
				this.destroyAllInScreenBlobble();
			});
		let setActiveInScreenText = this.add.text(100, 225, 'SET ACTIVE', {fontSize: `24px`, color: `#f00`})
			.setInteractive({useHandCursor: true})
			.on('pointerdown', () => {
				this.toggleInScreenActive(true);
			});
		let setInactiveInScreenText = this.add.text(100, 250, 'SET INACTIVE', {fontSize: `24px`, color: `#f00`})
			.setInteractive({useHandCursor: true})
			.on('pointerdown', () => {
				this.toggleInScreenActive(false);
			});
		let setVisibleInScreenText = this.add.text(100, 275, 'SET VISIBLE', {fontSize: `24px`, color: `#f00`})
			.setInteractive({useHandCursor: true})
			.on('pointerdown', () => {
				this.toggleInScreenVisible(true);
			});
		let setInvisibleInScreenText = this.add.text(100, 300, 'SET INVISIBLE', {fontSize: `24px`, color: `#f00`})
			.setInteractive({useHandCursor: true})
			.on('pointerdown', () => {
				this.toggleInScreenVisible(false);
			});
		this.uiContainer.add(addInScreenText);
		this.uiContainer.add(removeInScreenText);
		this.uiContainer.add(removeAllInScreenText);
		this.uiContainer.add(setActiveInScreenText);
		this.uiContainer.add(setInactiveInScreenText);
		this.uiContainer.add(setVisibleInScreenText);
		this.uiContainer.add(setInvisibleInScreenText);


		//out screen
		let addOutScreenText = this.add.text(400, 150, 'ADD OUT-OF-SCREEN', {fontSize: `24px`, color: `#f00`})
			.setInteractive({useHandCursor: true})
			.on('pointerdown', () => {
				this.spawnOutOfScreenBlobble();
			});
		let removeOutScreenText = this.add.text(400, 175, 'REMOVE OUT-OF-SCREEN', {fontSize: `24px`, color: `#f00`})
			.setInteractive({useHandCursor: true})
			.on('pointerdown', () => {
				this.destroyOutOfScreenBlobble();
			});
		let removeAllOutScreenText = this.add.text(400, 200, 'REMOVE ALL', {fontSize: `24px`, color: `#f00`})
			.setInteractive({useHandCursor: true})
			.on('pointerdown', () => {
				this.destroyAllOutOfScreenBlobble();
			});
		let setActiveOutScreenText = this.add.text(400, 225, 'SET ACTIVE', {fontSize: `24px`, color: `#f00`})
			.setInteractive({useHandCursor: true})
			.on('pointerdown', () => {
				this.toggleOutScreenActive(true);
			});
		let setInactiveOutScreenText = this.add.text(400, 250, 'SET INACTIVE', {fontSize: `24px`, color: `#f00`})
			.setInteractive({useHandCursor: true})
			.on('pointerdown', () => {
				this.toggleOutScreenActive(false);
			});
		let setVisibleOutScreenText = this.add.text(400, 275, 'SET VISIBLE', {fontSize: `24px`, color: `#f00`})
			.setInteractive({useHandCursor: true})
			.on('pointerdown', () => {
				this.toggleOutScreenVisible(true);
			});
		let setInvisibleOutScreenText = this.add.text(400, 300, 'SET INVISIBLE', {fontSize: `24px`, color: `#f00`})
			.setInteractive({useHandCursor: true})
			.on('pointerdown', () => {
				this.toggleOutScreenVisible(false);
			});
		this.inScreenText = this.add.text(1000, 150, 'IN-SCREEN: 0', {fontSize: `24px`, color: `#f00`});
		this.outScreenText = this.add.text(1000, 175, 'OUT-OF-SCREEN: 0', {fontSize: `24px`, color: `#f00`});
		this.uiContainer.add(addOutScreenText);
		this.uiContainer.add(removeOutScreenText);
		this.uiContainer.add(removeAllOutScreenText);
		this.uiContainer.add(setActiveOutScreenText);
		this.uiContainer.add(setInactiveOutScreenText);
		this.uiContainer.add(setVisibleOutScreenText);
		this.uiContainer.add(setInvisibleOutScreenText);

		let restartScene = this.add.text(1000, 25, 'RESTART', {fontSize: `24px`, color: `#f00`})
			.setInteractive({useHandCursor: true})
			.on('pointerdown', () => {
				this.restartScene();
			});
		this.uiContainer.add(restartScene);

		//memory
		this.usedHeapText = this.add.text(1000, 200, '?', {fontSize: `24px`, color: `#f00`});
		this.totalHeapText = this.add.text(1000, 225, '?', {fontSize: `24px`, color: `#f00`});
		this.uiContainer.add(this.usedHeapText);
		this.uiContainer.add(this.totalHeapText);

		//zoom
		this.input.keyboard.addKey('Q').on('down', ()=>{
			this.cameras.main.setZoom(1);
		});
		this.input.keyboard.addKey('E').on('down', ()=>{
			this.cameras.main.setZoom(0.1);
		});
	}

	update(){
		this.usedHeapText.setText(`${performance.memory.usedJSHeapSize / Math.pow(1000, 2)} MB`);
		this.totalHeapText.setText(`${performance.memory.totalJSHeapSize / Math.pow(1000, 2)} MB`);
	}

	/****************
	 * In Screen
	 * *************
	 */
	spawnInScreenBlobble() {
		for (let i = 0; i < 10; i++) {
			let spawnX = 1520 / 2 + (Math.random() * 1520 - (1520 / 2 - 50));
			let spawnY = 960 / 2 + (Math.random() * 960 - (960 / 2 - 50));
			let temp = this.add.spine(spawnX, spawnY, 'blobble', 'world_idle_animation', true);
			temp.setSkinByName(`default_1`);
			// let temp = this.add.sprite(spawnX, spawnY, 'dino');
			this.inScreenBlobbles.push(temp);
			this.blobbleContainer.add(temp);
		}
		this.inScreenText.setText(`IN-SCREEN: ${this.inScreenBlobbles.length}`);
	}

	destroyInScreenBlobble() {
		if(this.inScreenBlobbles.length == 0) return;
		for (let i = 0; i < 10; i++) {
			let temp = this.inScreenBlobbles.shift();
			this.blobbleContainer.remove(temp, true);
		}
		this.inScreenText.setText(`IN-SCREEN: ${this.inScreenBlobbles.length}`);
	}

	destroyAllInScreenBlobble() {
		let length = this.inScreenBlobbles.length;
		for (let i = 0; i < length; i++) {
			let temp = this.inScreenBlobbles.pop();
			this.blobbleContainer.remove(temp, true);
		}
		this.inScreenText.setText(`IN-SCREEN: ${this.inScreenBlobbles.length}`);
	}

	toggleInScreenActive(isActive) {
		for (let i = 0; i < this.inScreenBlobbles.length; i++) {
			this.inScreenBlobbles[i].setActive(isActive);
		}
	}

	toggleInScreenVisible(isVisible) {
		for (let i = 0; i < this.inScreenBlobbles.length; i++) {
			this.inScreenBlobbles[i].setVisible(isVisible);
		}
	}

	/******************
	 * Out Screen
	 * **************
	 */
	spawnOutOfScreenBlobble() {
		for (let i = 0; i < 10; i++) {
			let spawnX = (Math.random() > 0.5 ? 1 : -1) * (1520 + 50 + Math.random() * 1000);
			let spawnY = (Math.random() > 0.5 ? 1 : -1) * (960 + 50 + Math.random() * 1000);
			let temp = this.add.spine(spawnX, spawnY, 'blobble', 'world_idle_animation', true);
			temp.setSkinByName(`default_1`);
			this.outOfScreenBlobbles.push(temp);
			this.blobbleContainer.add(temp);
		}
		this.outScreenText.setText(`OUT-OF-SCREEN: ${this.outOfScreenBlobbles.length}`);
	}

	destroyOutOfScreenBlobble() {
		if(this.outOfScreenBlobbles.length == 0) return;
		for (let i = 0; i < 10; i++) {
			let temp = this.outOfScreenBlobbles.shift();
			this.blobbleContainer.remove(temp, true);
		}
		this.outScreenText.setText(`OUT-OF-SCREEN: ${this.outOfScreenBlobbles.length}`);
	}

	destroyAllOutOfScreenBlobble() {
		let length = this.outOfScreenBlobbles.length;
		for (let i = 0; i < length; i++) {
			let temp = this.outOfScreenBlobbles.pop();
			this.blobbleContainer.remove(temp, true);
		}
		this.outScreenText.setText(`IN-SCREEN: ${this.outOfScreenBlobbles.length}`);

	}

	toggleOutScreenActive(isActive) {
		for (let i = 0; i < this.outOfScreenBlobbles.length; i++) {
			this.outOfScreenBlobbles[i].setActive(isActive);
		}
	}

	toggleOutScreenVisible(isVisible) {
		for (let i = 0; i < this.outOfScreenBlobbles.length; i++) {
			this.outOfScreenBlobbles[i].setVisible(isVisible);
		}
	}

	/********************
	 * Other
	 * **************
	 */
	restartScene(){
		// this.scene.stop('SpineStressTest');
		this.scene.restart();
	}

	/* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
