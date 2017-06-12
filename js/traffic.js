//  map of traffic events
// initial map
//'http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png'
//'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
const mymap = L.map('accidentMap').setView([22.9945, 120.21208], 14)
L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
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
  const isChecked = $('#day_toggle').is(':checked')
  if (isChecked) {
    $('.day').css('visibility', 'visible')
  } else {
    $('.day').css('visibility', 'hidden')
  }
})
$('#night_toggle').on('click', () => {
  const isChecked = $('#night_toggle').is(':checked')
  if (isChecked) {
    $('.night').css('visibility', 'visible')
  } else {
    $('.night').css('visibility', 'hidden')
  }
})
$('#warning_area_checkbox').on('click', () => {
  const isChecked = $('#warning_area_checkbox').is(':checked')
  if (isChecked) {
    $('.warningArea').css('visibility', 'visible')
  } else {
    $('.warningArea').css('visibility', 'hidden')
  }
})

function addEventCircle(event, map) {
  const lat = event.lat
  const lng = event.lng
  const daynight = event.daynight
  const date = event.date
  const hour = event.hour
  const rush = event.rush
  if (lat !== undefined || lng !== undefined) {
    if (daynight === 'day') {
      if (rush) {
        const classString = 'circle day rush ' + hour
        const circle = L.circle([lat, lng], {
          color: '#ff6f69',
          stroke: false,
          fillColor: '#ff6f69',
          fillOpacity: 0.7,
          radius: 20,
          className: classString,
        }).addTo(map)
        circle.bindPopup('時間： ' + date.toString())
      } else {
        const classString = 'circle day nonrush ' + hour
        const circle = L.circle([lat, lng], {
          color: '#ff6f69',
          stroke: false,
          fillColor: '#ff6f69',
          fillOpacity: 0.7,
          radius: 20,
          className: classString,
        }).addTo(map)
        circle.bindPopup('時間： ' + date.toString())
      }
    } else {
        if(rush) {
          const classString = 'circle night rush ' + hour
          const circle = L.circle([lat, lng], {
            color: '#265665',
            stroke: false,
            fillColor: '#265665',
            fillOpacity: 0.7,
            radius: 20,
            className: classString,
          }).addTo(map)
          circle.bindPopup('時間： ' + date.toString())
        } else {
          const classString = 'circle night nonrush ' + hour
          const circle = L.circle([lat, lng], {
            color: '#265665',
            stroke: false,
            fillColor: '#265665',
            fillOpacity: 0.7,
            radius: 20,
            className: classString,
          }).addTo(map)
          circle.bindPopup('時間： ' + date.toString())
        }
    }
  }
}

function addWarningArea(event,map){
  const lat = event.lat
  const lng = event.lng
  const name = event.name
  const circle = L.circle([lat, lng], {
          color: '#FFCC00',
          stroke: false,
          fillColor: '#FFCC00',
          fillOpacity:0.6,
          radius: 100,
          className: 'warningArea',
        }).addTo(map)
        circle.bindPopup(event.name+', 累積事件數：'+ event.count+'lat,lng: ' + lat)
}

$.getJSON('./src/data/trafficeRawData.json', (data) => {
  $.each(data, (index, value) => {
    addEventCircle(value, mymap)
  })
})

$.getJSON('./src/data/trafficWarningArea.json', (data) => {
  $.each(data, (index, value) => {
    addWarningArea(value, mymap)
  })
})


// line chart

const svg = d3.select('#linechart svg'),
  margin = { top: 20, right: 20, bottom: 30, left: 50 },
  width = $('#linechart').width()- 10,
  height = +svg.attr('height') - margin.bottom,
  g = svg.append('g').attr('transform', 'translate(' + 0 + ',' + 5 + ')')

function brushed() {
  if (!d3.event.sourceEvent) return
  if (!d3.event.selection) return
  const d0 = d3.event.selection.map(x.invert)
  const d1 = d0.map((d) => { return +parseInt(d) })
  if (d1[0] >= d1[1]) {
    d1[0] = d0[0]
    d1[1] = d0[0]+ 1
  }
  console.log(d0,d1,d3.event.selection.map(x))
  d3.select(this).transition().call(d3.event.target.move, d1.map(x))
  $('#night_toggle').removeAttr('checked')
  $('#day_toggle').removeAttr('checked')
  $('.day').css('visibility', 'hidden')
  $('.night').css('visibility', 'hidden')
  for (let i = d1[0]; i <= d1[1]; i++) {
    let hourString = '.hour' + i
    $(hourString).css('visibility', 'visible')
  }
}

const x = d3.scaleLinear()
    .rangeRound([0, width])

const y = d3.scaleLinear()
    .rangeRound([height, 0])

const brush = d3.brushX()
    .extent([[0, 0], [width, height]])
    .on('brush end', brushed)

const area = d3.area()
    .x((d) => { return x(d.hour) })
    .y1((d) => { return y(d.count) })



d3.csv('./src/data/trafficHourSummary.csv', (d) => {
  d.hour = d.hour
  d.count = +d.count
  return d
}, (error, data) => {
  if (error) throw error

  x.domain([0, 23])
  y.domain([0, d3.max(data, (d) => { return d.count + 30 })])
  area.y0(y(0))

  g.append('path')
      .datum(data)
      .attr('fill', 'grey')
      .attr('opacity', '0.4')
      .attr('d', area)

  g.append('g')
      .attr('class', 'axis')
      .attr('transform', 'translate(2,' + height + ')')
      .call(d3.axisBottom(x)
      .ticks(24))

   g.append('g')
      .attr('class', 'brush')
      .call(brush)
      .call(brush.move, x.range())
})

let initX0 = 0
let initX1 = 23
$('.button').on('click',function() {
  let val = $(this).attr('value')
  console.log(val)
  //let brushActualRange = d3.brushSelection(d3.select(".brush").node())
  const brushg = d3.select('.brush').transition().duration(400)
  let d1 = d3.brushSelection(brushg.node()).map(x.invert)
  let d2 = d1.map((d) => { return Math.round(d) })
  if (val=='plus'){
    if(d2[1]<=22){
      d2[1]+=1
    }else if(d2[0]>0){
      d2[0]-=1
    }
    if (d2[0] >= d2[1]) {
    d2[0] = d1[0]
    d2[1] = d1[0]+ 1
  }
  }else if (val=='minus'){
    if(d2[0]>0){
      d2[0]+=1
      console.log("minus")
    }else if(d2[1]==23){
      d2[1]-=1
    }
    if (d2[0] >= d2[1]) {
    d2[0] = d1[0]
    d2[1] = d1[0]+ 1
  }
  }
  if (d2[1]==23 && d2[0]==-1){
    brush.move(brushg, [9,21].map(x))
  }
  else{
    brush.move(brushg, d2.map(x))
  }
  console.log( d1,d2)

  
  
  //moveBrush(initX0,initX1,val)
})
function moveBrush(X0,X1,action){
  console.log(X0,X1,action)
  //let range = [X0,X1]
 
  //brush(d3.select(".brush").transition().duration(500));
  //brush.event(d3.select(".brush").transition().delay(1000).duration(500))

}

/*pie chart*/
//total event 356590 + 12401 +1049
//important event 352617
/*
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
})(window.d3); */