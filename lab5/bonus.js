export function renderBonusBarchart(d3, rawData) {
    const svg = d3.select("#barchart-bonus"); // Ensure you have this SVG in HTML
    const margin = { top: 50, right: 50, bottom: 50, left: 50 };
    const width = +svg.attr("width") - margin.left - margin.right;
    const height = +svg.attr("height") - margin.top - margin.bottom;

    const chart = svg.append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

    // 1: Process Data (Group by Cylinders, average HWY)
    let rolledData = d3.rollup(rawData,
        v => Math.round(d3.mean(v, d => +d.hwy)),
        d => +d.cyl
    );

    // Sort the data by number of cylinders (4, 5, 6, 8)
    const data = Array.from(rolledData, ([name, value]) => ({ name, value }))
        .sort((a, b) => a.name - b.name);

    // 2: Create Scales
    const x = d3.scaleBand()
        .domain(data.map(d => d.name))
        .range([0, width])
        .padding(0.2);

    const y = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.value)])
        .range([height, 0]);

    // Linear Color Scale for continuous data
    const colorScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.value)])
        .range(["#e0f2f1", "#00695c"]); // Light green to Dark green

    // 3: Draw Bars
    chart.append('g')
        .selectAll("rect")
        .data(data)
        .join("rect")
        .attr("x", d => x(d.name))
        .attr("y", d => y(d.value))
        .attr("width", x.bandwidth())
        .attr("height", d => height - y(d.value))
        // Mapping BOTH color and height to the 'value' (HWY MPG)
        .attr("fill", d => colorScale(d.value))
        .attr("opacity", 0.9);

    // 4: Add Axes
    chart.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(d3.axisBottom(x));

    chart.append("g")
        .call(d3.axisLeft(y));

    // Add X-Axis Label
    chart.append('text')
        .attr('x', width / 2)
        .attr('y', height + 40)
        .attr('text-anchor', 'middle')
        .text('Number of Cylinders');
}