var game;
// var easyStar = new EasyStar.js();

window.addEventListener('load', function () {

	game = new Phaser.Game({
		width: 1520,
		height: 960,
		type: Phaser.AUTO,
        backgroundColor: "#242424",
		scale: {
			mode: Phaser.Scale.FIT,
			autoCenter: Phaser.Scale.CENTER_BOTH
		},
		plugins: {
			scene: [
				{ key: 'SpinePlugin', plugin: window.SpinePlugin, mapping: 'spine' }
			]
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

		// this.load.sceneFile('PathFindingTest','assets/client/scenes/PathFindingTest.js');
		// this.load.on(Phaser.Loader.Events.COMPLETE, () => this.scene.start("PathFindingTest"));

		this.load.sceneFile('SpineStressTest','assets/client/scenes/SpineStressTest.js');
		this.load.on(Phaser.Loader.Events.COMPLETE, () => this.scene.start("SpineStressTest"));
	}



}