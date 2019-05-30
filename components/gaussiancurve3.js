// backup for histogram of normal distribution 
const React = require('react');
const D3Component = require('idyll-d3-component');
const d3 = require('d3');

const size = 600;

class GaussianCurve3 extends D3Component {

  initialize(node, props) {
   //this.color = "steelblue";
    var data = [];

    // loop to populate data array with 
    // probabily - quantile pairs
    for (var i = 0; i < 1000000; i++) {
        let q = this.normal() // calc random draw from normal dist
        let p = this.gaussian(q) 
        let o = this.gaussian(q,1)// calc prob of rand draw
        let el = {
            "q": q,
            "p": p,
            "o":o
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

    let yval = 450; //Arbitrary Height
    let xval = 445; //Stopping point. Max x = 800 (0 coordinate = 445)

    var line = d3.line()
        .x(function(d) {
            return x(d.q);
        })
        .y(function(d) {
            return y(d.p);
        });
        //Custom code
    let line2 = d3.svg.line()
      .x(function(d) {
        return x(d.q);
      })
      .y(function(d) {
        return y(d.o);
      })
    //
//Taken from http://bl.ocks.org/jacobw56/2fd529120462c8ee044bccc3b0836547
//Changed it up a bit
//Took hours to figure out, but I did it!!!!
let area = d3.area() //Red
  .x(function(d) {  if(x(d.q)>xval) return x(d.q); return x(0);})
  .y0(yval)
  .y1(function(d) { if(d.p<d.o )return y(d.p); return y(d.p); });

let area1 = d3.area() //Blue
  .x(function(d) {  if(x(d.q)<=xval) return x(d.q); return x(0);})
  .y0(yval)
  .y1(function(d) { if(d.o<d.p) return y(d.o); return y(d.p) });

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
    //Custom code
    svg.append("path")
        .datum(data)
        .attr("class", "line1")
        .attr("d", line2);

    svg.append("path")
        .datum(data)
        .attr("class", "area")
        .attr("d", area);

    svg.append("path")
        .datum(data)
        .attr("class", "area1")
        .attr("d", area1);

    var alpha = 0.05;
    var quantile = 1.9599;
    var xleft = width/2 - quantile*(width/(2*4));
    var xright = width/2 + quantile*(width/(2*4));

    // svg.append("line")
    // .attr("x1", xleft)  //<<== change your code here
    // .attr("y1", 0)
    // .attr("x2", xleft)  //<<== and here
    // .attr("y2", height)
    // .style("stroke-width", 2)
    // .style("stroke", "red")
    // .style("stroke-dasharray", ("3, 3")) ;

    // svg.append("line")
    // .attr("x1", xright)  //<<== change your code here
    // .attr("y1", 0)
    // .attr("x2", xright)  //<<== and here
    // .attr("y2", height)
    // .style("stroke-width", 2)
    // .style("stroke", "red")
    // .style("stroke-dasharray", ("3, 3")) ;


    // svg.append("line")
    // .attr("x1", 380)  //<<== change your code here
    // .attr("y1", 30)
    // .attr("x2", 400)  //<<== and here
    // .attr("y2", 30)
    // .style("stroke-width", 2)
    // .style("stroke", "red")
    // .style("stroke-dasharray", ("3, 3")) ;
    // svg.append("text").attr("x", xleft + 5).attr("y", 30)
    // .text("Left quantile")
    // .style("font-size", "15px").attr("alignment-baseline","middle")
    // svg.append("text").attr("x", xright + 5).attr("y", 30)
    // .text("Right quantile")
    // .style("font-size", "15px").attr("alignment-baseline","middle")

  }

    update(props, oldProps) {
        const {xval} = props;
        this.svg.selectAll("line").remove();
        this.svg.selectAll("path").remove();
        this.replot(xval);
    }

    replot(xvalInput){
    var data = [];

    // loop to populate data array with 
    // probabily - quantile pairs
    for (var i = 0; i < 1000000; i++) {
        let q = this.normal() // calc random draw from normal dist
        let p = this.gaussian(q) 
        let o = this.gaussian(q,1)// calc prob of rand draw
        let el = {
            "q": q,
            "p": p,
            "o":o
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

    let yval = 450; //Arbitrary Height
    let xval = xvalInput; //Stopping point. Max x = 800 (0 coordinate = 445)

    var line = d3.line()
        .x(function(d) {
            return x(d.q);
        })
        .y(function(d) {
            return y(d.p);
        });
        //Custom code
    let line2 = d3.svg.line()
      .x(function(d) {
        return x(d.q);
      })
      .y(function(d) {
        return y(d.o);
      })
    //
//Taken from http://bl.ocks.org/jacobw56/2fd529120462c8ee044bccc3b0836547
//Changed it up a bit
//Took hours to figure out, but I did it!!!!
let area = d3.area() //Red
  .x(function(d) {  if(x(d.q)>xval) return x(d.q); return x(0);})
  .y0(yval)
  .y1(function(d) { if(d.p<d.o )return y(d.p); return y(d.p); });

let area1 = d3.area() //Blue
  .x(function(d) {  if(x(d.q)<=xval) return x(d.q); return x(0);})
  .y0(yval)
  .y1(function(d) { if(d.o<d.p) return y(d.o); return y(d.p) });

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
    //Custom code
    svg.append("path")
        .datum(data)
        .attr("class", "line1")
        .attr("d", line2);

    svg.append("path")
        .datum(data)
        .attr("class", "area")
        .attr("d", area);

    svg.append("path")
        .datum(data)
        .attr("class", "area1")
        .attr("d", area1);

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
    gaussian(x,m=0) {
        var gaussianConstant = 1 / Math.sqrt(2 * Math.PI),
            mean = m,
            sigma = 1;

        x = (x - mean) / sigma;
        return gaussianConstant * Math.exp(-.5 * x * x) / sigma;
    }
}

module.exports = GaussianCurve3;
