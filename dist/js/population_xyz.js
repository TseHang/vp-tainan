'use strict';

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

// require('./partial/default.js')
// TODO: RequireJs

var d3 = window.d3;
var Vue = window.Vue;
var $ = window.$;

(function (window) {
  var DATA = void 0;
  var features = void 0;
  var densityOverColor = d3.scale.linear().domain([860, 13000]).range(['#ffb62a', '#503604']);
  var desktopMapVis = d3.select('.area-desktop-map').append('svg').attr('width', '100%').attr('height', $('.area-intro').height());
  var mobileMapVis = d3.select('.area-mobile-map').append('svg').attr('width', '100%').attr('height', $(window).height() * 0.35);
  var isMobile = $(window).width() < 768 ? true : false;
  var TAINAN = {};
  var densityScope = {
    high: 10000,
    middle: 1000,
    little: 860
  };

  var setDensity = function setDensity(density) {
    if (density >= densityScope.high) {
      return '極高';
    } else if (density >= densityScope.middle) {
      return '高';
    } else if (density >= densityScope.little) {
      return '介於平均值附近';
    } else {
      return '低於平均值';
    }
  };

  if (isMobile) {
    $('#tainan-every-area').addClass('color-red p-size-big');
  }

  d3.csv('./src/data/population_xyz.csv', function (data) {

    var tableVm = new Vue({
      delimiters: ['${', '}'],
      el: '#table-list',
      data: {
        dataArray: data
      },
      computed: {
        descendSexratio: function descendSexratio() {
          var newArray = [].concat(_toConsumableArray(this.dataArray));
          newArray.sort(function (a, b) {
            return parseFloat(b.sexRatio) - parseFloat(a.sexRatio);
          });
          return [newArray[29]].concat(_toConsumableArray(newArray));
        },
        descendRaiseratio: function descendRaiseratio() {
          var newArray = [].concat(_toConsumableArray(this.dataArray));
          newArray.sort(function (a, b) {
            return parseFloat(b.raiseRatio) - parseFloat(a.raiseRatio);
          });
          return [newArray[26]].concat(_toConsumableArray(newArray));
        },
        descendZeroFourteen: function descendZeroFourteen() {
          var newArray = [].concat(_toConsumableArray(this.dataArray));
          newArray.sort(function (a, b) {
            return parseFloat(b.zero_fourteen_percent) - parseFloat(a.zero_fourteen_percent);
          });
          return [newArray[10]].concat(_toConsumableArray(newArray));
        },
        descendFifteenSixtyfour: function descendFifteenSixtyfour() {
          var newArray = [].concat(_toConsumableArray(this.dataArray));
          newArray.sort(function (a, b) {
            return parseFloat(b.fifteen_sixtyFour_percent) - parseFloat(a.fifteen_sixtyFour_percent);
          });
          return [newArray[10]].concat(_toConsumableArray(newArray));
        },
        descendSixtyFive: function descendSixtyFive() {
          var newArray = [].concat(_toConsumableArray(this.dataArray));
          newArray.sort(function (a, b) {
            return parseFloat(b.sixtyFiveUp_percent) - parseFloat(a.sixtyFiveUp_percent);
          });
          return [newArray[28]].concat(_toConsumableArray(newArray));
        },
        descendBorn: function descendBorn() {
          var newArray = [].concat(_toConsumableArray(this.dataArray));
          return newArray.sort(function (a, b) {
            return parseFloat(b.born_num.replace(/,/ig, '')) - parseFloat(a.born_num.replace(/,/ig, ''));
          });
        },
        descendDeath: function descendDeath() {
          var newArray = [].concat(_toConsumableArray(this.dataArray));
          return newArray.sort(function (a, b) {
            return parseFloat(b.death_num.replace(/,/ig, '')) - parseFloat(a.death_num.replace(/,/ig, ''));
          });
        },
        descendImmigration: function descendImmigration() {
          var newArray = [].concat(_toConsumableArray(this.dataArray));
          return newArray.sort(function (a, b) {
            return parseFloat(b.immigration_num.replace(/,/ig, '')) - parseFloat(a.immigration_num.replace(/,/ig, ''));
          });
        },
        descendLeaving: function descendLeaving() {
          var newArray = [].concat(_toConsumableArray(this.dataArray));
          return newArray.sort(function (a, b) {
            return parseFloat(b.leaving_num.replace(/,/ig, '')) - parseFloat(a.leaving_num.replace(/,/ig, ''));
          });
        },
        descendNatural: function descendNatural() {
          var newArray = [].concat(_toConsumableArray(this.dataArray));
          newArray.sort(function (a, b) {
            return parseFloat(b.naturalIncrease_percent) - parseFloat(a.naturalIncrease_percent);
          });
          return [newArray[9]].concat(_toConsumableArray(newArray));
        },
        descendSociety: function descendSociety() {
          var newArray = [].concat(_toConsumableArray(this.dataArray));
          newArray.sort(function (a, b) {
            return parseFloat(b.society_percent) - parseFloat(a.society_percent);
          });
          return [newArray[13]].concat(_toConsumableArray(newArray));
        },
        descendPopulationChange: function descendPopulationChange() {
          var newArray = [].concat(_toConsumableArray(this.dataArray));
          newArray.sort(function (a, b) {
            return parseFloat(b.population_change_percent) - parseFloat(a.population_change_percent);
          });
          return [newArray[9]].concat(_toConsumableArray(newArray));
        }
      }
    });

    var settings = {
      sexRatioSvg: {
        width: isMobile ? '100%' : '80%',
        height: isMobile ? 80 : 40
      },
      agesPramidSvg: {
        width: '100%',
        height: 300,
        rectY: 20,
        blocks: 15.8
      },
      populationChangeSvg: {
        width: '100%',
        height: 110
      }
    };

    var sexRatioSvg = d3.select('.sexRatioSvg').append('svg').attr('width', settings.sexRatioSvg.width).attr('height', settings.sexRatioSvg.height);

    var agesPramidSvg = d3.select('.agesPramidSvg').append('svg').attr('width', settings.agesPramidSvg.width).attr('height', settings.agesPramidSvg.height);

    var populationChangeSvg = d3.select('.populationChangeSvg').append('svg').attr('width', settings.populationChangeSvg.width).attr('height', settings.populationChangeSvg.height);

    //
    // sexRatioChart
    // ---------------
    var sexRatioSvgWidth = isMobile ? $('.sexRatioSvg').width() : $('.sexRatioSvg').width() * 0.7;
    var manRatioBar = sexRatioSvg.append('rect').attr({
      'fill': 'rgb(63,169,245)',
      'width': 0,
      'height': 30,
      'x': 0,
      'y': 0
    });

    var girlRatioBar = sexRatioSvg.append('rect').attr({
      'fill': 'rgb(243,71,8)',
      'width': '0px',
      'height': 30,
      'x': isMobile ? 0 : parseFloat(data[0].man.replace(/,/ig, '')) / parseFloat(data[0].population.replace(/,/ig, '')) * sexRatioSvgWidth + 5,
      'y': isMobile ? 40 : 0
    });

    sexRatioSvg.append('text').attr({
      'x': isMobile ? 10 : parseFloat(data[0].man.replace(/,/ig, '')) / parseFloat(data[0].population.replace(/,/ig, '')) * sexRatioSvgWidth - 130,
      'y': 20,
      'id': 'num-man'
    }).text('男生約佔 50%');

    sexRatioSvg.append('text').attr({
      'x': isMobile ? 10 : sexRatioSvgWidth - 130,
      'y': isMobile ? 60 : 20,
      'id': 'num-girl'
    }).text('女生約佔 50%');

    //
    // agesPramidChart
    // ---------------
    var agesData = _transformAgesData(data);
    var basicRectHeight = parseFloat((settings.agesPramidSvg.height - 90) / settings.agesPramidSvg.blocks);

    var pramidChartRow = agesPramidSvg.selectAll('g.pramidRow').data(agesData);
    var rectWidthRatio = isMobile ? 7 : 10;
    var newPramidRow = pramidChartRow.enter().append('g').attr('class', 'pramidRow');

    newPramidRow.append('rect').attr('class', 'pramidBar').attr('width', 0).attr('height', function (d) {
      return d.block * basicRectHeight;
    }).attr('y', function (d, i) {
      var restBlock = d.allBlocks - d.block;
      var separateY = 0;
      if (i >= 1) {
        separateY = 12;
      }
      if (i >= 5) {
        separateY = 24;
      }

      return restBlock * basicRectHeight + i * 4 + separateY;
    }).style('fill', function (d, i) {
      if (i === 0) {
        return '#165805';
      } else if (i >= 5) {
        return '#bbf99c';
      }
    }).on('mouseover', function (d, i) {
      d3.select(this).style('opacity', 0.5);

      switch (i) {
        case 0:
          $('.pramidIntroText').html('「老人不講古，後生會失譜。」<br>台南的國寶級人物，生命就象徵著文化與歷史。盡力傳頌吧～這些偉大的故事！');break;
        case 1:
          $('.pramidIntroText').html('「用知識武裝自己，去實現人生的最高價值。」<br>在人生的分水嶺中，別放棄心中那個曾經擁有夢想，天真無邪的自己。');break;
        case 2:
          $('.pramidIntroText').html('「在真正的生命裡，每一樁偉業都由信念開始，並由信念跨出第一步。」<br>現任的社會中堅，處在瞬息萬變的時代所造成的資訊衝突是很巨大的，莫怕改變，勇於嘗試，堅持下去。');break;
        case 3:
          $('.pramidIntroText').html('「命運只有自己能掌握。」<br>如果說台灣就像一灘自由自在的死水，但我們是自由自在活生生的台灣人，我們可以靠自己來改變。');break;
        case 4:
          $('.pramidIntroText').html('「享受你的青春！但也別忘記自己該有的責任。」<br>它象徵著我要對於自己，對於自己愛的人做出點什麼，因為我即將成為一個能獨立承當責任的成人，而再也不是一個處處受人照應的孩童了。');break;
        case 5:
          $('.pramidIntroText').html('「學習是學生的責任，它不是我的負擔，也不是痛苦的來源，它是自我的舞台。」<br>但別屈服於分數的權威體制下，做自己的主人翁。');break;
        case 6:
          $('.pramidIntroText').html('「保護眼睛，每天只能用30分鐘電腦或平板喔^^」<br>這麼小就用科技產品，要顧好眼睛啊！');break;
        case 7:
          $('.pramidIntroText').html('「哇嗚哇嗚啊～爸爸媽媽們辛苦了！」<br>我們假設你還看不懂中文字，所以對爸爸媽媽辛苦的幫你翻譯，說聲辛苦了！');break;
        default:
          $('.pramidIntroText').text('');
      }
    }).on('mouseleave', function () {
      d3.select(this).style('opacity', 1);

      $('#pramidIntroText').text('');
    });

    newPramidRow.append('text').attr('class', 'label').attr('dx', '.3em').attr('dy', '.35em').attr('x', function (d, i) {
      if (i === 1 || i === 2) {
        return isMobile ? d.value * rectWidthRatio - 130 : d.value * rectWidthRatio + 300;
      } else if (i === 3) {
        return isMobile ? d.value * rectWidthRatio - 20 : d.value * rectWidthRatio + 300;
      } else if (i === 5) {
        return isMobile ? d.value * rectWidthRatio + 60 : d.value * rectWidthRatio + 300;
      }
      return isMobile ? d.value * rectWidthRatio + 5 : d.value * rectWidthRatio + 140;
    }).attr('y', function (d, i) {
      var restBlock = d.allBlocks - d.block;
      var separateY = 0;
      if (i >= 1) {
        separateY = 12;
      }
      if (i >= 5) {
        separateY = 24;
      }

      return restBlock * basicRectHeight + i * 4 + d.block * basicRectHeight / 2 + separateY;
    }).text(function (d) {
      return d.range + ':  ' + d.value + '%';
    });

    newPramidRow.append('path').attr('d', function (d, i) {
      var restBlock = d.allBlocks - d.block;
      var separateY = 0;
      if (i >= 1) {
        separateY = 12;
      }
      if (i >= 5) {
        separateY = 24;
      }

      var x = d.value * rectWidthRatio;
      var y = restBlock * basicRectHeight + i * 4 + d.block * basicRectHeight / 2 + separateY;
      if (i === 1 || i === 2 || i === 3) {
        return isMobile ? '' : 'M ' + x + ' ' + y + ', H ' + (x + 290);
      } else if (i === 5) {
        return isMobile ? 'M ' + x + ' ' + y + ', H ' + (x + 60) : 'M ' + x + ' ' + y + ', H ' + (x + 290);
      }
      return isMobile ? 'M ' + x + ' ' + y + ', H ' + (x + 5) : 'M ' + x + ' ' + y + ', H ' + (x + 130);
    }).attr('stroke', '#D7DAE1');

    //
    // populationChangeSvg
    // ---------------
    var populationData = _transformPopulationData(data);
    var populationChartRow = populationChangeSvg.selectAll('g.populationRow').data(populationData.naturalData);
    var newNumber = [0, 0];

    var newPopulationChart = populationChartRow.enter().append('g').attr('class', 'populationRow');

    var barMax = d3.max([].concat(_toConsumableArray(populationData.naturalData), _toConsumableArray(populationData.socialData)), function (d) {
      return d.value;
    }) + 2000;
    var populationX = d3.scale.linear().domain([0, barMax]).range([0, isMobile ? $('.populationChangeSvg').width() * 0.6 : $('.populationChangeSvg').width() * 0.7]);

    newPopulationChart.append('rect').attr('width', 0).attr('height', '30px').attr('y', function (d, i) {
      return i * 40;
    }).attr('x', '0').attr('fill', function (d, i) {
      if (i === 0) {
        return '#FFAA0A';
      }
      return '#542801';
    }).transition().duration(1000).delay(800).attr('width', function (d) {
      return populationX(d.value);
    });

    newPopulationChart.append('text').attr('x', 10).attr('y', function (d, i) {
      return i * 40 + 15;
    }).attr('dy', '.3em').attr('class', 'population-name-text').text(function (d) {
      return d.name;
    });

    newPopulationChart.append('text').attr('x', 15).attr('y', function (d, i) {
      return i * 40 + 15;
    }).attr('dy', '.35em').attr('class', 'num-text').text('0').transition().duration(1000).delay(800).tween('num-text', function (d, i) {
      var tmp = d3.interpolateRound(newNumber[i], d.value);
      newNumber[i] = d.value;
      return function (t) {
        this.setAttribute('x', populationX(tmp(t)) + 15);
        this.textContent = tmp(t) + ' \u4EBA';
      };
    });

    $(document).scroll(function () {
      var st = $(window).scrollTop();
      if (st > $('#X-element.report-section').offset().top - 300) {
        manRatioBar.transition().duration(1500).attr('width', parseFloat(data[0].man.replace(/,/ig, '')) / parseFloat(data[0].population.replace(/,/ig, '')) * sexRatioSvgWidth);

        girlRatioBar.transition().duration(1000).attr('width', parseFloat(data[0].girl.replace(/,/ig, '')) / parseFloat(data[0].population.replace(/,/ig, '')) * sexRatioSvgWidth);
      }

      if (st > $('#Y-element.report-section').offset().top - 300) {
        newPramidRow.selectAll('rect').transition().duration(function () {
          var random = Math.random() + 0.3;
          return random * 900;
        }).attr('width', function (d) {
          return d.value * rectWidthRatio;
        });

        newPramidRow.selectAll('path').transition().delay(500).duration(300).style('opacity', 1);

        newPramidRow.selectAll('text').transition().delay(500).duration(300).style('opacity', 1);
      }
    });

    var isBorn = true;
    $('.btn-change-population-data').click(function () {
      if (isBorn) {
        $('.btn-change-population-data').text('點我看 出生 / 死亡');
      } else {
        $('.btn-change-population-data').text('點我看 移入 / 移出');
      }
      _transitionPopulationBar(populationData, !isBorn);
      isBorn = !isBorn;
    });

    // transform data
    DATA = _transformData(data);
    // console.log(DATA, TAINAN)

    function _transitionPopulationBar(populationData, isBorn) {
      var newData = isBorn ? populationData.naturalData : populationData.socialData;
      populationChangeSvg.selectAll('.population-name-text').data(newData).transition().duration(100).text(function (d, i) {
        if (i === 0) {
          $('#top-bar').text(d.name);
        } else if (i === 1) {
          $('#bottom-bar').text(d.name);
        }
        return d.name;
      });

      populationChangeSvg.selectAll('rect').data(newData).transition().duration(1000).attr('width', function (d) {
        return populationX(d.value);
      });

      populationChangeSvg.selectAll('.num-text').data(newData).transition().duration(1000).tween('num-text', function (d, i) {
        var tmp = d3.interpolateRound(newNumber[i], d.value);
        newNumber[i] = d.value;

        if (newNumber[0] - newNumber[1] < 0) {
          $('#support-diff').addClass('color-red');
        } else {
          $('#support-diff').removeClass('color-red');
        }
        $('#support-diff').text(newNumber[0] - newNumber[1] + ' \u4EBA');
        return function (t) {
          var timeValue = tmp(t);
          this.setAttribute('x', populationX(timeValue) + 15);
          this.textContent = timeValue + ' \u4EBA';
        };
      });
    }

    function _transformAgesData(array) {
      return [{
        range: '65歲以上',
        block: 4,
        allBlocks: 4,
        value: parseFloat(array[0].sixtyFiveUp_percent)
      }, {
        range: '51 ~ 64歲',
        block: 3,
        allBlocks: 7,
        value: parseFloat(array[0].fiftyOne_sixtyFour_percent)
      }, {
        range: '31 ~ 50歲',
        block: 4,
        allBlocks: 11,
        value: parseFloat(array[0].thirtyOne_fifty_percent)
      }, {
        range: '19 ~ 30歲',
        block: 2,
        allBlocks: 13,
        value: parseFloat(array[0].nighteen_thirty_percent)
      }, {
        range: '16 ~ 18歲',
        block: 0.3,
        allBlocks: 13.3,
        value: parseFloat(array[0].sixteen_eighteen_percent)
      }, {
        range: '13 ~ 15歲',
        block: 0.3,
        allBlocks: 13.6,
        value: parseFloat(array[0].thirteen_fifteen_percent)
      }, {
        range: '6 ~ 12歲',
        block: 1.2,
        allBlocks: 14.8,
        value: parseFloat(array[0].six_twelve_percent)
      }, {
        range: '0 ~ 5歲',
        block: 1,
        allBlocks: 15.8,
        value: parseFloat(array[0].zero_five_percent)
      }];
    }

    function _transformPopulationData(array) {
      return {
        naturalNum: array[0].naturalIncrease_num,
        naturalPercent: parseFloat(array[0].naturalIncrease_percent),
        societyNUm: array[0].society_num,
        societyPercent: parseFloat(array[0].society_percent),
        naturalData: [{
          name: '出生數',
          value: parseFloat(array[0].born_num.replace(/,/ig, ''))
        }, {
          name: '死亡數',
          value: parseFloat(array[0].death_num.replace(/,/ig, ''))
        }],
        socialData: [{
          name: '移入數',
          value: parseFloat(array[0].immigration_num.replace(/,/ig, ''))
        }, {
          name: '移出數',
          value: parseFloat(array[0].leaving_num.replace(/,/ig, ''))
        }]
      };
    }

    function _transformData(arrayData) {
      var obj = {};
      var array = [].concat(_toConsumableArray(arrayData));

      TAINAN.population = array[0].population;
      TAINAN.density = parseFloat(array[0].density);
      TAINAN.man = array[0].man;
      TAINAN.girl = array[0].girl;
      TAINAN.sexRatio = parseFloat(array[0].sexRatio);
      TAINAN.raiseRatio = parseFloat(array[0].sexRatio);

      TAINAN.zero_fourteen_num = array[0].zero_fourteen_num;
      TAINAN.fifteen_sixtyFour_num = array[0].fifteen_sixtyFour_num;
      TAINAN.sixtyFiveUp_num = array[0].sixtyFiveUp_num;
      TAINAN.zero_fourteen_percent = parseFloat(array[0].zero_fourteen_percent);
      TAINAN.fifteen_sixtyFour_percent = parseFloat(array[0].fifteen_sixtyFour_percent);
      TAINAN.sixtyFiveUp_percent = parseFloat(array[0].sixtyFiveUp_percent);

      TAINAN.zero_five_percent = parseFloat(array[0].zero_five_percent);
      TAINAN.six_twelve_percent = parseFloat(array[0].six_twelve_percent);
      TAINAN.thirteen_fifteen_percent = parseFloat(array[0].thirteen_fifteen_percent);
      TAINAN.sixteen_eighteen_percent = parseFloat(array[0].sixteen_eighteen_percent);
      TAINAN.nighteen_thirty_percent = parseFloat(array[0].nighteen_thirty_percent);
      TAINAN.thirtyOne_fifty_percent = parseFloat(array[0].thirtyOne_fifty_percent);
      TAINAN.fiftyOne_sixtyFour_percent = parseFloat(array[0].fiftyOne_sixtyFour_percent);

      TAINAN.naturalIncrease_num = array[0].naturalIncrease_num;
      TAINAN.naturalIncrease_percent = parseFloat(array[0].naturalIncrease_percent);
      TAINAN.marry_num = array[0].marry_num;
      TAINAN.marry_percent = parseFloat(array[0].marry_percent);
      TAINAN.divorce_num = array[0].divorce_num;
      TAINAN.divorce_percent = parseFloat(array[0].divorce_percent);
      TAINAN.born_num = array[0].born_num;
      TAINAN.death_num = array[0].death_num;
      TAINAN.immigration_num = array[0].immigration_num;
      TAINAN.leaving_num = array[0].leaving_num;
      TAINAN.society_num = array[0].society_num;
      TAINAN.society_percent = parseFloat(array[0].society_percent);

      array.forEach(function (value) {
        var valuePopulation = parseFloat(value.population.replace(/,/ig, ''));
        var valueDensity = parseFloat(value.density);
        var zeroFourteenPercent = parseFloat(value.zero_fourteen_percent);
        var fifteenSixtyFourPercent = parseFloat(value.fifteen_sixtyFour_percent);
        var sixtyFiveUpPercent = parseFloat(value.sixtyFiveUp_percent);
        var sexRatio = parseFloat(value.sexRatio);
        var raiseRatio = parseFloat(value.raiseRatio);

        obj[value.area.replace(/\s/ig, '')] = {
          isDensityOver: valueDensity > TAINAN.density,
          density: formatFloat(valueDensity, 0),
          populationPercent: formatFloat(valuePopulation / parseFloat(TAINAN.population.replace(/,/ig, '')) * 100, 1),
          zeroFourteenPercent: zeroFourteenPercent,
          fifteenSixtyFourPercent: fifteenSixtyFourPercent,
          sixtyFiveUpPercent: sixtyFiveUpPercent,
          raiseRatio: raiseRatio,
          sexRatio: sexRatio
        };
      });
      return obj;
    }
  });

  //
  // draw Map
  // -----------
  d3.json('./src/data/tainan-town.topo.json', function (topodata) {
    var path = d3.geo.path().projection(
    // 路徑產生器
    d3.geo.mercator().center([120.72, 23.1]).scale(35000));
    features = topojson.feature(topodata, topodata.objects.tainan).features;

    desktopMapVis.selectAll('path').data(features).enter().append('path').attr({
      'd': path,
      'fill': function fill(d) {
        var areaName = d.properties.TOWNNAME;
        if (DATA[areaName].isDensityOver) {
          return densityOverColor(DATA[areaName].density);
        }
        return '#D7DAE1';
      },
      'stroke': 'white',
      'stroke-width': '1.5px'
    }).on('mouseover', function (d) {
      var areaName = d.properties.TOWNNAME;
      var density = DATA[areaName].density;
      var sixtyFiveUpPercent = DATA[areaName].sixtyFiveUpPercent;

      d3.select(this).style('fill-opacity', .4);

      $('.intro-area').html(areaName);
      $('#intro-density').html(setDensity(density));

      $('#deskMap-sex-ratio').html(DATA[areaName].sexRatio);
      $('#deskMap-sixtyFiveUp').html(sixtyFiveUpPercent + ' %');
      $('#deskMap-fifteen-sixtyFour').html(DATA[areaName].fifteenSixtyFourPercent + ' %');
      $('#deskMap-zero-fourteen').html(DATA[areaName].zeroFourteenPercent + ' %');

      $('#deskMap-intro-num').html(function () {
        var raiseRatio = DATA[areaName].raiseRatio;
        var numberNoProductive = parseFloat(raiseRatio / 10);
        if (numberNoProductive > 4) {
          $('#deskMap-intro-word').text('社會中的無生產能力人口比例將會越來越重...');
          $('#deskMap-intro-num').addClass(' color-red p-size-big');
        } else {
          $('#deskMap-intro-word').text('年輕人的負擔將越變越大...');
          $('#deskMap-intro-num').removeClass(' color-red p-size-big');
        }
        return numberNoProductive;
      });

      $('#deskMap-ages-text').html(function () {
        var diffNum = formatFloat(parseFloat(14 - sixtyFiveUpPercent), 1);
        if (sixtyFiveUpPercent > 20) {
          return 'OMG 已經達到<span class="color-red">超高齡社會</span> 的標準了！老年人口佔人口的 20%以上了！';
        } else if (sixtyFiveUpPercent > 14) {
          return '已達到 <span class="color-red">高齡社會</span> 的標準！老年人口佔人口的 14%以上。';
        }return '\u96E2\u9AD8\u9F61\u5316\u793E\u6703\u53EA\u5DEE <span class="color-red">' + diffNum + ' %</span>\uFF0C\u8981\u6CE8\u610F\u554A\uFF01';
      });

      if (DATA[areaName].isDensityOver) {
        $('#intro-density').addClass('p-size-big color-red');
      } else {
        $('#intro-density').removeClass('p-size-big color-red');
      }
    }).on('mouseleave', function (d) {
      d3.select(this).style('fill-opacity', 1);
    });
  });

  // Mobile select map func.
  var selectAreaMap = function selectAreaMap(areaName) {
    mobileMapVis.selectAll('*').remove();
    var path = d3.geo.path().projection(d3.geo.mercator().center([121.55, 22.58]).scale(16000));
    mobileMapVis.selectAll('path').data(features).enter().append('path').attr({
      'd': path,
      'fill': function fill(d) {
        var area = d.properties.TOWNNAME;
        if (area === areaName) {
          return '#FFAA0A';
        }
        return '#D7DAE1';
      },
      'stroke': 'white',
      'stroke-width': '1px'
    });

    d3.select(undefined).style('fill-opacity', .4);

    var density = DATA[areaName].density;
    var sixtyFiveUpPercent = DATA[areaName].sixtyFiveUpPercent;

    $('#mobile-area').text(areaName);
    $('#mobile-intro-density').html('&nbsp;' + density);

    $('.intro-area').html(areaName);
    $('#intro-density').html(setDensity(density));

    $('#mobile-sex-ratio').html(DATA[areaName].sexRatio);
    $('#mobile-sixtyFiveUp').html(sixtyFiveUpPercent + ' %');
    $('#mobile-fifteen-sixtyFour').html(DATA[areaName].fifteenSixtyFourPercent + ' %');
    $('#mobile-zero-fourteen').html(DATA[areaName].zeroFourteenPercent + ' %');

    $('#mobile-intro-num').html(function () {
      var raiseRatio = DATA[areaName].raiseRatio;
      var numberNoProductive = parseFloat(raiseRatio / 10);
      if (numberNoProductive > 4) {
        $('#mobile-intro-word').text('社會中的無生產能力人口比例將會越來越重...');
        $('#mobile-intro-num').addClass(' color-red p-size-big');
      } else {
        $('#mobile-intro-word').text('年輕人的負擔將越變越大...');
        $('#mobile-intro-num').removeClass(' color-red p-size-big');
      }
      return numberNoProductive;
    });

    $('#mobile-ages-text').html(function () {
      var diffNum = formatFloat(parseFloat(14 - sixtyFiveUpPercent), 1);
      if (sixtyFiveUpPercent > 20) {
        return 'OMG 已經達到<span class="color-red">超高齡社會</span> 的標準了！老年人口佔人口的 20%以上了！';
      } else if (sixtyFiveUpPercent > 14) {
        return '已達到 <span class="color-red">高齡社會</span> 的標準！老年人口佔人口的 14%以上。';
      }return '\u96E2\u9AD8\u9F61\u5316\u793E\u6703\u53EA\u5DEE <span class="color-red">' + diffNum + ' %</span>\uFF0C\u8981\u6CE8\u610F\u554A\uFF01';
    });

    if (DATA[areaName].isDensityOver) {
      $('#mobile-intro-density').addClass('p-size-big color-red');
    } else {
      $('#mobile-intro-density').removeClass('p-size-big color-red');
    }
  };

  $('.ui.dropdown').dropdown({
    onChange: function onChange(value, text) {
      $('#map-modal').modal({
        offset: $('#tainan-every-area').offset().top - 200
      }).modal('show');
      selectAreaMap(text);
    }
  });

  window.setTimeout(function () {
    if (isMobile) {
      // 在 safari 中因為被綁到body上，所以要將 click事件綁到目標上可解決
      $('body').on('click', '.ui.pointing.menu .item', function () {
        var showContainer = $(this).data('container');
        $('.column.active').removeClass('active');
        $('.container.active').removeClass('active');
        $('.' + showContainer).addClass('active');

        $('.item.active').removeClass('active');
        $(this).addClass('active');

        if ($('.right.item').hasClass('active')) {
          $('.table-container').removeClass('disable');
        } else {
          $('.table-container').addClass('disable');
        }
      });
    } else {
      $('.ui.pointing.menu .item').click(function () {
        var showContainer = $(this).data('container');
        $('.' + showContainer).toggleClass('active');
        $(this).toggleClass('active');

        if ($('.right.item').hasClass('active')) {
          $('.table-container').removeClass('disable');
        } else {
          $('.table-container').addClass('disable');
        }
      });
    }
  }, 500);
})(window);