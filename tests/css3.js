/**
 * Unittests: CSS3
 */

module('CSS3');

test("Feature detection", function() {
	ok(
		($('html').hasClass('boxshadow') || $('html').hasClass('no-boxshadow')),
		'html element should contain a boxshadow feature detection class'
	);

	ok(
		($('html').hasClass('boxshadow') !== $('html').hasClass('no-boxshadow')),
		'A feature can\'t both be avaiable and not be available'
	);
});
