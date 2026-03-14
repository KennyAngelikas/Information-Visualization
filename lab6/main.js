import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

d3.csv("movie_metadata.csv").then((data) => {
    // part 2 -- Filtering
    const filteredData = data.filter(d => {
        return d.genres && d.genres.trim() !== "" &&
            d.content_rating && d.content_rating.trim() !== "";
    });

    // Mapping/Slimming
    const mappedData = filteredData.map(d => ({
        title: d.movie_title,
        genre: d.genres,
        rating: d.content_rating
    }));

    // Counting with a Dictionary
    const genreCounts = {};
    mappedData.forEach(d => {
        const genresArray = d.genre.split("|");
        genresArray.forEach(g => {
            const genreName = g.trim();
            genreCounts[genreName] = (genreCounts[genreName] || 0) + 1;
        });
    });

    // Convert Map to Array for D3
    const genreArray = Object.entries(genreCounts).map(([genre, count]) => ({
        genre: genre,
        count: count
    }));

    console.table(genreArray);

    const genreGroups = d3.group(mappedData, d => d.genre);

    /*
    for (const [genre, movies] of genreGroups) {
        console.log("Genre Bucket:", genre);
        console.log("Count in this bucket:", movies.length);
        console.log("First movie in this bucket:", movies[0].title);
        break; // break so only see the very first one
    }
    */

    // part 3 -- DRAWING THE PIE CHART 
    const width = 600, height = 600, radius = Math.min(width, height) / 2;

    const svg = d3.select("#piechart")
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", `translate(${width / 2}, ${height / 2})`);

    // Assigns a color to each genre name
    const color = d3.scaleOrdinal()
        .domain(genreArray.map(d => d.genre))
        .range(d3.schemeCategory10);  // D3 color palette

    // Calculates the angles
    const pie = d3.pie()
        .value(d => d.count); 

    const arcs = pie(genreArray);

    // Calculates the actual SVG path shapes
    const arcGenerator = d3.arc()
        .innerRadius(0) // 0 for a Pie Chart, >0 for a Donut Chart
        .outerRadius(radius);

    // Join the data to the screen
    const tooltip = d3.select("#tooltip");

    svg.selectAll("path")
        .data(arcs)
        .join("path")
        .attr("d", arcGenerator)
        .attr("fill", d => color(d.data.genre))
        .attr("stroke", "white")
        // --- Show and fill the tooltip -- mouse hover
        .on("mouseover", function (event, d) {
            tooltip.style("opacity", 1)
                .html(`Genre: ${d.data.genre}<br>Count: ${d.data.count}`);

            d3.select(this).attr("opacity", 0.7); // gray out hovered slice
        })
        // --- Move the tooltip with the cursor -- mouse move
        .on("mousemove", function (event) {
            tooltip.style("left", (event.pageX + 10) + "px")
                .style("top", (event.pageY + 10) + "px");
        })
        // --- Hide the tooltip -- mouse out
        .on("mouseout", function () {
            tooltip.style("opacity", 0);
            d3.select(this).attr("opacity", 1);
        });
});