'use strict';
var path = require('path');

module.exports = function(grunt) {
	var shellTask = function(task, name, async){
        return {
            command: task,
            options: {
                stdout: true,
                stderr: true,
                async: async || false,
                execOptions: {
                    cwd: path.join(__dirname, name)
                }
            }
        };
    };
    var cleanTask = function(name) {
		return shellTask('grunt clean', name);
	};
    var sharedServerTask = function(name){
        return shellTask(' C:/Users/piotr_000/AppData/Roaming/npm/grunt.cmd shared-server --verbose --debug', name, true);
    };

	grunt.initConfig({
		// Metadata.
		pkg: grunt.file.readJSON('package.json'),
		shell: {
			'clean-angularjs': cleanTask('angularjs'),
			'clean-backbonejs': cleanTask('backbonejs'),
			'clean-knockoutjs': cleanTask('knockoutjs'),
            'shared-server-angularjs': sharedServerTask('angularjs')
		},
		express: {
			'server': {
				options: {
					server: path.resolve(__dirname, './server/app.js'),
					livereload: true, // if you just specify `true`, default port `35729` will be used
					serverreload: true
				},
				serverreload: true
			}
		}
	});

	grunt.loadNpmTasks('grunt-shell');
	grunt.loadNpmTasks('grunt-express');


	grunt.registerTask('server', ['shell:shared-server-angularjs', 'express:server']);
	grunt.registerTask('clean', ['shell:clean-angularjs', 'shell:clean-backbonejs', 'shell:clean-knockoutjs']);

};