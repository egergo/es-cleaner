module.exports = function(grunt) {

	require('load-grunt-tasks')(grunt);

	grunt.registerMultiTask('babelHelpers', 'Babel Helpers', function() {
		var str = require('babel-core').buildExternalHelpers(undefined, 'global');
		require('fs').writeFileSync(this.data, str);
	});

	grunt.initConfig({
  	babelHelpers: {
  		src: 'build/dist/babel-helpers.js'
  	},

		babel: {
			options: {
				babelrc: ".babelrc",
				sourceMap: 'inline'
			},
			src: {
				files: [{
					expand: true,
					cwd: 'src/',
					src: ['**/*.js'],
					dest: 'build/dist/src',
					ext: '.js'
				}]
			}
		},

		exorcise: {
			src: {
				files: [{
					expand: true,
					cwd: 'build/dist/src/',
					src: ['**/*.js'],
					dest: 'build/dist/src/',
					ext: '.js.map'
				}]
			}
		},
	});

	grunt.registerTask('default', ['babel', 'exorcise', 'babelHelpers']);

};