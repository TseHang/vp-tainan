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
})
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
