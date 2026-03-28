export function renderScatterplot(d3, data) {
    const svg = d3.select("#scatterplot");
    const margin = { top: 50, right: 50, bottom: 50, left: 50 };
    const width = +svg.attr("width") - margin.left - margin.right;
    const height = +svg.attr("height") - margin.top - margin.bottom;

    const chart = svg.append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

    // --- 2.3: COLOR SCALE ---
    // Get unique manufacturers for the color domain
    const distinctValues = [...new Set(data.map((d) => d.manufacturer))];
    
    const colorScale = d3.scaleOrdinal()
        .domain(distinctValues)
        .range(d3.schemeSet3);

    // --- SCALES ---
    const x = d3.scaleLinear()
        .domain([0, d3.max(data, d => +d.hwy)])
        .range([0, width]);

    const y = d3.scaleLinear()
        .domain([0, d3.max(data, d => +d.cty)])
        .range([height, 0]);

    // --- 2.0 & 2.4: AXES WITH TICKS ---
    // X-axis with grid lines (tickSize)
    chart.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(d3.axisBottom(x).ticks(10).tickSize(-height))
        .call((g) => g.select(".domain").remove()); // Optional: cleaner look

    // Y-axis with grid lines
    chart.append("g")
        .call(d3.axisLeft(y).ticks(10).tickSize(-width))
        .call((g) => g.select(".domain").remove());

    // --- 2.1: AXIS TITLES ---
    chart.append('text')
        .attr('class', 'axis-title')
        .attr('y', height - 15)
        .attr('x', width - 60)
        .text('HWY');

    chart.append('text')
        .attr('class', 'axis-title')
        .attr('x', 10)
        .attr('y', 25)
        .text('CTY');

    // --- 1, 3, & 2.2: POINTS & TOOLTIP ---
    const points = chart.append('g')
        .selectAll("circle")
        .data(data)
        .join("circle")
        .attr("cx", d => x(+d.hwy))
        .attr("cy", d => y(+d.cty))
        .attr("r", 15) // Increased radius per 2.3 instructions
        .attr("fill", d => colorScale(d.manufacturer)) // Map color to manufacturer
        .attr("opacity", 0.8)
        .style("cursor", "pointer")
        // TOOLTIP INTERACTION
        .on('mouseover', (event, d) => {
            d3.select(event.currentTarget)
                .style("stroke", "black")
                .style("stroke-width", 2);

            d3.select('#tooltip')
                .style('display', 'block')
                // Position tooltip near the mouse
                .style('left', (event.pageX + 10) + 'px')
                .style('top', (event.pageY - 10) + 'px')
                .html(`
                    <h3 style="margin:0">${d.manufacturer.toUpperCase()}</h3>
                    <b>Model:</b> ${d.model}<br/>
                    <b>Highway:</b> ${d.hwy} MPG<br/>
                    <b>City:</b> ${d.cty} MPG
                `);
        })
        .on('mouseleave', (event) => {
            d3.select('#tooltip').style('display', 'none');
            d3.select(event.currentTarget).style("stroke", "none");
        });
}