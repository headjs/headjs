module.exports = function (grunt) {

    // Project configuration
    grunt.initConfig({
        // load package information
        pkg: grunt.file.readJSON('package.json'),

        // task: unit tests
        qunit: {
            files: ['test/unit/1.0.0/index-travis.html']
        }
    });


    grunt.loadNpmTasks('grunt-contrib-qunit');




    // register: unit tests
    grunt.registerTask('test', 'qunit');
};