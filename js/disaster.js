((window) => {
  const map = L.map('well-living-map', { renderer: L.canvas() }).setView([23.1, 120.3], 11)
  let isLoadSensitiveData = false
  let sensitiveArea
  let liquefactionArea
  let waterArea
  let w600Layer
  let w200Layer
  let sLayer
  let lLayer
  let countryW600Layer
  let countryW200Layer

  const sStyle = {
    color: '#E91E63',
    fillOpacity: 0.8,
    weight: 0,
  }
  const lStyle = {
    color: '#8BC34A',
    fillOpacity: 0.8,
    weight: 0,
  }
  const wStyle = {
    color: '#3F51B5',
    fillOpacity: 0.8,
    weight: 0,
  }

  map.scrollWheelZoom.disable()
  L.tileLayer('http://{s}.tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png', {
    maxZoom: 18,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  }).addTo(map)

  let mapInfo = `<span><span class="info-block bg-liquefaction"></span><strong>土壤液化潛勢區</strong></span>
                 <span><span class="info-block bg-water"></span><strong>淹水潛勢區</strong></span>`
  $('#map-info').append(mapInfo)

  $.getJSON('./src/data/disaster-liquefaction.json', (json) => {
    liquefactionArea = json
    lLayer = L.geoJSON(liquefactionArea, {
      style: (feature) => {
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
            break
        }
        return lStyle
      },
    }).addTo(map)
  })

  $.getJSON('./src/data/disaster-water600.json', (json) => {
    waterArea = json
    w600Layer = L.geoJSON(waterArea, {
      style: (feature) => {
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
            break
        }
        return wStyle
      },
    }).addTo(map)
  })

  $.getJSON('./src/data/disaster-water200.json', (json) => {
    w200Layer = L.geoJSON(json)
  })
  $.getJSON('./src/data/disaster-country-water200.json', (json) => {
    countryW200Layer = L.geoJSON(json)
  })
  $.getJSON('./src/data/disaster-country-water600.json', (json) => {
    countryW600Layer = L.geoJSON(json, {
      style: (feature) => {
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
            break
        }
        return wStyle
      },
    }).addTo(map)
  })
  let info = L.control()
  info.onAdd = function() {
    this._div = L.DomUtil.create('table', 'ui table');
    this.update();
    return this._div;
  };
  
  info.update = function(props) {
    if (props) {
      if (isLoadSensitiveData) {
        this._div.innerHTML = `<tbody>
        <thead><tr><th colspan="2">${props.name}</th></tr></thead>
        <tr><td>地質敏感區</td><td>${props.s}</td></tr>
        <tr><td>土壤液化潛勢</td><td>${props.l}</td></tr>
        <tr><td>淹水潛勢</td><td>${props.w}</td></tr>
        </tbody>`
      } else {
        this._div.innerHTML = `<tbody>
        <thead><tr><th colspan="2">${props.name}</th></tr></thead>
        <tr><td>土壤液化潛勢</td><td>${props.l}</td></tr>
        <tr><td>淹水潛勢</td><td>${props.w}</td></tr>
        </tbody>`
      }
    }
  }
  info.addTo(map)

  /* api key shall be protext */
  L.Control.geocoder({
    collapsed: false,
    placeholder: '請輸入地址或地名查詢...',
    errorMessage: '查無此地址',
    geocoder: new L.Control.Geocoder.Google('AIzaSyARIN80OjEjl4O24neRkXZgAo7hTKqVhD4'),
  }).on('markgeocode', (e) => {
    const latlng = e.geocode.center
    const name = e.geocode.name
    const lResult = leafletPip.pointInLayer(latlng, lLayer, true)
    let sResult
    if (isLoadSensitiveData) {
      sResult = leafletPip.pointInLayer(latlng, sLayer, true)
    }
    const w600Result = leafletPip.pointInLayer(latlng, w600Layer, true)
    const w200Result = leafletPip.pointInLayer(latlng, w200Layer, true)
    const countryW600Result = leafletPip.pointInLayer(latlng, countryW600Layer, true)
    const countryW200Result = leafletPip.pointInLayer(latlng, countryW200Layer, true)
    const lresponse = lResult.length > 0 ? lResult[0].feature.properties['分級'] : '無潛勢'
    let sresponse
    let wresponse
    if (isLoadSensitiveData) {
      sresponse = sResult.length > 0 ? '是' : '否'
    }
    if (w600Result.length > 0 && w200Result.length === 0) {
      wresponse = '雨量達600mm時，可能淹水'
      wresponse += w600Result[0].feature.properties.NOTE.replace('(', '').replace(')', '')
    } else if (w600Result.length > 0 && w200Result.length > 0) {
      wresponse = '雨量達200mm時(即豪雨)，可能淹水'
      wresponse += w200Result[0].feature.properties.NOTE.replace('(', '').replace(')', '')
      wresponse += '<br>雨量達600mm時，可能淹水'
      wresponse += w600Result[0].feature.properties.NOTE.replace('(', '').replace(')', '')
    } else if (w600Result.length === 0 && w200Result.length > 0) {
      wresponse = '雨量達200mm時(即豪雨)，可能淹水'
      wresponse += w200Result[0].feature.properties.NOTE.replace('(', '').replace(')', '')
    } else if (countryW600Result.length > 0 && countryW200Result.length === 0) {
      wresponse = '雨量達600mm時，可能淹水'
      wresponse += countryW600Result[0].feature.properties.NOTE.replace('(', '').replace(')', '')
    } else if (countryW600Result.length > 0 && countryW200Result.length > 0) {
      wresponse = '雨量達200mm時(即豪雨)，可能淹水'
      wresponse += countryW200Result[0].feature.properties.NOTE.replace('(', '').replace(')', '')
      wresponse += '<br>雨量達600mm時，可能淹水'
      wresponse += countryW600Result[0].feature.properties.NOTE.replace('(', '').replace(')', '')
    } else if (countryW600Result.length === 0 && countryW200Result.length > 0) {
      wresponse = '雨量達200mm時(即豪雨)，可能淹水'
      wresponse += countryW200Result[0].feature.properties.NOTE.replace('(', '').replace(')', '')
    } else {
      wresponse = '無潛勢'
    }

    if (isLoadSensitiveData) {
      info.update({
        name,
        l: lresponse,
        s: sresponse,
        w: wresponse
      })
    } else {
      info.update({
        name,
        l: lresponse,
        w: wresponse,
      })
    }
  }).addTo(map)

  $('#s-loadin').on('click', () => {
    if (isLoadSensitiveData) {
      return
    }
    $('#s-loadin').addClass('loading')
    $.getJSON('./src/data/disaster-sensitive.json', (json) => {
      sensitiveArea = json
      sLayer = L.geoJSON(sensitiveArea, { style: sStyle }).addTo(map)
      $('#s-loadin').removeClass('loading')
      $('#s-loadin').removeClass('basic')
      $('#s-loadin').addClass('disabled')
      $('#s-loadin').text('已載入地質敏感資料')

      mapInfo = `<span><span class="info-block" style="background-color: ${sStyle.color} "></span><strong>地質敏感區</strong></span>
      <span><span class="info-block bg-liquefaction"></span><strong>土壤液化潛勢區</strong></span>
      <span><span class="info-block bg-water"></span><strong>淹水潛勢區</strong></span>`

      $('#map-info').html(mapInfo)
    })

    isLoadSensitiveData = true
  })
})(window)
