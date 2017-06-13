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
 // var svgWidth = 300;
  var svgHeight = 300;
  //var totalWidth = svgWidth + 300;
  var totalHeight = svgHeight + 150;
  //var radius = Math.min(svgWidth, svgHeight) / 2;
  var radius = svgHeight / 2;
  var recSize = 18;
  var thickness = 25;
  

  var tmpWidth = 0;

  var svg = d3.select('#pieChart')
      .append('svg')
      .attr('width', '100%')
      .attr('height', totalHeight);
      //.append('g')
      // .attr('display', 'block')
      // .attr('margin', 'auto');
      //.attr('transform', 'translate(' + 300 + ',' + (svgHeight * 2 / 3) + ')')
      //.attr('transform', 'translate(' + $('svg').width() / 2  + ',' + (svgHeight * 2 / 3) + ')');
      

  var arc = d3.svg.arc()
      .innerRadius(radius - thickness)
      .outerRadius(radius);

  
  var pieSvg = svg.append('g')
                .attr('id', 'pieSvg')
                .attr('class', 'pie-svg')
                .attr('transform', 'translate(' + $('svg').width() / 2  + ',' + (svgHeight * 2 / 3 + 10)  + ')');
                //.attr('display', 'none');

  pieSvg.append('g')
      .append('circle')
      .attr('cx', 0)
      .attr('cy', 0)
      .attr('r', (svgHeight - thickness - 50) / 2)
      .attr('fill', 'none')
      .attr('stroke', '#BEBEBE')
      .attr('stroke-width', 3);
      

  pieSvg.append("g")
    .attr("class", "lines");

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
    //var color = d3.scale.category20c();

    var colorLabel = [];

    data.forEach(function(d) {
      colorLabel.push(d.event);
    });
    var color = d3.scale.ordinal()
                //.domain(['未領有駕照駕車','未戴安全帽','酒精濃度超過規定標準者','行車速度超速60公里以下','爭道行駛','不依規定轉彎或變換車道','闖紅燈直行左轉','闖紅燈右轉','違規臨時停車','違規停車','停車時間位置方式車種不依規定','併排停車','其他不遵守標誌標線號誌駕車','違規停車拖吊'])
                //.domain([1, 14])
                //.range(['#FFB6C1', '#66CDAA', '#87CEFA', '#48D1CC', '#7B68EE', '#F4A460', '#ADD8E6', '#CA8EC2', '#81C0C0', '#8080C0', '#FFBB77', '#AAAAFF', '#FF79BC', '#FFAD86']);
                .domain(colorLabel)
                .range(['#4F9D9D', '#95CACA', '#5A5AAD', '#A6A6D2', '#C07AB8', '#FFAD86', '#FF95CA', '#00E3E3', '#009393', '#46A3FF', '#66CDAA', '#8600FF', '#CA8EFF', '#FFB5B5'])
                //.range(['#4169E', '#1E90FF', '#ADD8E6', '#40E0D0', '#87CECB', '#FFDAB9', '#FFA07A', '#CD5C5C', '#D87093', '#FF69B4', '#FFB6C1', '#DDA0DD', '#9370DB', '#6A5ACD']);


    data.forEach(function(d) {
      d.times = +d.times;
    });

    var path = pieSvg.selectAll('path')
        .data(pie(data))
        .enter()
        .append('path')
        .attr('d', arc)
        .attr('fill', function(d, i) { 
          return color(d.data.event); 
        });


    tooltip.select('.event').html('<h1 class="tooltip-title">舉發總件數</h1><div class="title-line"></div>');
    tooltip.select('.times').html('370,040 件');

    var total = d3.sum(data.map(function(d) {
      return d.times;
    }));
    path.on('mouseover', function(d) {

      var percent = Math.round(1000 * d.data.times / total) / 10;
      var _comma = d3.format(",");

      tooltip.select('.event').html('<h1 class="tooltip-title">' + d.data.event + '</h1><div class="title-line"></div>');
      tooltip.select('.times').html(_comma(d.data.times) + ' 件');
      tooltip.select('.percent').html(percent + '%');

    });
    
    path.on('mouseout', function() {
      tooltip.select('.event').html('<h1 class="tooltip-title">舉發總件數</h1><div class="title-line"></div>');
      tooltip.select('.times').html('370,040 件');
      tooltip.select('.percent').html('');
    });

    /* label */
    var g = pieSvg.append("g").attr("transform", "translate(" + 0/ 2 + "," + 0/ 2 + ")");

    var radius2 = (svgHeight + 100) / 2;

    var arc2 = d3.svg.arc()
      .innerRadius(radius2 * 0.6)
      .outerRadius(radius2 * 0.8);
      
    var outerArc2 = d3.svg.arc()
      .innerRadius(radius2 * 0.95)
      .outerRadius(radius2 * 0.95);


    function midAngle(d) {
      return d.startAngle + (d.endAngle - d.startAngle) / 2;
    }

    g.selectAll("text").data(pie(data))
      .enter()
      .append("text")
      .attr("class", "label-style")
      .attr("transform", function(d){

        var pos = outerArc2.centroid(d);
        pos[0] = radius2 * (midAngle(d) < Math.PI ? 1 : -1);
        return "translate("+ pos +")";
      })
      .attr("text-anchor", function(d){
        var direction = midAngle(d) < Math.PI ? 1 : -1;
        if(direction === -1){
          return "end";
        }
        else{
          return "start";
        }
      })
      .text(function(d) {
        var total = d3.sum(data.map(function(d) {
          return d.times;
        }));
        var percent = Math.round(1000 * d.data.times / total) / 10;
        return d.data.event + ' ' + percent + '%';
      });
    /* polyline */

    var polyline = g.selectAll("polyline")
      .data(pie(data), function(d) {
        return d.data.event;
      })
      .enter()
      .append("polyline")
      .attr("points", function(d) {
        var pos = outerArc2.centroid(d);
            pos[0] = radius2 * 0.95 * (midAngle(d) < Math.PI ? 1 : -1);
            
        return [arc2.centroid(d), outerArc2.centroid(d), pos];
      });

   
    var dataSort = data.sort(function(a,b){return b.times - a.times;});

    var legend = svg.append('g')
        .attr('id', 'legendSvg')
        .attr('class', 'legend-svg')
        .attr('transform', 'translate(' + ($('svg').width() / 2 - 170 )  + ',' + 180  + ')')
        .selectAll('.legend-style') 
        .data(dataSort)
        .enter()
        .append('g')
        .attr('class', 'legend-style')
        .attr('transform', function(d, i) {
          var height = recSize + 8;
          var offset =  height * dataSort.length / 2;
          var vert = i * height - offset + 10;
          return 'translate(' + 0 + ',' + vert + ')';
        });


    legend.append('rect')
      .attr('width', recSize)
      .attr('height', recSize)                                   
      .style('fill', function(d){
        return color(d.event);
      })
      .style('stroke', function(d){
        return color(d.event);
      });
      
    legend.append('text')
      .attr('x', recSize + 10)
      .attr('y', recSize - 4)
      .text(function(d) { 
        var percent = Math.round(1000 * d.times / total) / 10;
        return d.event + ' ' + percent + '%'; 
      });

    //$( window ).resize(function() {
      

      // if(!isMobile){
      //   $('#pieSvg').show();
      //   $('#legendSvg').hide();
      // }
      // if(isMobile){
      //   $('#pieSvg').hide(); 
      //   $('#legendSvg').show();     
      // }
   // });

  });
})(window.d3);

var vm = new Vue({
    el: '#fineCreator',
    data: {
      eventData: [],
      setList: [],
      idEventData: {},
      selectId: [],
      selectName: [],
      fineList: [],
      fineTotal: 0,
      fineData: []
    },
    delimiters: ['${', '}'],
    created: function(){
        jQuery.get('/src/data/trafficFineSelect.json', function(data) {
          vm.eventData = data

          $.each(vm.eventData, function (key, data) {
            vm.idEventData[data.id] = data.category 
          })
        });
        jQuery.get('/src/data/trafficFineChart.json', function(data) {
          vm.fineData = data
        });
    },
    methods: {
      addSetting: function(id){
        this.setList.push(this.idEventData[id]);

        var tmpName = []
        var tmpId = []
        $.each(this.idEventData[id], function (index, data) {
          tmpName.push({ 'x': data.category[0].name})
          tmpId.push(data.category[0].id)
        })

        this.selectName.push(tmpName)
        this.selectId.push(tmpId)

        this.addFine(tmpId, -1)

      },
      changeSelectId: function(index1, index2, setId){
        this.selectId[index1][index2] = setId
        this.addFine(this.selectId[index1], index1)
      },
      addFine: function(tmpId, state){
        $.each(this.fineData, function (index, data) {
          var diff = $(data.all_id).not(tmpId).get();
          if(diff.length === 0){
            if(state === -1){// initial
              vm.fineList.push(data.fine)
            }
            else{
              vm.fineList[state] = data.fine
            }
            return false
          }
        })        
      },
      removeItem: function(index){
        this.fineList.splice(index, 1)
        this.selectId.splice(index, 1)
        this.selectName.splice(index, 1)
        this.setList.splice(index, 1)
      }
    }

});




