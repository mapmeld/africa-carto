// use some code from D3 examples
var width = 800,
  height = 800;

var projection = d3.geo.cylindricalEqualArea()
  .scale(470)
  .translate([290, 340])
  .precision(.1);

var path = d3.geo.path()
  .projection(projection);

var svg = d3.select("body").append("svg")
  .attr("width", width)
  .attr("height", height);

d3.json("data/world-continents.topojson", function(error, world) {
  if (error) {
    throw error;
  }
  svg.insert("path")
    .datum(topojson.feature(world, world.objects.continents))
    .attr("class", "outside-land")
    .attr("d", path);
});

d3.json("data/africa.topojson", function(error, africa) {
  if (error) {
    throw error;
  }

  svg.insert("path")
    .datum(topojson.feature(africa, africa.objects.countries))
    .attr("class", "country")
    .attr("d", path);
});
