var map = L.map('well-living-map').setView([23.1, 120.3], 11);
var mapLayer = L.tileLayer('http://{s}.tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png', {
  maxZoom: 18,
  attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);
var sensitiveArea, liquefactionArea, waterArea;
var sStyle = {
    "color": "#ff0000",
    "fillOpacity": 0.6,
    "weight": 1
  },
  lStyle = {
    "color": "#00ff00",
    "weight": 1
  },
  wStyle = {
    "color": "#0000ff",
    "fillOpacity": 0.6,
    "weight": 1
  };

$.getJSON('./src/data/disaster-sensitive.json', function(json) {
  sensitiveArea = json;
  L.geoJSON(sensitiveArea, { style: sStyle }).addTo(map);
});

$.getJSON('./src/data/disaster-liquefaction.json', function(json) {
  liquefactionArea = json;
  L.geoJSON(liquefactionArea, { 
    style: function(feature) {
        switch (feature.properties['分級']) {
            case '低潛勢': lStyle.fillOpacity = 0.2;break;
            case '中潛勢': lStyle.fillOpacity = 0.4;break;
            case '高潛勢': lStyle.fillOpacity = 0.6;break;
            default: console.log("undefined error");break;
        }
        return lStyle;
    }
  }).addTo(map);
});

$.getJSON('./src/data/disaster-water.json', function(json) {
  waterArea = json;
  L.geoJSON(waterArea, { style: wStyle }).addTo(map);
});
