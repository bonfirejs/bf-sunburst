/* jshint node: true */
'use strict';

module.exports = {
  name: 'bf-sunburst',

  included: function(app, parentAddon) {
    this._super.included(app, parentAddon);
    app.import('vendor/bf-sunburst.css');

    app.import(app.bowerDirectory + '/d3/d3.js');
    //app.import('/bf-sunburst/components/bf-sunburst.js');

    //app.import('addon/utils/strip-float.js');
    //app.import(app.bowerDirectory + '/bf-sunburst/addon/utils/bytes-to-readable-size.js');
    //app.import('/bf-sunburst/addon/utils/uuid.js');
  }
};
