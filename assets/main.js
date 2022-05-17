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


// patch SpineGameObject for phaser3.55.2, if you place spine game object in a container these two functions are required
/*
window.SpinePlugin.SpineGameObject.prototype.addToDisplayList = function(displayList) {
	if(displayList === undefined) {
		displayList = this.scene.sys.displayList;
	}

	if(this.displayList && this.displayList !== displayList) {
		this.removeFromDisplayList();
	}

	//  Don't repeat if it's already on this list
	if(!displayList.exists(this)) {
		this.displayList = displayList;
		displayList.add(this, true);
		displayList.queueDepthSort();
	}

	return this;
};
window.SpinePlugin.SpineGameObject.prototype.removeFromDisplayList = function() {
	var displayList = this.displayList || this.scene.sys.displayList;

	if(displayList.exists(this)) {
		displayList.remove(this, true);
		displayList.queueDepthSort();
		this.displayList = null;

		// this.emit(Events.REMOVED_FROM_SCENE, this, this.scene);
		// displayList.events.emit(SceneEvents.REMOVED_FROM_SCENE, this, this.scene);
	}

	return this;
};
*/

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