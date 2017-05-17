// require('./partial/default.js')
// TODO: RequireJs

const d3 = window.d3
const Vue = window.Vue
const $ = window.$
const CountUp = window.CountUp;

((window) => {
  let DATA
  let features
  const densityOverColor = d3.scale.linear().domain([860, 13000]).range(['#ffb62a', '#503604'])
  const desktopMapVis = d3.select('.area-desktop-map').append('svg').attr('width', '100%').attr('height', $('.area-intro').height())
  const mobileMapVis = d3.select('.area-mobile-map').append('svg').attr('width', '100%').attr('height', $(window).height() * 0.35)
  const TAINAN = {}

  if ($(window).width() < 768) {
    $('#every-area').addClass('color-red p-font-600');
  }

  d3.csv('./src/data/population_xyz.csv', (data) => {
    // Data list (Vue)
    const tableVm = new Vue({
      delimiters: ['${', '}'],
      el: '#table-list',
      data: {
        dataArray: data,
      },
      computed: {
        descendPopulation: function() {
          const newArray = [...this.dataArray]
          return newArray.sort((a, b) => (
            parseFloat(b.population) - parseFloat(a.population)
          ))
        },
        descendDensity: function() {
          const newArray = [...this.dataArray]
          newArray.sort((a, b) => (
              parseFloat(b.density) - parseFloat(a.density)
            ))
            // 因為台南密度排在第13名，所以插一個台南的密度在最前面
          return [newArray[13], ...newArray]
        },
        descendMan: function() {
          const newArray = [...this.dataArray]
          return newArray.sort((a, b) => (
            parseFloat(b.man) - parseFloat(a.man)
          ))
        },
      },
    })

    const settings = {
      sexRatioSvg: {
        width: '80%',
        height: 30,
      },
      agesPramidSvg: {
        width: '100%',
        height: 300,
        rectY: 20,
        blocks: 15.8,
      },
    }

    const sexRatioSvg = d3.select('.sexRatioSvg')
      .append('svg')
      .attr('width', settings.sexRatioSvg.width)
      .attr('height', settings.sexRatioSvg.height)

    const agesPramidSvg = d3.select('.agesPramidSvg')
      .append('svg')
      .attr('width', settings.agesPramidSvg.width)
      .attr('height', settings.agesPramidSvg.height)

    //
    // sexRatioChart
    // ---------------
    const sexRatioSvgWidth = $('.sexRatioSvg').width() * 0.7
    const manRatioBar = sexRatioSvg
      .append('rect')
      .attr({
        'fill': 'rgb(63,169,245)',
        'width': 0,
        'height': 30,
        'x': 0,
        'y': 0,
      })

    const girlRatioBar = sexRatioSvg
      .append('rect')
      .attr({
        'fill': 'rgb(243,71,8)',
        'width': '0px',
        'height': 30,
        'x': (data[0].man / data[0].population) * sexRatioSvgWidth + 5,
        'y': 0,
      })

    sexRatioSvg
      .append('text')
      .attr({
        'x': (data[0].man / data[0].population) * sexRatioSvgWidth - 130,
        'y': 20,
        'id': 'num-man',
      })
      .text('男生約佔 50.1%')

    sexRatioSvg
      .append('text')
      .attr({
        'x': sexRatioSvgWidth - 125,
        'y': 20,
        'id': 'num-girl',
      })
      .text('女生約佔 49.9%')

    //
    // agesPramidChart
    // ---------------
    const agesData = transformAgesData(data)
    const basicRectHeight = parseFloat((settings.agesPramidSvg.height - 90) / settings.agesPramidSvg.blocks)

    const chartRow = agesPramidSvg.selectAll('g.pramidRow')
    .data(agesData.pramidData)

    const newPramidRow = chartRow
    .enter()
    .append('g')
    .attr('class', 'pramidRow')

    newPramidRow
    .append('rect')
      .attr('class', 'pramidBar')
      .attr('width', 0)
      .attr('height', (d) => {
        return d.block * basicRectHeight
      })
      .attr('y', (d, i) => {
        const restBlock = d.allBlocks - d.block
        let separateY = 0
        if (i >= 1) {
          separateY = 12
        }
        if (i >= 5) {
          separateY = 24
        }

        return (restBlock * basicRectHeight) + (i * 4) + separateY
      })
      .style('fill', (d, i) => {
        if (i === 0) {
          return '#165805'
        } else if (i >= 5) {
          return '#bbf99c'
        }
      })

    newPramidRow
    .append('text')
      .attr('class', 'label')
      .attr('dx', '.3em')
      .attr('dy', '.35em')
      .attr('x', (d, i) => {
        if (i === 5) {
          return (d.value * 10) + 300
        }
        return (d.value * 10) + 140
      })
      .attr('y', (d, i) => {
        const restBlock = d.allBlocks - d.block
        let separateY = 0
        if (i >= 1) {
          separateY = 12
        }
        if (i >= 5) {
          separateY = 24
        }

        return (restBlock * basicRectHeight) + (i * 4) + (d.block * basicRectHeight / 2) + separateY
      })
      .text(d => (`${d.range}:  ${d.value}%`))

    newPramidRow
    .append('path')
      .attr('d', (d, i) => {
        const restBlock = d.allBlocks - d.block
        let separateY = 0
        if (i >= 1) {
          separateY = 12
        }
        if (i >= 5) {
          separateY = 24
        }

        const x = d.value * 10
        const y = (restBlock * basicRectHeight) + (i * 4) + (d.block * basicRectHeight / 2) + separateY

        if (i === 5) {
          return `M ${x} ${y}, H ${x + 290}`
        }
        return `M ${x} ${y}, H ${x + 130}`
      })
      .attr('stroke', '#D7DAE1')

    $(document).scroll(() => {
      const st = $(window).scrollTop()
      if (st > ($('#X-element.report-section').offset().top - 300)) {
        manRatioBar
          .transition()
          .duration(1500)
          .attr('width', (data[0].man / data[0].population) * sexRatioSvgWidth)

        girlRatioBar
          .transition()
          .duration(1000)
          .attr('width', (data[0].girl / data[0].population) * sexRatioSvgWidth)
      }

      if (st > ($('#Y-element.report-section').offset().top - 300)) {
        newPramidRow.selectAll('rect')
        .transition()
        .duration(() => {
          const random = Math.random() + 0.3
          return random * 900
        })
          .attr('width', (d) => (d.value * 10))

        newPramidRow.selectAll('path')
        .transition()
        .delay(500)
        .duration(300)
          .style('opacity', 1)

        newPramidRow.selectAll('text')
        .transition()
        .delay(500)
        .duration(300)
          .style('opacity', 1)
      }
    })

    // Set DATA
    DATA = transformData(data)

    function transformAgesData(array){
      return {
        sexRatio: parseFloat(array[0].sexRatio),
        zero_fourteen_num: parseFloat(array[0].zero_fourteen_num),
        fifteen_sixtyFour_num: parseFloat(array[0].fifteen_sixtyFour_num),
        sixtyFiveUp_num: parseFloat(array[0].sixtyFiveUp_num),
        zero_fourteen_percent: parseFloat(array[0].zero_fourteen_percent),
        fifteen_sixtyFour_percent: parseFloat(array[0].fifteen_sixtyFour_percent),
        sixtyFiveUp_percent: parseFloat(array[0].sixtyFiveUp_percent),
        pramidData: [{
          range: '65歲以上',
          block: 4,
          allBlocks: 4,
          value: parseFloat(array[0].sixtyFiveUp_percent),
        }, {
          range: '51 ~ 64歲',
          block: 3,
          allBlocks: 7,
          value: parseFloat(array[0].fiftyOne_sixtyFour_percent),
        }, {
          range: '31 ~ 50歲',
          block: 4,
          allBlocks: 11,
          value: parseFloat(array[0].thirtyOne_fifty_percent),
        }, {
          range: '19 ~ 30歲',
          block: 2,
          allBlocks: 13,
          value: parseFloat(array[0].nighteen_thirty_percent),
        }, {
          range: '16 ~ 18歲',
          block: 0.3,
          allBlocks: 13.3,
          value: parseFloat(array[0].sixteen_eighteen_percent),
        }, {
          range: '13 ~ 15歲',
          block: 0.3,
          allBlocks: 13.6,
          value: parseFloat(array[0].thirteen_fifteen_percent),
        }, {
          range: '6 ~ 12歲',
          block: 1.2,
          allBlocks: 14.8,
          value: parseFloat(array[0].six_twelve_percent),
        }, {
          range: '0 ~ 5歲',
          block: 1,
          allBlocks: 15.8,
          value: parseFloat(array[0].zero_five_percent),
        }],
      }
    }

    function transformData (array) {
      const obj = {}
      TAINAN.population = parseFloat(array[0].population)
      TAINAN.density = parseFloat(array[0].density)
      TAINAN.man = parseFloat(array[0].man)
      TAINAN.girl = parseFloat(array[0].girl)
      TAINAN.sexRatio = parseFloat(array[0].sexRatio)

      TAINAN.zero_fourteen_num = parseFloat(array[0].zero_fourteen_num)
      TAINAN.fifteen_sixtyFour_num = parseFloat(array[0].fifteen_sixtyFour_num)
      TAINAN.sixtyFiveUp_num = parseFloat(array[0].sixtyFiveUp_num)

      TAINAN.zero_fourteen_percent = parseFloat(array[0].zero_fourteen_percent)
      TAINAN.fifteen_sixtyFour_percent = parseFloat(array[0].fifteen_sixtyFour_percent)
      TAINAN.sixtyFiveUp_percent = parseFloat(array[0].sixtyFiveUp_percent)

      TAINAN.zero_five_percent = parseFloat(array[0].zero_five_percent)
      TAINAN.six_twelve_percent = parseFloat(array[0].six_twelve_percent)
      TAINAN.thirteen_fifteen_percent = parseFloat(array[0].thirteen_fifteen_percent)
      TAINAN.sixteen_eighteen_percent = parseFloat(array[0].sixteen_eighteen_percent)
      TAINAN.nighteen_thirty_percent = parseFloat(array[0].nighteen_thirty_percent)
      TAINAN.thirtyOne_fifty_percent = parseFloat(array[0].thirtyOne_fifty_percent)
      TAINAN.fiftyOne_sixtyFour_percent = parseFloat(array[0].fiftyOne_sixtyFour_percent)

      array.forEach((value) => {
        const valueDensity = parseFloat(value.density)
        obj[value.area.replace(/\s/ig, '')] = {
          isDensityOver: (valueDensity > TAINAN.density),
          density: formatFloat(valueDensity, 0),
        }
      })
      return obj
    }
  })

  d3.json('./src/data/tainan-town.topo.json', (topodata) => {
    const path = d3.geo.path().projection(
      // 路徑產生器
      d3.geo.mercator().center([120.72, 23.1]).scale(35000),
    )
    features = topojson.feature(topodata, topodata.objects.tainan).features

    desktopMapVis.selectAll('path').data(features)
      .enter().append('path')
      .attr({
        'd': path,
        'fill': (d) => {
          const areaName = d.properties.TOWNNAME
          if (DATA[areaName].isDensityOver) {
            return densityOverColor(DATA[areaName].density)
          }
          return '#D7DAE1'
        },
        'stroke': 'white',
        'stroke-width': '1.5px',
      })
      .on('mouseover', function(d) {
        const areaName = d.properties.TOWNNAME
        const density = DATA[areaName].density

        d3.select(this)
          .style({
            'stroke': '#333',
            'stroke-width': '6px',
          })
        $('.intro-area').html(areaName)
        $('#intro-population-percent').html(`${DATA[areaName].populationPercent}%`)
        $('#intro-density').html(density)

        if (DATA[areaName].isDensityOver) {
          $('#intro-density').addClass('p-font-600 color-red')
        } else {
          $('#intro-density').removeClass('p-font-600 color-red')
        }
      })
      .on('mouseleave', function(d) {
        d3.select(this)
          .style({
            'stroke': 'white',
            'stroke-width': '1.5px',
          })
      })
  })

  // Mobile select map func.
  const selectAreaMap = (area) => {
    mobileMapVis.selectAll('*').remove()

    const path = d3.geo.path().projection(
      // 路徑產生器
      d3.geo.mercator().center([121.55, 22.58]).scale(16000),
    )
    mobileMapVis.selectAll('path').data(features)
      .enter().append('path')
      .attr({
        'd': path,
        'fill': (d) => {
          const areaName = d.properties.TOWNNAME
          if (areaName === area) {
            return '#FFAA0A'
          }
          return '#D7DAE1'
        },
        'stroke': 'white',
        'stroke-width': '1.5px',
      })

    const density = DATA[area].density
    $('#mobile-area').text(area)
    $('#mobile-population-percent').html(`&nbsp;${DATA[area].populationPercent}%&nbsp;`)
    $('#mobile-density').html(`&nbsp;${density}&nbsp;`)

    if (DATA[area].isDensityOver) {
      $('#mobile-density').addClass('p-font-600 color-red')
    } else {
      $('#mobile-density').removeClass('p-font-600 color-red')
    }
  }

  $('.ui.dropdown')
    .dropdown({
      onChange: (value, text) => {
        $('#map-modal').modal('show')
        selectAreaMap(text)
          // console.log(value, text, $selectedItem)
      },
    })
  $('.ui.pointing.menu .item').click(function() {
    const showContainer = $(this).data('container')
    $('.container.active').removeClass('active')
    $(`.${showContainer}`).addClass('active')

    $('.item.active').removeClass('active')
    $(this).addClass('active')
  })

})(window)
