let margin = {top: 10, right: 0, bottom: 140, left: 0}
let height = 450,
    padding = 30,
    barMargin = 5,
    axisPadding = 80
    // legendPadding = 120
let width = 800 + axisPadding
function site() {

  let geoData
  let geoJson
  let siteMap
  const siteInfo = L.control()
  const focusButton = L.control().setPosition('topleft')
  const resetButton = L.control().setPosition('topleft')
  let markerArray = []

  $.getJSON('./src/data/tainan-town.geojson', function(data) {
    geoData = data
    geoJson = L.geoJson(geoData, {
      style: style,
      onEachFeature: onEachFeature
    })
    geoJson.addTo(siteMap)
    siteInfo.update()
  })
  $(document).ready(function () {
    initSiteMap()
  })

  function onEachFeature(feature, layer) {
    layer.on({
      mouseover: highlightFeature,
      mouseout: resetHighlight,
      // click: zoomToFeature
    })
  }

  function highlightFeature(e) {
    let layer = e.target

    for(var foo in markerArray) {
      for(var boo in markerArray[foo].options.town)
      if(layer.feature.properties.TOWNNAME===markerArray[foo].options.town[boo]) {
        const town = markerArray[foo]
        town.setOpacity(1)
        for (var foobar in town.options.town) {
          for (var foobar2 in geoJson._layers) {
            if (geoJson._layers[foobar2].feature.properties.TOWNNAME === town.options.town[foobar]) {
              geoJson._layers[foobar2].setStyle({
                weight: 2,
                color: '#758de5',
                fillColor: '#758de5',
                fillOpacity: 0.7,
              })
            }
          }
        }
      }
    }


    layer.setStyle({
      weight: 2,
      color: '#666',
      fillOpacity: 0.7,
    })

    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
      layer.bringToFront()
    }
    siteInfo.update(layer.feature.properties)
  }

  function resetHighlight(e) {
    geoJson.resetStyle(e.target)
    for (var bar in geoJson._layers) {
        geoJson.resetStyle(geoJson._layers[bar])
    }
    for(var foo in markerArray) {
      markerArray[foo].setOpacity(0.5)
    }
  }

  function initSiteMap() {
    siteMap = new L.Map('siteMap', { center: new L.LatLng(23.13, 120.3), zoom: 10.2})//, zoomControl: false })
    siteMap.touchZoom.disable()
    siteMap.doubleClickZoom.disable()
    siteMap.scrollWheelZoom.disable()
    siteMap.boxZoom.disable()
    siteMap.keyboard.disable()
    // siteMap.dragging.disable()

    const url = 'https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoicmFwaXJlbnQiLCJhIjoiY2oybXBsc2ZvMDE2YjMycGg4NzNkYXI0OSJ9.xC8TBirQ2os2eQ65hwTCMA'
    const attrib = '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    const osm = new L.TileLayer(url, { minZoom: 1, maxZoom: 20, attribution: attrib })
    osm.addTo(siteMap)
    siteInfo.addTo(siteMap)
    focusButton.addTo(siteMap)
    resetButton.addTo(siteMap)
    $.ajax({
      type: 'GET',
      url: './src/data/淨水廠.csv',
      dataType: 'text',
      success: function (data) {
        const suppleArea = $.csv.toObjects(data)
        for (var i in suppleArea) {
          const readMarker = L.ExtraMarkers.icon({
            icon: 'fa-tint',
            iconColor: 'white',
            markerColor: siteColor(suppleArea[i]),
            shape: 'circle',
            prefix: 'fa',
          })
          const marker = L.marker(L.latLng(
              suppleArea[i]['lat'], suppleArea[i]['lng']),
            {
              icon: readMarker,
              town: suppleArea[i]['轄區'].split('、'),
              name: suppleArea[i]['淨水場名稱'],
              opacity: 0.5,
            })
            .addTo(siteMap)
          marker.bindPopup('<strong>' +
                    suppleArea[i]['淨水場名稱'] +
                    '</strong><br>主要供水轄區:<strong>' +
                    suppleArea[i][' 主要供水轄區'] +
                    '</strong><br>總溶解固體量(Total Dissolved Solids):<strong>' +
                    suppleArea[i]['總溶解固體量(Total Dissolved Solids)'] +
                    '</strong><br>pH值(pH ):<strong>' +
                    suppleArea[i]['pH值(pH )'] +
                    '</strong><br>總硬度(Total Hardness):<strong>' +
                    suppleArea[i]['總硬度(Total Hardness)'] +
                    '</strong><br>鐵(Iron):<strong>' +
                    suppleArea[i]['鐵(Iron)'] +
                    '</strong><br>水質合格否(Y/N):<strong>' +
                    suppleArea[i]['水質合格否(Y/N)'] +
                    '</strong>')
          marker.on('popupopen', function() {
            this.setOpacity(1)
          })
          marker.on('popupclose', function() {
            siteMap.setView(new L.LatLng(23.13, 120.3), 10.2)
            // this.setOpacity(0.5)
          })
          marker.on('mouseover', function() {
            this.setOpacity(1)
            const town = this.options.town
            for (var foo in town) {
              for (var bar in geoJson._layers) {
                if (geoJson._layers[bar].feature.properties.TOWNNAME === town[foo]) {
                  let layer = geoJson._layers[bar]
                  layer.setStyle({
                    weight: 2,
                    color: '#758de5',
                    fillColor: '#758de5',
                    fillOpacity: 0.7,
                  })
                }
              }
            }
          })
          marker.on('mouseout', function () {
            this.setOpacity(0.5)
            const town = this.options.town
            for (var foo in town) {
              for (var bar in geoJson._layers) {
                if (geoJson._layers[bar].feature.properties.TOWNNAME === town[foo]) {
                  geoJson.resetStyle(geoJson._layers[bar])
                }
              }
            }
          })
          markerArray.push(marker)
        }
      }
    })
  }

  function siteColor(siteData) {
    // console.log(siteData['水質合格否(Y/N)'])
    if (siteData['水質合格否(Y/N)'].toString() === 'Y') {
      return 'blue'
    } else if (siteData['水質合格否(Y/N)'].toString() === 'N') {
      return 'red'
    } else {
      return 'black'
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
  siteInfo.onAdd = function(map) {
    this._div = L.DomUtil.create('div', 'siteInfo') // create a div with a class "info"
    this._div.innerHTML = '<h4>圖層載入中</h4>'
    return this._div
  }

  siteInfo.update = function (props) {
    if(props) {
      for(var foo in markerArray) {
        for(var boo in markerArray[foo].options.town){
          if(markerArray[foo].options.town[boo]===props['TOWNNAME']) {
            // console.log(markerArray[foo].options)
            this._div.innerHTML = '<h4><strong>' + props['TOWNNAME']
                        + '</strong></h4><h4>所屬淨水廠名稱:</h4>'  + markerArray[foo].options.name;
          }
        }
      }
    } else {
      this._div.innerHTML = '<h4>請點選畫面區塊</h4>'
    }
  }

  focusButton.onAdd = function() {
    const container = L.DomUtil.create('button', 'ui compact icon button')
    const icon = L.DomUtil.create('i', 'map outline icon', container)
    $(icon).on('click', function() {
      siteMap.setView([23.13, 120.3], 10.2)
    })
    $(icon).attr('title', '回到台南')
    return container
  }
  resetButton.onAdd = function() {
    const container = L.DomUtil.create('button', 'ui compact icon button')
    const icon = L.DomUtil.create('i', 'compass icon', container)
    $(icon).on('click', function() {
      if (navigator.geolocation) {
        return navigator.geolocation.getCurrentPosition(function (position){
          siteMap.setView(new L.LatLng(position.coords.latitude,
                              position.coords.longitude), 12)
        })
      }
    })
    $(icon).attr('title', '取得您的位置')
    return container
  }
}

function river() {

  let RiverMap
  let siteInfo
  let riverData
  let geojson // basin layer

  const basinRPI = {}
  let geoData = null
  const RiverInfo = L.control()
  const resetLocate = L.control().setPosition('topleft')
  const setLocate = L.control().setPosition('topleft')
  const legend = L.control({ position: 'bottomleft' })

  $.getJSON('./src/data/tainanCounty2010merge.json', function(data) {
    data = L.geoJson(data, {
      style: {
        fillColor: '#333',
        weight: 2,
        opacity: 1,
        color: '#eee',
        dashArray: '3',
        fillOpacity: 0.4,
      },
    })
    data.addTo(RiverMap)
  })

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
            icon: 'fa-map-marker',
            iconColor: 'white',
            markerColor: polluDegree.color,
            shipe: 'circle',
          })

          let marker = L.marker([
              siteInfo[i].TWD97Lat, siteInfo[i].TWD97Lon
            ], { icon: icon, opacity: 0.9 })
            .addTo(RiverMap)

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
    RiverMap = new L.Map('RiverMap', { center: new L.LatLng(23.13, 120.3), zoom: 10.2})//, zoomControl: false })
    // RiverMap.touchZoom.disable()
    RiverMap.doubleClickZoom.disable()
    RiverMap.scrollWheelZoom.disable()
    // RiverMap.boxZoom.disable()
    // RiverMap.keyboard.disable()
    // RiverMap.dragging.disable()
    const url = 'https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoicmFwaXJlbnQiLCJhIjoiY2oybXBsc2ZvMDE2YjMycGg4NzNkYXI0OSJ9.xC8TBirQ2os2eQ65hwTCMA'
    const attrib = '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    const osm = new L.TileLayer(url, { minZoom: 1, maxZoom: 16, attribution: attrib })

    // map.setView(new L.LatLng(23.7, 121), 8);
    osm.addTo(RiverMap)
    RiverInfo.addTo(RiverMap)
    legend.addTo(RiverMap)
    resetLocate.addTo(RiverMap)
    setLocate.addTo(RiverMap)
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
      fillOpacity: 0.5,
    })

    if (!L.Browser.ie && !L.Browser.opera) {
      layer.bringToFront()
    }
    RiverInfo.update(layer.feature.properties)
  }

  function resetHighlight(e) {
    geojson.resetStyle(e.target)
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
    this._div = L.DomUtil.create('div', 'riverInfo') // create a div with a class "info"
    this._div.innerHTML = '<h4>流域圖層載入中 </h4>'
    return this._div
  }

  RiverInfo.update = function(props) {
    if (props && props.name + '流域' in basinRPI) {
      this._div.innerHTML = '<h4>河川流域名稱：' + (props ?
        props.name + '</h4>平均污染指數RPI：' + basinRPI[props.name + '流域'].RPI.toFixed(1) : '</h4>請點選畫面區塊')
    } else {
      this._div.innerHTML = '<h4>河川流域名稱：' + (props ?
        props.name + '</h4>流域內無測站資料' : '</h4>請點選畫面區塊')
    }
  }
  legend.onAdd = function (map) {

    const div = L.DomUtil.create('div', 'riverInfo legend')
    const color = ['#684064', '#D24C39', '#E39941', '#39AADD']
    const labels = ['嚴重污染（6+）', '中度污染（3-6）', '輕度污染（2-3）', '未（稍）受污染（0-2）']

    for (var i = 0; i < labels.length; i++) {
      div.innerHTML += '<i style="background:' + color[i] + '"></i>' + labels[i] + '<br/>'
    }

    return div
  }

  // function getLocation() {
  //   if (navigator.geolocation) {
  //     return navigator.geolocation.getCurrentPosition(setPosition)
  //   } else {
  //     //x.innerHTML="Geolocation is not supported by this browser.";
  //   }
  // }

  function setPosition(position) {
    map.setView(new L.LatLng(position.coords.latitude,
      position.coords.longitude), 12)
  }

  resetLocate.onAdd = function() {
    const container = L.DomUtil.create('button', 'ui compact icon button')
    const icon = L.DomUtil.create('i', 'map outline icon', container)
    $(icon).on('click', function() {
      RiverMap.setView([23.13, 120.3], 10.2)
    })
    $(icon).attr('title', '縮放至整個台南市')
    return container
  }
  setLocate.onAdd = function() {
    const container = L.DomUtil.create('button', 'ui compact icon button')
    const icon = L.DomUtil.create('i', 'compass icon', container)
    $(icon).on('click', function() {
      if (navigator.geolocation) {
        return navigator.geolocation.getCurrentPosition(function (position){
          RiverMap.setView(new L.LatLng(position.coords.latitude,
                              position.coords.longitude), 12)
        })
      }
    })
    $(icon).attr('title', '取得您的位置')
    return container
  }
}

function rain() {
  $(document).ready(function () {
    d3.select('#column').append('initChart')
          .append('svg')
          .attr('width', width)
          .attr('height', height)
          .attr('class', 'initChart')
    initMap()
  })
  function initMap() {
    d3.csv('./src/data/酸雨監測值.csv', function(error, data){
      if(error) {
        console.log(error)
      }
      const dateArrayDump = function(d) {
        let tmp = []
        for(var foo in d) {
          tmp.push(d[foo]['監測日期'])
        }
        return tmp
      }
      const dateArray = dateArrayDump(data)
      const yMax = d3.max(data, function(d) {return parseFloat(d['酸雨pH值']) })
      const yMin = d3.min(data, function(d) {return parseFloat(d['酸雨pH值']) })
      const xScale = d3.scale.linear()
                    .domain([0, data.length])
                    .range([padding + axisPadding,
                      width - margin.left - margin.right - padding])
      const yScale2 = d3.scale.linear()
                      .domain([yMin, yMax])
                      .range([height - margin.top - margin.bottom - padding, padding])
      const svg = d3.select('.initChart')
      let xAxis

      if($(window).width() < 900) {
        xAxis = d3.svg.axis()
            .scale(xScale)
            .tickFormat('')
            .tickSize(1)
            .orient('bottom')
      }else {
        xAxis = d3.svg.axis()
                    .scale(xScale)
                    .tickFormat(function(d, i){
                      return dateArray[i]
                    })
                    .tickSize(1)
                    .ticks(data.length)
                    .orient('bottom')
      }
      let yAxis = d3.svg.axis()
                    .scale(yScale2)
                    .tickSize(1)
                    .orient('left')
      svg.append('g')
          .attr({
              'class': 'yAxis',
              'transform': 'translate(' + axisPadding + ',0)',
          })
          .call(yAxis)
          .append('text')
          .attr({
              'text-anchor': 'start',
          })

      svg.append('g')
        .attr({
          'class': 'xAxis',
          'transform': 'translate(0,'
          + (height - margin.top - margin.bottom) + ')',
        })
        .call(xAxis)
        .selectAll('text')
        .style('text-anchor', 'start')
        .attr({
          'transform': 'rotate(45)',
        })
      if($(window).width() >= 900) {
      svg.append('text')
          .attr({
              'class': 'yLabel',
              'text-anchor': 'end',
              'x': axisPadding,
              'y': height - margin.top - margin.bottom - padding,
              'dy': '2em',
              'opacity': 0.5,
          })
          .text('(pH值)')
      }
      const line = d3.svg.line()
                  .x(1)
                  .y(1)
                  .interpolate('linear')
      const line2 = d3.svg.line()
                  .x( function(d, i) {
                    return xScale(i)
                  })
                  .y( function(d) {
                    return yScale2(d['酸雨pH值'])
                  })
                  .interpolate('linear')

      svg.append('path')
        .attr({
          'id': 'line',
          'd': line(data),
          'y': 0,
          'stroke': '#666',
          'stroke-width': '0.5px',
          'fill': 'none',
        })
        .transition()
        .duration(1000)
        .attr('d', line2(data))
      const info = d3.select('body').append('div')
                  .attr('class', 'info')
                  .style('opacity', 0)
      let lastClicked;
      svg.selectAll('.point')
          .data(data)
          .enter()
          .append('circle')
          .attr({
            'cx': function(d, i) {
              return xScale(i)
            },
            'cy': function(d) {
              return yScale2(d['酸雨pH值'])
            },
            'r': function(d) {
              const tmp = Math.sqrt(d['雨量累計 (mm)']*10)
              // console.log(tmp)
              if(tmp < 9) {
                return 9
              }else {
                return tmp
              }
            },
            'fill': function(d) {
              if(d['酸雨pH值'] >= 5.6) {
                return '#758de5'
              }else if (d['酸雨pH值'] >= 5) {
                return '#ff7800'
              }else {
                return '#ea5a5a'
              }
            },
            'opacity': 0.5,
            'id': function(d) {
              return d['序號']
            },
            'date': function(d) {
              return d['監測日期']
            },
            'elect': function(d) {
              return d['雨水導電度 (μS/cm)']
            },
            'total': function(d) {
              return d['雨量累計 (mm)']
            },
            'site': function(d) {
              return d['測站']
            },
          })
          .on('mouseover', function() {
              d3.select(this).attr({
                  'opacity': 0.9,
                  'stroke': 'rgba(0, 0, 0, 0.12)',
                  'stroke-width': 2,
                  'cursor': 'pointer',
              })
          })
          .on('mouseout', function() {
              d3.select(this).attr({
                'opacity': 0.5,
                'stroke': 'rgba(0, 0, 0, 0.12)',
                'stroke-width': 0,
            })
          })
          .on('click', function() {
            if (d3.select(this).attr('id') !== lastClicked) {
              info.html(
                '<div id="info"> 監測日期: <strong>' +
                d3.select(this).attr('date') +
                '</strong><br>雨水導電度 (μS/cm): <strong>' +
                d3.select(this).attr('elect') +
                '</strong><br>雨量累計 (mm): <strong>' +
                d3.select(this).attr('total') +
                '</strong><br>測站: <strong>' +
                d3.select(this).attr('site') + '</div>')
              .style({
                'left': (d3.event.pageX) + 'px',
                'top': (d3.event.pageY) + 'px',
                'opacity': 1.0,
                'z-index': 999,
              })
              lastClicked = d3.select(this).attr('id')
            } else {
              lastClicked = 0
              info.style({
                'opacity': 0,
                'z-index': -1,
              })
            }
          })
    })
  }
}
function groundwater() {
  const constrain = {
    '砷 Arsenic (mg/L)': 0.25,
    '鎘 Cadmium (mg/L)': 0.025,
    '鉻 Chromium (mg/L)': 0.25,
    '銅 Copper (mg/L)': 0.25,
    '鉛 Lead (mg/L)': 0.05,
    '汞 Mercury (mg/L)': 0.01,
    '鋅 Zinc (mg/L)': 25,
    '鐵 Iron (mg/L)': 1.5,
    '錳 Manganese (mg/L)': 0.25,
    '總硬度 Total Hardness (mg/L as CaCO3)': 750,
    '總溶解固體物 Total Dissolved Solid (mg/L)': 1250,
    '氯鹽 Chloride (mg/L)': 625,
    '氨氮 NH3-N (mg/L)': 0.25,
    '硝酸鹽氮 Nitrate-Nitrogen (mg/L)': 50,
    '硫酸鹽 Sulfate (mg/L)': 625,
    '總有機碳 Total Organic Carbon (mg/L)': 10,
    // '總酚': 0.14,
  }
  const focusButton = L.control().setPosition('topleft')
  const setButton = L.control().setPosition('topleft')
  let waterMap
  let geoJson // basin layer
  let geoData = null

  $(document).ready(function() {
    $.getJSON('./src/data/tainan-town.geojson', function(data) {
      geoData = data
      geoJson = L.geoJson(geoData, {
        style:  {
          fillColor: '#333',
          weight: 2,
          opacity: 1,
          color: '#eee',
          dashArray: '3',
          fillOpacity: 0.2,
        },
      })

      geoJson.addTo(waterMap)
      focusButton.addTo(waterMap)
      setButton.addTo(waterMap)
    })
  })
  initMap()
  function siteColor(d) {
    for(var i in constrain) {
      if(d[i] > constrain[i]) {
        return 'red'
      }
    }
    return 'blue'
  }
  function getAttr(d) {
    let elementArray = {}
    let pollutioned = false
    for(var i in constrain) {
      if(d[i] > constrain[i]) {
        pollutioned = true
        elementArray[i + '  :'] = d[i]
      }
    }
    if(pollutioned===true) {
      return { disc: elementArray, color: 'red'}
    }else {
      return { disc: elementArray, color: 'blue'}
    }
  }

  function initMap() {
    waterMap = new L.Map('groundWater', { center: new L.LatLng(23.13, 120.3), zoom: 10.2})//, zoomControl: false })
    waterMap.doubleClickZoom.disable()
    waterMap.scrollWheelZoom.disable()
    const url = 'https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoicmFwaXJlbnQiLCJhIjoiY2oybXBsc2ZvMDE2YjMycGg4NzNkYXI0OSJ9.xC8TBirQ2os2eQ65hwTCMA'
    const attrib = '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    const osm = new L.TileLayer(url, { minZoom: 1, maxZoom: 16, attribution: attrib })

    osm.addTo(waterMap)
    d3.csv('./src/data/地下水水質監測與指標資料.csv', function(error, data){
      if(error) {
        console.log(error)
      }
      for(var foo in data) {
        const groundAttr = getAttr(data[foo])
        const readMarker = L.ExtraMarkers.icon({
          icon: 'fa-tint',
          iconColor: 'white',
          markerColor: groundAttr.color,
          shape: 'circle',
          prefix: 'fa',
        })
        const marker = L.marker(L.latLng(
          data[foo]['TWD97Lat'], data[foo]['TWD97Lon']), {
            icon: readMarker,
            // town: data[foo]['Township'],
            // name: data[foo]['測站'],
            opacity: 0.7,
          })
          .addTo(waterMap)
        let text = ''
        for(var i in groundAttr.disc) {
          text+= '</span><br>' + i + '<span class=\"red\">'
          text+= groundAttr.disc[i]
        }
        marker.on('popupopen', function() {
            this.setOpacity(1)
        })
        marker.on('popupclose', function() {
            this.setOpacity(0.7)
            // siteMap.setView(new L.LatLng(23.13, 120.3), 10.2)
            // this.setOpacity(0.5)
        })

        marker.bindPopup('測站:<strong>' +
                    data[foo]['測站'] +
                    '</strong><br>地址:<strong>' +
                    data[foo]['SiteAddress'] +
                    '</strong><br>最後採樣日期:<strong>' +
                    data[foo]['採樣日期'] + '</strong>' +
                    (text === '' ? '<hr>無超標項目' : '<hr>超標項目<span>') +
                    text)
      }
    })
  }
  focusButton.onAdd = function() {
    const container = L.DomUtil.create('button', 'ui compact icon button')
    const icon = L.DomUtil.create('i', 'map outline icon', container)
    $(icon).on('click', function() {
      waterMap.setView([23.13, 120.3], 10.2)
    })
    $(icon).attr('title', '回到台南')
    return container
  }
  setButton.onAdd = function() {
    const container = L.DomUtil.create('button', 'ui compact icon button')
    const icon = L.DomUtil.create('i', 'compass icon', container)
    $(icon).on('click', function() {
      if (navigator.geolocation) {
        return navigator.geolocation.getCurrentPosition(function (position){
          waterMap.setView(new L.LatLng(position.coords.latitude,
                              position.coords.longitude), 12)
        })
      }
    })
    $(icon).attr('title', '取得您的位置')
    return container
  }
}

$(window).ready(function() {
  site()
  river()
  rain()
  groundwater()
  if($(window).width() < 900) {
    d3.select('initChart').remove()
    $('#siteMap, #groundWater').css({
      'width': '100%',
      'transform':'translateX(0)',
    })
    axisPadding = 40
    width = ($(window).width() - 90) +  axisPadding// + legendPadding
    rain()
  }
  $(window).resize(function() {
    if($(window).width() < 900) {
      d3.select('initChart').remove()
      $('#siteMap, #groundWater').css({
        'width': '100%',
        'transform': 'translateX(0)',
      })
      axisPadding = 40
      width = ($(window).width() - 90) +  axisPadding// + legendPadding
      rain()
    }else {
      d3.select('initChart').remove()
      $('#siteMap, #groundWater').css({
        'width': '50%',
        'transform': 'translateX(50%)',
      })
      axisPadding = 80
      width = 800 +  axisPadding// + legendPadding
      rain()
    }
  })
})

