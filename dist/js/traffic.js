'use strict';

//  map of traffic events
// initial map
//'http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png'
//'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'

var mymap = L.map('accidentMap').setView([22.9945, 120.21208], 14);
L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 18,
  attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, &copy;<a href="https://carto.com/attribution">CARTO</a>'
}).addTo(mymap);

// add legend
var legend = L.control({ position: 'bottomright' });
var legendLocation = L.control({ position: 'bottomright' });

legend.onAdd = function () {
  var div = L.DomUtil.create('div', 'info legend'),
      colors = ['#ff6f69', '#265665'],
      labels = ['白天(5:00-17:00)', '晚上(17:00-5:00)'];

  for (var i = 0; i < labels.length; i++) {
    div.innerHTML += '<p><i style="background:' + colors[i] + '"></i> ' + labels[i] + '<br></p>';
  }
  return div;
};
legendLocation.onAdd = function () {
  var div = L.DomUtil.create('div', 'info legend');
  div.innerHTML += '<button class="ui button" style="background-color:#ffffff" id="getLocationButton">移動到我的位置</button>';

  return div;
};
legend.addTo(mymap);
legendLocation.addTo(mymap);

function getLocation(map) {
  map.locate({ setView: true, maxZoom: 15 }).on('locationfound', function (e) {
    var marker = L.marker([e.latitude, e.longitude]).bindPopup('你在這裡 :)');
    map.addLayer(marker);
  });
}

// toggle onclick
$('#day_toggleCheckbox').checkbox().on('click', function () {
  var isChecked = $('#day_toggle').is(':checked');
  if (isChecked) {
    $('.day').css('visibility', 'visible');
  } else {
    $('.day').css('visibility', 'hidden');
  }
});
$('#night_toggleCheckbox').checkbox().on('click', function () {
  var isChecked = $('#night_toggle').is(':checked');
  if (isChecked) {
    $('.night').css('visibility', 'visible');
  } else {
    $('.night').css('visibility', 'hidden');
  }
});

$('#warning_area_checkbox_wrap').checkbox().on('click', function () {
  var isChecked = $('#warning_area_checkbox').is(':checked');
  if (isChecked) {
    $('.warningArea').css('visibility', 'visible');
  } else {
    $('.warningArea').css('visibility', 'hidden');
  }
});

$('#getLocationButton').on('click', function () {
  getLocation(mymap);
});

function addEventCircle(event, map) {
  var lat = event.lat;
  var lng = event.lng;
  var daynight = event.daynight;
  var date = event.date;
  var hour = event.hour;
  var rush = event.rush;
  if (lat !== undefined || lng !== undefined) {
    if (daynight === 'day') {
      if (rush) {
        var classString = 'circle day rush ' + hour;
        var circle = L.circle([lat, lng], {
          color: '#ff6f69',
          stroke: false,
          fillColor: '#ff6f69',
          fillOpacity: 0.7,
          radius: 20,
          className: classString
        }).addTo(map);
        circle.bindPopup('時間： ' + date.toString());
      } else {
        var _classString = 'circle day nonrush ' + hour;
        var _circle = L.circle([lat, lng], {
          color: '#ff6f69',
          stroke: false,
          fillColor: '#ff6f69',
          fillOpacity: 0.7,
          radius: 20,
          className: _classString
        }).addTo(map);
        _circle.bindPopup('時間： ' + date.toString());
      }
    } else {
      if (rush) {
        var _classString2 = 'circle night rush ' + hour;
        var _circle2 = L.circle([lat, lng], {
          color: '#265665',
          stroke: false,
          fillColor: '#265665',
          fillOpacity: 0.7,
          radius: 20,
          className: _classString2
        }).addTo(map);
        _circle2.bindPopup('時間： ' + date.toString());
      } else {
        var _classString3 = 'circle night nonrush ' + hour;
        var _circle3 = L.circle([lat, lng], {
          color: '#265665',
          stroke: false,
          fillColor: '#265665',
          fillOpacity: 0.7,
          radius: 20,
          className: _classString3
        }).addTo(map);
        _circle3.bindPopup('時間： ' + date.toString());
      }
    }
  }
}

function addWarningArea(event, map) {
  var lat = event.lat;
  var lng = event.lng;
  var name = event.name;
  var circle = L.circle([lat, lng], {
    color: '#FFCC00',
    stroke: false,
    fillColor: '#FFCC00',
    fillOpacity: 0.6,
    radius: 100,
    className: 'warningArea'
  }).addTo(map);
  circle.bindPopup(event.name + ', 累積事件數：' + event.count + 'lat,lng: ' + lat);
}

// This example adds a search box to a map, using the Google Place Autocomplete
// feature. People can enter geographical searches. The search box will return a
// pick list containing a mix of places and predicted search terms.

// This example requires the Places library. Include the libraries=places
// parameter when you first load the API. For example:
// <script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places">
//google map exploration
/*
function initAutocomplete() {
        var map = new google.maps.Map(document.getElementById('accidentMap'), {
          center: {lat: -33.8688, lng: 151.2195},
          zoom: 13,
          mapTypeId: 'roadmap'
        });

        // Create the search box and link it to the UI element.
        var input = document.getElementById('pac-input');
        var searchBox = new google.maps.places.SearchBox(input);
        map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

        // Bias the SearchBox results towards current map's viewport.
        map.addListener('bounds_changed', function() {
          searchBox.setBounds(map.getBounds());
        });

        var markers = [];
        // Listen for the event fired when the user selects a prediction and retrieve
        // more details for that place.
        searchBox.addListener('places_changed', function() {
          var places = searchBox.getPlaces();

          if (places.length == 0) {
            return;
          }

          // Clear out the old markers.
          markers.forEach(function(marker) {
            marker.setMap(null);
          });
          markers = [];

          // For each place, get the icon, name and location.
          var bounds = new google.maps.LatLngBounds();
          places.forEach(function(place) {
            if (!place.geometry) {
              console.log("Returned place contains no geometry");
              return;
            }
            var icon = {
              url: place.icon,
              size: new google.maps.Size(71, 71),
              origin: new google.maps.Point(0, 0),
              anchor: new google.maps.Point(17, 34),
              scaledSize: new google.maps.Size(25, 25)
            };

            // Create a marker for each place.
            markers.push(new google.maps.Marker({
              map: map,
              icon: icon,
              title: place.name,
              position: place.geometry.location
            }));

            if (place.geometry.viewport) {
              // Only geocodes have viewport.
              bounds.union(place.geometry.viewport);
            } else {
              bounds.extend(place.geometry.location);
            }
          });
          map.fitBounds(bounds);
        });
      }

initAutocomplete()*/
$.getJSON('./src/data/trafficeRawData.json', function (data) {
  $.each(data, function (index, value) {
    addEventCircle(value, mymap);
  });
});

$.getJSON('./src/data/trafficWarningArea.json', function (data) {
  $.each(data, function (index, value) {
    addWarningArea(value, mymap);
  });
});

// line chart

var svg = d3.select('#linechart svg'),
    margin = { top: 20, right: 20, bottom: 30, left: 50 },
    width = $('#linechart').width() - 10,
    height = +svg.attr('height') - margin.bottom,
    g = svg.append('g').attr('transform', 'translate(' + 0 + ',' + 5 + ')');

function brushed() {
  if (!d3.event.sourceEvent) return;
  if (!d3.event.selection) return;
  var d0 = d3.event.selection.map(x.invert);
  var d1 = d0.map(function (d) {
    return +parseInt(d);
  });
  if (d1[0] >= d1[1]) {
    d1[0] = d0[0];
    d1[1] = d0[0] + 1;
  }

  d3.select(this).transition().call(d3.event.target.move, d1.map(x));
  $('#night_toggle').removeAttr('checked');
  $('#day_toggle').removeAttr('checked');
  $('.day').css('visibility', 'hidden');
  $('.night').css('visibility', 'hidden');
  for (var i = d1[0]; i <= d1[1]; i++) {
    var hourString = '.hour' + i;
    $(hourString).css('visibility', 'visible');
  }
}

var x = d3.scaleLinear().rangeRound([0, width]);

var y = d3.scaleLinear().rangeRound([height, 0]);

var brush = d3.brushX().extent([[0, 0], [width, height]]).on('brush end', brushed);

var area = d3.area().x(function (d) {
  return x(d.hour);
}).y1(function (d) {
  return y(d.count);
});

d3.csv('./src/data/trafficHourSummary.csv', function (d) {
  d.hour = d.hour;
  d.count = +d.count;
  return d;
}, function (error, data) {
  if (error) throw error;

  x.domain([0, 23]);
  y.domain([0, d3.max(data, function (d) {
    return d.count + 30;
  })]);
  area.y0(y(0));

  g.append('path').datum(data).attr('fill', 'grey').attr('opacity', '0.4').attr('d', area);

  g.append('g').attr('class', 'axis').attr('transform', 'translate(2,' + height + ')').call(d3.axisBottom(x).ticks(24));

  g.append('g').attr('class', 'brush').call(brush).call(brush.move, x.range());
});

$('.hourButton').on('click', function () {
  var val = $(this).attr('value');

  var brushg = d3.select('.brush').transition().duration(400);
  var d1 = d3.brushSelection(brushg.node()).map(x.invert);
  var d2 = d1.map(function (d) {
    return Math.round(d);
  });
  if (val == 'plus') {
    if (d2[1] <= 22) {
      d2[1] += 1;
    } else if (d2[0] > 0) {
      d2[0] -= 1;
    }
    if (d2[0] >= d2[1]) {
      d2[0] = d1[0];
      d2[1] = d1[0] + 1;
    }
  } else if (val == 'minus') {
    if (d2[0] > 0) {
      d2[0] += 1;
    } else if (d2[1] <= 23) {
      d2[1] -= 1;
    }
    if (d2[0] >= d2[1]) {
      d2[0] = d1[0];
      d2[1] = d1[0] + 1;
    }
  }
  if (d2[1] == 23 && d2[0] == -1 || d2[0] == 0) {
    brush.move(brushg, [9, 21].map(x));
  } else {
    brush.move(brushg, d2.map(x));
  }
  $('.day').css('visibility', 'hidden');
  $('.night').css('visibility', 'hidden');
  for (var i = d2[0]; i <= d2[1]; i++) {
    var hourString = '.hour' + i;
    $(hourString).css('visibility', 'visible');
  }
});

/*pie chart*/
//total event 356590 + 12401 +1049
//important event 352617

function pieChart() {
  // var svgWidth = 300;
  var svgHeight = 300;
  //var totalWidth = svgWidth + 300;
  var totalHeight = svgHeight + 150;
  //var radius = Math.min(svgWidth, svgHeight) / 2;
  var radius = svgHeight / 2;
  var recSize = 18;
  var thickness = 25;

  var tmpWidth = 0;

  var svg = d3.select('#pieChart').append('svg').attr('width', '100%').attr('height', totalHeight);
  //.append('g')
  // .attr('display', 'block')
  // .attr('margin', 'auto');
  //.attr('transform', 'translate(' + 300 + ',' + (svgHeight * 2 / 3) + ')')
  //.attr('transform', 'translate(' + $('svg').width() / 2  + ',' + (svgHeight * 2 / 3) + ')');


  var arc = d3.svg.arc().innerRadius(radius - thickness).outerRadius(radius);

  var pieSvg = svg.append('g').attr('id', 'pieSvg').attr('class', 'pie-svg').attr('transform', 'translate(' + $('#pieChart').width() / 2 + ',' + (svgHeight * 2 / 3 + 10) + ')');
  //.attr('display', 'none');

  pieSvg.append('g').append('circle').attr('cx', 0).attr('cy', 0).attr('r', (svgHeight - thickness - 50) / 2).attr('fill', 'none').attr('stroke', '#BEBEBE').attr('stroke-width', 3);

  pieSvg.append("g").attr("class", "lines");

  var pie = d3.layout.pie().value(function (d) {
    return d.times;
  }).sort(null);

  var tooltip = d3.select('#pieChart').append('div').attr('class', 'tooltip');

  tooltip.append('div').attr('class', 'event');

  tooltip.append('div').attr('class', 'times');

  tooltip.append('div').attr('class', 'percent');

  d3.csv('./src/data/trafficExposedData.csv', function (error, data) {
    //var color = d3.scale.category20c();

    var colorLabel = [];

    data.forEach(function (d) {
      colorLabel.push(d.event);
    });
    var color = d3.scale.ordinal()
    //.domain(['未領有駕照駕車','未戴安全帽','酒精濃度超過規定標準者','行車速度超速60公里以下','爭道行駛','不依規定轉彎或變換車道','闖紅燈直行左轉','闖紅燈右轉','違規臨時停車','違規停車','停車時間位置方式車種不依規定','併排停車','其他不遵守標誌標線號誌駕車','違規停車拖吊'])
    //.domain([1, 14])
    //.range(['#FFB6C1', '#66CDAA', '#87CEFA', '#48D1CC', '#7B68EE', '#F4A460', '#ADD8E6', '#CA8EC2', '#81C0C0', '#8080C0', '#FFBB77', '#AAAAFF', '#FF79BC', '#FFAD86']);
    .domain(colorLabel).range(['#4F9D9D', '#95CACA', '#5A5AAD', '#A6A6D2', '#C07AB8', '#FFAD86', '#FF95CA', '#00E3E3', '#009393', '#46A3FF', '#66CDAA', '#8600FF', '#CA8EFF', '#FFB5B5']);
    //.range(['#4169E', '#1E90FF', '#ADD8E6', '#40E0D0', '#87CECB', '#FFDAB9', '#FFA07A', '#CD5C5C', '#D87093', '#FF69B4', '#FFB6C1', '#DDA0DD', '#9370DB', '#6A5ACD']);


    data.forEach(function (d) {
      d.times = +d.times;
    });

    var path = pieSvg.selectAll('path').data(pie(data)).enter().append('path').attr('d', arc).attr('fill', function (d, i) {
      return color(d.data.event);
    });

    tooltip.select('.event').html('<h1 class="tooltip-title">舉發總件數</h1><div class="title-line"></div>');
    tooltip.select('.times').html('370,040 件');

    var total = d3.sum(data.map(function (d) {
      return d.times;
    }));
    path.on('mouseover', function (d) {

      var percent = Math.round(1000 * d.data.times / total) / 10;
      var _comma = d3.format(",");

      tooltip.select('.event').html('<h1 class="tooltip-title">' + d.data.event + '</h1><div class="title-line"></div>');
      tooltip.select('.times').html(_comma(d.data.times) + ' 件');
      tooltip.select('.percent').html(percent + '%');
    });

    path.on('mouseout', function () {
      tooltip.select('.event').html('<h1 class="tooltip-title">舉發總件數</h1><div class="title-line"></div>');
      tooltip.select('.times').html('370,040 件');
      tooltip.select('.percent').html('');
    });

    /* label */
    var g = pieSvg.append("g").attr("transform", "translate(" + 0 / 2 + "," + 0 / 2 + ")");

    var radius2 = (svgHeight + 100) / 2;

    var arc2 = d3.svg.arc().innerRadius(radius2 * 0.6).outerRadius(radius2 * 0.8);

    var outerArc2 = d3.svg.arc().innerRadius(radius2 * 0.95).outerRadius(radius2 * 0.95);

    function midAngle(d) {
      return d.startAngle + (d.endAngle - d.startAngle) / 2;
    }

    g.selectAll("text").data(pie(data)).enter().append("text").attr("class", "label-style").attr("transform", function (d) {

      var pos = outerArc2.centroid(d);
      pos[0] = radius2 * (midAngle(d) < Math.PI ? 1 : -1);
      return "translate(" + pos + ")";
    }).attr("text-anchor", function (d) {
      var direction = midAngle(d) < Math.PI ? 1 : -1;
      if (direction === -1) {
        return "end";
      } else {
        return "start";
      }
    }).text(function (d) {
      var total = d3.sum(data.map(function (d) {
        return d.times;
      }));
      var percent = Math.round(1000 * d.data.times / total) / 10;
      return d.data.event + ' ' + percent + '%';
    });
    /* polyline */

    var polyline = g.selectAll("polyline").data(pie(data), function (d) {
      return d.data.event;
    }).enter().append("polyline").attr("points", function (d) {
      var pos = outerArc2.centroid(d);
      pos[0] = radius2 * 0.95 * (midAngle(d) < Math.PI ? 1 : -1);

      return [arc2.centroid(d), outerArc2.centroid(d), pos];
    });

    var dataSort = data.sort(function (a, b) {
      return b.times - a.times;
    });

    var legend = svg.append('g').attr('id', 'legendSvg').attr('class', 'legend-svg').attr('transform', 'translate(' + ($('#pieChart').width() / 2 - 170) + ',' + 180 + ')').selectAll('.legend-style').data(dataSort).enter().append('g').attr('class', 'legend-style').attr('transform', function (d, i) {
      var height = recSize + 8;
      var offset = height * dataSort.length / 2;
      var vert = i * height - offset + 10;
      return 'translate(' + 0 + ',' + vert + ')';
    });

    legend.append('rect').attr('width', recSize).attr('height', recSize).style('fill', function (d) {
      return color(d.event);
    }).style('stroke', function (d) {
      return color(d.event);
    });

    legend.append('text').attr('x', recSize + 10).attr('y', recSize - 4).text(function (d) {
      var percent = Math.round(1000 * d.times / total) / 10;
      return d.event + ' ' + percent + '%';
    });
  });
}

pieChart();

// Vue Chart later.
// var vm = new Vue({
//   el: '#fineCreator',
//   data: {
//     eventData: [],
//     setList: [],
//     idEventData: {},
//     selectId: [],
//     selectName: [],
//     fineList: [],
//     fineTotal: 0,
//     fineData: []
//   },
//   delimiters: ['${', '}'],
//   created: function() {
//     jQuery.get('/src/data/trafficFineSelect.json', function(data) {
//       vm.eventData = data

//       $.each(vm.eventData, function(key, data) {
//         vm.idEventData[data.id] = data.category
//       })
//     });
//     jQuery.get('/src/data/trafficFineChart.json', function(data) {
//       vm.fineData = data
//     });
//   },
//   methods: {
//     addSetting: function(id) {
//       this.setList.push(this.idEventData[id]);

//       var tmpName = []
//       var tmpId = []
//       $.each(this.idEventData[id], function(index, data) {
//         tmpName.push({ 'x': data.category[0].name })
//         tmpId.push(data.category[0].id)
//       })

//       this.selectName.push(tmpName)
//       this.selectId.push(tmpId)

//       this.addFine(tmpId, -1)

//     },
//     changeSelectId: function(index1, index2, setId) {
//       this.selectId[index1][index2] = setId
//       this.addFine(this.selectId[index1], index1)
//     },
//     addFine: function(tmpId, state) {
//       $.each(this.fineData, function(index, data) {
//         var diff = $(data.all_id).not(tmpId).get();
//         if (diff.length === 0) {
//           if (state === -1) { // initial
//             vm.fineList.push(data.fine)
//           } else {
//             vm.fineList[state] = data.fine
//           }
//           return false
//         }
//       })
//     },
//     removeItem: function(index) {
//       this.fineList.splice(index, 1)
//       this.selectId.splice(index, 1)
//       this.selectName.splice(index, 1)
//       this.setList.splice(index, 1)
//     }
//   }

// });