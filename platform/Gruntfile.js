module.exports = function(grunt) {
    'use strict';

    var fs = require('fs-extra');
    var open = require('open');

    var SERVER_PORT = 3000;

    require('time-grunt')(grunt);
    require('load-grunt-tasks')(grunt);

    grunt.initConfig({
        copy: {
            theme: {
                src: 'public/js/theme-todr.js',
                dest: 'public/components/ace-builds/src-noconflict/theme-todr.js'
            }
        },
        nodemon: {
            server: {
                script: 'app.js',
                options: {
                    env: {
                        PORT: SERVER_PORT
                    },
                    watch: ['config', 'app', 'Gruntfile.js'],
                    callback: function(nodemon) {
                        nodemon.on('log', function(event) {
                            console.log(event.colour);
                        });

                        nodemon.on('config:update', function() {
                            setTimeout(function() {
                                open('http://localhost:' + SERVER_PORT);
                            }, 3000);
                        });

                        nodemon.on('restart', function() {
                            setTimeout(function() {
                                fs.writeFileSync('.rebooted', 'rebooted');
                            }, 1000);
                        });
                    }
                }
            }
        },
        watch: {
            options: {
                spawn: false
            },
            less: {
                files: ['public/**/**.less'],
                tasks: ['less:server'],
                options: {
                    livereload: true
                }
            },
            js: {
                files: ['public/js/**/*.js', 'public/plugins/**/*.js'],
                tasks: ['jshint:public'],
                options: {
                    livereload: true
                }
            },
            jade: {
                files: ['public/plugins/**/*.jade'],
                tasks: [],
                options: {
                    livereload: true
                }
            },
            server: {
                files: ['./*.js', 'config/*.js', 'app/**/*.js'],
                tasks: ['jshint:server']
            },
            rebootServer: {
                files: ['.rebooted'],
                options: {
                    livereload: true
                }
            }
        },
        jshint: {
            public: ['public/js/**/*.js', 'public/plugins/**/*.js', '!public/js/theme-todr.js', '!public/js/data.js', '!public/js/bin/**'],
            server: ['./*.js', 'config/*.js', 'app/**/*.js', 'Gruntfile.js']
        },
        less: {
            server: {
                files: {
                    'public/css/style.css': 'public/less/style.less'
                }
            },
            build: {
                options: {
                    cleancss: true
                },
                files: {
                    'public/css/style.css': 'public/less/style.less'
                }
            }
        },
        concurrent: {
            server: {
                tasks: ['nodemon', 'watch'],
                options: {
                    logConcurrentOutput: true
                }
            }
        },
        complexity: {
            build: {
                src: ['public/js/**/*.js', 'public/plugins/**/*.js', '!public/js/theme-todr.js', '!public/js/data.js', "!public/js/config.js", '!public/js/data-*.js', '!public/plugins/slide-jsmicrotasks/jsmicrotasks.js'],
                options: {
                    breakOnErrors: true,
                    errorsOnly: true,
                    cyclomatic: [5, 7, 12],
                    halstead: [10, 13, 20],
                    maintainability: 100,
                    hideComplexFunctions: false
                }
            }
        },
        requirejs: {
            compile: {
                options: {
                    baseUrl: "public/js",
                    mainConfigFile: "public/js/config.js",
                    findNestedDependencies: true,
                    name: "slider-deck", // assumes a production build using almond
                    out: "public/js/bin/slider-deck.js",
                    paths: {
                        "require/plugins/paths": "../../bin/plugins_paths",
                        "socket.io": "empty:"
                    }
                }
            }
        }
    });

    grunt.registerTask('create-plugins-paths', 'Create /require/plugins/paths file', function() {
        var async = this.async();

        var glob = require('glob');
        glob("public/plugins/**/*.js", function(err, files) {
            if (err) {
                throw new Error("Cannot find plugins");
            }
            files = files.map(function(file) {
                return file.replace(/.js$/, '').replace(/^public\//, '');
            });

            var mkdirp = require('mkdirp');
            mkdirp('bin', function() {
                grunt.file.write("bin/plugins_paths.js", 'define([], ' + JSON.stringify(files) + ');');
                async();
            });
        });
    });

    grunt.registerTask('hooks', 'Set up proper git hooks', function() {
        if (!fs.existsSync('./../.git/hooks/pre-commit')) {
            fs.copySync('./hooks/pre-commit.sample', '../.git/hooks/pre-commit');
            fs.chmodSync('../.git/hooks/pre-commit', '755');
        }
    });

    grunt.registerTask('server', function() {
        grunt.log.errorlns('Did you mean `grunt serve`?');
        grunt.log.ok('Running `serve` task');
        grunt.task.run('serve');
    });

    grunt.registerTask('optimize', ['create-plugins-paths', 'requirejs']);
    grunt.registerTask('serve', ['copy:theme', 'jshint', 'less:server', 'concurrent']);
    grunt.registerTask('build', ['copy:theme', 'jshint', 'less:build', 'complexity']);

    grunt.registerTask('default', ['serve']);
};