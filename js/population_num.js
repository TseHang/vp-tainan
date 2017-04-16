// require('./partial/default.js')
// TODO: RequireJs
const d3 = window.d3;
const Vue = window.Vue;

((window) => {
  const vis = d3.select('.area-map').append('svg').attr('width', 800).attr('height', 600)
  $('.ui.dropdown')
    .dropdown({
      onChange: (value, text, $selectedItem) => {
        $('#map-modal').modal('show')
      },
    })
  $('.ui.pointing.menu .item').click(() => {
    const showContainer = $(this).data('container')
    $('.container.active').removeClass('active')
    $(`.${showContainer}`).addClass('active')

    $('.item.active').removeClass('active')
    $(this).addClass('active')
  })

  d3.json('./src/data/tainan-town.topo.json', (topodata) => {
    const features = topojson.feature(topodata, topodata.objects.tainan).features
    const path = d3.geo.path().projection( // 路徑產生器
      d3.geo.mercator().center([120.25, 23.15]).scale(50000),
    )
    vis.selectAll('path').data(features)
      .enter().append('path')
      .attr({
        'd': path,
        'fill': (d) => {
          if (d.properties.TOWNNAME) {
            // console.log(d.properties.TOWNNAME)
            return '#D7DAE1'
          }
          return 'yellow'
        },
      })
      .on('mouseover', (d) => {
        $(this).css('opacity', .5)
      })
  })
  d3.csv('./src/data/population_num.csv', (data) => {
    const tableVm = new Vue({
      delimiters: ['${', '}'],
      el: '#table-list',
      data: {
        dataArray: data,
      },
      computed: {
        descendPopulation: function () {
          const newArray = [...this.dataArray]
          return newArray.sort((a, b) => (
            parseInt(b.population.replace(/,/ig, ''), 10) - parseInt(a.population.replace(/,/ig, ''), 10)
          ))

          // filter 只是過濾，並不會改變數組....等等等
          // return this.dataArray.filter(function(item){
          //   const transformNum = parseInt(item.population.replace(/,/ig, ''))
          //   return transformNum > 100000
          // })
        },
        descendDensity: function () {
          const newArray = [...this.dataArray]
          newArray.sort((a, b) => (
            parseInt(b.density.replace(/,/ig, ''), 10) - parseInt(a.density.replace(/,/ig, ''), 10)
          ))

          // 因為台南密度排在第13名，所以插一個台南的密度在最前面
          return [newArray[13], ...newArray]
        },
        descendLand: function () {
          const newArray = [...this.dataArray]
          return newArray.sort((a, b) => (
            parseInt(b.land.replace(/,/ig, ''), 10) - parseInt(a.land.replace(/,/ig, ''), 10)
          ))
        },
      },
    })
  })
})(window)
