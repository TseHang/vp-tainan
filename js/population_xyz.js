// require('./partial/default.js')
// TODO: RequireJs

const d3 = window.d3
const Vue = window.Vue
const $ = window.$;

((window) => {
  let DATA
  let features
  const densityOverColor = d3.scale.linear().domain([860, 13000]).range(['#ffb62a', '#503604'])
  const desktopMapVis = d3.select('.area-desktop-map').append('svg').attr('width', '100%').attr('height', $('.area-intro').height())
  const mobileMapVis = d3.select('.area-mobile-map').append('svg').attr('width', '100%').attr('height', $(window).height() * 0.35)
  const isMobile = ($(window).width() < 768) ? true : false
  const TAINAN = {}
  const densityScope = {
    high: 10000,
    middle: 1000,
    little: 750,
  }

  const setDensity = (density) => {
    if (density >= densityScope.high) {
      return '極高'
    } else if (density >= densityScope.middle) {
      return '高'
    } else if (density >= densityScope.little) {
      return '介於平均值附近'
    } else {
      return '低於平均值'
    }
  }

  if (isMobile) {
    $('#tainan-every-area').addClass('color-red p-font-600');
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
      populationChangeSvg: {
        width: '100%',
        height: 80,
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

    const populationChangeSvg = d3.select('.populationChangeSvg')
      .append('svg')
      .attr('width', settings.populationChangeSvg.width)
      .attr('height', settings.populationChangeSvg.height)

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
        'x': parseFloat(data[0].man.replace(/,/ig, '')) / parseFloat(data[0].population.replace(/,/ig, '')) * sexRatioSvgWidth + 5,
        'y': 0,
      })

    sexRatioSvg
      .append('text')
      .attr({
        'x': (parseFloat(data[0].man.replace(/,/ig, '')) / parseFloat(data[0].population.replace(/,/ig, ''))) * sexRatioSvgWidth - 130,
        'y': 20,
        'id': 'num-man',
      })
      .text('男生約佔 50.01%')

    sexRatioSvg
      .append('text')
      .attr({
        'x': sexRatioSvgWidth - 125,
        'y': 20,
        'id': 'num-girl',
      })
      .text('女生約佔 49.99%')

    //
    // agesPramidChart
    // ---------------
    const agesData = _transformAgesData(data)
    const basicRectHeight = parseFloat((settings.agesPramidSvg.height - 90) / settings.agesPramidSvg.blocks)

    const pramidChartRow = agesPramidSvg.selectAll('g.pramidRow')
      .data(agesData)

    const newPramidRow = pramidChartRow
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
      .on('mouseover', function (d, i) {
        d3.select(this)
          .style('opacity', 0.5)

        switch (i) {
          case 0:
            $('.pramidIntroText').html('「老人不講古，後生會失譜。」<br>台南的國寶級人物，生命就象徵著文化與歷史。盡力傳頌吧～這些偉大的故事！'); break
          case 1:
            $('.pramidIntroText').html('「用知識武裝自己，去實現人生的最高價值。」<br>在人生的分水嶺中，別放棄心中那個曾經擁有夢想，天真無邪的自己。'); break
          case 2:
            $('.pramidIntroText').html('「在真正的生命裡，每一樁偉業都由信念開始，並由信念跨出第一步。」<br>現任的社會中堅，處在瞬息萬變的時代所造成的資訊衝突是很巨大的，莫怕改變，勇於嘗試，堅持下去。'); break
          case 3:
            $('.pramidIntroText').html('「命運只有自己能掌握。」<br>如果說台灣就像一灘自由自在的死水，但我們是自由自在活生生的台灣人，我們可以靠自己來改變。'); break
          case 4:
            $('.pramidIntroText').html('「享受你的青春！但也別忘記自己該有的責任。」<br>它象徵著我要對於自己，對於自己愛的人做出點什麼，因為我即將成為一個能獨立承當責任的成人，而再也不是一個處處受人照應的孩童了。'); break
          case 5:
            $('.pramidIntroText').html('「學習是學生的責任，它不是我的負擔，也不是痛苦的來源，它是自我的舞台。」<br>但別屈服於分數的權威體制下，做自己的主人翁。'); break
          case 6:
            $('.pramidIntroText').html('「保護眼睛，每天只能用30分鐘電腦或平板喔^^」<br>這麼小就用科技產品，要顧好眼睛啊！'); break
          case 7:
            $('.pramidIntroText').html('「哇嗚哇嗚啊～爸爸媽媽們辛苦了！」<br>我們假設你還看不懂中文字，所以對爸爸媽媽辛苦的幫你翻譯，說聲辛苦了！'); break
          default:
            $('.pramidIntroText').text('')
        }
      })
      .on('mouseleave', function () {
        d3.select(this)
          .style('opacity', 1)

        $('#pramidIntroText').text('')
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

    //
    // populationChangeSvg
    // ---------------
    const populationData = _transformPopulationData(data)
    let populationChartRow = populationChangeSvg.selectAll('g.populationRow')
      .data(populationData.naturalData)
    let newNumber = [0, 0]

    const newPopulationChart = populationChartRow
      .enter()
      .append('g')
      .attr('class', 'populationRow')

    const barMax = d3.max([...populationData.naturalData, ...populationData.socialData], (d) => d.value) + 2000
    const populationX = d3.scale.linear()
      .domain([0, barMax])
      .range([0, $('.populationChangeSvg').width() * 0.7])

    newPopulationChart
      .append('rect')
      .attr('width', 0)
      .attr('height', '30px')
      .attr('y', (d, i) => i * 40)
      .attr('x', '0')
      .attr('fill', (d, i) => {
        if (i === 0) {
          return '#FFAA0A'
        }
        return '#542801'
      })
    .transition()
      .duration(1000)
      .delay(800)
      .attr('width', d => populationX(d.value))

    newPopulationChart
      .append('text')
      .attr('x', 10)
      .attr('y', (d, i) => (i * 40) + 15)
      .attr('dy', '.3em')
      .attr('class', 'population-name-text')
      .text(d => d.name)

    newPopulationChart
      .append('text')
      .attr('x', 15)
      .attr('y', (d, i) => (i * 40) + 15)
      .attr('dy', '.35em')
      .attr('class', 'num-text')
      .text('0')
    .transition()
      .duration(1000)
      .delay(800)
      .tween('num-text', (d, i) => {
        const tmp = d3.interpolateRound(newNumber[i], d.value)
        newNumber[i] = d.value
        return function (t) {
          this.setAttribute('x', populationX(tmp(t)) + 15)
          this.textContent = `${tmp(t)} 人`
        }
      })

    $(document).scroll(() => {
      const st = $(window).scrollTop()
      if (st > ($('#X-element.report-section').offset().top - 300)) {
        manRatioBar
          .transition()
          .duration(1500)
          .attr('width', (parseFloat(data[0].man.replace(/,/ig, '')) / parseFloat(data[0].population.replace(/,/ig, ''))) * sexRatioSvgWidth)

        girlRatioBar
          .transition()
          .duration(1000)
          .attr('width', (parseFloat(data[0].girl.replace(/,/ig, '')) / parseFloat(data[0].population.replace(/,/ig, ''))) * sexRatioSvgWidth)
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

    let isBorn = true
    $('.btn-change-population-data').click(() => {
      if (isBorn) {
        $('.btn-change-population-data').text('點我看 出生 / 死亡')
      } else {
        $('.btn-change-population-data').text('點我看 移入 / 移出')
      }
      _transitionPopulationBar(populationData, !isBorn)
      isBorn = !isBorn
    })

    // transform data
    DATA = _transformData(data)
    console.log(DATA, TAINAN)

    function _transitionPopulationBar(populationData, isBorn) {
      const newData = (isBorn) ? populationData.naturalData : populationData.socialData
      populationChangeSvg
      .selectAll('.population-name-text')
      .data(newData)
      .transition()
      .duration(100)
        .text((d, i) => {
          if (i === 0) {
            $('#top-bar').text(d.name)
          } else if (i === 1) {
            $('#bottom-bar').text(d.name)
          }
          return d.name
        })

      populationChangeSvg
      .selectAll('rect')
      .data(newData)
      .transition()
      .duration(1000)
        .attr('width', d => populationX(d.value))

      populationChangeSvg
      .selectAll('.num-text')
      .data(newData)
      .transition()
      .duration(1000)
        .tween('num-text', (d, i) => {
          const tmp = d3.interpolateRound(newNumber[i], d.value)
          newNumber[i] = d.value

          if ((newNumber[0] - newNumber[1]) < 0) {
            $('#support-diff').addClass('color-red')
          } else {
            $('#support-diff').removeClass('color-red')
          }
          $('#support-diff').text(`${newNumber[0] - newNumber[1]} 人`)
          return function (t) {
            const timeValue = tmp(t)
            this.setAttribute('x', populationX(timeValue) + 15)
            this.textContent = `${timeValue} 人`
          }
        })
    }

    function _transformAgesData(array) {
      return [{
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
      }]
    }

    function _transformPopulationData(array) {
      return {
        naturalNum: array[0].naturalIncrease_num,
        naturalPercent: parseFloat(array[0].naturalIncrease_percent),
        societyNUm: array[0].society_num,
        societyPercent: parseFloat(array[0].society_percent),
        naturalData: [{
          name: '出生數',
          value: parseFloat(array[0].born_num.replace(/,/ig, '')),
        }, {
          name: '死亡數',
          value: parseFloat(array[0].death_num.replace(/,/ig, '')),
        }],
        socialData: [{
          name: '移入數',
          value: parseFloat(array[0].immigration_num.replace(/,/ig, '')),
        }, {
          name: '移出數',
          value: parseFloat(array[0].leaving_num.replace(/,/ig, '')),
        }],
      }
    }

    function _transformData(arrayData) {
      const obj = {}
      const array = [...arrayData]

      TAINAN.population = array[0].population
      TAINAN.density = parseFloat(array[0].density)
      TAINAN.man = array[0].man
      TAINAN.girl = array[0].girl
      TAINAN.sexRatio = parseFloat(array[0].sexRatio)
      TAINAN.raiseRatio = parseFloat(array[0].sexRatio)

      TAINAN.zero_fourteen_num = array[0].zero_fourteen_num
      TAINAN.fifteen_sixtyFour_num = array[0].fifteen_sixtyFour_num
      TAINAN.sixtyFiveUp_num = array[0].sixtyFiveUp_num
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

      TAINAN.naturalIncrease_num = array[0].naturalIncrease_num
      TAINAN.naturalIncrease_percent = parseFloat(array[0].naturalIncrease_percent)
      TAINAN.marry_num = array[0].marry_num
      TAINAN.marry_percent = parseFloat(array[0].marry_percent)
      TAINAN.divorce_num = array[0].divorce_num
      TAINAN.divorce_percent = parseFloat(array[0].divorce_percent)
      TAINAN.born_num = array[0].born_num
      TAINAN.death_num = array[0].death_num
      TAINAN.immigration_num = array[0].immigration_num
      TAINAN.leaving_num = array[0].leaving_num
      TAINAN.society_num = array[0].society_num
      TAINAN.society_percent = parseFloat(array[0].society_percent)

      array.forEach((value) => {
        const valuePopulation = parseFloat(value.population.replace(/,/ig, ''))
        const valueDensity = parseFloat(value.density)
        const zeroFourteenPercent = parseFloat(value.zero_fourteen_percent)
        const fifteenSixtyFourPercent = parseFloat(value.fifteen_sixtyFour_percent)
        const sixtyFiveUpPercent = parseFloat(value.sixtyFiveUp_percent)
        const sexRatio = parseFloat(value.sexRatio)
        const raiseRatio = parseFloat(value.raiseRatio)
        obj[value.area.replace(/\s/ig, '')] = {
          isDensityOver: (valueDensity > TAINAN.density),
          density: formatFloat(valueDensity, 0),
          populationPercent: formatFloat((valuePopulation / parseFloat(TAINAN.population.replace(/,/ig, ''))) * 100, 1),
          zeroFourteenPercent,
          fifteenSixtyFourPercent,
          sixtyFiveUpPercent,
          raiseRatio,
          sexRatio,
        }
      })
      return obj
    }
  })

  //
  // draw Map
  // -----------
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
      .on('mouseover', function (d) {
        const areaName = d.properties.TOWNNAME
        const density = DATA[areaName].density
        const sixtyFiveUpPercent = DATA[areaName].sixtyFiveUpPercent

        d3.select(this)
          .style({
            'stroke': '#333',
            'stroke-width': '6px',
          })
        $('.intro-area').html(areaName)
        $('#intro-density').html(setDensity(density))

        $('#deskMap-sex-ratio').html(DATA[areaName].sexRatio)
        $('#deskMap-sixtyFiveUp').html(`${sixtyFiveUpPercent} %`)
        $('#deskMap-fifteen-sixtyFour').html(`${DATA[areaName].fifteenSixtyFourPercent} %`)
        $('#deskMap-zero-fourteen').html(`${DATA[areaName].zeroFourteenPercent} %`)

        $('#deskMap-intro-num').html(() => {
          const raiseRatio = DATA[areaName].raiseRatio
          const numberNoProductive = parseFloat(raiseRatio / 10)
          if (numberNoProductive > 4) {
            $('#deskMap-intro-word').text('社會中的無生產能力人口比例將會越來越重...')
            $('#deskMap-intro-num').addClass(' color-red p-font-600')
          } else {
            $('#deskMap-intro-word').text('年輕人的負擔將越變越大...')
            $('#deskMap-intro-num').removeClass(' color-red p-font-600')
          }
          return numberNoProductive
        })

        $('#deskMap-ages-text').html(() => {
          const diffNum = formatFloat(parseFloat(14 - sixtyFiveUpPercent), 1) 
          if (sixtyFiveUpPercent > 20) {
            return 'OMG 已經達到<span class="color-red">超高齡社會</span> 的標準了！老年人口佔人口的 20%以上了！'
          } else if (sixtyFiveUpPercent > 14) {
            return '已達到 <span class="color-red">高齡社會</span> 的標準！老年人口佔人口的 14%以上。'
          } return `離高齡化社會只差 <span class="color-red">${diffNum} %</span>，要注意啊！`
        })

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
  $('.ui.pointing.menu .item').click(function () {
    const showContainer = $(this).data('container')
    $('.container.active').removeClass('active')
    $(`.${showContainer}`).addClass('active')

    $('.item.active').removeClass('active')
    $(this).addClass('active')
  })
})(window)
