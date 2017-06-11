//  map of traffic events
// initial map
const mymap = L.map('accidentMap').setView([22.9945, 120.21208], 14)
L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png', {
  maxZoom: 18,
  attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, &copy;<a href="https://carto.com/attribution">CARTO</a>',
}).addTo(mymap)

if (isMobile){
  $('.hint').css('display', 'none')
}
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
          fillOpacity: 0.8,
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
          fillOpacity: 0.8,
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
            fillOpacity: 0.6,
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
            fillOpacity: 0.6,
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
  const circle = L.circle([lat, lng], {
          color: '#FFCC00',
          stroke: false,
          fillColor: '#FFCC00',
          fillOpacity:0.8,
          radius: 100,
          className: 'warningArea',
        }).addTo(map)
        circle.bindPopup('常發生事故路段: 累積事件數：'+ event.count)
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

function brushed() {
  if (!d3.event.sourceEvent) return
  if (!d3.event.selection) return
  const d0 = d3.event.selection.map(x.invert)
  const d1 = d0.map((d) => { return +parseInt(d) })
  if (d1[0] >= d1[1]) {
    d1[0] = d0[0]
    d1[1] = d0[0]+ 1
  }
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

//var controlButtons = $('.')

// pie chart code (d3)

// table next to pie chart
