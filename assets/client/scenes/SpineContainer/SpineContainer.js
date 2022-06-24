
// You can write more code here

/* START OF COMPILED CODE */

class SpineContainer extends Phaser.Scene {
	
	constructor() {
		super("SpineContainer");
		
		/* START-USER-CTR-CODE */
		// Write your code here.
		/* END-USER-CTR-CODE */
	}
	
	editorCreate() {
		
		// image
		this.add.image(1520, 960, "guapen");
		
		// image_1
		this.add.image(0, 0, "guapen");
	}
	
	/* START-USER-CODE */
	
	// Write your code here
	FONT = {fontSize: `36px`, color: `#f00`};

	preload() {
		this.load.spine('blobble', 'assets/content/spine/Blobble_rig_artwork.json', [`assets/content/spine/Blobble_rig_artwork.atlas`], false);
		this.load.image('dino', 'assets/content/dino.png');

		this.events.on('render', ()=>{
			fpsmeter.tick()
		});
	}

	create() {
	
		this.editorCreate();

		this.entityRegularContainer = this.add.container(0,0);
		this.entitySpineContainer = this.add.spineContainer(0,0);
		this.uiContainer = this.add.container(0,0);

		//no container
		this.spineNoContainers = [];
		let spineNoContainerText = this.add.text(100, 150, 'spine no container', this.FONT)
			.setInteractive({useHandCursor: true})
			.on('pointerdown', () => {
				this.spawnSpineObjectNoContainer();
			})
		this.uiContainer.add(spineNoContainerText);

		//regular container
		this.spineRegularContainers = [];
		let spineRegularContainerText = this.add.text(100, 150, 'spine regular container (object first, container second)', this.FONT)
			.setInteractive({useHandCursor: true})
			.on('pointerdown', () => {
				this.spawnSpineObjectRegularContainer();
			})
		this.uiContainer.add(spineRegularContainerText);


		//spine container (object first)
		this.spineSpineContainers = [];
		let spineSpineContainerText = this.add.text(100, 150, 'spine spine container (object first, container second)', this.FONT)
			.setInteractive({useHandCursor: true})
			.on('pointerdown', () => {
				this.spawnSpineObjectSpineContainer();
			})
		this.uiContainer.add(spineSpineContainerText);

		//spine entity (container first)
		this.spineEntityContainer = [];
		let spineEntityText = this.add.text(100, 150, 'spine spine entity (container first, object second)', this.FONT)
			.setInteractive({useHandCursor: true})
			.on('pointerdown', () => {
				this.spawnSpineEntity();
			})
		this.uiContainer.add(spineEntityText);

		//
		for(let i=0; i<this.uiContainer.list.length; i++){
			this.uiContainer.list[i].setPosition(100, 100 + 50 * i);
		}
	}

	spawnSpineObjectNoContainer(){
		for(let i=0; i<10; i++){
			let spawnX = Math.random() * 1520 ;
			let spawnY = Math.random() * 960;
			let temp = this.add.spine(spawnX, spawnY, 'blobble', 'world_idle_animation', true);
			temp.setSkinByName(`default_1`);

			//
			this.spineNoContainers.push(temp);
		}
		console.log(`Spine No Container: ${this.spineNoContainers.length}`);
	}

	spawnSpineObjectRegularContainer(){
		for(let i=0; i<10; i++){
			let spawnX = Math.random() * 1520 ;
			let spawnY = Math.random() * 960 ;
			let temp = this.add.spine(0, 0, 'blobble', 'world_idle_animation', true);
			let tempContainer = this.add.container(spawnX,spawnY);
			temp.setSkinByName(`default_1`);
			tempContainer.add(temp);
			this.entityRegularContainer.add(tempContainer);

			//
			this.spineRegularContainers.push(tempContainer);
		}
		console.log(`Spine Regular Container: ${this.spineRegularContainers.length}`);
	}

	spawnSpineObjectSpineContainer(){
		for(let i=0; i<10; i++){
			let spawnX = Math.random() * 1520 ;
			let spawnY = Math.random() * 960 ;
			let temp = this.add.spine(0, 0, 'blobble', 'world_idle_animation', true);
			let tempContainer = this.add.spineContainer(spawnX,spawnY);
			temp.setSkinByName(`default_1`);
			tempContainer.add(temp);
			this.entitySpineContainer.add(tempContainer);

			//
			this.spineSpineContainers.push(tempContainer);
		}
		console.log(`Spine Regular Container: ${this.spineSpineContainers.length}`);
	}

	//
	spawnSpineEntity(){
		for(let i=0; i<10; i++){
			let spawnX = 1520 / 2 + (Math.random() * 1520 -  1520)/2 ;
			let spawnY = 960/2 + (Math.random() * 960 - 960)/2 ;
			let temp = new SpineEntity(this, spawnX, spawnY);
			this.entitySpineContainer.add(temp);

			//
			this.spineEntityContainer.push(temp);
		}
		console.log(`Spine Regular Container: ${this.spineEntityContainer.length}`);
	}

	
	/* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here

class SpineEntity extends SpinePlugin.SpineContainer{

	constructor(scene, x, y) {
		super(scene, scene.spine, x, y);
		let temp = this.scene.add.spine(x, y, 'blobble', 'world_idle_animation', true);
		temp.setSkinByName(`default_1`);
		this.add(temp);
	}
}
