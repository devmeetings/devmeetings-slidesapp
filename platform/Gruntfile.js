module.exports = function(grunt) {
    'use strict';

    var fs = require('fs-extra');
    var open = require('open');

    var SERVER_PORT = 3000;

    require('time-grunt')(grunt);
    require('load-grunt-tasks')(grunt);

    var rjsOptimizationModule = function(path, module) {
        return {
            options: {
                baseUrl: 'public/' + path,
                mainConfigFile: "public/config.js",
                findNestedDependencies: true,
                name: module, // assumes a production build using almond
                out: "public/bin/" + path + '/' + module + "-" + version + ".js",
                paths: {
                    "templates": "../bin/templates",
                    "slider/bootstrap": "../bin/bootstrap",
                    "require/plugins/paths": "../bin/plugins_paths",
                    "socket.io": "empty:",
                    "ace": "empty:",
                    "ace_languageTools": "empty:"
                },
                optimize: "none"
            }
        };
    };

    var version = generateAndSaveNewVersion('.version');

    grunt.initConfig({
        copy: {
            theme: {
                src: 'public/dm-slider/theme-todr.js',
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
        jade: {
            compile: {
                files: [{
                    expand: true,
                    ext: ".html",
                    src: ["public/**/*.jade", "!public/components/**"]
                }]
            }
        },
        ngtemplates: {
            main: {
                options: {
                    module: 'slider',
                    htmlmin: {
                        collapseBooleanAttributes: true,
                        collapseWhitespace: true,
                        removeAttributeQuotes: false,
                        removeComments: true,
                        removeEmptyAttributes: true,
                        removeScriptTypeAttributes: true,
                        removeStyleLinkTypeAttributes: true
                    },
                    prefix: '/static',
                    bootstrap: function(module, script) {
                        return [
                            "define(['slider/slider'], function(slider) {",
                            "slider.run(['$templateCache', function($templateCache){",
                            script,
                            "}]);",
                            "});"
                        ].join("\n");
                    },
                    url: function(url) {
                        return url.replace('public/', '');
                    }
                },
                src: ['public/**/*.html', '!public/components/**'],
                dest: 'public/bin/templates.js'
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
                files: ['public/dm-slider/**/*.js', 'public/dm-plugins/**/*.js'],
                tasks: ['jshint:public', 'complexity'],
                options: {
                    livereload: true
                }
            },
            jade: {
                files: ['public/dm-plugins/**/*.jade'],
                tasks: [],
                options: {
                    livereload: true
                }
            },
            server: {
                files: ['./*.js', 'config/*.js', 'app/**/*.js'],
                tasks: ['jshint:server', 'complexity']
            },
            rebootServer: {
                files: ['.rebooted'],
                options: {
                    livereload: true
                }
            }
        },
        jshint: {
            public: ['public/dm-slider/**/*.js', 'public/dm-plugins/**/*.js', '!public/dm-slider/theme-todr.js', '!public/bin/**'],
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
                    cleancss: true,
                    sourceMap: true
                },
                files: (function() {
                    var files = {};
                    files['public/css/style-' + version + '.css'] = 'public/less/style.less';
                    return files;
                }())
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
                src: ['public/dm-slider/**/*.js', 'public/dm-plugins/**/*.js', '!public/dm-slider/theme-todr.js', "!public/config.js", /* Because of hashCode function */ '!public/dm-plugins/slide.sidebar-microtasks/microtasks.js', '!public/dm-slider/data-*.js', '!public/bin/**'],
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
            deck: rjsOptimizationModule('dm-slider', "slider-deck"),
            slide: rjsOptimizationModule('dm-slider', "slider-slide"),
            trainer: rjsOptimizationModule('dm-slider', "slider-trainer"),
            xplatform: rjsOptimizationModule('dm-xplatform', 'dm-xplatform')
        }
    });

    function generateAndSaveNewVersion(path) {
        // Generate new version id
        var version = new Date().getTime();
        grunt.file.write(path, version);
        return version;
    }

    grunt.registerTask('optimize-plugins-bootstrap', 'Create special bootstrap file with plugins inlined', function() {
        var async = this.async();

        var glob = require('glob');
        glob("public/dm-plugins/**/*.js", function(err, files) {
            if (err) {
                throw new Error("Cannot find plugins");
            }
            files = files.map(function(file) {
                return file.replace(/.js$/, '').replace(/^public\/dm-plugins/, 'plugins');
            });

            var mkdirp = require('mkdirp');
            mkdirp('../bin', function() {

                var bootstrap = grunt.file.read('public/dm-slider/slider/bootstrap-prod.js');
                bootstrap = bootstrap.replace('"<plugins>"', JSON.stringify(files));
                grunt.file.write("public/bin/bootstrap.js", bootstrap);

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

    grunt.registerTask('optimize', ['optimize-plugins-bootstrap', 'ngtemplates', 'requirejs']);
    grunt.registerTask('serve', ['copy:theme', 'jshint', 'less:server', 'complexity', 'concurrent']);
    grunt.registerTask('quality', ['jshint', 'less:build', 'complexity']);
    grunt.registerTask('build', ['copy:theme', 'jshint', 'less:build', 'jade', 'optimize']);

    grunt.registerTask('default', ['serve']);
};
