import Ember from 'ember';
import uuid from '../utils/uuid';
import stripFloat from '../utils/strip-float';

export default Ember.Component.extend({
  width: 0,
  height: 0,
  units: 'units',
  chartTitle: '',
  chartDescription: '',
  legend: false,
  action: false,
  dataSource: null,
  totalSize: 0,
  attributeBindings: ['getId:data-id'],
  classNames: ['inline-block'],
  colors: {
    "gray": "#D7D7D7",
    "light-green": "rgb(106, 185, 117)",
    "dark-green": "#45924f",
    "blue": "rgb(86, 135, 209)",
    "dark-blue": "rgb(63, 98, 151)",
    "orange": "rgb(222, 120, 59)",
    "yellow": "#FFF79A",
    "red": "rgb(128, 21, 21)",
    "brown": "#4D3619"
  },
  getId: Ember.computed('customId', function(){
    return this.get('customId');
  }),
  isSizeDynamic: Ember.computed('dataSource', 'dataSource.isSizeDynamic', 'dataSource.@each', function() {
    return this.get('dataSource.isSizeDynamic');
  }),
  sizeMultiplier: Ember.computed('dataSource', 'dataSource.sizeMultiplier', 'dataSource.@each', function(){
    return this.get('dataSource.sizeMultiplier');
  }),
  gCustomId: Ember.computed(function() {
    return 'g' + this.get('elementId');
  }),
  explanationStyle: Ember.computed('width', 'height', function() {
    return 'width:100%; height:100%';
  }),
  customStyle: Ember.computed('width', 'height', function() {
    return 'width:100%; height:100%';
  }),
  dataSourceExists: Ember.computed('dataSource.@each', 'dataSource', function() {
    return typeof this.get('dataSource') !== 'undefined' && this.get('dataSource') !== null;
  }),
  radius: Ember.computed('width', 'height', function() {
    return Math.min(this.get('width'), this.get('height')) / 2;
  }),
  drawDetailSunburst: function(dataSource) {
    var percent = 25;
    var width = (percent / 100) * this.get('width');
    var height = (percent / 100) * this.get('height');
    var radius = Math.min(width, height) / 2;

    var self = this;
    var vis = d3.select('[data-id="'+self.get('customId')+'"] .bf-sunburst-details').append("svg:svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("id", self.get('gCustomId') + 'details')
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

    var partition = d3.layout.partition()
      .sort(null)
      .size([2 * Math.PI, radius * radius])
      .value(function(d) { return d.size; });

    var arc = d3.svg.arc().startAngle(function(d) { return d.x; })
      .endAngle(function(d) { return d.x + d.dx; })
      .innerRadius(function(d) { return Math.sqrt(d.y); })
      .outerRadius(function(d) { return Math.sqrt(d.y + d.dy); });

    d3.select('[data-id="'+self.get('customId')+'"] .bf-sunburst-details').append("text")
          .attr("r", radius)
          .style("opacity", 0);

    var path = vis.data([dataSource]).selectAll('[data-id="'+self.get('customId')+'"] .bf-sunburst-details path')
      .data(partition.nodes)
      .enter().append("path")
      .attr("display", function(d) { return d.depth ? null : "none"; }) // hide inner ring
      .attr("d", arc)
      .style("stroke", "#fff")
      .style("fill", function(d) {
        if (d.fill_type) {
          return self.get('colors')[d.fill_type];
        } else {
          return d3.scale.category20c(((d.children ? d : d.parent).name));
        }
      })
      .style("fill-rule", "evenodd")
      .style("opacity", 1);

    dataSource.children.forEach( function(item, index, enumerable){
      Ember.$('[data-id="'+self.get('customId')+'"] .bf-sunburst-details').append('<div class="bf-sunburst-details-item"> <div class="bf-sunburst-details-swatch" style="background-color:'+self.get('colors')[item.fill_type]+';"> </div><span class="bf-sunburst-details-label">' + item.name + ' ' + item.size + ' ' + self.get('units') + '</span></div>');
    });
  },
  draw: function() {
    var isHovered = Ember.$('[data-id="'+this.get('customId')+'"] .bf-sunburst-svg-container:hover').length > 0;
    if (isHovered) { return; }
    Ember.$('[data-id="'+this.get('customId')+'"] .bf-sunburst-svg-container').empty();
    var self = this;
    var vis = d3.select('[data-id="'+self.get('customId')+'"] .bf-sunburst-svg-container').append("svg:svg")
    .attr("width", "100%")
    .attr('viewBox', '0 0 300 300')
    .append("g")
    .attr("id", self.get('gCustomId'))
    .attr("transform", "translate(" + self.get('width') / 2 + "," + self.get('height') / 2 + ")");
    var partition = d3.layout.partition()
      .sort(null)
      .size([2 * Math.PI, self.get('radius') * self.get('radius')])
      .value(function(d) { return d.size; });
    var arc = d3.svg.arc()
      .startAngle(function(d) { return d.x; })
      .endAngle(function(d) { return d.x + d.dx; })
      .innerRadius(function(d) { return Math.sqrt(d.y); })
      .outerRadius(function(d) { return Math.sqrt(d.y + d.dy); });
    d3.select('[data-id="'+self.get('customId')+'"] .bf-sunburst-svg-container').append("text")
      .attr("r", self.get('radius'))
      .style("opacity", 0);
    var path = vis.data([this.get('dataSource')]).selectAll('[data-id="'+self.get('customId')+'"] .bf-sunburst-svg-container path')
      .data(partition.nodes)
      .enter().append("path")
      .attr("display", function(d) { return d.depth ? null : "none"; }) // hide inner ring
      .attr("d", arc)
      .style("stroke", "#fff")
      .style("fill", function(d) {
        if (d.fill_type) {
          return self.get('colors')[d.fill_type];
        } else if (d.dynamic_color) {
          return d.dynamic_color;
        } else {
          return d3.scale.category20c(((d.children ? d : d.parent).name));
        }
      })
      .style("fill-rule", "evenodd")
      .style("opacity", 1)
      .on("mouseover", mouseover, true);

      d3.select('[data-id="'+self.get('customId')+'"]').on("mouseleave", mouseleave);
      this.set('totalSize', path.node().__data__.value);
      defaultExplanation();
      function mouseover(d, i) {
          var percentage = 100 * d.value / self.get('totalSize');
          var percentageString = stripFloat(percentage) + "%";
          if (percentage < 0.1) {
            percentageString = "< 0.1%";
          }
          d3.select('[data-id="'+self.get('customId')+'"] .bf-sunburst-percentage')
            .text(percentageString);
          d3.select('[data-id="'+self.get('customId')+'"] .bf-sunburst-title')
            .text(d.name);
          if (self.get('isSizeDynamic')) {
            var readableSize = '';
            if (!Ember.isEmpty(self.get('sizeMultiplier'))) {
              readableSize = bytesToReadableSize(d.size, self.get('sizeMultiplier'));
            } else {
              readableSize = bytesToReadableSize(d.size);
            }
            d3.select('[data-id="'+self.get('customId')+'"] .bf-sunburst-description')
            .text(readableSize);
          } else {
            d3.select('[data-id="'+self.get('customId')+'"] .bf-sunburst-description')
            .text(d.size + " " + self.get('units'));
          }
          d3.select('[data-id="'+self.get('customId')+'"] .bf-sunburst-fill_type')
            .text(d.description);
          //d3.select('[data-id="'+self.get('customId')+'"] .sunburst-details')

          //self.set('explanationStyle', 'visibility: visible; width:'+self.get('width')+'px; height:'+self.get('height')+'px;');
          self.set('explanationStyle', 'visibility: visible; width:100%; height:100%');

          // Empty details
          Ember.$('[data-id="'+self.get('customId')+'"] .bf-sunburst-details').empty();
          // Draw Details
          if (typeof d.detailsChildren !== "undefined") {
            self.drawDetailSunburst(d.detailsChildren);
          }

          var sequenceArray = getAncestors(d);
          //updateBreadcrumbs(sequenceArray, percentageString);

          // Fade all the segments.
          d3.selectAll('[data-id="'+self.get('customId')+'"] .bf-sunburst-svg-container path')
            .style("opacity", 0.3);

          // Then highlight only those that are an ancestor of the current segment.
          vis.selectAll('[data-id="'+self.get("customId")+'"] .bf-sunburst-svg-container path')
            .filter(function(node) {
              return (sequenceArray.indexOf(node) >= 0);
            })
            .style("opacity", 1);

          // Highlight event siblings
          vis.selectAll('[data-id="'+self.get("customId")+'"] .bf-sunburst-svg-container path')
            .filter(function(node) {
              return (node.eventSiblingId !== undefined && node.eventSiblingId === d.eventSiblingId);
            })
            .style("opacity", 1);

          // Update link values
          if (!Ember.isEmpty(self.get('action'))) {
            if (!Ember.isEmpty(d.route)) {
              self.set('linkRoute', d.route);
            }
            if (!Ember.isEmpty(d.routeId)) {
              self.set('linkRouteId', d.routeId);
            }
            if (!Ember.isEmpty(d.routeLabel)) {
              var widthOfTextContainer = (30 / 100) * self.get('width');
              var d3SvgSelector = d3.select('[data-id="'+self.get('customId')+'"] .bf-sunburst-link-container');
              d3.select('[data-id="'+self.get("customId")+'"] .bf-sunburst-link')
                .text(d.routeLabel).call(svgTextEllipsis, d.routeLabel, widthOfTextContainer, d3SvgSelector);
            } else {
              d3.select('[data-id="'+self.get("customId")+'"] .bf-sunburst-link')
              .text('');
            }
          }

          function svgTextEllipsis(selection, textString, widthOfTextContainer, d3SvgSelector) {
            var widthOfText = this.node().getComputedTextLength();
            if (widthOfText > widthOfTextContainer) {
              for (var x=textString.length-3;x>0;x-=3) {
                Ember.$('.ellipsisSandbox').remove();
                var text = d3SvgSelector.append("svg:text")
                  .attr("x",  this.attr("x"))
                  .attr("y", this.attr("y"))
                  .attr("text-anchor", this.attr("text-anchor"))
                  .attr("class", "ellipsisSandbox")
                  .attr("visibility", "hidden")
                  .text(textString.substring(0,x)+"...");
                var sandboxWidth = text.node().getBBox().width;
                if (sandboxWidth <= widthOfTextContainer) {
                  selection.text(textString.substring(0,x)+"...");
                  return;
                }
              }
            }
          }
      }

      function mouseleave(d) {

          // Hide the breadcrumb trail
          //d3.select("#trail").style("visibility", "hidden");

          //Empty details
          Ember.$("[data-id="+self.get('customId')+"] .bf-sunburst-details").empty();

          // Deactivate all segments during transition.
          d3.selectAll('[data-id="'+self.get('customId')+'"] .bf-sunburst-svg-container path').on("mouseover", null);

          // Transition each segment to full opacity and then reactivate it.
          d3.selectAll('[data-id="'+self.get('customId')+'"] .bf-sunburst-svg-container path')
            .transition()
            .duration(500)
            .style("opacity", 1)
            .each("end", function() {
              d3.select(this).on("mouseover", mouseover);
            });

          //self.set('explanationStyle', 'width:'+self.get('width')+'px; height:'+self.get('height')+'px;');
          self.set('explanationStyle', 'visibility: visible; width:100%; height:100%');
          defaultExplanation();
      }
      function defaultExplanation() {
          d3.select('[data-id="'+self.get('customId')+'"] .bf-sunburst-percentage')
            .text(self.get('chartTitle'));
          d3.select('[data-id="'+self.get('customId')+'"] .bf-sunburst-title')
            .text('');
          d3.select('[data-id="'+self.get('customId')+'"] .bf-sunburst-description')
            .text(self.get('chartTitle'));
          d3.select('[data-id="'+self.get('customId')+'"] .bf-sunburst-fill_type')
            .text('');
          d3.select('[data-id="'+self.get('customId')+'"] .bf-sunburst-details')
          .text('');
          d3.select('[data-id="'+self.get('customId')+'"] .bf-sunburst-link')
          .text('');
          self.set('linkRoute', '');
          self.set('linkRouteId', '');
      }

      function getAncestors(node) {
        var path = [];
        var current = node;
        while (current.parent) {
          path.unshift(current);
          current = current.parent;
        }
        return path;
      }

      function drawLegend() {

        // Dimensions of legend item: width, height, spacing, radius of rounded rect.
        var li = {
          w: 75, h: 30, s: 3, r: 3
        };

        var legend = d3.select('[data-id="'+self.get('customId')+'"] .bf-sunburst-legend').append("svg:svg")
            .attr("width", li.w)
            .attr("height", d3.keys(self.get('colors')).length * (li.h + li.s));

        var g = legend.selectAll("g")
            .data(d3.entries(self.get('colors')))
            .enter().append("svg:g")
            .attr("transform", function(d, i) {
                    return "translate(0," + i * (li.h + li.s) + ")";
                 });

        g.append("svg:rect")
            .attr("rx", li.r)
            .attr("ry", li.r)
            .attr("width", li.w)
            .attr("height", li.h)
            .style("fill", function(d) { return d.value; });

        g.append("svg:text")
            .attr("x", li.w / 2)
            .attr("y", li.h / 2)
            .attr("dy", "0.35em")
            .attr("text-anchor", "middle")
            .text(function(d) { return d.key; });
      }
      if (self.get('legend')) { drawLegend(); }
  },
  actions: {
    changeRoute: function(route, routeId) {
      this.sendAction('action', route, routeId);
    }
  },
  dataSourceObserver: Ember.observer('dataSource.@each', 'dataSource.isSizeDynamic', function() {
    if (!Ember.isEmpty(this.get('dataSource.units'))) {
      this.set('units', this.get('dataSource.units'));
    }
    this.draw();
  }),
  didInsertElement: function() {
    this.set('width', parseInt(this.$().css('width').replace('px', '')));
    this.set('height', parseInt(this.$().css('width').replace('px', '')));
    this.set('gCustomId', uuid());
    this.draw();
  },
  init: function() {
    this.set('customId', uuid());
    this._super();
  }
});
