mapboxgl.accessToken = 'pk.eyJ1IjoibWFwbWVsZCIsImEiOiI0a1NzYW53In0.2gQTd6k9Ghw8UBK4DsciLA';

// load basic terrain map into MapBox GL JS API
var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapboxgl-style.json',
    center: [11, 0],
    zoom: 2.5,
    hash: true
});

// delay layer load briefly to make sure it loads after the main JSON file
setTimeout(function() {
  // load continents other than Africa, and block the underlying terrain
  $.getJSON("data/world-continents.geo.geojson", function (gj) {

    var continents = new mapboxgl.GeoJSONSource({data: gj});
    map.addSource('continents', continents);

    map.addLayer({
      "id": "continents",
      "type": "fill",
      "source": "continents",
      "paint": {
        "fill-color": "#6cabc7",
        "fill-opacity": 0.9
      }
    });
  });

  // load rivers from Overpass API data
  $.getJSON("data/rivers.geojson?v=2", function (gj) {

    var rivers = new mapboxgl.GeoJSONSource({data: gj});
    map.addSource('rivers', rivers);

    console.log(gj.features);

    map.addLayer({
      "id": "rivers",
      "type": "line",
      "source": "rivers",
      "paint": {
        "line-color": "#6cabc7",
        "line-width": 2
      }
    });
  });

  // load African kingdoms
  $.getJSON("data/kingdoms.geojson?v=3", function (gj) {
    var kingdoms = new mapboxgl.GeoJSONSource({data: gj});
    map.addSource('kingdoms', kingdoms);

    map.addLayer({
      "id": "kongo",
      "type": "line",
      "source": "kingdoms",
      "filter": ['any', ['==', 'name', 'Kongo Kingdom']],
      "layout": {
        "visibility": "visible"
      },
      "paint":{
        "line-color":"#000",
        "line-width":4,
        "line-dasharray": [2, 1]
      }
    });

    map.addLayer({
      "id": "zimbabwe",
      "type": "line",
      "source": "kingdoms",
      "filter": ['any', ['==', 'name', 'Zimbabwe Kingdom']],
      "layout": {
        "visibility": "visible"
      },
      "paint":{
        "line-color":"#5c9bc7",
        "line-width":4,
        "line-dasharray": [2, 1]
      }
    });
  });
}, 250);
