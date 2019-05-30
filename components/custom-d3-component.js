const React = require('react');
const D3Component = require('idyll-d3-component');
const d3 = require('d3');

const size = 600;

class CustomD3Component extends D3Component {

  initialize(node, props) {
    this.mean1 = -1;
    this.mean2 = 1;
    this.alpha = 0.05;

    // Generate a 1000 data points using normal distribution with mean=20, deviation=5
    this.values = d3.range(10000).map(d3.randomNormal(-1, 1));
    this.values2 = d3.range(10000).map(d3.randomNormal(1, 1));
    //console.log(this.values)

    // A formatter for counts.
    var formatCount = d3.format(",.0f");

    var margin = {top: 20, right: 5, bottom: 30, left: 5},
        width = 500 - margin.left - margin.right,
        height = 300 - margin.top - margin.bottom;

    var max = d3.max(this.values.concat(this.values2));
    var min = d3.min(this.values.concat(this.values2));
    var x = d3.scaleLinear()
          .domain([min, max])
          .range([0, width]);

    // Generate a histogram using twenty uniformly-spaced bins.
    var data = d3.histogram()
        .thresholds(x.ticks(20))
        (this.values);
    var data2 = d3.histogram()
        .thresholds(x.ticks(20))
        (this.values2);
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
    var yAxis = d3.axisLeft(y);

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
        .attr("fill", "#69b3a2")
        .style("opacity", 0.6);

    // this.bar.append("text")
    //     .attr("dy", ".5em")
    //     .attr("y", -15)
    //     .attr("x", function(d) { return (x(d.x1) - x(d.x0) )/2; })
    //     .attr("text-anchor", "middle")
    //     .text(function(d) { return formatCount(d.length); });

    this.hist = svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);
    // svg.append("g")
    // .attr("transform", "translate(0,5)")
    // .call(d3.axisLeft(y));


///////////////////////////////////////////////////////////////////////////////////////////////
    this.bar2 = svg.selectAll(".bar2")
        .data(data2)
        .enter().append("g")
        .attr("class", "bar")
        .attr("transform", function(d) {return "translate(" + x(d.x1) + "," + y(d.length) + ")"; });

    this.bar2.append("rect")
        .attr("x", 1)
        .attr("width", function(d) { return x(d.x1) - x(d.x0) -1 ; })
        .attr("height", function(d) { return height - y(d.length); })
        .attr("fill", "#404080")
        .style("opacity", 0.6);

    // this.bar2.append("text")
    //     .attr("dy", ".5em")
    //     .attr("y", -15)
    //     .attr("x", function(d) { return (x(d.x1) - x(d.x0) )/2; })
    //     .attr("text-anchor", "middle")
    //     .text(function(d) { return formatCount(d.length); });

    // this.hist = svg.append("g")
    //     .attr("class", "x axis")
    //     .attr("transform", "translate(0," + height + ")")
    //     .call(xAxis);

     // Handmade legend
  svg.append("circle").attr("cx",400).attr("cy",30).attr("r", 6).style("fill", "#69b3a2")
  svg.append("circle").attr("cx",400).attr("cy",60).attr("r", 6).style("fill", "#404080")
  svg.append("text").attr("x", 420).attr("y", 30).text("Dist. under Null H.").style("font-size", "15px").attr("alignment-baseline","middle")
  svg.append("text").attr("x", 420).attr("y", 60).text("Dist. under Alternative H.").style("font-size", "15px").attr("alignment-baseline","middle")

    svg.append("line")
    .attr("x1", 10)  //<<== change your code here
    .attr("y1", 0)
    .attr("x2", 10)  //<<== and here
    .attr("y2", height)
    .style("stroke-width", 2)
    .style("stroke", "red")
    .style("stroke-dasharray", ("3, 3")) ;
  }

  update(props, oldProps) {
    console.log("update")
    this.svg.selectAll("*").remove();
    this.replot();
  }
  
  replot(){
    this.mean1 = -1;
    this.mean2 = 1;
    this.alpha = 0.05;

    // Generate a 1000 data points using normal distribution with mean=20, deviation=5
    this.values = d3.range(10000).map(d3.randomNormal(-1, 1));
    this.values2 = d3.range(10000).map(d3.randomNormal(1, 1));
    //console.log(this.values)

    // A formatter for counts.
    var formatCount = d3.format(",.0f");

    var margin = {top: 20, right: 5, bottom: 30, left: 5},
        width = 500 - margin.left - margin.right,
        height = 300 - margin.top - margin.bottom;

    var max = d3.max(this.values.concat(this.values2));
    var min = d3.min(this.values.concat(this.values2));
    var x = d3.scaleLinear()
          .domain([min, max])
          .range([0, width]);

    // Generate a histogram using twenty uniformly-spaced bins.
    var data = d3.histogram()
        .thresholds(x.ticks(40))
        (this.values);
    var data2 = d3.histogram()
        .thresholds(x.ticks(40))
        (this.values2);
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
    var yAxis = d3.axisLeft(y);

    // var svg = this.svg = d3.select(node).append("svg")
    //     .attr("width", "100%")
    //     .attr("height", height + margin.top + margin.bottom)
    //     .append("g")
    //     .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    var svg = this.svg;

    this.bar = svg.selectAll(".bar")
        .data(data)
        .enter().append("g")
        .attr("class", "bar")
        .attr("transform", function(d) {return "translate(" + x(d.x1) + "," + y(d.length) + ")"; });

    this.bar.append("rect")
        .attr("x", 1)
        .attr("width", function(d) { return x(d.x1) - x(d.x0) -1 ; })
        .attr("height", function(d) { return height - y(d.length); })
        .attr("fill", "#69b3a2")
        .style("opacity", 0.6);

    // this.bar.append("text")
    //     .attr("dy", ".5em")
    //     .attr("y", -15)
    //     .attr("x", function(d) { return (x(d.x1) - x(d.x0) )/2; })
    //     .attr("text-anchor", "middle")
    //     .text(function(d) { return formatCount(d.length); });

    this.hist = svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);
    // svg.append("g")
    // .attr("transform", "translate(0,5)")
    // .call(d3.axisLeft(y));


///////////////////////////////////////////////////////////////////////////////////////////////
    this.bar2 = svg.selectAll(".bar2")
        .data(data2)
        .enter().append("g")
        .attr("class", "bar")
        .attr("transform", function(d) {return "translate(" + x(d.x1) + "," + y(d.length) + ")"; });

    this.bar2.append("rect")
        .attr("x", 1)
        .attr("width", function(d) { return x(d.x1) - x(d.x0) -1 ; })
        .attr("height", function(d) { return height - y(d.length); })
        .attr("fill", "#404080")
        .style("opacity", 0.6);

    // this.bar2.append("text")
    //     .attr("dy", ".5em")
    //     .attr("y", -15)
    //     .attr("x", function(d) { return (x(d.x1) - x(d.x0) )/2; })
    //     .attr("text-anchor", "middle")
    //     .text(function(d) { return formatCount(d.length); });

    // this.hist = svg.append("g")
    //     .attr("class", "x axis")
    //     .attr("transform", "translate(0," + height + ")")
    //     .call(xAxis);

     // Handmade legend
  svg.append("circle").attr("cx",400).attr("cy",30).attr("r", 6).style("fill", "#69b3a2")
  svg.append("circle").attr("cx",400).attr("cy",60).attr("r", 6).style("fill", "#404080")
  svg.append("text").attr("x", 420).attr("y", 30).text("Dist. under Null H.").style("font-size", "15px").attr("alignment-baseline","middle")
  svg.append("text").attr("x", 420).attr("y", 60).text("Dist. under Alternative H.").style("font-size", "15px").attr("alignment-baseline","middle")

    svg.append("line")
    .attr("x1", 10)  //<<== change your code here
    .attr("y1", 0)
    .attr("x2", 10)  //<<== and here
    .attr("y2", height)
    .style("stroke-width", 2)
    .style("stroke", "red")
    .style("stroke-dasharray", ("3, 3")) ;
  }
}

module.exports = CustomD3Component;
