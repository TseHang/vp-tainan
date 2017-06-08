//  map of traffic events
// initial map
const mymap = L.map('accidentMap').setView([22.9945, 120.21208], 14)
L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png', {
  maxZoom: 18,
  attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, &copy;<a href="https://carto.com/attribution">CARTO</a>',
}).addTo(mymap)

// add legend
const legend = L.control({ position: 'bottomright' })

legend.onAdd = () => {
  const div = L.DomUtil.create('div', 'info legend'),
    colors = ['#ff6f69', '#265665'],
    labels = ['白天(5:00-17:00)', '晚上(17:00-5:00)']

  for (let i = 0; i < labels.length; i++) {
    div.innerHTML +=
    '<p><i style="background:' + colors[i] + '"></i> ' + labels[i] + '<br></p>'
  }
  return div
}
legend.addTo(mymap)

// toggle onclick
$('#day_toggle').on('click', () => {
  let isChecked = $('#day_toggle').is(':checked')
    if(isChecked) {
      $('.day').css('visibility' , 'visible')
    } else {
      $('.day').css('visibility' , 'hidden')
    }
})
$('#night_toggle').on('click', () => {
  let isChecked = $('#night_toggle').is(':checked')
    if(isChecked) {
      $('.night').css('visibility' , 'visible')
    } else {
      $('.night').css('visibility' , 'hidden')
    }
})

function addEventCircle(event, map) {
  const lat = event.lat
  const lng = event.lng
  const daynight = event.daynight
  const date = event.date
  if (lat !== undefined || lng !== undefined) {
    if (daynight === 'day') {
      const circle = L.circle([lat, lng], {
        color: '#ff6f69',
        stroke: false,
        fillColor: '#ff6f69',
        fillOpacity: 0.5,
        radius: 15,
        className: 'circle day',
      }).addTo(map)
      circle.bindPopup('時間： ' + date.toString())
    } else {
      const circle = L.circle([lat, lng], {
        color: '#265665',
        stroke: false,
        fillColor: '#265665',
        fillOpacity: 0.5,
        radius: 15,
        className: 'circle night',
      }).addTo(map)
      circle.bindPopup('時間： ' + date.toString())
    }
  }
}

$.getJSON('./src/data/trafficeRawData.json', (data) => {
  $.each(data, (index, value) => {
    addEventCircle(value, mymap)
  })
});
// pie chart code (d3)
/*
let svg = d3.select('svg')
.append('g')
.attr('class', 'slices')
.attr('class', 'labels')
.attr('class', 'lines')

const width = $('svg').width()
const height = $('svg').height()
const radius = Math.min(width, height / 2)
*/
// table next to pie chart




/*pie chart*/
//total event 356590 + 12401 +1049
//important event 352617
(function(d3) {
  var svgWidth = 300;
  var svgHeight = 300;
  var radius = Math.min(svgWidth, svgHeight) / 2;
  var recSize = 18;
  var thickness = 25;
  
  var svg = d3.select('#pieChart')
      .append('svg')
      .attr('width', svgWidth + 300)
      .attr('height', svgHeight + 10)
      .append('g')
      .attr('transform', 'translate(' + (svgWidth / 2) + ',' + (svgHeight / 2) + ')');

  var arc = d3.svg.arc()
      .innerRadius(radius - thickness)
      .outerRadius(radius);

  svg.append('g')
      .append('circle')
      .attr('cx', 0)
      .attr('cy', 0)
      .attr('r', (svgHeight - thickness - 50) / 2)
      .attr('fill', 'none')
      .attr('stroke', '#BEBEBE')
      .attr('stroke-width', 3);


  var pie = d3.layout.pie()
      .value(function(d){ return d.times; })
      .sort(null);

  var tooltip = d3.select('#pieChart')
      .append('div')
      .attr('class', 'tooltip');

  tooltip.append('div')
    .attr('class', 'event');

  tooltip.append('div')
    .attr('class', 'times');

  tooltip.append('div')
    .attr('class', 'percent'); 

  d3.csv('./src/data/trafficExposedData.csv', function(error, data) {
    var color = d3.scale.category20c();
    // var color = d3.scale.ordinal()
    //             .domain(['未領有駕照駕車','未戴安全帽','酒精濃度超過規定標準者','行車速度超速60公里以下','爭道行駛','不依規定轉彎或變換車道','闖紅燈直行左轉','闖紅燈右轉','違規臨時停車','違規停車','停車時間位置方式車種不依規定','併排停車','其他不遵守標誌標線號誌駕車','違規停車拖吊'])
    //             //.domain([1, 14])
    //             .range(['#CECEFF', '#B9B9FF', '#7D7DFF', '#4A4AFF']);

    data.forEach(function(d) {
      d.times = +d.times;
    });

    var path = svg.selectAll('path')
        .data(pie(data))
        .enter()
        .append('path')
        .attr('d', arc)
        .attr('fill', function(d, i) { 
          return color(d.data.event); 
          //return color(i);
        });

    path.on('mouseover', function(d) {
      var total = d3.sum(data.map(function(d) {
        return d.times;
      }));
      var percent = Math.round(1000 * d.data.times / total) / 10;
      var _comma = d3.format(",");
      //var percent = Math.round(d.data.times / total);
      tooltip.select('.event').html('<h1 class="tooltip-title">' + d.data.event + '</h1><div class="title-line"></div>');
      tooltip.select('.times').html(_comma(d.data.times) + ' 件');
      tooltip.select('.percent').html(percent + '%');
      tooltip.style('display', 'block');
    });
    
    path.on('mouseout', function() {
      tooltip.style('display', 'none');
    });
      
    var legend = svg.selectAll('.legend')
        .data(color.domain())
        .enter()
        .append('g')
        .attr('class', 'legend')
        .attr('transform', function(d, i) {
          var height = recSize + 4;
          var offset =  height * color.domain().length / 2;
          var horz = svgHeight / 2 + 50;
          var vert = i * height - offset + 10;
          return 'translate(' + horz + ',' + vert + ')';
        });

    legend.append('rect')
      .attr('width', recSize)
      .attr('height', recSize)                                   
      .style('fill', color)
      .style('stroke', color);
      
    legend.append('text')
      .attr('x', recSize + 4)
      .attr('y', recSize - 4)
      .text(function(d) { return d; });

  });
})(window.d3);