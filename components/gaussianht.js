const D3Component = require('idyll-d3-component');
const d3 = require('d3');

//Based on work provided by Eric Cohen
//https://github.com/Escohen98/QKE-A4

class GaussianHT extends D3Component {

    getData() {

        // loop to populate data array with
        // probabily - quantile pairs
        for (let i = 0; i < 100000; i++) {
            let q = this.normal(), // calc random draw from normal dist
            p = this.gaussian(q), // calc prob of rand draw
            o = this.gaussian(q, 1), // calc prob of rand draw with mean = 1, custom code
            el = {
                "q": q,
                "p": p,
                "o": o
            };
            this.data.push(el)
        };

        // need to sort for plotting
        //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort
        this.data.sort(function(x, y) {
            return x.q - y.q;
        });

    }

    // from http://bl.ocks.org/mbostock/4349187
    // Sample from a normal distribution with mean 0, stddev 1.
    normal() {
        let x = 1,
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
    gaussian(x, m=0) {
        let gaussianConstant = 1 / Math.sqrt(2 * Math.PI),
            mean = m,
            sigma = 1;

        x = (x - mean) / sigma;
        return gaussianConstant * Math.exp(-.5 * x * x) / sigma;
    };


    initialize(node, props){

        //Taken from http://bl.ocks.org/phil-pedruco/88cb8a51cdce45f13c7e
        //setting up empty data array
        this.data = [];

        this.getData(); // populate data

        //console.log(this.data);

        // line chart based on http://bl.ocks.org/mbostock/3883245
        this.margin = {
                top: 20,
                right: 5,
                bottom: 30,
                left: 15
            };

        this.width = 500 - this.margin.left - this.margin.right,
        this.height = 300 - this.margin.top - this.margin.bottom;

        this.x = d3.scaleLinear()
            .domain([-4, 4])
            .range([0, this.width]);

        this.y = d3.scaleLinear()
            .range([this.height+this.margin.top, this.margin.bottom]);

        console.log("adding axis")

        this.xAxis = d3.axisBottom(this.x);

        this.yAxis = d3.axisLeft(this.y);

        let yval = 270; //Arbitrary Height
        let xval = 445; //Stopping point. Max x = 800 (0 coordinate = 445)

        console.log("calculating svg areas")
        //Taken from http://bl.ocks.org/jacobw56/2fd529120462c8ee044bccc3b0836547
        //Changed it up a bit
        //Took hours to figure out, but I did it!!!!
        this.area = d3.area() //Red
        .x((d) => {  if(this.x(d.q)>xval) return this.x(d.q); return this.x(0);})
        .y0(yval)
        .y1((d) => { if(d.p<d.o )return this.y(d.p); return this.y(d.p); });

        this.area1 = d3.area() //Blue
        .x((d) => {  if(this.x(d.q)<=xval) return this.x(d.q); return this.x(0);})
        .y0(yval)
        .y1((d) => { if(d.o<d.p) return this.y(d.o); return this.y(d.p) });


        console.log("drawing lines for svg")
        this.line = d3.line()
            .x((d) => {
                return this.x(d.q);
            })
            .y((d) => {
                return this.y(d.p);
            });

        //Custom code
        this.line2 = d3.line()
        .x((d) => {
            return this.x(d.q);
        })
        .y((d) => {
            return this.y(d.o);
        })

        console.log("about to add svg")
        //
        this.svg = d3.select(node).append("svg")
            .attr("width", this.width + this.margin.left + this.margin.right)
            .attr("height", this.height + this.margin.top + this.margin.bottom)
            .append("g")
            .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");

        /*this.x.domain(d3.extent(this.data, function(d) {
            return d.q;
        }));*/
        this.y.domain(d3.extent(this.data, function(d) {
            return d.p;
        }));

        console.log("adding xaxis")
        //Intersection (0.5, 0.352)
        this.svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + (this.height + this.margin.top) + ")")
            .call(this.xAxis);

        // svg.append("g")
        //     .attr("class", "y axis")
        //     .call(yAxis);

        //this.svg.append("path")

        console.log("adding line to svg");

        this.svg.append("path")
            .attr("class", "line")
            .attr("d", () => this.line(this.data))
            .attr("fill", "none")
            .attr("stroke", "yellow")
            .attr("stroke-width", "5px");

        console.log("adding line1 to svg");
        //Custom code
        this.svg.append("path")
            .attr("class", "line1")
            .attr("d", () => this.line2(this.data))
            .style("fill", "none")
            .style("stroke", "green")
            .style("stroke-width", "5px");


        console.log("addingh area to svg");
        this.svg.append("path")
            .attr("class", "area")
            .attr("d", () => this.area(this.data))
            .style("fill", "red")
            .style("stroke-width", "0px");

        console.log("addingh area1 to svg");
        this.svg.append("path")
            .attr("class", "area1")
            .attr("d", () => this.area1(this.data))
            .style("fill", "steelblue")
            .style("stroke-width", "0px");

    }

    update(props){

    }
}

module.exports = GaussianHT;
