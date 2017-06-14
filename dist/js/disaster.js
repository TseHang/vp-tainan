'use strict';

(function (window) {
  var map = L.map('well-living-map', { renderer: L.canvas() }).setView([23.1, 120.3], 11);
  var isLoadSensitiveData = false;
  var sensitiveArea = void 0;
  var liquefactionArea = void 0;
  var waterArea = void 0;
  var w600Layer = void 0;
  var w200Layer = void 0;
  var sLayer = void 0;
  var lLayer = void 0;
  var countryW600Layer = void 0;
  var countryW200Layer = void 0;

  var sStyle = {
    color: '#E91E63',
    fillOpacity: 0.8,
    weight: 0
  };
  var lStyle = {
    color: '#8BC34A',
    fillOpacity: 0.8,
    weight: 0
  };
  var wStyle = {
    color: '#3F51B5',
    fillOpacity: 0.8,
    weight: 0
  };

  map.scrollWheelZoom.disable();
  L.tileLayer('http://{s}.tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png', {
    maxZoom: 18,
    minZoom: 10,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  }).addTo(map);

  var mapInfo = '<span><span class="info-block bg-liquefaction"></span><strong>\u571F\u58E4\u6DB2\u5316\u6F5B\u52E2\u5340</strong></span>\n                 <span><span class="info-block bg-water"></span><strong>\u6DF9\u6C34\u6F5B\u52E2\u5340</strong></span>';
  $('#map-info').append(mapInfo);

  $.getJSON('./src/data/disaster-liquefaction.json', function (json) {
    liquefactionArea = json;
    lLayer = L.geoJSON(liquefactionArea, {
      style: function style(feature) {
        switch (feature.properties['分級']) {
          case '低潛勢':
            lStyle.fillOpacity = 0.5;
            break;
          case '中潛勢':
            lStyle.fillOpacity = 0.7;
            break;
          case '高潛勢':
            lStyle.fillOpacity = 0.9;
            break;
          default:
            break;
        }
        return lStyle;
      }
    }).addTo(map);
  });

  $.getJSON('./src/data/disaster-water600.json', function (json) {
    waterArea = json;
    w600Layer = L.geoJSON(waterArea, {
      style: function style(feature) {
        switch (feature.properties.CLASS) {
          case 1:
            wStyle.fillOpacity = 0.5;
            break;
          case 2:
            wStyle.fillOpacity = 0.7;
            break;
          case 3:
            wStyle.fillOpacity = 0.9;
            break;
          default:
            break;
        }
        return wStyle;
      }
    }).addTo(map);
  });

  $.getJSON('./src/data/disaster-water200.json', function (json) {
    w200Layer = L.geoJSON(json);
  });
  $.getJSON('./src/data/disaster-country-water200.json', function (json) {
    countryW200Layer = L.geoJSON(json);
  });
  $.getJSON('./src/data/disaster-country-water600.json', function (json) {
    countryW600Layer = L.geoJSON(json, {
      style: function style(feature) {
        switch (feature.properties.CLASS) {
          case 1:
            wStyle.fillOpacity = 0.5;
            break;
          case 2:
            wStyle.fillOpacity = 0.7;
            break;
          case 3:
            wStyle.fillOpacity = 0.9;
            break;
          default:
            break;
        }
        return wStyle;
      }
    }).addTo(map);
  });

  /* api key shall be protext */
  L.Control.geocoder({
    collapsed: false,
    placeholder: '請輸入地址或地名查詢...',
    errorMessage: '查無此地址',
    geocoder: new L.Control.Geocoder.Google('AIzaSyARIN80OjEjl4O24neRkXZgAo7hTKqVhD4')
  }).on('markgeocode', function (e) {
    var latlng = e.geocode.center;
    var name = e.geocode.name;
    var lResult = leafletPip.pointInLayer(latlng, lLayer, true);
    var sResult = void 0;
    if (isLoadSensitiveData) {
      sResult = leafletPip.pointInLayer(latlng, sLayer, true);
    }
    var w600Result = leafletPip.pointInLayer(latlng, w600Layer, true);
    var w200Result = leafletPip.pointInLayer(latlng, w200Layer, true);
    var countryW600Result = leafletPip.pointInLayer(latlng, countryW600Layer, true);
    var countryW200Result = leafletPip.pointInLayer(latlng, countryW200Layer, true);
    var lresponse = lResult.length > 0 ? lResult[0].feature.properties['分級'] : '無潛勢';
    var sresponse = void 0;
    var wresponse = void 0;
    if (isLoadSensitiveData) {
      sresponse = sResult.length > 0 ? '是' : '否';
    }
    if (w600Result.length > 0 && w200Result.length === 0) {
      wresponse = '雨量達600mm時，可能淹水';
      wresponse += w600Result[0].feature.properties.NOTE.replace('(', '').replace(')', '');
    } else if (w600Result.length > 0 && w200Result.length > 0) {
      wresponse = '雨量達200mm時(即豪雨)，可能淹水';
      wresponse += w200Result[0].feature.properties.NOTE.replace('(', '').replace(')', '');
      wresponse += '<br>雨量達600mm時，可能淹水';
      wresponse += w600Result[0].feature.properties.NOTE.replace('(', '').replace(')', '');
    } else if (w600Result.length === 0 && w200Result.length > 0) {
      wresponse = '雨量達200mm時(即豪雨)，可能淹水';
      wresponse += w200Result[0].feature.properties.NOTE.replace('(', '').replace(')', '');
    } else if (countryW600Result.length > 0 && countryW200Result.length === 0) {
      wresponse = '雨量達600mm時，可能淹水';
      wresponse += countryW600Result[0].feature.properties.NOTE.replace('(', '').replace(')', '');
    } else if (countryW600Result.length > 0 && countryW200Result.length > 0) {
      wresponse = '雨量達200mm時(即豪雨)，可能淹水';
      wresponse += countryW200Result[0].feature.properties.NOTE.replace('(', '').replace(')', '');
      wresponse += '<br>雨量達600mm時，可能淹水';
      wresponse += countryW600Result[0].feature.properties.NOTE.replace('(', '').replace(')', '');
    } else if (countryW600Result.length === 0 && countryW200Result.length > 0) {
      wresponse = '雨量達200mm時(即豪雨)，可能淹水';
      wresponse += countryW200Result[0].feature.properties.NOTE.replace('(', '').replace(')', '');
    } else {
      wresponse = '無潛勢';
    }

    if (isLoadSensitiveData) {
      info.update({
        name: name,
        l: lresponse,
        s: sresponse,
        w: wresponse
      });
    } else {
      info.update({
        name: name,
        l: lresponse,
        w: wresponse
      });
    }
  }).addTo(map);

  var focusButton = L.control().setPosition('topleft');

  focusButton.onAdd = function () {
    var container = L.DomUtil.create('button', 'ui compact icon button');
    var icon = L.DomUtil.create('i', 'map outline icon', container);
    $(icon).on('click', function () {
      map.setView([23.1, 120.3], 11);
    });
    $(icon).attr('title', '縮放至整個台南市');
    return container;
  };

  focusButton.addTo(map);

  var info = L.control();
  info.onAdd = function () {
    this._div = L.DomUtil.create('table', 'ui table');
    this.update();
    return this._div;
  };

  info.update = function (props) {
    if (props) {
      if (isLoadSensitiveData) {
        this._div.innerHTML = '<tbody>\n        <thead><tr><th colspan="2">' + props.name + '</th></tr></thead>\n        <tr><td>\u5730\u8CEA\u654F\u611F\u5340</td><td>' + props.s + '</td></tr>\n        <tr><td>\u571F\u58E4\u6DB2\u5316\u6F5B\u52E2</td><td>' + props.l + '</td></tr>\n        <tr><td>\u6DF9\u6C34\u6F5B\u52E2</td><td>' + props.w + '</td></tr>\n        </tbody>';
      } else {
        this._div.innerHTML = '<tbody>\n        <thead><tr><th colspan="2">' + props.name + '</th></tr></thead>\n        <tr><td>\u571F\u58E4\u6DB2\u5316\u6F5B\u52E2</td><td>' + props.l + '</td></tr>\n        <tr><td>\u6DF9\u6C34\u6F5B\u52E2</td><td>' + props.w + '</td></tr>\n        </tbody>';
      }
    }
  };
  info.addTo(map);

  $('#s-loadin').on('click', function () {
    if (isLoadSensitiveData) {
      return;
    }
    $('#s-loadin').addClass('loading');
    $.getJSON('./src/data/disaster-sensitive.json', function (json) {
      sensitiveArea = json;
      sLayer = L.geoJSON(sensitiveArea, { style: sStyle }).addTo(map);
      $('#s-loadin').removeClass('loading');
      $('#s-loadin').removeClass('basic');
      $('#s-loadin').addClass('disabled');
      $('#s-loadin').text('已載入地質敏感資料');

      mapInfo = '<span><span class="info-block" style="background-color: ' + sStyle.color + ' "></span><strong>\u5730\u8CEA\u654F\u611F\u5340</strong></span>\n      <span><span class="info-block bg-liquefaction"></span><strong>\u571F\u58E4\u6DB2\u5316\u6F5B\u52E2\u5340</strong></span>\n      <span><span class="info-block bg-water"></span><strong>\u6DF9\u6C34\u6F5B\u52E2\u5340</strong></span>';

      $('#map-info').html(mapInfo);
    });

    isLoadSensitiveData = true;
  });
})(window);