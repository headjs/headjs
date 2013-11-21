module("Conf");

// INFO: Must be last test since it is loading HeadJS while running tests, which in turn already relies on HeadJS
// If run as last test in suite it should be ok, since it shouldn't be a problem if we overwrite HeadJS stuff at the end

// only sync tests use expect()
// http://qunitjs.com/cookbook/#synchronous-callbacks

asyncTest("head_conf", 1, function() {
    head_conf = { head: "headJS" };
    head.load(libs.head(), function () {
        ok(!!headJS, "callback: headJS");

        // reset
        head = headJS;

        start();
    });
});