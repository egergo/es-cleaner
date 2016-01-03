import es from 'elasticsearch';
import Promise from 'bluebird';

var client = new es.Client({
	host: process.env.ES_URL || 'localhost:9200',
	log: 'warning'
});

(async function() {
	let threshold = new Date(Date.now() - 7 * 24*60*60*1000);
	let toDelete = [];

	let defs = {
		logstash: {
			regexp: /logstash-([0-9]{4})\.([0-9]{2})\.([0-9]{2})/,
			threshold: new Date(Date.now() - 3 * 24*60*60*1000)
		},
		marvel: {
			regexp: /marvel-es-([0-9]{4})\.([0-9]{2})\.([0-9]{2})/,
			threshold: new Date(Date.now() - 3 * 24*60*60*1000)
		}
	};

	let indices = await client.indices.get({index: '_all', feature: '_settings'});
	for (let index of Object.keys(indices)) {
		for (let defName of Object.keys(defs)) {
			let def = defs[defName];
			let match = index.match(def.regexp);
			if (match) {
				let day = new Date(Date.UTC(match[1], match[2] - 1, match[3]));
				if (day < def.threshold) {
					toDelete[index] = true;
					console.log(`Index '${index} scheduled for deletion by rule ${defName}`);
				}
			}
		}
	}

	let keys = Object.keys(toDelete);
	if (keys.length) {
		console.log('Deleting...');
		await client.indices.delete({index: keys});
		console.log('Deleted');
	} else {
		console.log('No indices to delete');
	}
})();
