const mymap = L.map('accidentMap').setView([22.98877766803278, 120.21154403686522], 15)

L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png', {
  			 maxZoom: 18,
  			 attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, &copy;<a href="https://carto.com/attribution">CARTO</a>'
 }).addTo(mymap)
