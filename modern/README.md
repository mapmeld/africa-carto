## africa-carto tutorial

## Modern Political Map

<img src="http://mapmeld.github.io/africa-carto/maps/3.jpg"/>

### Creating a D3 Map

I want to display the modern-day map of Africa in a different, so the best option today is to use D3.

According to Mike Bostock's entry on d3.geo, the <a href="http://bl.ocks.org/mbostock/3712408">Cylindrical Equal-Area</a>
projection is the way to display the Gall-Peters projection (as seen in that scene from *The West Wing*).

I already have a continents-except-Africa GeoJSON file, so I convert that into TopoJSON using this command:

```bash
npm install -g topojson
topojson continents.geojson -o world-continents.topojson
```

Then I set up a D3 map with this initial framework:

```javascript
// create the projection object
var projection = d3.geo.cylindricalEqualArea()
  .parallel(45)
  .scale(190)
  .translate([width / 2, height / 2])
  .precision(0.1);

// set the d3.geo.path object out here
var path = d3.geo.path()
  .projection(projection);

d3.json("data/world-continents.topojson", function(error, world) {
  // callback with loaded JSON data
  svg.insert("path")
    // use topojson to make sense of the world topojson file
    .datum(topojson.feature(world, world.objects.continents))
    .attr("class", "outside-land")
    .attr("d", path);
});
```

Because D3 is creating this internally in SVG, I can use CSS to style:

```css
html, body, svg {
  margin: 0;
  padding: 0;
  border: none;
  background-color: #8ccbf7;
}

.outside-land {
  fill: #6cabc7;
}
```

Here's what it looks like:

<img src="http://mapmeld.github.io/africa-carto/maps/progress/political-projection.png"/>

### Adding Africa

African countries are re-added from <a href="https://github.com/johan/world.geo.json/">world.geo.json</a>, an open source project from Johan. I skipped QGIS and removed countries line-by-line from the GeoJSON file until only African countries were there.

Worth noting here that Sao Tome and Principe, the Seychelles, and a few other islands are not in world.geo.json because they are too small, but they
are labelled on the Brooklyn Museum map. The map also includes South Sudan, Somaliland, and Western Sahara. The Brooklyn Museum does not recognize Somaliland.

The GeoJSON file is large enough that I'd like to reformat it as a smaller TopoJSON file. Run this command:

```bash
topojson africa.geojson -p -o africa.topojson
```

Once I've loaded that in, I'll use a new CSS class to style it:

```css
.country {
  fill: #fff;
  stroke: #888;
  stroke-width: 1.5px;
}
```

It's tempting to have the borders be black, but a grey border (#888) looks better.

Then I realign the initial projection so that it's centered and zoomed on Africa. Here's what we get:

<img src="http://mapmeld.github.io/africa-carto/maps/progress/political-cropped.png"/>

### Labeling Countries

Now we need to add labels over the countries. Mike Bostock's <a href="http://bost.ocks.org/mike/map/">Let's Make a Map</a>
is a good guide to adding labels. We re-add the countries but instead of using GeoJSON to make paths, we add an SVG text element.

The country name is in the GeoJSON "name" property, so I retrieve that in the anonymous function passed to text()

```javascript
svg.selectAll(".subunit-label")
    .data(topojson.feature(africa, africa.objects.africa).features)
  .enter().append("text")
    .attr("class", "subunit-label")
    .attr("transform", function(d) { return "translate(" + path.centroid(d) + ")"; })
    .attr("dy", ".35em")
    .text(function(d) { return d.properties.name; });
```

Then the size, font, and capitalization of the labels is set using CSS:

```css
.subunit-label {
  font-family: arial, sans-serif;
  fill: #000;
  font-size: 11px;
  text-anchor: middle;
  text-transform: uppercase;
}
```

<img src="http://mapmeld.github.io/africa-carto/maps/progress/political-labels.png"/>

The labels are placed in the geographic center of the country, which isn't always the best location for it. Labeling is an
exceedingly difficult thing for a human to do, and computers aren't especially good at it. Even if the labels were much
smaller Ivory Coast, Ghana, Togo, and Benin are right next to each other. In the Brooklyn Museum map, most of West Africa's
labels are moved into the ocean's negative space.

We can set dx using a function to move individual labels. Here are two:

```javascript
.attr("dx", function (d) {
  switch (d.properties.name) {
    case "Djibouti":
      return "40px";
    case "Eritrea":
      return "20px";
  }
})
```

#### Multiple Line Text

Another significant change is that multiple-word labels (Western Sahara, South Sudan) should be on multiple lines. In SVG, you need
to split a text element into multiple tspans for there to be multiple lines. Fortunately a StackOverflow answer explains how to do this:

```javascript
/* modified from bdesham's answer at http://stackoverflow.com/a/13275930 */
var insertLineBreaks = function (d) {
  var el = d3.select(this);
  var words = el.text().split(' ');
  el.text('');

  for (var i = 0; i < words.length; i++) {
    var tspan = el.append('tspan').text(words[i]);
    if (i > 0)
      tspan.attr('x', 0).attr('dy', '15');
  }
};
```

Guinea-Bissau was listed as "Guinea Bissau" in my GeoJSON, but the Brooklyn Museum map uses a hyphen and thus does not split it. I edited
the GeoJSON file and re-ran the TopoJSON script.

Sierra Leone is also written on one line by the Brookyln Museum map. I didn't see a need to do this.

Now the labels look much better:

<img src="http://mapmeld.github.io/africa-carto/maps/progress/political-labels-2.png"/>

### Adding Islands
