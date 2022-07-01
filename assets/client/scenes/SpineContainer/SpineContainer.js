
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

		this.entityArray = [];
		this.entityRegularContainer = this.add.container(0,0);
		this.entitySpineContainer = this.add.spineContainer(0,0);
		this.uiContainer = this.add.container(0,0);

		//no container
		let spineNoContainerText = this.add.text(100, 150, 'spine no container', this.FONT)
			.setInteractive({useHandCursor: true})
			.on('pointerdown', () => {
				this.spawnSpineObjectNoContainer();
			})
		this.uiContainer.add(spineNoContainerText);

		//regular container
		let spineRegularContainerText = this.add.text(100, 150, 'spine regular container (object first, container second)', this.FONT)
			.setInteractive({useHandCursor: true})
			.on('pointerdown', () => {
				this.spawnSpineObjectRegularContainer();
			})
		this.uiContainer.add(spineRegularContainerText);


		//spine container (object first)
		let spineSpineContainerText = this.add.text(100, 150, 'spine spine container (object first, container second)', this.FONT)
			.setInteractive({useHandCursor: true})
			.on('pointerdown', () => {
				this.spawnSpineObjectSpineContainer();
			})
		this.uiContainer.add(spineSpineContainerText);

		//spine entity (container first)
		let spineEntityText = this.add.text(100, 150, 'spine spine entity (container first, object second)', this.FONT)
			.setInteractive({useHandCursor: true})
			.on('pointerdown', () => {
				this.spawnSpineEntity();
			})
		this.uiContainer.add(spineEntityText);

		//pet battle entity (double container)
		let petBattleEntityText = this.add.text(100, 150, 'pet battle entity (double container)', this.FONT)
			.setInteractive({useHandCursor: true})
			.on('pointerdown', () => {
				this.spawnPetBattleEntity();
			})
		this.uiContainer.add(petBattleEntityText);

		//spine object spine container regular container (spine container in regular container)
		let spineContainerContainerText = this.add.text(100, 150, 'spine object container container', this.FONT)
			.setInteractive({useHandCursor: true})
			.on('pointerdown', () => {
				this.spawnSpineObjectInSpineContainerInRegularContainer();
			})
		this.uiContainer.add(spineContainerContainerText);

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
			let dino = this.add.sprite(spawnX, spawnY, 'dino');
			let text = this.add.text(spawnX,spawnY, 'DINO');
			let rectangle = this.add.rectangle(spawnX-50, spawnY-50, 100, 100, 0xff0000);

			//
			this.entityArray.push(temp);
		}
		console.log(`Spine No Container: ${this.entityArray.length}`);
	}

	spawnSpineObjectRegularContainer(){
		for(let i=0; i<10; i++){
			//
			let spawnX = Math.random() * 1520 ;
			let spawnY = Math.random() * 960 ;

			//
			let tempContainer = this.add.container(spawnX,spawnY);

			//
			let temp = this.add.spine(0, 0, 'blobble', 'world_idle_animation', true);
			temp.setSkinByName(`default_1`);
			tempContainer.add(temp);

			//
			let dino = this.add.sprite(0, 0, 'dino');
			let text = this.add.text(0,0, 'DINO');
			let rectangle = this.add.rectangle(0-50, 0-50, 100, 100, 0xff0000);
			tempContainer.add(dino);
			tempContainer.add(text);
			tempContainer.add(rectangle);

			//
			this.entityRegularContainer.add(tempContainer);

			//
			this.entityArray.push(tempContainer);
		}
		console.log(`Spine Regular Container: ${this.entityArray.length}`);
	}

	spawnSpineObjectSpineContainer(){
		for(let i=0; i<10; i++){
			//
			let spawnX = Math.random() * 1520 ;
			let spawnY = Math.random() * 960 ;

			//
			let regularContainer = this.add.container(spawnX,spawnY);

			//spine container
			let spineContainer = this.add.spineContainer(0,0);

			//
			let temp = this.add.spine(0, 0, 'blobble', 'world_idle_animation', true);
			temp.setSkinByName(`default_1`);
			spineContainer.add(temp);

			//
			let dino = this.add.sprite(0, 0, 'dino');
			regularContainer.add(dino);
			regularContainer.add(spineContainer);

			//
			this.entitySpineContainer.add(regularContainer);

			//array
			this.entityArray.push(spineContainer);
		}
		console.log(`Spine Container: ${this.entityArray.length}`);
	}

	spawnSpineEntity(){
		for(let i=0; i<10; i++){
			let spawnX = 1520 / 2 + (Math.random() * 1520 -  1520)/2 ;
			let spawnY = 960/2 + (Math.random() * 960 - 960)/2 ;
			let temp = new SpineEntity(this, spawnX, spawnY);
			this.entitySpineContainer.add(temp);

			//
			this.entityArray.push(temp);
		}
		console.log(`Spine Entity: ${this.entityArray.length}`);
	}

	spawnPetBattleEntity(){
		for(let i=0; i<10; i++){
			let spawnX = Math.random() * 1520 / 4;
			let spawnY = Math.random() * 960 /4;
			let temp = new PetBattleEntity(this, spawnX, spawnY);
			this.entitySpineContainer.add(temp);

			//
			this.entityArray.push(temp);
		}
		console.log(`Pet battle Entity: ${this.entityArray.length}`);
	}


	//image in spine container 			in regular container = error (not rendering)

	//spine container 					in regular container = 30fps @ 170 blobbles
	spawnSpineObjectInSpineContainerInRegularContainer(){
		for(let i=0; i<10; i++){
			let spawnX = 1520  + (Math.random() * 1520 -  1520) ;
			let spawnY = 960 + (Math.random() * 960 - 960) ;

			//spine object
			let tempSpineObject = this.add.spine(0, 0, 'blobble', 'world_idle_animation', true);
			tempSpineObject.setSkinByName(`default_1`);

			//spine container
			let tempSpineContainer = this.add.spineContainer(0,0);
			tempSpineContainer.add(tempSpineObject);

			//container
			let tempContainer = this.add.container(spawnX,spawnY);
			// let tempContainer = this.add.spineContainer(spawnX,spawnY);
			let dino = this.add.sprite(0, 0, 'dino');
			tempContainer.add(dino);
			tempContainer.add(tempSpineContainer);

			//ultimate container
			this.entityRegularContainer.add(tempContainer);

			//array
			this.entityArray.push(tempSpineObject);
		}
		console.log(`Spine container container: ${this.entityArray.length}`);
	}

	
	/* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here

class PetBattleEntity extends SpinePlugin.SpineContainer{
	constructor(scene, x, y) {
		super(scene, scene.spine, x, y);
		let temp = new SpineEntity(scene, x, y);
		this.add(temp);
	}
}

class SpineEntity extends SpinePlugin.SpineContainer{

	constructor(scene, x, y) {
		super(scene, scene.spine, x, y);
		let temp = this.scene.add.spine(x, y, 'blobble', 'world_idle_animation', true);
		temp.setSkinByName(`default_1`);
		this.add(temp);

		// let dino = this.scene.add.sprite(x, y, 'dino');
		// this.add(dino);
	}
}
