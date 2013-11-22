module.exports = function (grunt) {
    //#region Saucelabs Browsers
    // https://saucelabs.com/docs/platforms
    var browsers = [
                    // sauce says ff25 is availiable, but times out systematically...
                    {
                        browserName: "firefox",
                        platform   : "Windows 8",
                        version    : "22"
                    },
                    {
                        browserName         : "iphone",
                        platform            : "OS X 10.8",
                        version             : "6.1",
                        "device-orientation": "portrait"
                    },
                    {
                        browserName         : "ipad",
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
                        platform: "OS X 10.6",
                        version: "5"
                    },
                    {
                        browserName: "safari",
                        platform   : "OS X 10.8",
                        version    : "6"
                    },
                    {
                        browserName: "chrome",
                        platform   : "Windows 7",
                        version    : "31"
                    },
                    {
                        browserName: "internet explorer",
                        platform   : "Windows XP",
                        version    : "7"
                    },
                    {
                        browserName: "internet explorer",
                        platform   : "Windows XP",
                        version    : "8"
                    },
                    {
                        browserName: "internet explorer",
                        platform   : "Windows 7",
                        version    : "9"
                    },
                    {
                        browserName: "internet explorer",
                        platform   : "Windows 8",
                        version    : "10"
                    },   
                    {
                        browserName: "internet explorer",
                        platform   : "Windows 8.1",
                        version    : "11"
                    }                 
                ];
    //#endregion

    // Project configuration
    grunt.initConfig({
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
                    tags         : ["master"]
                }
            }
        },
        watch: {},
        //#endregion

        // load package information ..use later for building via grunt...
        //pkg: grunt.file.readJSON("package.json"),

        // task: local unit tests
        qunit: {
            files: ['test/unit/1.0.0/index.html']
        }
    });

    // Loading dependencies
    for (var key in grunt.file.readJSON("package.json").devDependencies) {
        if (key !== "grunt" && key.indexOf("grunt") === 0) {
            grunt.loadNpmTasks(key);
        }
    }

    // register: local unit tests
    grunt.registerTask("qtest", "qunit");

    // register sauce tasks
    grunt.registerTask("dev" , ["connect", "watch"]);
    grunt.registerTask("test", ["connect", "saucelabs-qunit"]);
};