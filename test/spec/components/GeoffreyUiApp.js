'use strict';

describe('Main', function () {
  var GeoffreyUiApp, component;

  beforeEach(function () {
    var container = document.createElement('div');
    container.id = 'content';
    document.body.appendChild(container);

    GeoffreyUiApp = require('../../../src/scripts/components/GeoffreyUiApp.jsx');
    component = GeoffreyUiApp();
  });

  it('should create a new instance of GeoffreyUiApp', function () {
    expect(component).toBeDefined();
  });
});
