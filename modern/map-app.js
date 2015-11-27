// use some code from D3 examples
var width = 1400,
  height = 1600;

var projection = d3.geo.cylindricalEqualArea()
  .parallel(45)
  .scale(900)
  .translate([580, 840])
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

  svg.selectAll(".subunit-label")
      .data(topojson.feature(africa, africa.objects.africa).features)
    .enter().append("text")
      .attr("class", function(d) { return "subunit-label " + d.id; })
      .attr("transform", function(d) { return "translate(" + path.centroid(d) + ")"; })
      .attr("dy", ".35em")
      .text(function(d) { return d.properties.name; });
});
