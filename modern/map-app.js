// use some code from D3 examples
var width = 700,
  height = 800;

var projection = d3.geo.cylindricalEqualArea()
  .parallel(45)
  .scale(460)
  .translate([290, 420])
  .precision(0.1);

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
    .datum(topojson.feature(africa, africa.objects.africa))
    .attr("class", "country")
    .attr("d", path);
});
