import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

// Activity 2: Load JSON Data
d3.json("./coins.json").then((data) => {
    
    // 1. Extract the Bitcoin array from the JSON object
    let bitcoinData = data.bitcoin;

    // 2. Filter out null prices (as requested in the lab)
    bitcoinData = bitcoinData.filter(d => d.price_usd != null);

    // 3. Clean the data: Parse dates and convert prices to numbers
    const parseTime = d3.timeParse("%d/%m/%Y"); // Format: Day/Month/Year
    bitcoinData.forEach(d => {
        d.date = parseTime(d.date);
        d.price = +d.price_usd;
    });

    // 4. Sort chronologically
    bitcoinData.sort((a, b) => a.date - b.date);

    // Call the rendering function
    renderBitcoinChart(bitcoinData);

}).catch(error => {
    console.error("Error loading JSON:", error);
});

function renderBitcoinChart(data) {
    const margin = { top: 30, right: 30, bottom: 50, left: 80 };
    const width = 800 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    const svg = d3.select("#cryptograph")
        .append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

    // SCALES
    const x = d3.scaleTime()
        .domain(d3.extent(data, d => d.date))
        .range([0, width]);

    const y = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.price)])
        .range([height, 0]);

    // LINE GENERATOR
    const line = d3.line()
        .x(d => x(d.date))
        .y(d => y(d.price));

    // DRAW THE PATH
    svg.append("path")
        .datum(data) // Use .datum for a single continuous line
        .attr("fill", "none")
        .attr("stroke", "orange")
        .attr("stroke-width", 2)
        .attr("d", line);

    // AXES
    svg.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(d3.axisBottom(x));

    svg.append("g")
        .call(d3.axisLeft(y).tickFormat(d => "$" + d));
}

/*
d3.csv("./covid_phila.csv").then((data) => {
    // 1.1: Filter out rows with no date
    data = data.filter(d => d.collection_date != null);

    // 1.2: Clean the Data
    data.forEach(d => {
        d.date = new Date(d.collection_date);
        d.count = +d.count;
    });

    console.log("Cleaned Data Sample:", data.slice(0, 5));

    // Sort chronologically
    data.sort((a, b) => a.date - b.date);

    // Group by test result
    const sumstat = d3.group(data, d => d.test_result);

    renderChart(data, sumstat);
});

function renderChart(data, sumstat) {
    const margin = { top: 30, right: 30, bottom: 50, left: 60 };
    const width = 800 - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;

    const svg = d3.select("#linegraph")
        .append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

    // 1.3: Create Scales
    const x = d3.scaleTime()
        .domain(d3.extent(data, d => d.date))
        .range([0, width]);

    const y = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.count)])
        .range([height, 0]);

    const color = d3.scaleOrdinal()
        .domain(['negative', 'positive'])
        .range(['steelblue', 'crimson']);

    // 1.4: Line Generator
    const line = d3.line()
        .x(d => x(d.date))
        .y(d => y(d.count));

    // Draw the paths
    svg.selectAll(".line")
        .data(sumstat)
        .join("path")
        .attr("class", "line")
        .attr("fill", "none")
        .attr("stroke", d => color(d[0])) // d[0] is the key ('positive' or 'negative')
        .attr("d", d => line(d[1]));     // d[1] is the array of values

    // Add Axes
    svg.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(d3.axisBottom(x));

    svg.append("g")
        .call(d3.axisLeft(y));
}

*/