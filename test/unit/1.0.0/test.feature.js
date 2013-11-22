module("Features");

// only sync tests use expect()
// http://qunitjs.com/cookbook/#synchronous-callbacks
 
var classes = " " + document.documentElement.className;

function hasClass(css) {
    return classes.indexOf(" " + css) !== -1;
}

test("hasClass(className)", function () {
    expect(1);
    
    ok(hasClass("boxshadow") || hasClass("no-boxshadow"), "box-shadow");
});