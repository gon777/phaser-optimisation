if('undefined' === typeof window)
{
	importScripts('../../../lib/easystar-0.4.4.min.js');
}
{
	let easyStar = new EasyStar.js();
	let workerID = 0;

	onmessage = function (e, a) {
		// console.log(`Message Received`);
		// console.log(e.data);
		// console.log(easyStar);
debugger;
		switch (e.data.command) {
			case 'set':
				easyStar.setGrid(e.data.mapData);
				easyStar.setAcceptableTiles([0]);
				easyStar.enableDiagonals();
				workerID = e.data.wokerID;
				break;
			case 'find':
				easyStar.findPath(e.data.start.x, e.data.start.y, e.data.end.x, e.data.end.y, (p) => {
					postMessage(p);;
				});
				easyStar.calculate();
				break;
			default:
				console.error('error');
				console.error(e);
				break;
		}

	}
}