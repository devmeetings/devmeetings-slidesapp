module.exports = function(grunt) {
    'use strict';

    var fs = require('fs-extra');
    var open = require('open');

    var SERVER_PORT = 3000;

    require('time-grunt')(grunt);
    require('load-grunt-tasks')(grunt);

    grunt.initConfig({
        nodemon: {
            server: {
                script: 'app.js',
                options: {
                    env: {
                        PORT: SERVER_PORT
                    },
                    watch: ['config', 'app', 'Gruntfile.js'],
                    callback: function (nodemon) {
                        nodemon.on('log', function (event) {
                            console.log(event.colour);
                        });

                        nodemon.on('config:update', function () {
                            setTimeout(function() {
                                open('http://localhost:' + SERVER_PORT);
                            }, 1000);
                        });

                        nodemon.on('restart', function () {
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
                files: ['public/less/**/**.less'],
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
            public: ['public/js/**/*.js', 'public/plugins/**/*.js', '!public/js/theme-todr.js', '!public/js/data.js'],
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
                src: ['public/js/**/*.js', 'public/plugins/**/*.js', '!public/js/theme-todr.js', '!public/js/data.js'],
                options: {
                    breakOnErrors: false,
                    errorsOnly: false,
                    cyclomatic: [3, 7, 12],
                    halstead: [8, 13, 20],
                    maintainability: 100,
                    hideComplexFunctions: false
                }
            }
        }
    });

    grunt.registerTask('hooks', 'Set up proper git hooks', function () {
        if (!fs.existsSync('./../.git/hooks/pre-push')) {
            fs.copySync('./hooks/pre-push.sample', '../.git/hooks/pre-push');
            fs.chmodSync('../.git/hooks/pre-push', '755');
        }
    });

    grunt.registerTask('serve', ['jshint', 'less:server', 'concurrent']);
    grunt.registerTask('server', function () {
        grunt.log.errorlns('Did you mean `grunt serve`?');
        grunt.log.ok('Running `serve` task');
        grunt.task.run('serve');
    });

    grunt.registerTask('build', ['jshint', 'less:build', 'complexity']);

    grunt.registerTask('default', ['serve']);
};
