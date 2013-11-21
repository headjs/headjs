module.exports = function (grunt) {
    //#region Saucelabs Browsers
    // https://saucelabs.com/docs/platforms
    var browsers = [
                    {
                        browserName: "firefox",
                        platform   : "Windows 8",
                        version    : "25"
                    },
                    {
                        browserName         : "iphone",
                        platform            : "OS X 10.8",
                        version             : "6.1",
                        "device-orientation": "portrait"
                    },
                    {
                        browserName         : "android",
                        platform            : "Linux",
                        version             : "4.0",
                        "device-orientation": "portrait"
                    },
                    {
                        browserName: "safari",
                        platform   : "OS X 10.8",
                        version    : "6"
                    },
                    {
                        browserName: "safari",
                        platform   : "OS X 10.6",
                        version    : "5"
                    },
                    {
                        browserName: "chrome",
                        platform   : "Windows 7",
                        version    : "31"
                    },
                    {
                        browserName: "internet explorer",
                        platform   : "Windows 8.1",
                        version    : "11"
                    },
                    {
                        browserName: "internet explorer",
                        platform   : "Windows 8",
                        version    : "10"
                    },
                    {
                        browserName: "internet explorer",
                        platform   : "Windows 7",
                        version    : "9"
                    },
                    {
                        browserName: "internet explorer",
                        platform   : "Windows XP",
                        version    : "8"
                    }
                ];
    //#endregion

    // Project configuration
    grunt.initConfig({
        // load package information
        //pkg: grunt.file.readJSON("package.json"),

        //#region Saucelabs
        connect: {
            server: {
                options: {
                    base: "",
                    port: 9999
                }
            }
        },
        "saucelabs-qunit": {
            all: {
                options: {
                    urls         : ["http://127.0.0.1:9999/test/unit/1.0.0/index.html"],
                    tunnelTimeout: 10,
                    build        : process.env.TRAVIS_JOB_ID,
                    concurrency  : 3,
                    browsers     : browsers,
                    testname     : "qunit tests",
                    tags: ["master"]
                }
            }
        },
        watch: {},
        //#endregion


        // task: unit tests
        qunit: {
            files: ['test/unit/1.0.0/index-travis.html']
        }
    });


    //grunt.loadNpmTasks("grunt-contrib-qunit");
    // Loading dependencies
    for (var key in grunt.file.readJSON("package.json").devDependencies) {
        if (key !== "grunt" && key.indexOf("grunt") === 0) {
            grunt.loadNpmTasks(key);
        }
    }


    // register: unit tests
    grunt.registerTask("qtest", "qunit");

    // register sauce tasks
    grunt.registerTask("dev" , ["connect", "watch"]);
    grunt.registerTask("test", ["connect", "saucelabs-qunit"]);
};