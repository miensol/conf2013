'use strict';

var LIVERELOAD_PORT = 35729;
var lrSnippet = require('connect-livereload')({port: LIVERELOAD_PORT});
var mountFolder = function (connect, dir) {
    return connect.static(require('path').resolve(dir));
};

var server = require('../server/app.js');

module.exports = function (grunt) {

    // Project configuration.
    grunt.initConfig({
        // Metadata.
        pkg: grunt.file.readJSON('package.json'),
        banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
            '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
            '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
            '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
            ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */\n',
        // Task configuration.
        clean: {
            files: ['dist']
        },
        concat: {
            options: {
                banner: '<%= banner %>',
                stripBanners: true
            },
            dist: {
                src: ['components/requirejs/require.js', '<%= concat.dist.dest %>'],
                dest: 'dist/require.js'
            },
        },
        uglify: {
            options: {
                banner: '<%= banner %>'
            },
            dist: {
                src: '<%= concat.dist.dest %>',
                dest: 'dist/require.min.js'
            },
        },
        qunit: {
            files: ['test/**/*.html']
        },
        jshint: {
            gruntfile: {
                options: {
                    jshintrc: '.jshintrc'
                },
                src: 'Gruntfile.js'
            },
            app: {
                options: {
                    jshintrc: 'app/.jshintrc'
                },
                src: ['app/**/*.js']
            },
            test: {
                options: {
                    jshintrc: 'test/.jshintrc'
                },
                src: ['test/**/*.js']
            },
        },
        compass: {
            options: {
                sassDir: 'app/styles',
                cssDir: 'app/styles',
                generatedImagesDir: 'app/images/generated',
                imagesDir: 'app/images',
                javascriptsDir: 'app/scripts',
                fontsDir: 'app/styles/fonts',
                importPath: 'bower_components',
                httpImagesPath: '/images',
                httpGeneratedImagesPath: '/images/generated',
                httpFontsPath: '/styles/fonts',
                relativeAssets: false,
                dryRun: false
            },
            dist: {},
            server: {
                options: {
                    debugInfo: true
                }
            }
        },
        watch: {
            compass: {
                files: ['app/styles/{,*/}*.{scss,sass}'],
                tasks: ['compass:server']
            },
            livereload: {
                options: {
                    livereload: LIVERELOAD_PORT,
                    spawn: true
                },
                files: [
                    './index.htm',
                    'app/*.html',
                    'app/*.js',
                    'app/styles/*.css'
                ]
            }
        },
        requirejs: {
            compile: {
                options: {
                    name: 'config',
                    mainConfigFile: 'app/config.js',
                    out: '<%= concat.dist.dest %>',
                    optimize: 'none'
                }
            }
        },
        connect: {
            development: {
                options: {
                    middleware: function (connect, options) {
                        return [
                            lrSnippet,
                            server,
                            mountFolder(connect, __dirname)
                        ];
                    }
                }
            },
            production: {
                options: {
                    keepalive: true,
                    port: 8000,
                    middleware: function (connect, options) {
                        return [
                            // rewrite requirejs to the compiled version
                            function (req, res, next) {
                                if (req.url === '/components/requirejs/require.js') {
                                    req.url = '/dist/require.min.js';
                                }
                                next();
                            },
                            connect.static(options.base)
                        ];
                    }
                }
            }
        }
    });

    // These plugins provide necessary tasks.
    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

    // Default task.
    grunt.registerTask('default', ['jshint', 'qunit', 'clean', 'requirejs', 'concat', 'uglify']);
    grunt.registerTask('preview', ['connect:development', 'compass:server', 'watch']);
    grunt.registerTask('preview-live', ['default', 'connect:production']);

};
