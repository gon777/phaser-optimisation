{
	importScripts('../../../lib/easystar-0.4.4.min.js');

	let easyStar = new EasyStar.js();
	let workerID = 0;

	onmessage = function (e) {
		// console.log(`Message Received`);
		// console.log(e.data);
		// console.log(easyStar);
		switch (e.data.command) {
			case 'set':
				easyStar.setGrid(e.data.mapData);
				easyStar.setAcceptableTiles([0]);
				easyStar.enableDiagonals();
				workerID = e.data.wokerID;
				break;
			case 'find':
				// console.log(`find path from ${JSON.stringify(e.data.start)} to ${JSON.stringify(e.data.end)}`);
				// console.log(easyStar);
				easyStar.findPath(e.data.start.x, e.data.start.y, e.data.end.x, e.data.end.y, (p) => {
					// console.log(workerID);
					postMessage(p);;
				});
				easyStar.calculate();
				break;
			default:
				console.error('a');
				break;
		}

	}
}