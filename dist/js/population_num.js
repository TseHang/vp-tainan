"use strict";function _toConsumableArray(e){if(Array.isArray(e)){for(var t=0,o=Array(e.length);t<e.length;t++)o[t]=e[t];return o}return Array.from(e)}var d3=window.d3,Vue=window.Vue,$=window.$;!function(e){var t=void 0,o=void 0,a=d3.scale.linear().domain([860,13e3]).range(["#ffb62a","#503604"]),n=d3.select(".area-desktop-map").append("svg").attr("width","100%").attr("height",$(".area-intro").height()),r=d3.select(".area-mobile-map").append("svg").attr("width","100%").attr("height",.35*$(e).height()),i={},l={topHigh:1e4,high:5e3,middle:1e3,little:750},s={topHigh:{comment:"就像這行字一樣你說擠不擠擠不擠擠不擠擠不擠擠不擠擠不擠擠不擠擠不擠擠不擠擠不擠擠不擠擠不擠擠不擠擠不擠擠不擠擠不擠擠不擠擠不擠擠不擠擠不擠擠不擠擠不擠擠不擠擠不擠擠不擠擠不擠擠不擠擠不擠擠不擠",word:"這整整高出平均13倍以上啊！"},high:{comment:"就像剛進入熱戀期的情侶一樣，距離愈變愈近，手腳愈來愈快...",word:"完蛋！要警覺啊！"},middle:{comment:"就像一種活在悠閒大都市的感覺吧！有時慢活，有時擁擠 ",word:"以平均來說，還算不錯吧！"},little:{comment:"就像是剛做好的鮪魚蛋土司，不油不膩，空間舒適度相對來說 ",word:"相當不錯呢！"},less:{comment:"就像加長型King-Size總統套房彈簧床，怎麼滾都滾不到盡頭的那種... ",word:"人呢？好像不怎麼熱鬧啊..."}},d=function(e,t){$("#intro-comment").text(e),$("#intro-word").text(t),$("#mobile-comment").text(e),$("#mobile-word").text(t)},c=function(e){e>=l.topHigh?d(s.topHigh.comment,s.topHigh.word):e>=l.high?d(s.high.comment,s.high.word):e>=l.middle?d(s.middle.comment,s.middle.word):e>=l.little?d(s.little.comment,s.little.word):d(s.less.comment,s.less.word)};$(e).width()<768&&$("#every-area").addClass("color-red p-font-600"),d3.csv("./src/data/population_num.csv",function(e){new Vue({delimiters:["${","}"],el:"#table-list",data:{dataArray:e},computed:{descendPopulation:function(){return[].concat(_toConsumableArray(this.dataArray)).sort(function(e,t){return parseFloat(t.population.replace(/,/gi,""))-parseFloat(e.population.replace(/,/gi,""))})},descendDensity:function(){var e=[].concat(_toConsumableArray(this.dataArray));return e.sort(function(e,t){return parseFloat(t.density.replace(/,/gi,""))-parseFloat(e.density.replace(/,/gi,""))}),[e[13]].concat(_toConsumableArray(e))},descendLand:function(){return[].concat(_toConsumableArray(this.dataArray)).sort(function(e,t){return parseFloat(t.land.replace(/,/gi,""))-parseFloat(e.land.replace(/,/gi,""))})}}});t=function(e){var t={};return i.population=parseFloat(e[0].population.replace(/,/gi,"")),i.land=parseFloat(e[0].land.replace(/,/gi,"")),i.density=parseFloat(e[0].density.replace(/,/gi,"")),e.forEach(function(e){var o=parseFloat(e.population.replace(/,/gi,"")),a=parseFloat(e.land.replace(/,/gi,"")),n=parseFloat(e.density.replace(/,/gi,""));t[e.area.replace(/\s/gi,"")]={numberHold:e.numberHold,isDensityOver:n>i.density,density:formatFloat(n,0),landPercent:formatFloat(a/i.land*100,1),populationPercent:formatFloat(o/i.population*100,1)}}),t}(e)}),d3.json("./src/data/tainan-town.topo.json",function(e){var r=d3.geo.path().projection(d3.geo.mercator().center([120.72,23.1]).scale(35e3));o=topojson.feature(e,e.objects.tainan).features,n.selectAll("path").data(o).enter().append("path").attr({d:r,fill:function(e){var o=e.properties.TOWNNAME;return t[o].isDensityOver?a(t[o].density):"#D7DAE1"},stroke:"white","stroke-width":"1.5px"}).on("mouseover",function(e){var o=e.properties.TOWNNAME,a=t[o].density;d3.select(this).style("fill-opacity",.4),$(".intro-area").html(o),$("#intro-population-percent").html(t[o].populationPercent+"%"),$("#intro-land-percent").html(t[o].landPercent+"%"),$("#intro-density").html(a),c(a),t[o].isDensityOver?$("#intro-density").addClass("p-font-600 color-red"):$("#intro-density").removeClass("p-font-600 color-red")}).on("mouseleave",function(e){d3.select(this).style("fill-opacity",1)})});var p=function(e){r.selectAll("*").remove();var a=d3.geo.path().projection(d3.geo.mercator().center([121.55,22.58]).scale(16e3));r.selectAll("path").data(o).enter().append("path").attr({d:a,fill:function(t){return t.properties.TOWNNAME===e?"#FFAA0A":"#D7DAE1"},stroke:"white","stroke-width":"1.5px"});var n=t[e].density;$("#mobile-area").text(e),$("#mobile-population-percent").html("&nbsp;"+t[e].populationPercent+"%&nbsp;"),$("#mobile-land-percent").html("&nbsp;"+t[e].landPercent+"%&nbsp;"),$("#mobile-density").html("&nbsp;"+n+"&nbsp;"),c(n),t[e].isDensityOver?$("#mobile-density").addClass("p-font-600 color-red"):$("#mobile-density").removeClass("p-font-600 color-red")};$(".ui.dropdown").dropdown({onChange:function(e,t){$("#map-modal").modal("show"),p(t)}}),$(".ui.pointing.menu .item").click(function(){var e=$(this).data("container");$(".container.active").removeClass("active"),$("."+e).addClass("active"),$(".item.active").removeClass("active"),$(this).addClass("active")})}(window);