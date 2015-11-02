## africa-carto tutorial

### Physical and Kingdom Map

To include the physical/terrain basemap, I'll use the MapBoxGL JavaScript API. According to
<a href="https://github.com/mapbox/mapbox-gl-js/issues/1466">this ticket</a>, I need to keep using the Web Mercator projection for now.

The default MapBoxGL style has roads, borders, and labels which shouldn't appear in the physical/kingdom map. It also has a much-too-light green for grassland and jungle. I can set a custom style
using this JavaScript:

```javascript
mapboxgl.accessToken = 'pk.my.mapbox.api.key';

var map = new mapboxgl.Map({
  container: 'map',
  style: 'mapboxgl-style.json',
  center: [11, 0],
  zoom: 2.5,
  hash: true
});
```

Then in the same folder, I created mapboxgl-style.json using the sources and layers from <a href="https://api.mapbox.com/styles/v1/mapbox/streets-v8?access_token=pk.eyJ1IjoibWFwbWVsZCIsImEiOiI0a1NzYW53In0.2gQTd6k9Ghw8UBK4DsciLA">MapBox Streets v8</a>. Then I can cut out layers and make necessary style changes. I do need to keep the mapbox.mapbox-streets-v6 source to make the oceans fill in. I don't fully understand this part.

<img src="//mapmeld.github.io/africa-carto/maps/progress/physical-colored.png"/>

The natural boundaries shown come from OpenStreetMap/MapBox and differ from the Brooklyn Museum, but they look good on their own. The areas and hillshades sharpen when you zoom in.

<img src="//mapmeld.github.io/africa-carto/maps/progress/physical-zoom.png"/>

To cover up the other continents, I downloaded data from <a href="http://www.naturalearthdata.com/">Natural Earth</a>. In QGIS, I was able to divide one multipolygon from the data into many smaller polygons, and then split Africa (including the Sinai Peninsula) off from the rest of the earth. Then I ran simplify until my output GeoJSON was about 1 MB.

```javascript
// I put the jQuery call inside a timeout, because it needs to load after the MapBox/OSM layers
setTimeout(function() {
  $.getJSON("data/world-continents.geo.geojson", function (geojson) {
    var continents = new mapboxgl.GeoJSONSource({data: geojson});
    map.addSource('continents', continents);
    map.addLayer({
      "id": "continents",
      "type": "fill",
      "source": "continents",
      "paint": { "fill-color": "#6cabc7", "fill-opacity": 0.9 }
    });
  });
}, 250);
```

I tried to use MapBoxGL styling to make the rivers visible on the continent-level zoom, but the features stay small, and on OpenStreetMap they are tagged with a mix of coastline, riverbank, or natural=water tags. I go to Overpass API and extract waterway=river features from Madagascar. This dataset proves too large even on Madagascar, so I look
up the lile
