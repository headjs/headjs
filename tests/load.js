/**
 * Unittests: javascript loader
 */
module('Load');


test('Non blocking inorder execution', function () {
    equals(typeof counter1, 'undefined', 'sanity check');
    stop();
    head.js(
        {counterScript1: "helpers/counter1.js"},
        {counterScript2: "helpers/counter1.js"},
        function () {
            start();
            equals(counter1, 2, '1 + 1 == 2');

        }
    );
    // TODO: improve non-blocking detection
    equals(typeof testCounter, 'undefined', 'No counter1.js script should have run');
    //counter1 = 10;
    head.ready('counterScript2', function () {
        equals(counter1, 2, 'sanity check');
    });
    head.ready('counterScript1', function () {
        equals(counter1, 1, 'When the counter1 ready is fired, the script should be executed once');
    });
});

// create test to run the same script x times
function duplicateScriptnameTest(nrOfCalls) {

    return function () {
        var callbackCounter = 0;
        var testCounterStart = 0;
        if (typeof counter2 == 'number') {
            testCounterStart = counter2;
        }

        var allCompleted = function() {
            callbackCounter++;
            if (callbackCounter == nrOfCalls) {
                start();
                ok(true, 'Callback function should be executed ' + nrOfCalls + ' times?'); // Currently doesn't work in ff
            }
        };

        stop();
        for (var i = 0; i < nrOfCalls; i++) {
            head.js("helpers/counter2.js?makeUrlUnique=" + nrOfCalls, allCompleted);
        }
        setTimeout(function () {
            if (callbackCounter != nrOfCalls) {
                start();
                equals(callbackCounter, nrOfCalls, 'Callback function isn\'t called ' + nrOfCalls + ' times?');
            }
            equals(counter2 - testCounterStart, 1, 'Should the script be executed only once?');
        }, 250); // assume counter2.js is loaded & executed within 250 miliseconds
    };
}

test('Duplicate scriptname 2x', duplicateScriptnameTest(2));

test('Duplicate scriptname 3x', duplicateScriptnameTest(3));
