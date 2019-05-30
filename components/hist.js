// backup for histogram of normal distribution 
const React = require('react');
const D3Component = require('idyll-d3-component');
const d3 = require('d3');

const size = 600;

class Hist extends D3Component {

  initialize(node, props) {
   //this.color = "steelblue";
    this.mean = props.mean;

    // Generate a 1000 data points using normal distribution with mean=20, deviation=5
    this.values = d3.range(1000).map(d3.randomNormal(0, 1));
    //var this.values2 = d3.range(1000).map(d3.randomNormal(1, 1));
    //console.log(this.values)

    // A formatter for counts.
    var formatCount = d3.format(",.0f");

    var margin = {top: 20, right: 5, bottom: 30, left: 5},
        width = 500 - margin.left - margin.right,
        height = 300 - margin.top - margin.bottom;

    var max = d3.max(this.values);
    var min = d3.min(this.values);
    var x = d3.scaleLinear()
          .domain([-5, 5])
          .range([0, width]);

    // Generate a histogram using twenty uniformly-spaced bins.
    var data = d3.histogram()
        .thresholds(x.ticks(10))
        (this.values);
    //console.log(data); //[num1, num2,..., x0 = -4.67645, x1=-4.5]

    var yMax = d3.max(data, function(d){return d.length}); // the max count
    //console.log(yMax);
    var yMin = d3.min(data, function(d){return d.length}); // the min count
    var colorScale = d3.scaleLinear()
                .domain([yMin, yMax])
                .range(["#F0FFF0", "steelblue"]);

    var y = d3.scaleLinear()
        .domain([0, yMax])
        .range([height, 0]);

    var xAxis = d3.axisBottom(x);

    var svg = this.svg = d3.select(node).append("svg")
        .attr("width", "100%")
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    this.bar = svg.selectAll(".bar")
        .data(data)
        .enter().append("g")
        .attr("class", "bar")
        .attr("transform", function(d) {return "translate(" + x(d.x1) + "," + y(d.length) + ")"; });

    this.bar.append("rect")
        .attr("x", 1)
        .attr("width", function(d) { return x(d.x1) - x(d.x0) -1 ; })
        .attr("height", function(d) { return height - y(d.length); })
        .attr("fill", function(d) { return colorScale(d.length) });

    this.bar.append("text")
        .attr("dy", ".5em")
        .attr("y", -15)
        .attr("x", function(d) { return (x(d.x1) - x(d.x0) )/2; })
        .attr("text-anchor", "middle")
        .style("font-size", "12px")
        .text(function(d) { return formatCount(d.length); });

    this.hist = svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);
    this.sampleMean = d3.mean(this.values).toFixed(2);
    svg.append("text").attr("x", 420).attr("y", 60).text("Sample mean = " + this.sampleMean)
    .style("font-size", "15px").attr("alignment-baseline","middle");
  }

  update(props, oldProps) {
    const {mean,sd,samplesize} = props
    this.svg.selectAll("*").remove();
    this.replot(mean,sd,samplesize);
  }

  replot(mean,sd,samplesize){
    this.values = d3.range(samplesize).map(d3.randomNormal(mean, sd));
    //var this.values2 = d3.range(1000).map(d3.randomNormal(1, 1));
    //console.log(this.values)

    // A formatter for counts.
    var formatCount = d3.format(",.0f");

    var margin = {top: 20, right: 5, bottom: 30, left: 5},
        width = 500 - margin.left - margin.right,
        height = 300 - margin.top - margin.bottom;

    var max = d3.max(this.values);
    var min = d3.min(this.values);
    var x = d3.scaleLinear()
          .domain([-5, 5])
          .range([0, width]);

    // Generate a histogram using twenty uniformly-spaced bins.
    var data = d3.histogram()
        .thresholds(x.ticks(30))
        (this.values);
    //console.log(data); //[num1, num2,..., x0 = -4.67645, x1=-4.5]

    var yMax = d3.max(data, function(d){return d.length}); // the max count
    //console.log(yMax);
    var yMin = d3.min(data, function(d){return d.length}); // the min count
    var colorScale = d3.scaleLinear()
                .domain([yMin, yMax])
                .range(["#F0FFF0", "steelblue"]);

    var y = d3.scaleLinear()
        .domain([0, yMax])
        .range([height, 0]);

    var xAxis = d3.axisBottom(x);

    // var svg = this.svg = d3.select(node).append("svg")
    //     .attr("width", "100%")
    //     .attr("height", height + margin.top + margin.bottom)
    //     .append("g")
    //     .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    this.bar = this.svg.selectAll(".bar")
        .data(data)
        .enter().append("g")
        .attr("class", "bar")
        .attr("transform", function(d) {return "translate(" + x(d.x1) + "," + y(d.length) + ")"; });

    this.bar.append("rect")
        .attr("x", 1)
        .attr("width", function(d) { return x(d.x1) - x(d.x0) -1 ; })
        .attr("height", function(d) { return height - y(d.length); })
        .attr("fill", function(d) { return colorScale(d.length) });

    this.bar.append("text")
        .attr("dy", ".5em")
        .attr("y", -15)
        .attr("x", function(d) { return (x(d.x1) - x(d.x0) )/2; })
        .attr("text-anchor", "middle")
        .style("font-size", "12px")
        .text(function(d) { return formatCount(d.length); });

    this.hist = this.svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);
    this.sampleMean = d3.mean(this.values).toFixed(2);
    this.svg.append("text").attr("x", 420).attr("y", 60).text("Sample mean = " + this.sampleMean)
    .style("font-size", "15px").attr("alignment-baseline","middle");
    }  
}

module.exports = Hist;
