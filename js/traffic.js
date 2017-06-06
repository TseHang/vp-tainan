//  map of traffic events
const mymap = L.map('accidentMap').setView([22.98877766803278, 120.21154403686522], 14)

L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png', {
  maxZoom: 18,
  attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, &copy;<a href="https://carto.com/attribution">CARTO</a>',
}).addTo(mymap)

// ./src/data/traffic10506.csv

function addEventCircle(event) {
  const lat = event.lat
  const lng = event.lng
  const month = event.month
  const daynight = (event.hour < 17 && event.hour > 5) ? ('day') : ('night')
  const date = event.month + '月' + event.day + '日'
  if (lat !== undefined || lng !== undefined) {
    if (daynight === 'day') {
      const circle = L.circle([lat, lng], {
        color: '#ff6f69',
        fillColor: '#f03',
        fillOpacity: 0.1,
        radius: 0.2,
        class: month,
      }).addTo(mymap)
      circle.bindPopup(date + ' lat: '+ lat + 'lng' + lng)
    } else {
      const circle = L.circle([lat, lng], {
        color: '#265665',
        fillColor: '#f03',
        fillOpacity: 0.1,
        radius: 0.2,
        class: month,
      }).addTo(mymap)
      circle.bindPopup(date + ' lat: '+ lat + 'lng' + lng)
    }
  }
}

function processCSVData(allText) {
  const allTextLines = allText.split(/\r\n|\n/)
  const headers = allTextLines[0].split(',')
  const lines = []
  for (let i = 1; i < allTextLines.length; i++) {
    const data = allTextLines[i].split(',')
    console.log( data[58] + ' '  + data[59])
    const EventData = { lat: data[59], lng: data[58], category: 'injury', month: data[5], day: data[6], hour: data[7] }
    addEventCircle(EventData)
 /*   if (data.length === headers.length) {
      const tarr = []
      for (let j = 0; j < headers.length; j++) {
        tarr.push(headers[j] + ':' + data[j])
      }
      lines.push(tarr)
    }
  }*/
  }
}
$(document).ready(function() {
  $.ajax({
    type: 'GET',
    url: './src/data/traffic10506.csv',
    dataType: 'text',
    success: function (data) { processCSVData(data)},
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
