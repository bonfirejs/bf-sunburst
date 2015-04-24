import Ember from "ember";

export default Ember.Controller.extend({
  exampleDataSource: {
    "name": "scu_chart",
    "children": [
      {
        name: "Trees",
        fill_type: "dark-green",
        description:  "Perennial",
        size: 50,
        route: "vmsVm",
        routeId: 's3h5kj2j3k1k84',
        routeLabel: 'Trees Resource',
        children: [
          {
            name: "Oak",
            description: "Trees",
            size: 25,
            children: [
              {
                name: "Eastern Oak",
                size: 25,
                children: [
                  {
                    name: "Biological",
                    size: 25,
                    children: [
                      {
                        name: "Regional",
                        size: 25,
                        children: [
                          {
                            name: "Local",
                            size: 25
                          }
                        ]
                      }
                    ]
                  }
                ]
              }
            ]
          },
          {
            name: "Chestnut",
            description: "Trees",
            size: 25
          }
        ]
      },
      {
        name: "Shrubs",
        fill_type: "light-green",
        size: 20
      }
    ]
  }
});
