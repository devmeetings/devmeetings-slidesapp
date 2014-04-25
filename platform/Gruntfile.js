module.exports = function(grunt) {
    'use strict';

    require('time-grunt')(grunt);
    require('load-grunt-tasks')(grunt);

    grunt.initConfig({
        watch: {
            options: {
                spawn: false,
                livereload: true
            },
            less: {
                files: ['public/less/**/**.less'],
                tasks: ['less:dev']
            },
            jsPublic: {
                files: ['public/js/**/*.js', 'public/plugins/**/*.js'],
                tasks: ['jshint:public']
            },
            jsServer: {
                files: ['./*.js', 'config/*.js', 'app/**/*.js'],
                tasks: ['jshint:server']
            }
        },
        jshint: {
            public: ['public/js/**/*.js', 'public/plugins/**/*.js', '!public/js/theme-todr.js'],
            server: ['./*.js', 'config/*.js', 'app/**/*.js']
        },
        less: {
            dev: {
                files: {
                    'public/css/style.css': 'public/less/style.less'
                }
            },
            dist: {
                options: {
                    cleancss: true
                },
                files: {
                    'public/css/style.css': 'public/less/style.less'
                }
            }
        }
    });

    grunt.registerTask('serve', ['jshint', 'less:dev', 'watch']);
    grunt.registerTask('server', function () {
        grunt.log.errorlns('Did you mean `grunt serve`?');
        grunt.log.ok('Running `serve` task');
        grunt.task.run('serve');
    });

    grunt.registerTask('build', ['jshint', 'less:dist']);

    grunt.registerTask('default', ['serve']);
};
