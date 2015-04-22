/* jshint node: true */
'use strict';

module.exports = {
  name: 'bf-sunburst',

  included: function(app, parentAddon) {
    this._super.included(app, parentAddon);
    app.import('vendor/bf-sunburst.css');
    app.import(app.bowerDirectory + '/d3/d3.js');
  }
};
