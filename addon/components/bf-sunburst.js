import Ember from 'ember';
//import uuid from '../utils/uuid';
import stripFloat from '../utils/strip-float';
//import d3 from '../../bower_components/d3/d3';

export default Ember.Component.extend({
  width: 100,
  centerOuterRadius: 28,
  sizeAdjustment: 2000,
  classNames: ['bf-sunburst-container'],
  radius: Ember.computed(function(){
    return this.get('width') / 2;
  }),
  draw: function(){
    var sunburst = this.get('sunburstContainer');
    var pathAndTextGroup = sunburst.data([this.get('data')]).selectAll('.bf-sunburst-container g')
      .data(this.get('partition').nodes)
      .enter().append('g');
    this.appendPath(pathAndTextGroup);
    this.appendText(pathAndTextGroup);
    this.set('totalSize', pathAndTextGroup.node().__data__.value);
    this.set('centerPathWidth', d3.select('#bf-sunburst-center-path').node().getBBox().width);
  },
  sunburstContainer: Ember.computed(function(){
    return d3.select('#' + this.get('elementId')).append('svg:svg')
      .attr('viewBox', '-50 -50 100 100')
      .append('g');
  }),
  partition: Ember.computed(function(){
    return d3.layout.partition()
      .size([2 * Math.PI, this.get('radius') + this.get('sizeAdjustment')])
      .value(function(d) { return d.size; });
  }),
  arc: Ember.computed(function(){
    var self = this;
    return d3.svg.arc()
      .startAngle(function(d) { return d.x; })
      .endAngle(function(d) { return d.x + d.dx; })
      .innerRadius(function(d) { return Math.sqrt(d.y); })
      .outerRadius(function(d) { return Math.sqrt(d.y + d.dy); });
  }),
  appendPath: function(group){
    var mouseOverPath = this.mouseOverPath;
    var self = this;
    return group.append("path")
      .attr("d", this.get('arc'))
      //.attr('class', function(d) { return d.depth; })
      .attr('id', function(d){
        if (d.depth === 0) {
          return 'bf-sunburst-center-path';
        }
      })
      .style("stroke", "#fff")
      .style("fill", function(d) {
        if (d.depth === 0) {
          return "green";
        }
        return "#666";  //dynamic group color here
      }).on("mouseover", function(d, i) {
        return mouseOverPath.call(self, d, i);
      }, true)
  },
  appendText: function(group) {
    return group.append('text')
      .attr('class', function(d) { return 'path-text-' + d.depth; })
      .text(function(d) {
        if (d.depth === 0) {
          //return d.name;
        }
      })
      //.attr('font-size', '1em')
      .attr('text-anchor', 'middle');
  },
  appendTspan: function(textContainer, text, attributes){
    return textContainer.append('tspan')
    .attr(attributes)
    .text(function(d, i) {
      return text;
     });
  },
  mouseOverPath: function(d, i) {
    var self = this;
    var percentage = 100 * d.value / this.get('totalSize');
    var percentageString = (percentage < 0.1) ? '< 0.1%' : stripFloat(percentage) + '%';

    d3.select('.path-text-0').selectAll('*').remove(); // clean up
    this.appendTspan(d3.select('.path-text-0'), d.name, {
      x: 0,
      dy: -Math.abs(this.get('centerPathWidth') / 10),
      'font-size': this.get('centerPathWidth') / 10,
      'class': 'bf-sunburst-title'
    });
    this.appendTspan(d3.select('.path-text-0'), percentageString, {
      x: 0,
      dy: this.get('centerPathWidth') / 4.5,
      'font-size': this.get('centerPathWidth') / 6,
      'class': 'bf-sunburst-percentage'
    });
  },
  didInsertElement: function() {
    this.draw();
  }
});
