
/**
 * Unittests: CSS3
 */

var klasses = " " + document.documentElement.className;

function hasClass(klass) {
    return klasses.indexOf(" " + klass) !== -1;
}

module('CSS3');

test("Feature detection", function() {
    
    ok(hasClass('boxshadow') || hasClass('no-boxshadow'), 'html element contains boxshadow feature detection');
    
    ok(hasClass('boxshadow') !== hasClass('no-boxshadow'), 'feature and no-feature cannot co-exist');
    
});
