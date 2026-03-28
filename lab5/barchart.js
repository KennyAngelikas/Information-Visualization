export function renderBarchart(d3, rawData) {
    const svg = d3.select("#barchart");
    const margin = { top: 50, right: 50, bottom: 50, left: 50 };
    const width = +svg.attr("width") - margin.left - margin.right;
    const height = +svg.attr("height") - margin.top - margin.bottom;

    const chart = svg.append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

    // --- 3.2: DATA PROCESSING ---
    // Group by manufacturer and calculate the mean of 'cty'
    let rolledData = d3.rollup(rawData, 
        v => Math.round(d3.mean(v, d => d.cty)), 
        d => d.manufacturer
    );

    // Convert the Map back into an Array of objects so D3 can read it easily
    const data = Array.from(rolledData, ([name, value]) => ({ name, value }));

    // --- 3.3: SCALES ---
    const distinctNames = data.map(d => d.name);

    const x = d3.scaleBand()
        .domain(distinctNames)
        .range([0, width])
        .padding(0.2); // 20% of the band is empty space

    const y = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.value)])
        .range([height, 0]);

    const colorScale = d3.scaleOrdinal()
        .domain(distinctNames)
        .range(d3.schemeSet3);

    // --- 3.4: DRAWING BARS ---
    chart.append('g')
        .selectAll("rect") // Bars are SVG rectangles
        .data(data)
        .join("rect")
        .attr("x", d => x(d.name))
        .attr("y", d => y(d.value)) // The 'y' is the top of the bar
        .attr("width", x.bandwidth()) 
        .attr("height", d => height - y(d.value)) // Height is calculated from bottom
        .attr("fill", d => colorScale(d.name))
        .attr("opacity", 0.8)
        // Add the tooltip logic (same as scatterplot)
        .on('mouseover', (event, d) => {
            d3.select('#tooltip')
                .style('display', 'block')
                .style('left', (event.pageX + 10) + 'px')
                .style('top', (event.pageY - 10) + 'px')
                .html(`<h3>${d.name.toUpperCase()}</h3>Avg City MPG: ${d.value}`);
        })
        .on('mouseleave', () => d3.select('#tooltip').style('display', 'none'));

    // --- AXES ---
    chart.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(d3.axisBottom(x))
        .selectAll("text") // Rotate labels if they overlap
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", ".15em")
        .attr("transform", "rotate(-45)");

    chart.append("g")
        .call(d3.axisLeft(y));
}