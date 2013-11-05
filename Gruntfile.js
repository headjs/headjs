module.exports = function (grunt) {
    grunt.initConfig({
        qunit: {
            files: ['test/unit/1.0.0/index-travis.html']
        }
    });

    grunt.loadNpmTasks('grunt-contrib-qunit');

    // A convenient task alias.
    grunt.registerTask('test', 'qunit');
};