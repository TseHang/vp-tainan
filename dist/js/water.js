"use strict";function site(){function t(t,i){i.on({mouseover:n,mouseout:e,click:o})}function o(t){var o=t.target;for(var n in h)for(var e in h[n].options.town)if(o.feature.properties.TOWNNAME===h[n].options.town[e]){var i=h[n];i.setOpacity(1),i.openPopup(),c===o&&!0===l?(s&&s.closePopup(),i.closePopup(),l=!1):l=!0,c=o,s=i;for(var r in i.options.town)for(var a in p._layers)p._layers[a].feature.properties.TOWNNAME===i.options.town[r]&&p._layers[a].setStyle({weight:2,color:"#758de5",fillColor:"#758de5",fillOpacity:.7})}}function n(t){var o=t.target;for(var n in h)for(var e in h[n].options.town)if(o.feature.properties.TOWNNAME===h[n].options.town[e]){var i=h[n];i.setOpacity(1);for(var r in i.options.town)for(var a in p._layers)p._layers[a].feature.properties.TOWNNAME===i.options.town[r]&&p._layers[a].setStyle({weight:2,color:"#758de5",fillColor:"#758de5",fillOpacity:.7})}f.update(o.feature.properties),o.setStyle({weight:2,color:"#666",fillOpacity:.7}),L.Browser.ie||L.Browser.opera||L.Browser.edge||o.bringToFront()}function e(t){p.resetStyle(t.target);for(var o in p._layers)p.resetStyle(p._layers[o]);for(var n in h)h[n].setOpacity(.5)}function i(){u=new L.Map("siteMap",{center:new L.LatLng(23.13,120.3),zoom:10.2}),u.touchZoom.disable(),u.doubleClickZoom.disable(),u.scrollWheelZoom.disable(),u.boxZoom.disable(),u.keyboard.disable();new L.TileLayer("https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoicmFwaXJlbnQiLCJhIjoiY2oybXBsc2ZvMDE2YjMycGg4NzNkYXI0OSJ9.xC8TBirQ2os2eQ65hwTCMA",{minZoom:1,maxZoom:20,attribution:'&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'}).addTo(u),f.addTo(u),g.addTo(u),m.addTo(u),$.ajax({type:"GET",url:"./src/data/淨水廠.csv",dataType:"text",success:function(t){var o=$.csv.toObjects(t);for(var n in o){var e=L.ExtraMarkers.icon({icon:"fa-tint",iconColor:"white",markerColor:r(o[n]),shape:"circle",prefix:"fa"}),i=L.marker(L.latLng(o[n].lat,o[n].lng),{icon:e,town:o[n]["轄區"].split("、"),name:o[n]["淨水場名稱"],opacity:.5}).addTo(u);i.bindPopup('<p><span class="p-font-bold">'+o[n]["淨水場名稱"]+'</span><br>主要供水轄區:<span class="p-font-bold">'+o[n][" 主要供水轄區"]+'</span><br>總溶解固體量(Total Dissolved Solids):<span class="p-font-bold">'+o[n]["總溶解固體量(Total Dissolved Solids)"]+'</span><br>pH值(pH ):<span class="p-font-bold">'+o[n]["pH值(pH )"]+'</span><br>總硬度(Total Hardness):<span class="p-font-bold">'+o[n]["總硬度(Total Hardness)"]+'</span><br>水質合格否(Y/N):<span class="p-font-bold" style="color: red;">'+o[n]["水質合格否(Y/N)"]+"</span></p>"),i.on("popupopen",function(){this.setOpacity(1)}),i.on("popupclose",function(){u.setView(new L.LatLng(23.13,120.3),10.2),this.setOpacity(.5)}),i.on("mouseover",function(){this.setOpacity(1);var t=this.options.town;for(var o in t)for(var n in p._layers)if(p._layers[n].feature.properties.TOWNNAME===t[o]){var e=p._layers[n];e.setStyle({weight:2,color:"#758de5",fillColor:"#758de5",fillOpacity:.7})}}),i.on("mouseout",function(){this.setOpacity(.5);var t=this.options.town;for(var o in t)for(var n in p._layers)p._layers[n].feature.properties.TOWNNAME===t[o]&&p.resetStyle(p._layers[n])}),h.push(i)}}})}function r(t){return"Y"===t["水質合格否(Y/N)"].toString()?"blue":"N"===t["水質合格否(Y/N)"].toString()?"red":"black"}function a(t){return{fillColor:"#333",weight:2,opacity:1,color:"#eee",dashArray:"3",fillOpacity:.4}}var s=null,c=null,l=!1,d=void 0,p=void 0,u=void 0,f=L.control().setPosition("bottomleft"),g=L.control(),m=L.control(),h=[];$.getJSON("./src/data/tainan-town.geojson",function(o){d=o,p=L.geoJson(d,{style:a,onEachFeature:t}),p.addTo(u),f.update()}),$(document).ready(function(){i()}),f.onAdd=function(t){return this._div=L.DomUtil.create("div","siteInfo"),this._div.innerHTML="<h4>圖層載入中</h4>",this._div},f.update=function(t){if(t)for(var o in h)for(var n in h[o].options.town)h[o].options.town[n]===t.TOWNNAME&&(this._div.innerHTML='<p><h4><span class="p-font-bold">'+t.TOWNNAME+'</span></h4>所屬淨水廠名稱:<span class="p-font-bold">'+h[o].options.name+"</span></p>");else this._div.innerHTML="<h4>請點選畫面區塊</h4>"},g.onAdd=function(){var t=L.DomUtil.create("button","ui compact icon button"),o=L.DomUtil.create("i","undo icon",t);return $(o).on("click",function(){u.setView([23.13,120.3],10.2)}),$(o).attr("title","回到台南"),t},m.onAdd=function(){var t=L.DomUtil.create("button","ui compact icon button"),o=L.DomUtil.create("i","unhide icon",t);return $(o).on("click",function(){if(navigator.geolocation)return navigator.geolocation.getCurrentPosition(function(t){u.setView(new L.LatLng(t.coords.latitude,t.coords.longitude),12)})}),$(o).attr("title","取得您的位置"),t}}function river(){function t(){$.getJSON("./src/data/siteInfo.json",function(t){d=t;for(var n in d)if(d[n].SiteName in p){if(p[d[n].SiteName].RPI=parseFloat(p[d[n].SiteName].RPI),isNaN(p[d[n].SiteName].RPI))continue;var i=o(p[d[n].SiteName].RPI),r=L.ExtraMarkers.icon({prefix:"fa",icon:"fa-map-marker",iconColor:"white",markerColor:i.color,shipe:"circle"}),a=L.marker([d[n].TWD97Lat,d[n].TWD97Lon],{icon:r,opacity:.9}).addTo(l);a.bindPopup('<p><span class="p-font-bold">測站名稱：'+d[n].SiteName+'</span><br/>污染程度：<span class="p-font-bold" style="color: red;">'+i.disc+'</span><br/>所屬流域：<span class="p-font-bold">'+d[n].Basin+'</span><br/>RPI指標：<span class="p-font-bold">'+p[d[n].SiteName].RPI+'</span><br/>酸鹼值：<span class="p-font-bold">'+p[d[n].SiteName].PH+'</span><br/>懸浮固體：<span class="p-font-bold">'+p[d[n].SiteName].SS+'（mg/L）</span><br/>溶氧量：<span class="p-font-bold">'+p[d[n].SiteName].DO+'（mg/L）</span><br/>生化需氧量：<span class="p-font-bold">'+p[d[n].SiteName].COD+'（mg/L）</span><br/>氨氮：<span class="p-font-bold">'+p[d[n].SiteName].NH3N+'（mg/L）</span><br/>地址：<span class="p-font-bold">'+d[n].SiteAddress),d[n].Basin in f?(f[d[n].Basin].RPI+=p[d[n].SiteName].RPI,f[d[n].Basin].siteNumber+=1):(f[d[n].Basin]={},f[d[n].Basin].RPI=p[d[n].SiteName].RPI,f[d[n].Basin].siteNumber=1)}for(var n in f)f[n].RPI=parseFloat(f[n].RPI)/f[n].siteNumber;u=L.geoJson(g,{style:e,onEachFeature:c}),u.addTo(l)})}function o(t){return t<=2?{disc:"未(稍)受污染",color:"blue"}:t<=3?{disc:"輕度污染",color:"orange"}:t<=6?{disc:"中度污染",color:"red"}:{disc:"嚴重污染",color:"darkpurple"}}function n(){l=new L.Map("RiverMap",{center:new L.LatLng(23.13,120.3),zoom:10.2}),l.doubleClickZoom.disable(),l.scrollWheelZoom.disable();new L.TileLayer("https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoicmFwaXJlbnQiLCJhIjoiY2oybXBsc2ZvMDE2YjMycGg4NzNkYXI0OSJ9.xC8TBirQ2os2eQ65hwTCMA",{minZoom:1,maxZoom:16,attribution:'&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'}).addTo(l),m.addTo(l),v.addTo(l),h.addTo(l),y.addTo(l)}function e(t){return{fillColor:i(t.properties.name),weight:2,opacity:1,color:"#eee",dashArray:"3",fillOpacity:.4}}function i(t){var o=0;return t+"流域"in f?(o=f[t+"流域"].RPI,o<=2?"#39AADD":o<=3?"#E39941":o<=6?"#D24C39":"#684064"):"transparent"}function r(t){var o=t.target;o.setStyle({weight:5,color:"#666",dashArray:"",fillOpacity:.5}),L.Browser.ie||L.Browser.opera||o.bringToFront(),m.update(o.feature.properties)}function a(t){u.resetStyle(t.target)}function s(t){l.fitBounds(t.target.getBounds()),m.update(t.target.feature.properties)}function c(t,o){o.on({mouseover:r,mouseout:a,click:s})}var l=void 0,d=void 0,p=void 0,u=void 0,f={},g=null,m=L.control(),h=L.control().setPosition("topleft"),y=L.control().setPosition("topleft"),v=L.control({position:"bottomleft"});$.getJSON("./src/data/tainanCounty2010merge.json",function(t){t=L.geoJson(t,{style:{fillColor:"#333",weight:2,opacity:1,color:"#eee",dashArray:"3",fillOpacity:.4}}),t.addTo(l)}),$.getJSON("./src/data/river.geojson",function(t){g=t,u=L.geoJson(g,{style:e,onEachFeature:c}),u.addTo(l),m.update()}),$(document).ready(function(){n(),$.getJSON("./src/data/river.json",function(o){p=o,t()})}),m.onAdd=function(t){return this._div=L.DomUtil.create("div","riverInfo"),this._div.innerHTML="<h4>流域圖層載入中 </h4>",this._div},m.update=function(t){t&&t.name+"流域"in f?this._div.innerHTML="<h4>河川流域名稱："+(t?t.name+"</h4>平均污染指數RPI："+f[t.name+"流域"].RPI.toFixed(1):"</h4>請點選畫面區塊"):this._div.innerHTML="<h4>河川流域名稱："+(t?t.name+"</h4>流域內無測站資料":"</h4>請點選畫面區塊")},v.onAdd=function(t){for(var o=L.DomUtil.create("div","riverInfo legend"),n=["#684064","#D24C39","#E39941","#39AADD"],e=["嚴重污染（6+）","中度污染（3-6）","輕度污染（2-3）","未（稍）受污染（0-2）"],i=0;i<e.length;i++)o.innerHTML+='<i style="background:'+n[i]+'"></i>'+e[i]+"<br/>";return o},h.onAdd=function(){var t=L.DomUtil.create("button","ui compact icon button"),o=L.DomUtil.create("i","undo icon",t);return $(o).on("click",function(){l.setView([23.13,120.3],10.2)}),$(o).attr("title","縮放至整個台南市"),t},y.onAdd=function(){var t=L.DomUtil.create("button","ui compact icon button"),o=L.DomUtil.create("i","unhide icon",t);return $(o).on("click",function(){if(navigator.geolocation)return navigator.geolocation.getCurrentPosition(function(t){l.setView(new L.LatLng(t.coords.latitude,t.coords.longitude),12)})}),$(o).attr("title","取得您的位置"),t}}function rain(){function t(){d3.csv("./src/data/酸雨監測值.csv",function(t,o){t&&console.log(t);var n=function(t){var o=[];for(var n in t)o.push(t[n]["監測日期"]);return o}(o),e=d3.max(o,function(t){return parseFloat(t["酸雨pH值"])}),i=d3.min(o,function(t){return parseFloat(t["酸雨pH值"])}),r=d3.scale.linear().domain([0,o.length]).range([padding+axisPadding,width-margin.left-margin.right-padding]),a=d3.scale.linear().domain([i,e]).range([height-margin.top-margin.bottom-padding,padding]),s=d3.select(".initChart"),c=void 0,l=d3.svg.axis().scale(a).tickSize(1).orient("left");$(window).width()<768?(c=d3.svg.axis().scale(r).tickFormat("").tickSize(0).orient("bottom"),$(".rainInfo").css("display","block")):($(".rainInfo").css("display","none"),c=d3.svg.axis().scale(r).tickFormat(function(t,o){return n[o]}).tickSize(1).ticks(o.length).orient("bottom"),s.append("text").attr({class:"yLabel","text-anchor":"end",x:axisPadding,y:height-margin.top-margin.bottom-padding,dy:"2em",opacity:.5}).text("(pH值)")),s.append("g").attr({class:"yAxis",transform:"translate("+axisPadding+",0)"}).call(l).append("text").attr({"text-anchor":"start"}),s.append("g").attr({class:"xAxis",transform:"translate(0,"+(height-margin.top-margin.bottom)+")"}).call(c).selectAll("text").style("text-anchor","start").attr({transform:"rotate(45)"});var d=d3.svg.line().x(function(){return r(1)}).y(function(){return a(i)}).interpolate("linear"),p=d3.svg.line().x(function(t,o){return r(o)}).y(function(t){return a(t["酸雨pH值"])}).interpolate("linear");s.append("path").attr({id:"line",d:d(o),y:0,stroke:"#666","stroke-width":"0.5px",fill:"none"}).transition().duration(1500).attr("d",p(o));var u=d3.select("body").append("div").attr("class","info").style("opacity",0),f=0,g=s.selectAll(".point").data(o).enter().append("circle").attr({cx:function(){return r(1)},cy:function(t){return a(i)},r:function(t){if(!0===trigger)return 9;var o=Math.sqrt(10*t["雨量累計 (mm)"]);return o<9?9:o},fill:function(t){return t["酸雨pH值"]>=5.6?"#758de5":t["酸雨pH值"]>=5?"#ff7800":"red"},opacity:.5,class:"rainPoint",id:function(t){return t["序號"]},date:function(t){return t["監測日期"]},pH:function(t){return t["酸雨pH值"]},total:function(t){return t["雨量累計 (mm)"]},site:function(t){return t["測站"]}});g.transition().duration(1500).attr({cx:function(t,o){return r(o)},cy:function(t){return a(t["酸雨pH值"])}}),$(window).width()>=768?g.on("mouseover",function(){d3.select(this).attr({opacity:.9,stroke:"rgba(0, 0, 0, 0.12)","stroke-width":2,cursor:"pointer"}),u.html('<div id="info"><p>測站: <span class="p-font-bold">'+d3.select(this).attr("site")+'</span></p><p>酸雨pH值: : <span class="p-font-bold" style="color: red;">'+d3.select(this).attr("pH")+'</span></p><p>監測日期: <span class="p-font-bold">'+d3.select(this).attr("date")+'</span></p><p>雨量累計 (mm): <span class="p-font-bold">'+d3.select(this).attr("total")+"</div>").style({left:d3.event.pageX+"px",top:d3.event.pageY+"px",opacity:1,"z-index":999})}).on("mouseout",function(){d3.select(this).attr({opacity:.5,stroke:"rgba(0, 0, 0, 0.12)","stroke-width":0}),u.style({opacity:0,"z-index":-1})}):g.on("click",function(){$(".rainInfo").css("display","block"),d3.select(this).attr("id")!==f?(f=d3.select(this).attr("id"),$(".rainInfo").empty().html('<div id="info"> 監測日期: <strong>'+d3.select(this).attr("date")+"</strong><br>雨水導電度 (μS/cm): <strong>"+d3.select(this).attr("elect")+"</strong><br>雨量累計 (mm): <strong>"+d3.select(this).attr("total")+"</strong><br>測站: <strong>"+d3.select(this).attr("site")+"</div>"),d3.selectAll(".rainPoint").style({opacity:.5,stroke:"rgba(0, 0, 0, 0.12)","stroke-width":0}),d3.select(this).style({opacity:.9,stroke:"rgba(0, 0, 0, 0.12)","stroke-width":2,cursor:"pointer"})):(f=0,d3.select(this).style({opacity:.5,stroke:"rgba(0, 0, 0, 0.12)","stroke-width":0}),$(".rainInfo").css("display","none"))})})}$(document).ready(function(){d3.selectAll("initChart").remove(),d3.select("#column").append("initChart").append("svg").attr("width",width).attr("height",height).attr("class","initChart"),t()})}function groundwater(){function t(t){return{fillColor:"#333",weight:2,opacity:1,color:"#eee",dashArray:"3",fillOpacity:.4}}function o(t){p.fitBounds(t.target.getBounds()),d=!0}function n(t,n){n.on({mouseover:e,mouseout:i,click:o})}function e(t){var o=t.target;l.update(o.feature.properties),o.setStyle({weight:2,color:"#666",fillOpacity:.7}),L.Browser.ie||L.Browser.opera||L.Browser.edge||o.bringToFront()}function i(t){u.resetStyle(t.target)}function r(t){var o={},n=!1;for(var e in a)t[e]>a[e]&&(n=!0,o[e+"  :"]=t[e]);return!0===n?{disc:o,color:"red"}:{disc:o,color:"blue"}}var a={"砷 Arsenic (mg/L)":.25,"鎘 Cadmium (mg/L)":.025,"鉻 Chromium (mg/L)":.25,"銅 Copper (mg/L)":.25,"鉛 Lead (mg/L)":.05,"汞 Mercury (mg/L)":.01,"鋅 Zinc (mg/L)":25,"鐵 Iron (mg/L)":1.5,"錳 Manganese (mg/L)":.25,"總硬度 Total Hardness (mg/L as CaCO3)":750,"總溶解固體物 Total Dissolved Solid (mg/L)":1250,"氯鹽 Chloride (mg/L)":625,"氨氮 NH3-N (mg/L)":.25,"硝酸鹽氮 Nitrate-Nitrogen (mg/L)":50,"硫酸鹽 Sulfate (mg/L)":625,"總有機碳 Total Organic Carbon (mg/L)":10},s=L.control().setPosition("topright"),c=L.control().setPosition("topright"),l=L.control().setPosition("bottomleft"),d=!1,p=void 0,u=void 0,f=null;$(document).ready(function(){$.getJSON("./src/data/tainan-town.geojson",function(o){f=o,u=L.geoJson(f,{style:t,onEachFeature:n}),u.addTo(p),s.addTo(p),c.addTo(p),l.addTo(p)})}),function(){p=new L.Map("groundWater",{center:new L.LatLng(23.13,120.3),zoom:10.2}),p.doubleClickZoom.disable(),p.scrollWheelZoom.disable(),new L.TileLayer("https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoicmFwaXJlbnQiLCJhIjoiY2oybXBsc2ZvMDE2YjMycGg4NzNkYXI0OSJ9.xC8TBirQ2os2eQ65hwTCMA",{minZoom:1,maxZoom:16,attribution:'&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'}).addTo(p),d3.csv("./src/data/地下水水質監測與指標資料.csv",function(t,o){t&&console.log(t);for(var n in o){var e=r(o[n]),i=L.ExtraMarkers.icon({icon:"fa-tint",iconColor:"white",markerColor:e.color,shape:"circle",prefix:"fa"}),a=L.marker(L.latLng(o[n].TWD97Lat,o[n].TWD97Lon),{icon:i,opacity:.7}).addTo(p),s="";for(var c in e.disc)s+="</span><br>"+c+'<span class="p-font-bold" sytle="color: red;">',s+=e.disc[c];a.on("popupopen",function(){this.setOpacity(1)}),a.on("popupclose",function(){this.setOpacity(.7),p.setView(new L.LatLng(23.13,120.3),10.2)}),a.bindPopup('<p>測站:<span class="p-font-bold">'+o[n]["測站"]+'</span></p><p>地址:<span class="p-font-bold">'+o[n].SiteAddress+'</span></p><p>最後採樣日期:<span class="p-font-bold">'+o[n]["採樣日期"]+"</span></p>"+(""===s?"<hr>無超標項目":"<hr>超標項目<span>")+s)}})}(),s.onAdd=function(){var t=L.DomUtil.create("button","ui compact icon button"),o=L.DomUtil.create("i","undo icon",t);return $(o).on("click",function(){p.setView([23.13,120.3],10.2)}),$(o).attr("title","回到台南"),t},c.onAdd=function(){var t=L.DomUtil.create("button","ui compact icon button"),o=L.DomUtil.create("i","unhide icon",t);return $(o).on("click",function(){if(navigator.geolocation)return navigator.geolocation.getCurrentPosition(function(t){p.setView(new L.LatLng(t.coords.latitude,t.coords.longitude),12)})}),$(o).attr("title","取得您的位置"),t},l.onAdd=function(t){return this._div=L.DomUtil.create("div","siteInfo"),this._div.innerHTML="<h4>區域資料載入中</h4>",this._div},l.update=function(t){this._div.innerHTML=t?"<h4>"+t.TOWNNAME+"</h4>":"<h4>請點選畫面區塊</h4>"}}var $=jQuery.noConflict(),margin={top:10,right:0,bottom:140,left:0},height=450,padding=30,barMargin=5,axisPadding=80,trigger=!1,width=800+axisPadding;$(window).ready(function(){$("#zoom_01").ezPlus(),site(),river(),rain(),groundwater(),$(window).width()<768&&(d3.selectAll("initChart").remove(),$("#siteMap, #groundWater").css({width:"100%",transform:"translateX(0)"}),$(".browser-in").css({display:"none"}),$(".mobile-in").css({display:"block"}),axisPadding=40,width=$(window).width()-90+axisPadding,margin.bottom=20,trigger=!0,rain()),$(window).resize(function(){$(window).width()<768&&!1===trigger?(d3.selectAll("initChart").remove(),$("#siteMap, #groundWater").css({width:"100%",transform:"translateX(0)"}),$(".browser-in").css({display:"none"}),$(".mobile-in").css({display:"block"}),axisPadding=40,width=$(window).width()-90+axisPadding,margin.bottom=20,trigger=!0,rain()):!0===trigger&&(d3.selectAll("initChart").remove(),$("#siteMap, #groundWater").css({width:"50%",transform:"translateX(50%)"}),$(".browser-in").css({display:"block"}),$(".mobile-in").css({display:"none"}),trigger=!1,axisPadding=80,width=800+axisPadding,margin.bottom=140,rain())})});