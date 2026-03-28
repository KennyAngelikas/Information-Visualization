import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

Promise.all([
    d3.json("https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json"), // the geography
    d3.csv("./cities.csv"), // the capital cities
    d3.csv("./states.csv")  // the population numbers
]).then((data) => {

    const topology = data[0];
    const citiesData = data[1];
    const statesData = data[2];

    // step 1: create a lookup dictionary for population
    // Map because it's faster to grab data by state name later
    const statePopLookup = new Map();
    statesData.forEach(d => {
        statePopLookup.set(d.State, +d['2018 Population']);
    });

    // step 2: set up the color scale (light blue for low pop, deep blue for high)
    const colorScale = d3.scaleSequential()
        .domain(d3.extent(statePopLookup.values()))
        .range(["#f7fbff", "#084594"]);

    // step 3: prep the map shapes
    // convert topojson back to geojson features
    const statesGeo = topojson.feature(topology, topology.objects.states);

    // define "lens" for the US
    const projection = d3.geoAlbersUsa()
        .scale(1000)
        .translate([500, 300]);

    const pathGenerator = d3.geoPath().projection(projection);

    const svg = d3.select("#geomap");
    const chart = svg.append("g");

    // step 4: draw the states (the choropleth part)
    chart.append("g")
        .selectAll("path")
        .data(statesGeo.features)
        .join("path")
        .attr("d", pathGenerator)
        .attr("stroke", "white")
        .attr("stroke-width", "0.5px")
        .attr("fill", d => {
            // look up the state's population using its name
            const pop = statePopLookup.get(d.properties.name);
            return pop ? colorScale(pop) : "#ccc"; // gray if don't have data
        });

    // step 5: drop the city circles on top
    chart.append("g")
        .selectAll("circle")
        .data(citiesData)
        .join("circle")
        .attr("cx", d => {
            // projection expects [longitude, latitude]
            const p = projection([+d.longitude, +d.latitude]); 
            return p ? p[0] : null;
        })
        .attr("cy", d => {
            const p = projection([+d.longitude, +d.latitude]);
            return p ? p[1] : null;
        })
        .attr("r", 5)
        .attr("fill", "orange")
        .attr("stroke", "black")
        .attr("opacity", 0.8)
        .attr("pointer-events", "none"); // circles don't block mouse events on states

    console.log("map is live!");
});