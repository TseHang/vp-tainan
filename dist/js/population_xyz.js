"use strict";function _toConsumableArray(t){if(Array.isArray(t)){for(var e=0,a=Array(t.length);e<t.length;e++)a[e]=t[e];return a}return Array.from(t)}var d3=window.d3,Vue=window.Vue,$=window.$;!function(t){var e=void 0,a=void 0,r=d3.scale.linear().domain([860,13e3]).range(["#ffb62a","#503604"]),n=d3.select(".area-desktop-map").append("svg").attr("width","100%").attr("height",$(".area-intro").height()),o=d3.select(".area-mobile-map").append("svg").attr("width","100%").attr("height",.35*$(t).height()),i=$(t).width()<768,l={},s={high:1e4,middle:1e3,little:750},p=function(t){return t>=s.high?"極高":t>=s.middle?"高":t>=s.little?"介於平均值附近":"低於平均值"};i&&$("#tainan-every-area").addClass("color-red p-size-big"),d3.csv("./src/data/population_xyz.csv",function(a){function r(t,e){var a=e?t.naturalData:t.socialData;s.selectAll(".population-name-text").data(a).transition().duration(100).text(function(t,e){return 0===e?$("#top-bar").text(t.name):1===e&&$("#bottom-bar").text(t.name),t.name}),s.selectAll("rect").data(a).transition().duration(1e3).attr("width",function(t){return F(t.value)}),s.selectAll(".num-text").data(a).transition().duration(1e3).tween("num-text",function(t,e){var a=d3.interpolateRound(y[e],t.value);return y[e]=t.value,y[0]-y[1]<0?$("#support-diff").addClass("color-red"):$("#support-diff").removeClass("color-red"),$("#support-diff").text(y[0]-y[1]+" 人"),function(t){var e=a(t);this.setAttribute("x",F(e)+15),this.textContent=e+" 人"}})}var n=(new Vue({delimiters:["${","}"],el:"#table-list",data:{dataArray:a},computed:{descendPopulation:function(){return[].concat(_toConsumableArray(this.dataArray)).sort(function(t,e){return parseFloat(e.population)-parseFloat(t.population)})},descendDensity:function(){var t=[].concat(_toConsumableArray(this.dataArray));return t.sort(function(t,e){return parseFloat(e.density)-parseFloat(t.density)}),[t[13]].concat(_toConsumableArray(t))},descendMan:function(){return[].concat(_toConsumableArray(this.dataArray)).sort(function(t,e){return parseFloat(e.man)-parseFloat(t.man)})}}}),{sexRatioSvg:{width:"80%",height:30},agesPramidSvg:{width:"100%",height:300,rectY:20,blocks:15.8},populationChangeSvg:{width:"100%",height:80}}),o=d3.select(".sexRatioSvg").append("svg").attr("width",n.sexRatioSvg.width).attr("height",n.sexRatioSvg.height),i=d3.select(".agesPramidSvg").append("svg").attr("width",n.agesPramidSvg.width).attr("height",n.agesPramidSvg.height),s=d3.select(".populationChangeSvg").append("svg").attr("width",n.populationChangeSvg.width).attr("height",n.populationChangeSvg.height),p=.7*$(".sexRatioSvg").width(),c=o.append("rect").attr({fill:"rgb(63,169,245)",width:0,height:30,x:0,y:0}),u=o.append("rect").attr({fill:"rgb(243,71,8)",width:"0px",height:30,x:parseFloat(a[0].man.replace(/,/gi,""))/parseFloat(a[0].population.replace(/,/gi,""))*p+5,y:0});o.append("text").attr({x:parseFloat(a[0].man.replace(/,/gi,""))/parseFloat(a[0].population.replace(/,/gi,""))*p-130,y:20,id:"num-man"}).text("男生約佔 50.01%"),o.append("text").attr({x:p-125,y:20,id:"num-girl"}).text("女生約佔 49.99%");var d=function(t){return[{range:"65歲以上",block:4,allBlocks:4,value:parseFloat(t[0].sixtyFiveUp_percent)},{range:"51 ~ 64歲",block:3,allBlocks:7,value:parseFloat(t[0].fiftyOne_sixtyFour_percent)},{range:"31 ~ 50歲",block:4,allBlocks:11,value:parseFloat(t[0].thirtyOne_fifty_percent)},{range:"19 ~ 30歲",block:2,allBlocks:13,value:parseFloat(t[0].nighteen_thirty_percent)},{range:"16 ~ 18歲",block:.3,allBlocks:13.3,value:parseFloat(t[0].sixteen_eighteen_percent)},{range:"13 ~ 15歲",block:.3,allBlocks:13.6,value:parseFloat(t[0].thirteen_fifteen_percent)},{range:"6 ~ 12歲",block:1.2,allBlocks:14.8,value:parseFloat(t[0].six_twelve_percent)},{range:"0 ~ 5歲",block:1,allBlocks:15.8,value:parseFloat(t[0].zero_five_percent)}]}(a),m=parseFloat((n.agesPramidSvg.height-90)/n.agesPramidSvg.blocks),h=i.selectAll("g.pramidRow").data(d),f=h.enter().append("g").attr("class","pramidRow");f.append("rect").attr("class","pramidBar").attr("width",0).attr("height",function(t){return t.block*m}).attr("y",function(t,e){var a=t.allBlocks-t.block,r=0;return e>=1&&(r=12),e>=5&&(r=24),a*m+4*e+r}).style("fill",function(t,e){return 0===e?"#165805":e>=5?"#bbf99c":void 0}).on("mouseover",function(t,e){switch(d3.select(this).style("opacity",.5),e){case 0:$(".pramidIntroText").html("「老人不講古，後生會失譜。」<br>台南的國寶級人物，生命就象徵著文化與歷史。盡力傳頌吧～這些偉大的故事！");break;case 1:$(".pramidIntroText").html("「用知識武裝自己，去實現人生的最高價值。」<br>在人生的分水嶺中，別放棄心中那個曾經擁有夢想，天真無邪的自己。");break;case 2:$(".pramidIntroText").html("「在真正的生命裡，每一樁偉業都由信念開始，並由信念跨出第一步。」<br>現任的社會中堅，處在瞬息萬變的時代所造成的資訊衝突是很巨大的，莫怕改變，勇於嘗試，堅持下去。");break;case 3:$(".pramidIntroText").html("「命運只有自己能掌握。」<br>如果說台灣就像一灘自由自在的死水，但我們是自由自在活生生的台灣人，我們可以靠自己來改變。");break;case 4:$(".pramidIntroText").html("「享受你的青春！但也別忘記自己該有的責任。」<br>它象徵著我要對於自己，對於自己愛的人做出點什麼，因為我即將成為一個能獨立承當責任的成人，而再也不是一個處處受人照應的孩童了。");break;case 5:$(".pramidIntroText").html("「學習是學生的責任，它不是我的負擔，也不是痛苦的來源，它是自我的舞台。」<br>但別屈服於分數的權威體制下，做自己的主人翁。");break;case 6:$(".pramidIntroText").html("「保護眼睛，每天只能用30分鐘電腦或平板喔^^」<br>這麼小就用科技產品，要顧好眼睛啊！");break;case 7:$(".pramidIntroText").html("「哇嗚哇嗚啊～爸爸媽媽們辛苦了！」<br>我們假設你還看不懂中文字，所以對爸爸媽媽辛苦的幫你翻譯，說聲辛苦了！");break;default:$(".pramidIntroText").text("")}}).on("mouseleave",function(){d3.select(this).style("opacity",1),$("#pramidIntroText").text("")}),f.append("text").attr("class","label").attr("dx",".3em").attr("dy",".35em").attr("x",function(t,e){return 5===e?10*t.value+300:10*t.value+140}).attr("y",function(t,e){var a=t.allBlocks-t.block,r=0;return e>=1&&(r=12),e>=5&&(r=24),a*m+4*e+t.block*m/2+r}).text(function(t){return t.range+":  "+t.value+"%"}),f.append("path").attr("d",function(t,e){var a=t.allBlocks-t.block,r=0;e>=1&&(r=12),e>=5&&(r=24);var n=10*t.value,o=a*m+4*e+t.block*m/2+r;return 5===e?"M "+n+" "+o+", H "+(n+290):"M "+n+" "+o+", H "+(n+130)}).attr("stroke","#D7DAE1");var v=function(t){return{naturalNum:t[0].naturalIncrease_num,naturalPercent:parseFloat(t[0].naturalIncrease_percent),societyNUm:t[0].society_num,societyPercent:parseFloat(t[0].society_percent),naturalData:[{name:"出生數",value:parseFloat(t[0].born_num.replace(/,/gi,""))},{name:"死亡數",value:parseFloat(t[0].death_num.replace(/,/gi,""))}],socialData:[{name:"移入數",value:parseFloat(t[0].immigration_num.replace(/,/gi,""))},{name:"移出數",value:parseFloat(t[0].leaving_num.replace(/,/gi,""))}]}}(a),g=s.selectAll("g.populationRow").data(v.naturalData),y=[0,0],_=g.enter().append("g").attr("class","populationRow"),x=d3.max([].concat(_toConsumableArray(v.naturalData),_toConsumableArray(v.socialData)),function(t){return t.value})+2e3,F=d3.scale.linear().domain([0,x]).range([0,.7*$(".populationChangeSvg").width()]);_.append("rect").attr("width",0).attr("height","30px").attr("y",function(t,e){return 40*e}).attr("x","0").attr("fill",function(t,e){return 0===e?"#FFAA0A":"#542801"}).transition().duration(1e3).delay(800).attr("width",function(t){return F(t.value)}),_.append("text").attr("x",10).attr("y",function(t,e){return 40*e+15}).attr("dy",".3em").attr("class","population-name-text").text(function(t){return t.name}),_.append("text").attr("x",15).attr("y",function(t,e){return 40*e+15}).attr("dy",".35em").attr("class","num-text").text("0").transition().duration(1e3).delay(800).tween("num-text",function(t,e){var a=d3.interpolateRound(y[e],t.value);return y[e]=t.value,function(t){this.setAttribute("x",F(a(t))+15),this.textContent=a(t)+" 人"}}),$(document).scroll(function(){var e=$(t).scrollTop();e>$("#X-element.report-section").offset().top-300&&(c.transition().duration(1500).attr("width",parseFloat(a[0].man.replace(/,/gi,""))/parseFloat(a[0].population.replace(/,/gi,""))*p),u.transition().duration(1e3).attr("width",parseFloat(a[0].girl.replace(/,/gi,""))/parseFloat(a[0].population.replace(/,/gi,""))*p)),e>$("#Y-element.report-section").offset().top-300&&(f.selectAll("rect").transition().duration(function(){return 900*(Math.random()+.3)}).attr("width",function(t){return 10*t.value}),f.selectAll("path").transition().delay(500).duration(300).style("opacity",1),f.selectAll("text").transition().delay(500).duration(300).style("opacity",1))});var b=!0;$(".btn-change-population-data").click(function(){b?$(".btn-change-population-data").text("點我看 出生 / 死亡"):$(".btn-change-population-data").text("點我看 移入 / 移出"),r(v,!b),b=!b}),e=function(t){var e={},a=[].concat(_toConsumableArray(t));return l.population=a[0].population,l.density=parseFloat(a[0].density),l.man=a[0].man,l.girl=a[0].girl,l.sexRatio=parseFloat(a[0].sexRatio),l.raiseRatio=parseFloat(a[0].sexRatio),l.zero_fourteen_num=a[0].zero_fourteen_num,l.fifteen_sixtyFour_num=a[0].fifteen_sixtyFour_num,l.sixtyFiveUp_num=a[0].sixtyFiveUp_num,l.zero_fourteen_percent=parseFloat(a[0].zero_fourteen_percent),l.fifteen_sixtyFour_percent=parseFloat(a[0].fifteen_sixtyFour_percent),l.sixtyFiveUp_percent=parseFloat(a[0].sixtyFiveUp_percent),l.zero_five_percent=parseFloat(a[0].zero_five_percent),l.six_twelve_percent=parseFloat(a[0].six_twelve_percent),l.thirteen_fifteen_percent=parseFloat(a[0].thirteen_fifteen_percent),l.sixteen_eighteen_percent=parseFloat(a[0].sixteen_eighteen_percent),l.nighteen_thirty_percent=parseFloat(a[0].nighteen_thirty_percent),l.thirtyOne_fifty_percent=parseFloat(a[0].thirtyOne_fifty_percent),l.fiftyOne_sixtyFour_percent=parseFloat(a[0].fiftyOne_sixtyFour_percent),l.naturalIncrease_num=a[0].naturalIncrease_num,l.naturalIncrease_percent=parseFloat(a[0].naturalIncrease_percent),l.marry_num=a[0].marry_num,l.marry_percent=parseFloat(a[0].marry_percent),l.divorce_num=a[0].divorce_num,l.divorce_percent=parseFloat(a[0].divorce_percent),l.born_num=a[0].born_num,l.death_num=a[0].death_num,l.immigration_num=a[0].immigration_num,l.leaving_num=a[0].leaving_num,l.society_num=a[0].society_num,l.society_percent=parseFloat(a[0].society_percent),a.forEach(function(t){var a=parseFloat(t.population.replace(/,/gi,"")),r=parseFloat(t.density),n=parseFloat(t.zero_fourteen_percent),o=parseFloat(t.fifteen_sixtyFour_percent),i=parseFloat(t.sixtyFiveUp_percent),s=parseFloat(t.sexRatio),p=parseFloat(t.raiseRatio);e[t.area.replace(/\s/gi,"")]={isDensityOver:r>l.density,density:formatFloat(r,0),populationPercent:formatFloat(a/parseFloat(l.population.replace(/,/gi,""))*100,1),zeroFourteenPercent:n,fifteenSixtyFourPercent:o,sixtyFiveUpPercent:i,raiseRatio:p,sexRatio:s}}),e}(a),console.log(e,l)}),d3.json("./src/data/tainan-town.topo.json",function(t){var o=d3.geo.path().projection(d3.geo.mercator().center([120.72,23.1]).scale(35e3));a=topojson.feature(t,t.objects.tainan).features,n.selectAll("path").data(a).enter().append("path").attr({d:o,fill:function(t){var a=t.properties.TOWNNAME;return e[a].isDensityOver?r(e[a].density):"#D7DAE1"},stroke:"white","stroke-width":"1.5px"}).on("mouseover",function(t){var a=t.properties.TOWNNAME,r=e[a].density,n=e[a].sixtyFiveUpPercent;d3.select(this).style({stroke:"#333","stroke-width":"6px"}),$(".intro-area").html(a),$("#intro-density").html(p(r)),$("#deskMap-sex-ratio").html(e[a].sexRatio),$("#deskMap-sixtyFiveUp").html(n+" %"),$("#deskMap-fifteen-sixtyFour").html(e[a].fifteenSixtyFourPercent+" %"),$("#deskMap-zero-fourteen").html(e[a].zeroFourteenPercent+" %"),$("#deskMap-intro-num").html(function(){var t=e[a].raiseRatio,r=parseFloat(t/10);return r>4?($("#deskMap-intro-word").text("社會中的無生產能力人口比例將會越來越重..."),$("#deskMap-intro-num").addClass(" color-red p-size-big")):($("#deskMap-intro-word").text("年輕人的負擔將越變越大..."),$("#deskMap-intro-num").removeClass(" color-red p-size-big")),r}),$("#deskMap-ages-text").html(function(){var t=formatFloat(parseFloat(14-n),1);return n>20?'OMG 已經達到<span class="color-red">超高齡社會</span> 的標準了！老年人口佔人口的 20%以上了！':n>14?'已達到 <span class="color-red">高齡社會</span> 的標準！老年人口佔人口的 14%以上。':'離高齡化社會只差 <span class="color-red">'+t+" %</span>，要注意啊！"}),e[a].isDensityOver?$("#intro-density").addClass("p-size-big color-red"):$("#intro-density").removeClass("p-size-big color-red")}).on("mouseleave",function(t){d3.select(this).style({stroke:"white","stroke-width":"1.5px"})})});var c=function(t){o.selectAll("*").remove();var r=d3.geo.path().projection(d3.geo.mercator().center([121.55,22.58]).scale(16e3));o.selectAll("path").data(a).enter().append("path").attr({d:r,fill:function(e){return e.properties.TOWNNAME===t?"#FFAA0A":"#D7DAE1"},stroke:"white","stroke-width":"1.5px"});var n=e[t].density;$("#mobile-area").text(t),$("#mobile-population-percent").html("&nbsp;"+e[t].populationPercent+"%&nbsp;"),$("#mobile-density").html("&nbsp;"+n+"&nbsp;"),e[t].isDensityOver?$("#mobile-density").addClass("p-size-big color-red"):$("#mobile-density").removeClass("p-size-big color-red")};$(".ui.dropdown").dropdown({onChange:function(t,e){$("#map-modal").modal("show"),c(e)}}),$(".ui.pointing.menu .item").click(function(){var t=$(this).data("container");$(".container.active").removeClass("active"),$("."+t).addClass("active"),$(".item.active").removeClass("active"),$(this).addClass("active")})}(window);