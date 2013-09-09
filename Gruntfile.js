'use strict';
var path = require('path');

module.exports = function(grunt) {
	grunt.initConfig({
		complexity: {

		options: {
			halstead: 12
		},
			angularjs: {
				jsLintXML: 'angular-report.xml',
				src : ['./angularjs/app/scripts/**/*.js']
			},
			backbonejs: {
				jsLintXML: 'backbone-report.xml',
				src : ['./backbonejs/app/scripts/*.js']
			}
		}
	});
 	grunt.loadNpmTasks('grunt-complexity');


 	grunt.registerTask('default', ['complexity:angularjs', 'complexity:backbonejs']);
};