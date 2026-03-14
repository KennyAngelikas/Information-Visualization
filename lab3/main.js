import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

const svg = d3.select("svg");
console.log("D3 loaded:", d3);

const circles = d3.select("g").selectAll("circle");

circles
    .style("fill", (d, i) => {
        if (i % 2 === 0) {
            return "red";  // Even numbers (0, 2, 4)
        } else {
            return "blue"; // Odd numbers (1, 3)
        }
    })
    .attr("r", (d, i) => 10 + (i * 10)) // Size increases 10, 20, 30...
    .attr("cx", (d, i) => i * 100)      // Spread them out
    .attr("cy", 0);                     // Align vertically
// .attr("cy", (d, i) => i * 100)      // Spread them out
// .attr("cx", 0);                     // Align horizontally

d3.csv("../lab1/cars.csv")
    .then((data) => {
        console.log(data)
    }).catch((error) => {
        console.error("Error loading CSV:", error)
    });

d3.json("https://raw.githubusercontent.com/npow/airline-codes/master/airlines.json")
    .then((data) => {
        console.log(data)
    }).catch((error) => {
        console.error("Error loading CSV:", error)
    });