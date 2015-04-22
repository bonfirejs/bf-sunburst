import Ember from "ember";

export default Ember.Controller.extend({
  exampleDataSource: {
    "name": "scu_chart",
    "children": [
      {
        "name": "Compute",
        "fill_type": "dark-green",
        "size": 50
      },
      {
        "name": "Test",
        "fill_type": "light-green",
        "size": 20
      }
    ]
  }
});
