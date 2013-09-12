(function(){
  var testStart = QUnit.testStart;
  QUnit.testStart = function() {
    QUnit.config.current.step = 0;
    testStart.apply(null, arguments);
  };
}(undefined));
