import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
import { renderScatterplot } from "./scatterplot.js";
import { renderBarchart } from "./barchart.js";
import { renderBonusBarchart } from "./bonus.js";

d3.csv("./cars.csv").then((data) => {
    renderScatterplot(d3, data);
    renderBarchart(d3, data);
    renderBonusBarchart(d3, data);
});
