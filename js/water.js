

function reservoir() {
  let reservoirCsv = null
  let reservoirMap
  let reservoirMapClick = false
  let reservoirInfo = L.control({ position: 'topleft' })
  let reservoirlegend = L.control({ position: 'bottomleft' })

  $.ajax({
    type: 'GET',
    url: './src/data/水庫水質.csv',
    dataType: 'text',
    success: function (data) { reservoirCsv = $.csv.toObjects(data) }
  });

  $(document).ready(function () {
    initReservoirMap()
    reservoirInfo.onAdd = function (map) {
      this._div = L.DomUtil.create('div', 'info')
      this.update()
      return this._div
    }

    reservoirInfo.update = function (props) {
      this._div.innerHTML = '<h4>水庫名稱</h4>' + (props ? '<b>' + '\t' + props.name + '\t' + '</b><br/>' : '請選擇')
    }
    reservoirInfo.addTo(reservoirMap)

    reservoirlegend.onAdd = function (map) {

      let div = L.DomUtil.create('div', 'info legend')
      const grades = [0, 40, 50]

      // loop through our density intervals and generate a label with a colored square for each interval
      for (let i = 0; i < grades.length; i++) {
        div.innerHTML +=
          '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
          grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '')
      }

      return div
    }

    reservoirlegend.addTo(reservoirMap)
    // initSiteMap();
  })

  function getColor(d) {
    return d > 50 ? '#2BF888' :
      d > 40 ? '#2BAD88' :
      (d !== d) === false ? '#288' :
      '#333'
  }

  function initReservoirMap() {
    reservoirMap = new L.Map('reservoirMap', { center: new L.LatLng(23.25, 120.3), zoom: 10.2, zoomControl: false })
    reservoirMap.touchZoom.disable()
    reservoirMap.doubleClickZoom.disable()
    reservoirMap.scrollWheelZoom.disable()
    reservoirMap.boxZoom.disable()
    reservoirMap.keyboard.disable()
    reservoirMap.dragging.disable()
    const url = 'https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoicmFwaXJlbnQiLCJhIjoiY2oybXBsc2ZvMDE2YjMycGg4NzNkYXI0OSJ9.xC8TBirQ2os2eQ65hwTCMA'
    const attrib = '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    let osm = new L.TileLayer(url, { minZoom: 1, maxZoom: 20, attribution: attrib })
    osm.addTo(reservoirMap)
    // reservoirMap.addLayer(layer);
    $.getJSON('./src/data/jishuei.geojson', function (data) {
      let geojson = L.geoJSON(data, {
        style: ReservoirStyle,
        onEachFeature: function(feature, layer) {
          layer.on('mouseover', function(e) {
            highlightTitle(e)
          })
          layer.on('mouseout', function(e) {
            geojson.resetStyle(e.target)
          })
          layer.on('click', function(e) {
            changeIntro(e, reservoirMapClick)
            reservoirMapClick = !reservoirMapClick
          })
        },
      }).addTo(reservoirMap)
    })

    function ReservoirStyle(feature) {
      return {
        fillColor: getReservoirColor(feature.properties.name),
        weight: 1,
        opacity: 1,
        color: '#333',
        dashArray: '3',
        fillOpacity: 0.7
      }
    }
  }


  function getReservoirColor(name) {
    let sum = 0.0
    let count = 0
    for (let foo in reservoirCsv) {
      if (reservoirCsv[foo].Site == name) {
        sum += parseFloat(reservoirCsv[foo].CTSI)
        count++
      }
    }
    return getColor(sum / count);
  }

  function changeIntro(e, clicked) {
    var layer = e.target
    if (clicked === false) {
      var task = new Promise(function() {
        reservoirMap.fitBounds(e.target.getBounds())
      })

      // task.then(function() {
      // $('#reservoirMap').css({'width': '65%'});
      // })0
    } else {
      // $('#reservoirMap').css({'width': '100%'});
      reservoirMap.setView(new L.LatLng(23.25, 120.3), 10.2)
    }
  }

  function highlightTitle(e) {
    var layer = e.target
    layer.setStyle({
      fillColor: '#2B59FF',
      weight: 2,
      color: '#000',
      fillOpacity: 0.7,
      zoom: 20,
    })
    reservoirInfo.update(layer.feature.properties)
  }



}

function site() {

  let geoData
  let geoJson
  let siteMap
  let siteInfo = L.control()

  $.getJSON('./src/data/tainan-town.geojson', function(data) {
    geoData = data
    geoJson = L.geoJson(geoData, {
      style: style,
      onEachFeature: onEachFeature
    });
    geoJson.addTo(siteMap)

    console.log(geoJson)
    // siteInfo.update();
  })
  $(document).ready(function () {
    initSiteMap()
  })

  function onEachFeature(feature, layer) {
    layer.on({
      mouseover: highlightFeature,
      mouseout: resetHighlight,
      // click: zoomToFeature
    });
  }

  function highlightFeature(e) {
    let layer = e.target

    layer.setStyle({
      weight: 5,
      color: '#666',
      fillOpacity: 0.7,
    });

    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
      layer.bringToFront()
    }
    // info.update(layer.feature.properties);
  }

  function resetHighlight(e) {
    geoJson.resetStyle(e.target)
    // info.update();
  }

  function initSiteMap() {
    siteMap = new L.Map('siteMap', { center: new L.LatLng(23.13, 120.3), zoom: 10.2, zoomControl: false })
    siteMap.touchZoom.disable()
    siteMap.doubleClickZoom.disable()
    siteMap.scrollWheelZoom.disable()
    siteMap.boxZoom.disable()
    siteMap.keyboard.disable()
    siteMap.dragging.disable()
    // var accessToken = 'pk.eyJ1IjoiY2hpbmc1NiIsImEiOiJjaXNiZmYydGMwMTN1MnpwbnNqNWVqM2plIn0.k7h-PUGX7Tl5xLwDH3Qpsg';

    // var accessToken =  'pk.eyJ1IjoiY2hpbmc1NiIsImEiOiJjaXNiZmYydGMwMTN1MnpwbnNqNWVqM2plIn0.k7h-PUGX7Tl5xLwDH3Qpsg';
    var url = 'https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoicmFwaXJlbnQiLCJhIjoiY2oybXBsc2ZvMDE2YjMycGg4NzNkYXI0OSJ9.xC8TBirQ2os2eQ65hwTCMA'
    var attrib = '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    var osm = new L.TileLayer(url, { minZoom: 1, maxZoom: 20, attribution: attrib })
    osm.addTo(siteMap)
    $.ajax({
      type: 'GET',
      url: './src/data/淨水廠.csv',
      dataType: "text",
      success: function (data) {
        var suppleArea = $.csv.toObjects(data)
        for (var i in suppleArea) {
          let readMarker = L.ExtraMarkers.icon({
            icon: 'fa-tint',
            iconColor: 'white',
            markerColor: siteColor(suppleArea[i]),
            shape: 'circle',
            prefix: 'fa',
          })
          let marker = L.marker(L.latLng(
              suppleArea[i]['lat'], suppleArea[i]['lng']), { icon: readMarker, town: suppleArea[i]['轄區'].split("、") })
            .addTo(siteMap)
          marker.bindPopup('<strong>' + suppleArea[i]['淨水場名稱'] + '</strong><br>主要供水轄區:<strong>' + suppleArea[i][' 主要供水轄區'] + '</strong><br>總溶解固體量(Total Dissolved Solids):<strong>' + suppleArea[i]['總溶解固體量(Total Dissolved Solids)'] + '</strong><br>pH值(pH ):<strong>' + suppleArea[i]['pH值(pH )'] + '</strong><br>總硬度(Total Hardness):<strong>' + suppleArea[i]['總硬度(Total Hardness)'] + '</strong><br>鐵(Iron):<strong>' + suppleArea[i]['鐵(Iron)'] + '</strong><br>水質合格否(Y/N):<strong>' + suppleArea[i]['水質合格否(Y/N)'] + '</strong>')
          marker.on('popupclose', function () {
            siteMap.setView(new L.LatLng(23.13, 120.3), 10.2)
          })
          marker.on('mouseover', function () {
            const town = this.options.town
            for (var foo in town) {
              for (var bar in geoJson._layers) {
                if (geoJson._layers[bar].feature.properties.TOWNNAME === town[foo]) {
                  let layer = geoJson._layers[bar]
                  layer.setStyle({
                    weight: 5,
                    color: 'blue',
                    fillColor: 'blue',
                    fillOpacity: 0.7,
                  })
                }
              }
            }
          })
          marker.on('mouseout', function () {
            const town = this.options.town
            for (var foo in town) {
              for (var bar in geoJson._layers) {
                if (geoJson._layers[bar].feature.properties.TOWNNAME === town[foo]) {
                  geoJson.resetStyle(geoJson._layers[bar])
                }
              }
            }
          })
        }
      }
    });
  }

  function siteColor(siteData) {
    console.log(siteData['水質合格否(Y/N)'])
    if (siteData['水質合格否(Y/N)'].toString() === 'Y') {
      return 'blue'
    } else if (siteData['水質合格否(Y/N)'].toString() === 'N') {
      return 'red'
    } else {
      return '#666'
    }
  }

  function style(feature) {
    return {
      fillColor: '#333',
      weight: 2,
      opacity: 1,
      color: '#eee',
      dashArray: '3',
      fillOpacity: 0.4,
    }
  }
}


function river() {

  let RiverMap
  let siteInfo
  let riverData
  let geojson // basin layer

  let basinRPI = {}
  let geoData = null
  let showLinks = false
  let RiverInfo = L.control()

  // var GeojsonMinifier = require('geojson-minifier');
  // var minifier = new GeojsonMinifier({ precision: 3 });


  window.getLocation = getLocation
  window.resetView = resetView
  window.toogleLinks = toogleLinks
  window.showRPIInfo = showRPIInfo
  window.hideRPIInfo = hideRPIInfo

  const geoJSONStyle = {
    "color": "#ff7800",
    "weight": 5,
    "opacity": 0.2,
  }

  $.getJSON('./src/data/river.geojson', function (data) {
    geoData = data
    geojson = L.geoJson(geoData, {
      style: style,
      onEachFeature: onEachFeature,
    })
    geojson.addTo(RiverMap)
    RiverInfo.update()
  })

  $(document).ready(function () {
    initMap()
    $.getJSON('./src/data/river.json', function (data) {
      riverData = data
      // console.log(data);
      addSiteToMap()
    })
  })

  function addSiteToMap() {
    $.getJSON('./src/data/siteInfo.json', function (data) {
      siteInfo = data

      for (var i in siteInfo) {
        if (siteInfo[i].SiteName in riverData) {
          riverData[siteInfo[i].SiteName]['RPI'] =
            parseFloat(riverData[siteInfo[i].SiteName]['RPI'])
          if (isNaN(riverData[siteInfo[i].SiteName]['RPI'])) {
            continue
          }

          const polluDegree = getPollutionDegree(riverData[siteInfo[i].SiteName]['RPI'])
          const icon = L.ExtraMarkers.icon({
            prefix: 'fa',
            icon: 'map-marker',
            markerColor: polluDegree.color,
          })

          let marker = L.marker([
              siteInfo[i].TWD97Lat, siteInfo[i].TWD97Lon
            ], { icon: icon, opacity: 0.9 })
            .addTo(RiverMap)

          /*marker.on('click', function(e) {
            map.setView(this.getLatLng(), 11);
          });*/

          marker.bindPopup('<strong>測站名稱：' + siteInfo[i].SiteName + '</strong><br/><span class="red">污染程度：' + polluDegree.disc + "</span><br/>所屬流域：" + siteInfo[i].Basin + '<br/>RPI指標：' + riverData[siteInfo[i].SiteName].RPI + '<br/>酸鹼值：' + riverData[siteInfo[i].SiteName].PH + '<br/>懸浮固體：' + riverData[siteInfo[i].SiteName].SS + '（mg/L）' + '<br/>溶氧量：' + riverData[siteInfo[i].SiteName].DO + '（mg/L）' + '<br/>生化需氧量：' + riverData[siteInfo[i].SiteName].COD + '（mg/L）' + '<br/>氨氮：' + riverData[siteInfo[i].SiteName].NH3N + '（mg/L）' + '<br/>地址：' + siteInfo[i].SiteAddress);

          if (siteInfo[i].Basin in basinRPI) {
            basinRPI[siteInfo[i].Basin].RPI += riverData[siteInfo[i].SiteName]['RPI']
            basinRPI[siteInfo[i].Basin].siteNumber += 1
          } else {
            basinRPI[siteInfo[i].Basin] = {}
            basinRPI[siteInfo[i].Basin].RPI = riverData[siteInfo[i].SiteName]['RPI']
            basinRPI[siteInfo[i].Basin].siteNumber = 1
          }
        }
      }
      for (var i in basinRPI) {
        basinRPI[i].RPI = parseFloat(basinRPI[i].RPI) / basinRPI[i].siteNumber
      }

      geojson = L.geoJson(geoData, {
        style: style,
        onEachFeature: onEachFeature
      })
      geojson.addTo(RiverMap)

    })

  }

  function getPollutionDegree(RPI) {
    if (RPI <= 2) {
      return { disc: '未(稍)受污染', color: 'blue' }
    } else if (RPI <= 3) {
      return { disc: '輕度污染', color: 'orange' }
    } else if (RPI <= 6) {
      return { disc: '中度污染', color: 'red' }
    } else {
      return { disc: '嚴重污染', color: 'darkpurple' }
    }
  }

  function initMap() {
    RiverMap = new L.Map('RiverMap', { center: new L.LatLng(23.25, 120.3), zoom: 10.2, zoomControl: false })
    RiverMap.touchZoom.disable()
    RiverMap.doubleClickZoom.disable()
    RiverMap.scrollWheelZoom.disable()
    RiverMap.boxZoom.disable()
    RiverMap.keyboard.disable()
    RiverMap.dragging.disable()
    const url = 'https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoicmFwaXJlbnQiLCJhIjoiY2oybXBsc2ZvMDE2YjMycGg4NzNkYXI0OSJ9.xC8TBirQ2os2eQ65hwTCMA'
    const attrib = '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    const osm = new L.TileLayer(url, { minZoom: 1, maxZoom: 16, attribution: attrib })

    // map.setView(new L.LatLng(23.7, 121), 8);
    osm.addTo(RiverMap)
    RiverInfo.addTo(RiverMap)
    legend.addTo(RiverMap)
  }

  function style(feature) {
    return {
      fillColor: getColor(feature.properties.name),
      weight: 2,
      opacity: 1,
      color: '#eee',
      dashArray: '3',
      fillOpacity: 0.4,
    }
  }

  function getColor(name) {
    let d = 0;
    if (name + '流域' in basinRPI) {
      d = basinRPI[name + '流域'].RPI
    } else {
      return 'transparent'
    }

    return d <= 2 ? '#39AADD' :
      d <= 3 ? '#E39941' :
      d <= 6 ? '#D24C39' :
      '#684064'
  }

  function highlightFeature(e) {
    let layer = e.target

    layer.setStyle({
      weight: 5,
      color: '#666',
      dashArray: '',
      fillOpacity: 0.7,
    })

    if (!L.Browser.ie && !L.Browser.opera) {
      layer.bringToFront()
    }
    RiverInfo.update(layer.feature.properties)
  }

  function resetHighlight(e) {
    geojson.resetStyle(e.target)
    //info.update();
  }

  function zoomToFeature(e) {
    RiverMap.fitBounds(e.target.getBounds())
    RiverInfo.update(e.target.feature.properties)
  }

  function onEachFeature(feature, layer) {
    layer.on({
      mouseover: highlightFeature,
      mouseout: resetHighlight,
      click: zoomToFeature,
    })
  }

  RiverInfo.onAdd = function(map) {
    this._div = L.DomUtil.create('div', 'info') // create a div with a class "info"
    this._div.innerHTML = '<h4>流域圖層載入中 <i class="fa fa-spinner"></i></h4>'
    return this._div
  };

  RiverInfo.update = function (props) {
    if (props && props.name + '流域' in basinRPI) {
      this._div.innerHTML = '<h4>河川流域名稱：' + (props ?
        props.name + '</h4>平均污染指數RPI<sup class="rpi-q"><a href="#" onclick="showRPIInfo()">[?]</a></sup>：' + basinRPI[props.name + '流域'].RPI.toFixed(1) : '</h4>請點選畫面區塊')
    } else {
      this._div.innerHTML = '<h4>河川流域名稱：' + (props ?
        props.name + '</h4>流域內無測站資料' : '</h4>請點選畫面區塊')
    }
  };

  var legend = L.control({ position: 'bottomright' })

  legend.onAdd = function (map) {

    const div = L.DomUtil.create('div', 'info legend')
    const color = ['#684064', '#D24C39', '#E39941', '#39AADD']
    const labels = ['嚴重污染（6+）', '中度污染（3-6）', '輕度污染（2-3）', '未（稍）受污染（0-2）']

    for (var i = 0; i < labels.length; i++) {
      div.innerHTML += '<i style="background:' + color[i] + '"></i>' + labels[i] + '<br/>'
    }

    return div
  }

  function getLocation() {
    if (navigator.geolocation) {
      return navigator.geolocation.getCurrentPosition(setPosition)
    } else {
      //x.innerHTML="Geolocation is not supported by this browser.";
    }
  }

  function setPosition(position) {
    map.setView(new L.LatLng(position.coords.latitude,
      position.coords.longitude), 12)
  }

  function resetView() {
    map.setView(new L.LatLng(23.7, 121), 8)
  }

  function toogleLinks() {
    if (showLinks) {
      $('.links').hide()
    } else {
      $('.links').show()
    }
    showLinks = !showLinks
  }

  function showRPIInfo() {
    $('.rpi-info').show()
  }

  function hideRPIInfo() {
    $('.rpi-info').hide()
  }
}


reservoir()
site()
river()