"use strict";

var AppRegistry = {
  runApplication: function runApplication(appKey, appParameters) {
    infoLog('Heap: Touchables are instrumented for autocapture.');
    (function (appKey, appParameters) {
      var foo = 'bar';
    }).call(this, appKey, appParameters);
  }
};
