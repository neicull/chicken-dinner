var width = 960, height = 500;

var vehicleCounts = d3.map();

var vehicleCountIntensity = d3.scale.linear()
    .domain([0, 1000])
    .range([0.9, 0.1]);

var path = d3.geo.path();

var svg = d3.select("#huge-map").append("svg")
    .attr("width", width)
    .attr("height", height);

queue()
    .defer(d3.json, "us.json")
    .defer(d3.csv, "cycle.csv", function(d) { vehicleCounts.set(d.zip, +d.data); })
    .await(ready);

function ready(error, us) {
  svg.append("g")
      .attr("class", "counties")
    .selectAll("path")
      .data(topojson.feature(us, us.objects.counties).features)
    .enter().append("path")
      .style("fill", function(d) { return d3.hsl(210, 1, vehicleCountIntensity(vehicleCounts.get(d.id))); })
      .attr("d", path);

  svg.append("path")
      .datum(topojson.mesh(us, us.objects.states))
      .attr("class", "states")
      .attr("d", path);
}

