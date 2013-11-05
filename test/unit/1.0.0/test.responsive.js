/**
 * Unittests: javascript loader
 */

module('Responsive');

test("head.touch, head.screen.width, ...", function () {
    expect(7);

    ok(typeof head.touch              === "boolean", 'head.touch');
    ok(typeof head.screen.width       === "number" , 'screen.width');
    ok(typeof head.screen.height      === "number" , 'screen.height');
    ok(typeof head.screen.innerWidth  === "number" , 'screen.innerWidth');
    ok(typeof head.screen.innerHeight === "number" , 'screen.innerHeight');
    ok(typeof head.screen.innerWidth  === "number" , 'screen.innerWidth');
    ok(typeof head.screen.innerHeight === "number" , 'screen.innerHeight');
});



