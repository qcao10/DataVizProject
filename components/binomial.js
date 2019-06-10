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

        if(props.mean_h_a !== undefined) {
            this.mean_h_a = props.mean_h_a;
        }

        // Use the binomial distribution counts as values
        this.values = [];
        this.h_a_values = [];

        this.total_outcomes = 0;

        for(var i = 0; i<this.n+1; i++){
            var s = this.successes(this.n, i);
            this.total_outcomes += s;

            //console.log("num success", s);
            this.values.push(s * this.skewed_outcomes(this.n, i, this.mean));

            if(this.mean_h_a !== undefined){
                this.h_a_values.push(s * this.skewed_outcomes(this.n, i, this.mean_h_a));
                
            }
        }

        this.values = this.values.concat(this.h_a_values);

        //console.log("n", this.n, "k", this.k, "mean", this.mean, "mean_h_a", this.mean_h_a, "total", this.total_outcomes, this.values, this.h_a_values);

    }

    draw_dist(){
        var barWidth = this.width / this.n+2;

        //console.log("graphing values", values);

        this.bar
            .selectAll("rect")
            .data(this.values)
            .enter()
            .append("rect")
            .attr("y", (d) => { return this.y(d)-this.margin.bottom; } )
            .attr("x", (d, i) => {return this.x((i%(this.n+1))+0.5)+this.margin.left; })
            //evenly divided width offset by difference of margins, translated by one of the extra literal "2"
            //that are added to give space around the actual distribution
            //.attr("width", barWidth - (this.margin.right - this.margin.left)/2 + 1 )
            .attr("width", barWidth/2 + 1 )
            .attr("height", (d)=>{ return this.height - this.y(d); })
            //.attr("transform", function(d,i) {return "translate(" + x(i) + "," + y(d) + ")"; })
            .attr("fill", (d, i) => { 
                var floatIndex = i/(this.n+1);
                var colorIndex = Math.floor(floatIndex);

                //console.log("colorscale and index", i, this.n+1, d, colorScale, floatIndex, colorIndex);

                //console.log(colorScale[colorIndex]);

                var color= this.colorScale[colorIndex](d+0.2);
                if(i%(this.n+1)==this.k) {
                    color= "rgba(255,0,0,0.5)"; 
                }
                //console.log(color);
                return color; 
            });
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

        this.margin = {top: 20, right: 5, bottom: 30, left: 5};
        this.width = 500 - this.margin.left - this.margin.right;
        this.height = 300 - this.margin.top - this.margin.bottom;

        //var max = d3.max(this.values);
        //var min = d3.min(this.values);
        
        this.x = d3.scaleLinear()
            .domain([0, this.n+2])
            .range([0, this.width]);

        // Generate a histogram using n+2 uniformly-spaced bins.

        var yMax = d3.max(this.values, function (d) {return d}); // the max count
        var yMin = d3.min(this.values, function(d){return d}); // the min count

        this.colorScale = [d3.scaleLinear()
                    .domain([yMin, yMax])
                    //.domain([0, 1.2])
                    .range(["rgba(240, 255, 240, 0.5)", "rgba(70, 130, 180, 0.5)"]), 
                    d3.scaleLinear()
                    .domain([yMin, yMax])
                    //.domain([0, 1.2])
                    .range(["rgba(0, 255, 128, 0.5)", "rgba(127,255,0, 0.5)"])];

        this.y = d3.scaleLinear()
            //.domain([0, yMax])
            .domain([0, yMax])
            .range([this.height, 0]);

        var xAxis = d3.axisBottom(this.x);
        var yAxis = d3.axisLeft(this.y);

        this.svg = d3.select(node).append("svg")
            .attr("width", "100%")
            .attr("height", this.height + this.margin.top + this.margin.bottom);

        this.bar = this.svg
            .append("g");
        
        this.bar.attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");

        //console.log("binomial k is", this.k);

        this.draw_dist();

        // this.bar.append("rect")
        //     .attr("x", 1)
        //     .attr("width", function(d) { return x(d.x1) - x(d.x0) -1 ; })
        //     .attr("height", function(d) { return height - y(d.length); })
        //     .attr("fill", function(d) { return colorScale(d.length) });

        var tick_factor = 1;

        this.xticks = this.svg.selectAll("rect").append("text")
            .attr("dy", ".5em")
            .attr("y", -15)
            .attr("x", (d)=> { return (this.x(d.x1) - this.x(d.x0) )/tick_factor; })
            .attr("text-anchor", "middle")
            .style("font-size", "12px")
            .text((d)=> { return formatCount(d); });

        this.xaxis = this.svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + this.height + ")")
            .call(xAxis);

        this.yaxis = this.svg.append("g")
            .attr("class", "y axis")
            .attr("transform", "translate("+ this.margin.left +", 0)")
            .call(yAxis);

        //console.log(this.values);
        //this.mean = Number(d3.mean(this.values)).toFixed(2);
        // this.text1 = this.svg.append("text").attr("x", 420).attr("y", 60).text("H_0 sample mean = " + this.mean)
        // .style("font-size", "15px").attr("alignment-baseline","middle");

        // if(this.mean_h_a!== undefined) {
        //     this.text2 = this.svg.append("text").attr("x", 420).attr("y", 80).text("H_a Sample mean = " + this.mean_h_a)
        //     .style("font-size", "15px").attr("alignment-baseline","middle");
        // }
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
        
        //console.log(this.values);

        //this.values = d3.range(samplesize).map(d3.randomNormal(mean, sd));
        //var this.values2 = d3.range(1000).map(d3.randomNormal(1, 1));
        //console.log(this.values)

        // A formatter for counts.
        var formatCount = d3.format(",.0f");

        /*var margin = {top: 20, right: 5, bottom: 30, left: 5},
            width = 500 - margin.left - margin.right,
            height = 300 - margin.top - margin.bottom;
        */

        this.x// = d3.scaleLinear()
            .domain([0, this.n+2])
            .range([0, this.width]);

        // Generate a histogram using twenty uniformly-spaced bins.
        var yMax = d3.max(this.values); // the max count
        //console.log(yMax);
        var yMin = d3.min(this.values); // the min count
        
        this.colorScale = [d3.scaleLinear()
            .domain([yMin, yMax])
            //.domain([0, 1.2])
            .range(["rgba(240, 255, 240, 0.5)", "rgba(70, 130, 180, 0.5)"]), 
            d3.scaleLinear()
            .domain([yMin, yMax])
            //.domain([0, 1.2])
            .range(["rgba(0, 255, 128, 0.5)", "rgba(127,255,0, 0.5)"])];

        this.y
            //.domain([0, yMax+0.2])
            .domain([0, yMax])
            .range([this.height, 0]);

        var xAxis = d3.axisBottom(this.x);
        var yAxis = d3.axisLeft(this.y);

        var k = this.k;

        console.log("update bars");

        this.bar.selectAll("rect").remove().exit();

/*        this.bar
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
*/
        this.draw_dist();

        console.log("update xticks");
        var tick_factor = 1;

        this.xticks.remove();

        this.xticks = this.svg.selectAll("rect").append("text")
            .attr("dy", ".5em")
            .attr("y", -15)
            .attr("x", (d)=> { return (this.x(d.x1) - this.x(d.x0) )/tick_factor; })
            .attr("text-anchor", "middle")
            .style("font-size", "12px")
            .text((d)=> { return formatCount(d); });

        //this.svg.selectAll("g").selectAll(".x axis").remove().exit();

        //this.xaxis.remove();

        this.xaxis// = this.svg.append("g")
            .transition()
            .duration(200)
            .attr("class", "x axis")
            .attr("transform", "translate(0," + this.height + ")")
            .call(xAxis);

        this.yaxis// = this.svg.append("g")
            .transition()
            .duration(200)
            .attr("class", "y axis")
            .attr("transform", "translate("+ this.margin.left +", 0)")
            .call(yAxis);

        // this.text1.remove();
        // //console.log(this.values);
        // //this.mean = Number(d3.mean(this.values)).toFixed(2);
        // this.svg.append("text").attr("x", 420).attr("y", 60).text("H_0 Sample mean = " + this.mean)
        // .style("font-size", "15px").attr("alignment-baseline","middle");

        // if(this.mean_h_a!== undefined) {
        //     this.text2.remove();
        //     this.svg.append("text").attr("x", 420).attr("y", 80).text("H_a Sample mean = " + this.mean_h_a)
        //     .style("font-size", "15px").attr("alignment-baseline","middle");
        // }

    }

}

module.exports = Binomial;