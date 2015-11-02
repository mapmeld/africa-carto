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

  // load African kingdoms
  $.getJSON("data/kingdoms.geojson", function (gj) {
    var kingdoms = new mapboxgl.GeoJSONSource({data: gj});
    map.addSource('kingdoms', kingdoms);

    map.addLayer({
      "id": "zimbabwe",
      "type": "line",
      "source": "kingdoms",
      "filter": ['any', ['==', 'name', 'Zimbabwe Kingdom']]
      "layout": {
        "visibility": "visible",
        "line-cap": {
          "base":1,"stops":[[0,"butt"],[11,"round"]]
        },
        "line-join":"round"
      },
      "paint":{
        "line-color":"#8ccbf7","line-width":{
          "base":1.3,"stops":[[8.5,0.1],[20,8]]
        },
        "line-opacity":{
          "base":1,"stops":[[8,0],[8.5,1]]
        }
      }
    });
  });
}, 250);
