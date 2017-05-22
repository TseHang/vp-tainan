// require('./partial/default.js')
// TODO: RequireJs
const d3 = window.d3
const Vue = window.Vue
const $ = window.$;

((window) => {
  let DATA
  let features
  const densityOverColor = d3.scale.linear().domain([860, 13000]).range(['#ffb62a', '#503604'])
  const desktopVis = d3.select('.area-desktop-map').append('svg').attr('width', '100%').attr('height', $('.area-intro').height())
  const mobileVis = d3.select('.area-mobile-map').append('svg').attr('width', '100%').attr('height', $(window).height() * 0.35)
  const TAINAN = {}
  const densityScope = {
    topHigh: 10000,
    high: 5000,
    middle: 1000,
    little: 750,
  }
  const commentWord = {
    topHigh: {
      comment: '就像這行字一樣你說擠不擠擠不擠擠不擠擠不擠擠不擠擠不擠擠不擠擠不擠擠不擠擠不擠擠不擠擠不擠擠不擠擠不擠擠不擠擠不擠擠不擠擠不擠擠不擠擠不擠擠不擠擠不擠擠不擠擠不擠擠不擠擠不擠擠不擠擠不擠擠不擠',
      word: '這整整高出平均13倍以上啊！',
    },
    high: {
      comment: '就像剛進入熱戀期的情侶一樣，距離愈變愈近，手腳愈來愈快...',
      word: '完蛋！要警覺啊！',
    },
    middle: {
      comment: '就像一種活在悠閒大都市的感覺吧！有時慢活，有時擁擠 ',
      word: '以平均來說，還算不錯吧！',
    },
    little: {
      comment: '就像是剛做好的鮪魚蛋土司，不油不膩，空間舒適度相對來說 ',
      word: '相當不錯呢！',
    },
    less: {
      comment: '就像加長型King-Size總統套房彈簧床，怎麼滾都滾不到盡頭的那種... ',
      word: '人呢？好像不怎麼熱鬧啊...',
    },
  }

  const changeComment = (comment, word) => {
    $('#intro-comment').text(comment)
    $('#intro-word').text(word)

    $('#mobile-comment').text(comment)
    $('#mobile-word').text(word)
  }

  const setComment = (density) => {
    if (density >= densityScope.topHigh) {
      changeComment(commentWord.topHigh.comment, commentWord.topHigh.word)
    } else if (density >= densityScope.high) {
      changeComment(commentWord.high.comment, commentWord.high.word)
    } else if (density >= densityScope.middle) {
      changeComment(commentWord.middle.comment, commentWord.middle.word)
    } else if (density >= densityScope.little) {
      changeComment(commentWord.little.comment, commentWord.little.word)
    } else {
      changeComment(commentWord.less.comment, commentWord.less.word)
    }
  }

  if ($(window).width() < 768) {
    $('#every-area').addClass('color-red p-font-600');
  }

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
            parseFloat(b.population.replace(/,/ig, '')) - parseFloat(a.population.replace(/,/ig, ''))
          ))

          // filter 只是過濾，並不會改變數組....等等等
          // return this.dataArray.filter(function(item){
          //   const transformNum = parseFloat(item.population.replace(/,/ig, ''))
          //   return transformNum > 100000
          // })
        },
        descendDensity: function () {
          const newArray = [...this.dataArray]
          newArray.sort((a, b) => (
            parseFloat(b.density.replace(/,/ig, '')) - parseFloat(a.density.replace(/,/ig, ''))
          ))
          // 因為台南密度排在第13名，所以插一個台南的密度在最前面
          return [newArray[13], ...newArray]
        },
        descendLand: function () {
          const newArray = [...this.dataArray]
          return newArray.sort((a, b) => (
            parseFloat(b.land.replace(/,/ig, '')) - parseFloat(a.land.replace(/,/ig, ''))
          ))
        },
      },
    })

    const transformData = (array) => {
      const obj = {}
      TAINAN.population = parseFloat(array[0].population.replace(/,/ig, ''))
      TAINAN.land = parseFloat(array[0].land.replace(/,/ig, ''))
      TAINAN.density = parseFloat(array[0].density.replace(/,/ig, ''))

      array.forEach((value) => {
        const valuePopulation = parseFloat(value.population.replace(/,/ig, ''))
        const valueLand = parseFloat(value.land.replace(/,/ig, ''))
        const valueDensity = parseFloat(value.density.replace(/,/ig, ''))
        obj[value.area.replace(/\s/ig, '')] = {
          numberHold: value.numberHold,
          isDensityOver: (valueDensity > TAINAN.density),
          density: formatFloat(valueDensity, 0),
          landPercent: formatFloat((valueLand / TAINAN.land) * 100, 1),
          populationPercent: formatFloat((valuePopulation / TAINAN.population) * 100, 1),
        }
      })
      return obj
    }

    DATA = transformData(data)
  })

  d3.json('./src/data/tainan-town.topo.json', (topodata) => {
    const path = d3.geo.path().projection(
      // 路徑產生器
      d3.geo.mercator().center([120.72, 23.1]).scale(35000),
    )
    features = topojson.feature(topodata, topodata.objects.tainan).features

    desktopVis.selectAll('path').data(features)
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
      .on('mouseover', function (d) {
        const areaName = d.properties.TOWNNAME
        const density = DATA[areaName].density

        d3.select(this).style('fill-opacity', .4)
          // .style({
          //   'stroke': '#333',
          //   'stroke-width': '6px',
          // })
        $('.intro-area').html(areaName)
        $('#intro-population-percent').html(`${DATA[areaName].populationPercent}%`)
        $('#intro-land-percent').html(`${DATA[areaName].landPercent}%`)
        $('#intro-density').html(density)

        // set CommentWord
        setComment(density)

        if (DATA[areaName].isDensityOver) {
          $('#intro-density').addClass('p-font-600 color-red')
        } else {
          $('#intro-density').removeClass('p-font-600 color-red')
        }
      })
      .on('mouseleave', function (d) {
        d3.select(this)
          .style('fill-opacity', 1)
      })
  })

  // Mobile select map func.
  const selectAreaMap = (area) => {
    mobileVis.selectAll('*').remove()

    const path = d3.geo.path().projection(
      // 路徑產生器
      d3.geo.mercator().center([121.55, 22.58]).scale(16000),
    )
    mobileVis.selectAll('path').data(features)
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
    $('#mobile-land-percent').html(`&nbsp;${DATA[area].landPercent}%&nbsp;`)
    $('#mobile-density').html(`&nbsp;${density}&nbsp;`)

    setComment(density)

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
  $('.ui.pointing.menu .item').click(function () {
    const showContainer = $(this).data('container')
    $('.container.active').removeClass('active')
    $(`.${showContainer}`).addClass('active')

    $('.item.active').removeClass('active')
    $(this).addClass('active')
  })

})(window)
