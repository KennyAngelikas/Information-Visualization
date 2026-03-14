import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

// d3.csv("movie_metadata.csv").then((data) => { console.log(data) })

/*
const data = [
    { name: 'London', population: 8674000 },
    { name: 'New York', population: 8406000 },
    { name: 'Sydney', population: 4293000 },
    { name: 'Paris', population: 2244000 },
    { name: 'Beijing', population: 11510000 }
]

let g = d3.select("#vis")// var g becomes an array of 5 svg circles
    .selectAll("rect") // squares
    .data(data)
    .join("rect") //mapping a rectangle to each array element

g.attr("fill", "steelblue")
    .attr("width", function (d) { return + d.population / 1000000 })
    .attr("height", function (d) { return + d.population / 1000000 })
    .attr("x", function (d, i) { return 50 * i })
    .attr("y", function (d, i) { return 50 * i })


g.attr('transform', "translate(50, 50)")
*/

function createVisualization() {
    d3.csv("./cars.csv").then((data) => { //anonymous function returns w/ data
        d3.select('#vis')
            .selectAll('circle')
            .data(data)
            .join(
                function (enter) {
                    return enter.append('circle')
                        .style('opacity', 0.25);
                },
                function (update) {
                    return update.style('opacity', 1);
                }
            )
            .attr('cx', function (d, i) { return scale(i); })

            .attr('cy', 50)
            .attr('r', (d) => +d.hwy * 0.5)
            .style('fill', 'steelblue');
    })
}


d3.select("button") //select button on the page, add a click event to it.
    .on("click", createVisualization);

var scale = d3.scaleLinear() //returns a function you can invoke later! 
    .domain([0, 250]) //we have <250 cars
    .range([0, 1400]); //our SVG is 1400px wide
let axis = d3.axisBottom(scale);

d3.select('#vis').append("g")
    .transition()
    .call(axis).attr("transform", "translate(" + 0 + ", " + 90 + ")");
