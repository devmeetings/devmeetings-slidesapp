module.exports = function(grunt) {
    'use strict';

    require('time-grunt')(grunt);
    require('load-grunt-tasks')(grunt);

    grunt.initConfig({
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

    grunt.registerTask('dev', ['less:dev']);
    grunt.registerTask('build', ['less:dist']);
    grunt.registerTask('default', ['dev']);
};
