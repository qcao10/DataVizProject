// backup for histogram of normal distribution 
const React = require('react');
const D3Component = require('idyll-d3-component');
const d3 = require('d3');

const size = 600;

class GaussianCurve extends D3Component {

  initialize(node, props) {
   //this.color = "steelblue";
    var data = [];

    // loop to populate data array with 
    // probabily - quantile pairs
    for (var i = 0; i < 1000000; i++) {
        let q = this.normal() // calc random draw from normal dist
        let p = this.gaussian(q) // calc prob of rand draw
        let el = {
            "q": q,
            "p": p
        }
        data.push(el)
    }
    // need to sort for plotting
    //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort
    data.sort(function(x, y) {
        return x.q - y.q;
    }); 
    
    // line chart based on http://bl.ocks.org/mbostock/3883245
    var margin = {
            top: 20,
            right: 5,
            bottom: 30,
            left: 15
        },
        width = 500 - margin.left - margin.right,
        height = 300 - margin.top - margin.bottom;

    var x = d3.scaleLinear()
        .domain([-4,4])
        .range([0, width]);

    var y = d3.scaleLinear()
        .range([height, 0]);

    var xAxis = d3.axisBottom(x)

    var yAxis = d3.axisLeft(x)

    var line = d3.line()
        .x(function(d) {
            return x(d.q);
        })
        .y(function(d) {
            return y(d.p);
        });

    var svg = this.svg = d3.select(node).append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    x.domain(d3.extent(data, function(d) {
        return d.q;
    }));
    y.domain(d3.extent(data, function(d) {
        return d.p;
    }));

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis);

    svg.append("path")
        .data([data])
        .attr("class", "line")
        .attr("d", line)
        .attr("fill", "#69b3a2")
        .style("opacity", 0.6);

    var alpha = 0.05;
    var quantile = 1.9599;
    var xleft = width/2 - quantile*(width/(2*4));
    var xright = width/2 + quantile*(width/(2*4));
    svg.append("line")
    .attr("x1", xleft)  //<<== change your code here
    .attr("y1", 0)
    .attr("x2", xleft)  //<<== and here
    .attr("y2", height)
    .style("stroke-width", 2)
    .style("stroke", "red")
    .style("stroke-dasharray", ("3, 3")) ;

    svg.append("line")
    .attr("x1", xright)  //<<== change your code here
    .attr("y1", 0)
    .attr("x2", xright)  //<<== and here
    .attr("y2", height)
    .style("stroke-width", 2)
    .style("stroke", "red")
    .style("stroke-dasharray", ("3, 3")) ;


    // svg.append("line")
    // .attr("x1", 380)  //<<== change your code here
    // .attr("y1", 30)
    // .attr("x2", 400)  //<<== and here
    // .attr("y2", 30)
    // .style("stroke-width", 2)
    // .style("stroke", "red")
    // .style("stroke-dasharray", ("3, 3")) ;
    svg.append("text").attr("x", xleft + 5).attr("y", 30)
    .text("Left quantile")
    .style("font-size", "15px").attr("alignment-baseline","middle")
    svg.append("text").attr("x", xright + 5).attr("y", 30)
    .text("Right quantile")
    .style("font-size", "15px").attr("alignment-baseline","middle")

  }

    update(props, oldProps) {
        const {alpha} = props;
        this.svg.selectAll("line").remove();
        this.svg.selectAll("text").remove();
        this.replot(alpha);
    }

    replot(alpha){
    var data = [];

    // loop to populate data array with 
    // probabily - quantile pairs
    // for (var i = 0; i < 1000000; i++) {
    //     let q = this.normal() // calc random draw from normal dist
    //     let p = this.gaussian(q) // calc prob of rand draw
    //     let el = {
    //         "q": q,
    //         "p": p
    //     }
    //     data.push(el)
    // }
    // // need to sort for plotting
    // //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort
    // data.sort(function(x, y) {
    //     return x.q - y.q;
    // }); 
    
    // line chart based on http://bl.ocks.org/mbostock/3883245
    var margin = {
            top: 20,
            right: 5,
            bottom: 30,
            left: 15
        },
        width = 500 - margin.left - margin.right,
        height = 300 - margin.top - margin.bottom;

    var x = d3.scaleLinear()
        .domain([-4,4])
        .range([0, width]);

    var y = d3.scaleLinear()
        .range([height, 0]);

    var xAxis = d3.axisBottom(x)

    var yAxis = d3.axisLeft(x)

    var line = d3.line()
        .x(function(d) {
            return x(d.q);
        })
        .y(function(d) {
            return y(d.p);
        });

    var svg = this.svg;


    x.domain(d3.extent(data, function(d) {
        return d.q;
    }));
    y.domain(d3.extent(data, function(d) {
        return d.p;
    }));

    // svg.append("g")
    //     .attr("class", "x axis")
    //     .attr("transform", "translate(0," + height + ")")
    //     .call(xAxis);

    // svg.append("g")
    //     .attr("class", "y axis")
    //     .call(yAxis);

    // svg.append("path")
    //     .data([data])
    //     .attr("class", "line")
    //     .attr("d", line)
    //     .attr("fill", "#69b3a2")
    //     .style("opacity", 0.6);
        
    var quantile = 1.9599
    if (Math.abs(alpha-0.05) < 0.001){
        quantile = 1.9599;
    } else if (Math.abs(alpha-0.075) < 0.001){
        quantile = 1.78046;
    } else if (Math.abs(alpha-0.1) < 0.001){
        quantile = 1.64485;
    }
    var xleft = width/2 - quantile*(width/(2*4));
    var xright = width/2 + quantile*(width/(2*4));
    svg.append("line")
    .attr("x1", xleft)  //<<== change your code here
    .attr("y1", 0)
    .attr("x2", xleft)  //<<== and here
    .attr("y2", height)
    .style("stroke-width", 2)
    .style("stroke", "red")
    .style("stroke-dasharray", ("3, 3")) ;

    svg.append("line")
    .attr("x1", xright)  //<<== change your code here
    .attr("y1", 0)
    .attr("x2", xright)  //<<== and here
    .attr("y2", height)
    .style("stroke-width", 2)
    .style("stroke", "red")
    .style("stroke-dasharray", ("3, 3")) ;

    // svg.append("line")
    // .attr("x1", 380)  //<<== change your code here
    // .attr("y1", 30)
    // .attr("x2", 400)  //<<== and here
    // .attr("y2", 30)
    // .style("stroke-width", 2)
    // .style("stroke", "red")
    // .style("stroke-dasharray", ("3, 3")) ;
    svg.append("text").attr("x", xleft + 5).attr("y", 30)
    .text("Left Quantile")
    .style("font-size", "15px").attr("alignment-baseline","middle")
    svg.append("text").attr("x", xright + 5).attr("y", 30)
    .text("Right Quantile")
    .style("font-size", "15px").attr("alignment-baseline","middle")
    }
  // from http://bl.ocks.org/mbostock/4349187
// Sample from a normal distribution with mean 0, stddev 1.
    normal() {
        var x = 0,
            y = 0,
            rds, c;
        do {
            x = Math.random() * 2 - 1;
            y = Math.random() * 2 - 1;
            rds = x * x + y * y;
        } while (rds == 0 || rds > 1);
        c = Math.sqrt(-2 * Math.log(rds) / rds); // Box-Muller transform
        return x * c; // throw away extra sample y * c
    }

    //taken from Jason Davies science library
    // https://github.com/jasondavies/science.js/
    gaussian(x) {
        var gaussianConstant = 1 / Math.sqrt(2 * Math.PI),
            mean = 0,
            sigma = 1;

        x = (x - mean) / sigma;
        return gaussianConstant * Math.exp(-.5 * x * x) / sigma;
    }
}

module.exports = GaussianCurve;
