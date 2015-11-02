var width = 960,
  height = 300;

var projection = d3.geo.cylindricalEqualArea()
  .scale(153)
  .translate([width / 2, height / 2])
  .precision(.1);

var path = d3.geo.path()
  .projection(projection);

var graticule = d3.geo.graticule();

var svg = d3.select("body").append("svg")
  .attr("width", width)
  .attr("height", height);

svg.append("path")
  .datum(graticule)
  .attr("class", "graticule")
  .attr("d", path);

d3.json("data/world-continents.topojson", function(error, world) {
  if (error) {
    throw error;
  }

  svg.insert("path", ".graticule")
    .datum(topojson.feature(world, world.objects.continents))
    .attr("class", "land")
    .attr("d", path);
});

d3.select(self.frameElement).style("height", height + "px");
