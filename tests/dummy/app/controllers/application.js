import Ember from "ember";

export default Ember.Controller.extend({
  exampleDataSource: {
    "name": "scu_chart",
    "children": [
      {
        "name": "Compute",
        "fill_type": "dark-green",
        "size": 50
      }
    ]
  }
});
