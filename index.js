require('babel-polyfill');
require('./build/dist/babel-helpers.js');

require('source-map-support').install();

process.on('unhandledRejection', function(reason) {
	console.error('Unhandled rejection:', reason.stack); // eslint-disable-line no-console
});

require('./build/dist/src');
