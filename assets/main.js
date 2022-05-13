var game;
// var easyStar = new EasyStar.js();

window.addEventListener('load', function () {

	game = new Phaser.Game({
		width: 800,
		height: 600,
		type: Phaser.AUTO,
        backgroundColor: "#242424",
		scale: {
			mode: Phaser.Scale.FIT,
			autoCenter: Phaser.Scale.CENTER_BOTH
		},
		plugins: {
			// global:[
			// 	{key:'PhaserWebWorkers', plugin:PhaserWebWorkers.Plugin, start:true},
			// ]
		}
	});
	
	// game.scene.add("Preload", Preload);
	// game.scene.add("Level", Level);
	game.scene.add("Boot", Boot, true);
	// game.scene.add("PathFindingTest", PathFindingTest);
});

class Boot extends Phaser.Scene {

	preload() {
		// this.load.pack("pack", "assets/content/preload-asset-pack.json");
		// this.load.on(Phaser.Loader.Events.COMPLETE, () => this.scene.start("Preload"));
		this.load.sceneFile('PathFindingTest','assets/client/scenes/PathFindingTest.js');
		this.load.on(Phaser.Loader.Events.COMPLETE, () => this.scene.start("PathFindingTest"));
	}



}