var map = L.map('well-living-map', { renderer: L.canvas() }).setView([23.1, 120.3], 11)
map.scrollWheelZoom.disable()
var mapLayer = L.tileLayer('http://{s}.tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png', {
  maxZoom: 18,
  attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map)
var isLoadSensitiveData = false
var sensitiveArea, liquefactionArea, waterArea
var w600Layer, w200Layer, sLayer, lLayer, countryW600Layer, countryW200Layer
var sStyle = {
    color: '#E91E63',
    fillOpacity: 0.8,
    weight: 0,
  },
  lStyle = {
    color: '#8BC34A',
    fillOpacity: 0.8,
    weight: 0,
  },
  wStyle = {
    color: '#3F51B5',
    fillOpacity: 0.8,
    weight: 0,
  }

var info = '<span><span class="info-block bg-liquefaction"></span><strong>土壤液化潛勢區</strong></span>'
info += '<span><span class="info-block bg-water"></span><strong>淹水潛勢區</strong></span>'

$('#map-info').append(info)
$.getJSON('./src/data/disaster-liquefaction.json', function(json) {
  liquefactionArea = json
  lLayer = L.geoJSON(liquefactionArea, {
    style: function(feature) {
      switch (feature.properties['分級']) {
        case '低潛勢':
          lStyle.fillOpacity = 0.5
          break
        case '中潛勢':
          lStyle.fillOpacity = 0.7
          break
        case '高潛勢':
          lStyle.fillOpacity = 0.9
          break
        default:
          console.log("undefined error")
          break
      }
      return lStyle
    }
  }).addTo(map)
})

$.getJSON('./src/data/disaster-water600.json', function(json) {
  waterArea = json
  w600Layer = L.geoJSON(waterArea, {
    style: function(feature) {
      switch (feature.properties.CLASS) {
        case 1:
          wStyle.fillOpacity = 0.5
          break
        case 2:
          wStyle.fillOpacity = 0.7
          break
        case 3:
          wStyle.fillOpacity = 0.9
          break
        default:
          console.log("undefined error")
          break
      }
      return wStyle
    }
  }).addTo(map)
})

$.getJSON('./src/data/disaster-water200.json', function(json) {
  w200Layer = L.geoJSON(json)
})
$.getJSON('./src/data/disaster-country-water200.json', function(json) {
  countryW200Layer = L.geoJSON(json)
})
$.getJSON('./src/data/disaster-country-water600.json', function(json) {
  countryW600Layer = L.geoJSON(json,{
    style: function(feature) {
      switch (feature.properties.CLASS) {
        case 1:
          wStyle.fillOpacity = 0.5
          break
        case 2:
          wStyle.fillOpacity = 0.7
          break
        case 3:
          wStyle.fillOpacity = 0.9
          break
        default:
          console.log("undefined error")
          break
      }
      return wStyle
    }
  }).addTo(map)
})


/* api key shall be protext */
L.Control.geocoder({
  collapsed: false,
  placeholder: "請輸入地址或地名查詢...",
  errorMessage: "查無此地址",
  geocoder: new L.Control.Geocoder.Google("AIzaSyARIN80OjEjl4O24neRkXZgAo7hTKqVhD4"),
}).on('markgeocode', function(e) {
  var latlng = e.geocode.center
  var name = e.geocode.name
  var lResult = leafletPip.pointInLayer(latlng, lLayer, true)
  if (isLoadSensitiveData)
    var sResult = leafletPip.pointInLayer(latlng, sLayer, true)
  var w600Result = leafletPip.pointInLayer(latlng, w600Layer, true)
  var w200Result = leafletPip.pointInLayer(latlng, w200Layer, true)
  var countryW600Result = leafletPip.pointInLayer(latlng, countryW600Layer, true)
  var countryW200Result = leafletPip.pointInLayer(latlng, countryW200Layer, true)
  console.log("lLayer", lResult)
  if (isLoadSensitiveData)
    console.log("sLayer", sResult)
  console.log("wLayer", w600Result)
  var lresponse = lResult.length > 0 ? lResult[0].feature.properties['分級'] : "無潛勢"
  if (isLoadSensitiveData)
    var sresponse = sResult.length > 0 ? "是" : "否"
  if (w600Result.length > 0 && w200Result.length === 0) {
    var wresponse = '雨量達600mm時，可能淹水'
    wresponse += w600Result[0].feature.properties.NOTE.replace('(', '').replace(')', '')
  } else if (w600Result.length > 0 && w200Result.length > 0) {
    var wresponse = '雨量達200mm時(即豪雨)，可能淹水'
    wresponse += w200Result[0].feature.properties.NOTE.replace('(', '').replace(')', '')
    wresponse += '<br>雨量達600mm時，可能淹水'
    wresponse += w600Result[0].feature.properties.NOTE.replace('(', '').replace(')', '')
  } else if (w600Result.length === 0 && w200Result.length > 0) {
    var wresponse = '雨量達200mm時(即豪雨)，可能淹水'
    wresponse += w200Result[0].feature.properties.NOTE.replace('(', '').replace(')', '')
  } else if (countryW600Result.length > 0 && countryW200Result.length === 0) {
    var wresponse = '雨量達600mm時，可能淹水'
    wresponse += countryW600Result[0].feature.properties.NOTE.replace('(', '').replace(')', '')
  } else if (countryW600Result.length > 0 && countryW200Result.length > 0) {
    var wresponse = '雨量達200mm時(即豪雨)，可能淹水'
    wresponse += countryW200Result[0].feature.properties.NOTE.replace('(', '').replace(')', '')
    wresponse += '<br>雨量達600mm時，可能淹水'
    wresponse += countryW600Result[0].feature.properties.NOTE.replace('(', '').replace(')', '')
  } else if (countryW600Result.length === 0 && countryW200Result.length > 0) {
    var wresponse = '雨量達200mm時(即豪雨)，可能淹水'
    wresponse += countryW200Result[0].feature.properties.NOTE.replace('(', '').replace(')', '')
  } else {
    var wresponse = "無潛勢"
  }

  if (isLoadSensitiveData)
    info.update({
      name: name,
      l: lresponse,
      s: sresponse,
      w: wresponse
    })
  else
    info.update({
      name: name,
      l: lresponse,
      w: wresponse
    })
}).addTo(map)

var info = L.control()

info.onAdd = function(map) {
  this._div = L.DomUtil.create('table', 'ui table')
  this.update()
  return this._div
}

info.update = function(props) {
  console.log(props)
  if (props) {
    if (isLoadSensitiveData)
      this._div.innerHTML = '<tbody>' +
      '<thead><tr><th colspan="2">' + props.name + '</th></tr></thead>' +
      '<tr><td>地質敏感區</td><td>' + props.s + '</td></tr>' +
      '<tr><td>土壤液化潛勢</td><td>' + props.l + '</td></tr>' +
      '<tr><td>淹水潛勢</td><td>' + props.w + '</td></tr>' +
      '</tbody>'
    else
      this._div.innerHTML = '<tbody>' +
      '<thead><tr><th colspan="2">' + props.name + '</th></tr></thead>' +
      '<tr><td>土壤液化潛勢</td><td>' + props.l + '</td></tr>' +
      '<tr><td>淹水潛勢</td><td>' + props.w + '</td></tr>' +
      '</tbody>'
  }
}
info.addTo(map);

$('#s-loadin').on('click', function() {
  if (isLoadSensitiveData){
    return
  }
  $('#s-loadin').addClass('loading')
  $.getJSON('./src/data/disaster-sensitive.json', function(json) {
    sensitiveArea = json
    sLayer = L.geoJSON(sensitiveArea, { style: sStyle }).addTo(map)
    $('#s-loadin').removeClass('loading')

    var info = '<span><span class="info-block" style="background-color:' + sStyle.color + '"></span><strong>地質敏感區</strong></span>'
    info += '<span><span class="info-block bg-liquefaction"></span><strong>土壤液化潛勢區</strong></span>'
    info += '<span><span class="info-block bg-water"></span><strong>淹水潛勢區</strong></span>'

    $('#map-info').html(info)
  })

  isLoadSensitiveData = true
})
