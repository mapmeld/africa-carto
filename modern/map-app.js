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

/* modified from bdesham's answer at http://stackoverflow.com/a/13275930 */
var insertLineBreaks = function (d) {
  var el = d3.select(this);
  var words = el.text().split(' ');
  el.text("");
  var dx = el.attr("dx") || 0;

  for (var i = 0; i < words.length; i++) {
    var tspan = el.append('tspan').text(words[i]);
    if (i > 0)
      tspan.attr('x', dx).attr('dy', '15');
  }
};

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
      .attr("class", "subunit-label")
      .attr("transform", function(d) { return "translate(" + path.centroid(d) + ")"; })
      .attr("dy", function (d) {
        switch (d.properties.name) {
          case "Benin":
            return "-20px";
          case "Cameroon":
            return "10px";
          case "Central African Republic":
            return "-10px";
          case "Congo":
            return "55px";
          case "Ghana":
            return "40px";
          case "Liberia":
            return "30px";
          case "Madagascar":
            return "90px";
          case "Morocco":
            return "-50px";
          case "Senegal":
            return "-20px";
          case "Somalia":
            return "15px";
          case "South Africa":
            return "50px";
          case "Tunisia":
            return "-10px";
          case "Zambia":
            return "15px";
        }
        return "0.35em";
      })
      .attr("dx", function (d) {
        switch (d.properties.name) {
          case "Cameroon":
            return "-10px";
          case "Congo":
            return "-10px";
          case "Djibouti":
            return "40px";
          case "Equatorial Guinea":
            return "-35px";
          case "Eritrea":
            return "20px";
          case "Gambia":
            return "-40px";
          case "Guinea-Bissau":
            return "-65px";
          case "Liberia":
            return "-8px";
          case "Madagascar":
            return "-35px";
          case "Morocco":
            return "30px";
          case "Senegal":
            return "-35px";
          case "Sierra Leone":
            return "-15px";
          case "Tunisia":
            return "15px";
          case "Western Sahara":
            return "-60px";
        }
      })
      .text(function(d) {
        return d.properties.name;
      })
      .each(insertLineBreaks);
});
