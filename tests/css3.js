
/**
 * Test CSS3
 */

module('CSS3');
 
var klasses = " " + document.documentElement.className;

function hasClass(klass) {
    return klasses.indexOf(" " + klass) !== -1;
}

test("basics", function() {
    
    ok(hasClass('boxshadow') || hasClass('no-boxshadow'), 'sanity check');
    
    ok(hasClass('boxshadow') !== hasClass('no-boxshadow'), 'opposite detection');
    
});
