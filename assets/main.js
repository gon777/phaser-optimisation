let game;
let fpsmeter;
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

	//
	fpsmeter = new FPSMeter(document.body, {
		interval:  100,     // Update interval in milliseconds.
		smoothing: 10,      // Spike smoothing strength. 1 means no smoothing.
		show:      'fps',   // Whether to show 'fps', or 'ms' = frame duration in milliseconds.
		toggleOn:  'click', // Toggle between show 'fps' and 'ms' on this event.
		decimals:  1,       // Number of decimals in FPS number. 1 = 59.9, 2 = 59.94, ...
		maxFps:    60,      // Max expected FPS value.
		threshold: 100,     // Minimal tick reporting interval in milliseconds.

		position: 'absolute',
		zIndex: 100,
		left : '10px',
		top : '10px',

		//
		theme: 'dark', // Meter theme. Build in: 'dark', 'light', 'transparent', 'colorful'.
		heat:  60,      // Allow themes to use coloring by FPS heat. 0 FPS = red, maxFps = green.

		// Graph
		graph:   1, // Whether to show history graph.
		history: 20 // How many history states to show in a graph.
	});
});


class Boot extends Phaser.Scene {

	preload() {
		this.load.pack("pack", "assets/content/preload-asset-pack.json");
		this.load.pack("pack-tilemap", "assets/content/asset-pack.json");
		// this.load.on(Phaser.Loader.Events.COMPLETE, () => this.scene.start("Preload"));

		// this.load.sceneFile('PathFindingTest','assets/client/scenes/PathFindingTest.js');
		// this.load.on(Phaser.Loader.Events.COMPLETE, () => this.scene.start("PathFindingTest"));

		// this.load.sceneFile('SpineStressTest','assets/client/scenes/SpineStressTest.js');
		// this.load.on(Phaser.Loader.Events.COMPLETE, () => this.scene.start("SpineStressTest"));

		// this.load.sceneFile('BotOptimisationTest','assets/client/scenes/BotOptimisationTest.js');
		// this.load.on(Phaser.Loader.Events.COMPLETE, () => this.scene.start("BotOptimisationTest"));

		this.load.sceneFile('TilemapScene','assets/client/scenes/Tilemap/TilemapScene.js');
		this.load.on(Phaser.Loader.Events.COMPLETE, () => this.scene.start("TilemapScene"));

		// this.load.sceneFile('SpineContainer','assets/client/scenes/SpineContainer/SpineContainer.js');
		// this.load.on(Phaser.Loader.Events.COMPLETE, () => this.scene.start("SpineContainer"));
	}
}



// patch SpineGameObject for phaser3.55.2, if you place spine game object in a container these two functions are required
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
window.SpinePlugin.SpineGameObject.prototype.destroy = function() {
	//  This Game Object has already been destroyed
	if (!this.scene || this.ignoreDestroy)
	{
		return;
	}

	if (this.preDestroy)
	{
		this.preDestroy.call(this);
	}

	this.emit(Phaser.Events.DESTROY, this);

	this.removeAllListeners();

	if (this.postPipelines)
	{
		this.resetPostPipeline(true);
	}

	if (this.displayList)
	{
		this.displayList.queueDepthSort();
		this.displayList.remove(this);
	}

	if (this.preUpdate)
	{
		this.scene.sys.updateList.remove(this);
	}

	if (this.input)
	{
		this.scene.sys.input.clear(this);

		this.input = undefined;
	}

	if (this.data)
	{
		this.data.destroy();

		this.data = undefined;
	}

	if (this.body)
	{
		this.body.destroy();

		this.body = undefined;
	}

	this.active = false;
	this.visible = false;

	this.scene = undefined;
	this.displayList = undefined;
	this.parentContainer = undefined;
};

window.SpinePlugin.SpineContainer.prototype.addToDisplayList = function(displayList) {
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
window.SpinePlugin.SpineContainer.prototype.removeFromDisplayList = function() {
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

//
console.log(Phaser.Tilemaps.TilemapLayer);
console.log(Phaser.Tilemaps.TilemapLayer.prototype);
console.log(Phaser.Tilemaps.TilemapLayer.prototype.renderWebGL);

Phaser.Tilemaps.TilemapLayer.prototype.renderWebGL = function (renderer, src, camera)
{
	var renderTiles = src.cull(camera);

	var tileCount = renderTiles.length;
	var alpha = camera.alpha * src.alpha;

	if (tileCount === 0 || alpha <= 0)
	{
		return;
	}

	var gidMap = src.gidMap;
	var pipeline = renderer.pipelines.set(src.pipeline, src);

	var getTint = function (rgb, a)
	{
		var ua = ((a * 255) | 0) & 0xff;

		return ((ua << 24) | rgb) >>> 0;
	};

	var scrollFactorX = src.scrollFactorX;
	var scrollFactorY = src.scrollFactorY;

	var x = src.x;
	var y = src.y;

	var sx = src.scaleX;
	var sy = src.scaleY;

	renderer.pipelines.preBatch(src);

	for (var i = 0; i < tileCount; i++)
	{
		// debugger;
		var tile = renderTiles[i];

		var tileset = gidMap[tile.index];

		if (!tileset)
		{
			continue;
		}

		var tileTexCoords = tileset.getTileTextureCoordinates(tile.index);

		if (tileTexCoords === null)
		{
			continue;
		}

		var texture = tileset.glTexture;

		var textureUnit = pipeline.setTexture2D(texture, src);

		var frameWidth = tileset.tileWidth;
		var frameHeight = tileset.tileHeight;

		var frameX = tileTexCoords.x;
		var frameY = tileTexCoords.y;

		// console.log('====');
		// console.log(`frameWidth: ${frameWidth}`);  //256
		// console.log(`tileWidth: ${frameHeight}`);  //330
		// console.log(`tileHeight: ${tileset.tileWidth}`);
		// console.log(`tileWidth: ${tileset.tileHeight}`);

		var tileWidth = tile.baseWidth;
		var tileHeight = tile.baseHeight;

		// debugger;
		var tw = tileset.tileWidth * 0.5;
		var th = tileset.tileHeight * 0.5;

		// tw = tw + 100;
		// th = th + 300;

		var tint = getTint(tile.tint, alpha * tile.alpha);

		pipeline.batchTexture(
			src,
			texture,
			texture.width, texture.height,
			x + ((tw + tile.pixelX) * sx), y + ((th + tile.pixelY) * sy),
			tile.width, tile.height,
			sx, sy,
			tile.rotation,
			tile.flipX, tile.flipY,
			scrollFactorX, scrollFactorY,
			tw, th,
			// tile.baseWidth * 0.5 , tileset.tileHeight * 1.5 - tile.baseHeight * 0.5,
			frameX, frameY, frameWidth, frameHeight,
			tint, tint, tint, tint, false,
			0, 0,
			camera,
			null,
			true,
			textureUnit
		);
	}

	renderer.pipelines.postBatch(src);
};