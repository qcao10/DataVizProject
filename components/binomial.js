import React from 'react';
const D3Component = require('idyll-d3-component');
const d3 = require('d3');

class Binomial extends D3Component {

    product(i_arr) {
        //console.log("arr", i_arr);

        const product_reduce = (acc, cur) => acc*cur;
        var p = i_arr.reduce(product_reduce);
        
        return p;
    }

    sum(i_arr) {
        const sum_reduce = (acc, cur) => acc+cur;
        var s = i_arr.reduce(sum_reduce);
        
        return s;
    }

    successes(n, k) {
        var num_factors = [1];
        var den_factors = [1];
        
        for( var i=k+1; i<n+1; i++) {
            num_factors.push(i)
        }

        //console.log("numerator factors", num_factors);

        for( var i=2; i<(n-k)+1; i++) {
            den_factors.push(i)
        }

        //console.log("denominator factors", den_factors);

        var num = this.product(num_factors);
        var den = this.product(den_factors);

        //console.log("num/den", num, den, num/den);

        return num/den;
    }

    skewed_outcomes(n, k, mean){
        var prob = Math.pow(mean, k)*Math.pow((1-mean), (n-k));
        //console.log("prob", prob);
        return prob;
    }

    calculate_dist(props){

        if( props.k !== undefined ) {
            this.k = props.k;
        }

        //console.log("n", this.n, "k", this.k)

        if(props.mean !== undefined) {
            this.mean = props.mean;
        }

        // Use the binomial distribution counts as values
        this.values = [];

        this.total_outcomes = 0;

        for(var i = 0; i<this.n+1; i++){
            var s = this.successes(this.n, i);
            this.total_outcomes += s;

            //console.log("num success", s);
            this.values.push(s * this.skewed_outcomes(this.n, i, this.mean));
        }



        console.log("n", this.n, "k", this.k, "mean", this.mean, "total", this.total_outcomes, this.values);

    }

    initialize(node, props) {

        //console.log("init", node, props);

        this.n = 1;

        this.mean = 0.5;

        if( props.n !== undefined ) {
            this.n = props.n;
        }

        if( props.mean_h_a !== undefined ) {
            this.mean_h_a = props.mean_h_a;
        }

        //if k not set, set it out of range
        this.k = this.n+1;

        this.calculate_dist(props);

        // A formatter for counts.
        var formatCount = d3.format(",.0f");

        var margin = {top: 20, right: 5, bottom: 30, left: 5},
            width = 500 - margin.left - margin.right,
            height = 300 - margin.top - margin.bottom;

        //var max = d3.max(this.values);
        //var min = d3.min(this.values);
        var x = d3.scaleLinear()
            .domain([0, this.n+2])
            .range([0, width]);

        // Generate a histogram using n+2 uniformly-spaced bins.

        var yMax = d3.max(this.values, function (d) {return d}); // the max count
        var yMin = d3.min(this.values, function(d){return d}); // the min count

        var colorScale = d3.scaleLinear()
                    .domain([yMin, yMax])
                    //.domain([0, 1.2])
                    .range(["#F0FFF0", "steelblue"]);

        var y = d3.scaleLinear()
            //.domain([0, yMax])
            .domain([0, yMax])
            .range([height, 0]);

        var xAxis = d3.axisBottom(x);

        var barWidth = width / this.n+2;

        this.svg = d3.select(node).append("svg")
            .attr("width", "100%")
            .attr("height", height + margin.top + margin.bottom);

        this.bar = this.svg
            .append("g");
        
        this.bar.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        console.log("binomial k is", this.k);

        this.bar
            .selectAll("rect")
            .data(this.values)
            .enter()
            .append("rect")
            .attr("y", function(d) { return y(d)-margin.bottom; } )
            .attr("x", function(d, i) {return x(i+0.5)+margin.left; })
            .attr("width", barWidth/2 + 1 )
            .attr("height", function(d) { return height - y(d); })
            //.attr("transform", function(d,i) {return "translate(" + x(i) + "," + y(d) + ")"; })
            .attr("fill", (d, i) => { 
                var color= colorScale(d+0.2); 
                if(i==this.k) {
                    color= "#FF0000"; 
                }
                //console.log(color);
                return color; 
            });

        // this.bar.append("rect")
        //     .attr("x", 1)
        //     .attr("width", function(d) { return x(d.x1) - x(d.x0) -1 ; })
        //     .attr("height", function(d) { return height - y(d.length); })
        //     .attr("fill", function(d) { return colorScale(d.length) });

        var tick_factor = 1;

        this.xticks = this.svg.selectAll("rect").append("text")
            .attr("dy", ".5em")
            .attr("y", -15)
            .attr("x", function(d) { return (x(d.x1) - x(d.x0) )/tick_factor; })
            .attr("text-anchor", "middle")
            .style("font-size", "12px")
            .text(function(d) { return formatCount(d); });

        this.hist = this.svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis);

        //console.log(this.values);
        //this.mean = Number(d3.mean(this.values)).toFixed(2);
        this.svg.append("text").attr("x", 420).attr("y", 60).text("Sample mean = " + this.mean)
        .style("font-size", "15px").attr("alignment-baseline","middle");
    }

    update(props){
        console.log("update", props);

        if( props.n !== undefined ) {
            this.n = props.n;
        }

        if( props.k !== undefined ) {
            this.k = props.k;
        }

        console.log("binomial update k", this.k);
        
        this.calculate_dist(props);
        
        console.log(this.values);

        //this.values = d3.range(samplesize).map(d3.randomNormal(mean, sd));
        //var this.values2 = d3.range(1000).map(d3.randomNormal(1, 1));
        //console.log(this.values)

        // A formatter for counts.
        var formatCount = d3.format(",.0f");

        var margin = {top: 20, right: 5, bottom: 30, left: 5},
            width = 500 - margin.left - margin.right,
            height = 300 - margin.top - margin.bottom;

        var x = d3.scaleLinear()
            .domain([0, this.n+2])
            .range([0, width]);

        // Generate a histogram using twenty uniformly-spaced bins.
        var yMax = d3.max(this.values); // the max count
        //console.log(yMax);
        var yMin = d3.min(this.values); // the min count

        var colorScale = d3.scaleLinear()
                    .domain([yMin, yMax])
                    //.domain([0, 1.2])
                    .range(["#F0FFF0", "steelblue"]);

        var y = d3.scaleLinear()
            //.domain([0, yMax+0.2])
            .domain([0, yMax])
            .range([height, 0]);

        var xAxis = d3.axisBottom(x);

        var barWidth = width / this.n+2;

        var k = this.k;

        console.log("update bars");

        this.bar.selectAll("rect").remove().exit();

        this.bar
            .selectAll("rect")
            .data(this.values)
            .enter()
            .append("rect")
            .attr("fill", function(d, i) { var color= colorScale(d+0.2); if(i==k) color= "#FF0000"; console.log(color, i, this.k); return color; })
            .attr("y", function(d) { return y(d)-margin.bottom; } )
            .attr("x", function(d, i) {return x(i+0.5)+margin.left; })
            .attr("width", barWidth/2 + 1 )
            .attr("height", function(d) { return height - y(d); })
            .transition()
            .duration(200);

        console.log("update xticks");
        var tick_factor = 1;

        this.xticks = this.svg.selectAll("rect").append("text")
            .attr("dy", ".5em")
            .attr("y", -15)
            .attr("x", function(d) { return (x(d.x1) - x(d.x0) )/tick_factor; })
            .attr("text-anchor", "middle")
            .style("font-size", "12px")
            .text(function(d) { return formatCount(d); });

        //this.svg.selectAll("g").selectAll(".x axis").remove().exit();

        this.hist = this.svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis);

        //console.log(this.values);
        //this.mean = Number(d3.mean(this.values)).toFixed(2);
        this.svg.append("text").attr("x", 420).attr("y", 60).text("Sample mean = " + this.mean)
        .style("font-size", "15px").attr("alignment-baseline","middle");

    }

}

module.exports = Binomial;