## africa-carto tutorial

## Modern Political Map

### Creating a D3 Map

I want to display the modern-day map of Africa in a different, so the best option today is to use D3.

According to Mike Bostock's entry on d3.geo, the <a href="http://bl.ocks.org/mbostock/3712408">Cylindrical Equal-Area</a>
projection is the way to display the Gall-Peters projection (as seen in that scene from *The West Wing*).

I already have a continents-except-Africa GeoJSON file, so I convert that into TopoJSON and load it
into D3's example map.

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

The GeoJSON file is large enough that I'd like to reformat it as a smaller TopoJSON file. Run these commands:

```bash
npm install -g topojson
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

It's tempting to have the borders be black, but it looks weird on maps.

Then I realign the initial projection so that it's centered and zoomed on Africa. Here's what we get:

<img src="http://mapmeld.github.io/africa-carto/maps/progress/political-cropped.png"/>

### Labeling Countries

### Adding Islands
