"use strict";var map=L.map("well-living-map",{renderer:L.canvas()}).setView([23.1,120.3],11);map.scrollWheelZoom.disable();var mapLayer=L.tileLayer("http://{s}.tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png",{maxZoom:18,attribution:'&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'}).addTo(map),isLoadSensitiveData=!1,sensitiveArea,liquefactionArea,waterArea,w600Layer,w200Layer,sLayer,lLayer,countryW600Layer,countryW200Layer,sStyle={color:"#E91E63",fillOpacity:.8,weight:0},lStyle={color:"#8BC34A",fillOpacity:.8,weight:0},wStyle={color:"#3F51B5",fillOpacity:.8,weight:0},info='<span><span class="info-block bg-liquefaction"></span><strong>土壤液化潛勢區</strong></span>';info+='<span><span class="info-block bg-water"></span><strong>淹水潛勢區</strong></span>',$("#map-info").append(info),$.getJSON("./src/data/disaster-liquefaction.json",function(e){liquefactionArea=e,lLayer=L.geoJSON(liquefactionArea,{style:function(e){switch(e.properties["分級"]){case"低潛勢":lStyle.fillOpacity=.5;break;case"中潛勢":lStyle.fillOpacity=.7;break;case"高潛勢":lStyle.fillOpacity=.9;break;default:console.log("undefined error")}return lStyle}}).addTo(map)}),$.getJSON("./src/data/disaster-water600.json",function(e){waterArea=e,w600Layer=L.geoJSON(waterArea,{style:function(e){switch(e.properties.CLASS){case 1:wStyle.fillOpacity=.5;break;case 2:wStyle.fillOpacity=.7;break;case 3:wStyle.fillOpacity=.9;break;default:console.log("undefined error")}return wStyle}}).addTo(map)}),$.getJSON("./src/data/disaster-water200.json",function(e){w200Layer=L.geoJSON(e)}),$.getJSON("./src/data/disaster-country-water200.json",function(e){countryW200Layer=L.geoJSON(e)}),$.getJSON("./src/data/disaster-country-water600.json",function(e){countryW600Layer=L.geoJSON(e,{style:function(e){switch(e.properties.CLASS){case 1:wStyle.fillOpacity=.5;break;case 2:wStyle.fillOpacity=.7;break;case 3:wStyle.fillOpacity=.9;break;default:console.log("undefined error")}return wStyle}}).addTo(map)}),L.Control.geocoder({collapsed:!1,placeholder:"請輸入地址或地名查詢...",errorMessage:"查無此地址",geocoder:new L.Control.Geocoder.Google("AIzaSyARIN80OjEjl4O24neRkXZgAo7hTKqVhD4")}).on("markgeocode",function(e){console.log("geocoder",e),latlng=e.geocode.center,name=e.geocode.name,lResult=leafletPip.pointInLayer(latlng,lLayer,!0),isLoadSensitiveData&&(sResult=leafletPip.pointInLayer(latlng,sLayer,!0)),w600Result=leafletPip.pointInLayer(latlng,w600Layer,!0),w200Result=leafletPip.pointInLayer(latlng,w200Layer,!0),countryW600Result=leafletPip.pointInLayer(latlng,countryW600Layer,!0),countryW200Result=leafletPip.pointInLayer(latlng,countryW200Layer,!0),console.log("lLayer",lResult),isLoadSensitiveData&&console.log("sLayer",sResult),console.log("wLayer",w600Result),lresponse=lResult.length>0?lResult[0].feature.properties["分級"]:"無潛勢",isLoadSensitiveData&&(sresponse=sResult.length>0?"是":"否"),w600Result.length>0&&0===w200Result.length?(wresponse="雨量達600mm時，可能淹水",wresponse+=w600Result[0].feature.properties.NOTE.replace("(","").replace(")","")):w600Result.length>0&&w200Result.length>0?(wresponse="雨量達200mm時(即豪雨)，可能淹水",wresponse+=w200Result[0].feature.properties.NOTE.replace("(","").replace(")",""),wresponse+="<br>雨量達600mm時，可能淹水",wresponse+=w600Result[0].feature.properties.NOTE.replace("(","").replace(")","")):0===w600Result.length&&w200Result.length>0?(wresponse="雨量達200mm時(即豪雨)，可能淹水",wresponse+=w200Result[0].feature.properties.NOTE.replace("(","").replace(")","")):countryW600Result.length>0&&0===countryW200Result.length?(wresponse="雨量達600mm時，可能淹水",wresponse+=countryW600Result[0].feature.properties.NOTE.replace("(","").replace(")","")):countryW600Result.length>0&&countryW200Result.length>0?(wresponse="雨量達200mm時(即豪雨)，可能淹水",wresponse+=countryW200Result[0].feature.properties.NOTE.replace("(","").replace(")",""),wresponse+="<br>雨量達600mm時，可能淹水",wresponse+=countryW600Result[0].feature.properties.NOTE.replace("(","").replace(")","")):0===countryW600Result.length&&countryW200Result.length>0?(wresponse="雨量達200mm時(即豪雨)，可能淹水",wresponse+=countryW200Result[0].feature.properties.NOTE.replace("(","").replace(")","")):wresponse="無潛勢",isLoadSensitiveData?info.update({name:name,l:lresponse,s:sresponse,w:wresponse}):info.update({name:name,l:lresponse,w:wresponse})}).addTo(map);var info=L.control();info.onAdd=function(e){return this._div=L.DomUtil.create("table","ui table"),this.update(),this._div},info.update=function(e){console.log(e),e&&(this._div.innerHTML=isLoadSensitiveData?'<tbody><thead><tr><th colspan="2">'+e.name+"</th></tr></thead><tr><td>地質敏感區</td><td>"+e.s+"</td></tr><tr><td>土壤液化潛勢</td><td>"+e.l+"</td></tr><tr><td>淹水潛勢</td><td>"+e.w+"</td></tr></tbody>":'<tbody><thead><tr><th colspan="2">'+e.name+"</th></tr></thead><tr><td>土壤液化潛勢</td><td>"+e.l+"</td></tr><tr><td>淹水潛勢</td><td>"+e.w+"</td></tr></tbody>")},info.addTo(map),$("#s-loadin").on("click",function(){isLoadSensitiveData||($("#s-loadin").addClass("loading"),$.getJSON("./src/data/disaster-sensitive.json",function(e){sensitiveArea=e,sLayer=L.geoJSON(sensitiveArea,{style:sStyle}).addTo(map),$("#s-loadin").removeClass("loading");var t='<span><span class="info-block" style="background-color:'+sStyle.color+'"></span><strong>地質敏感區</strong></span>';t+='<span><span class="info-block bg-liquefaction"></span><strong>土壤液化潛勢區</strong></span>',t+='<span><span class="info-block bg-water"></span><strong>淹水潛勢區</strong></span>',$("#map-info").html(t)}),isLoadSensitiveData=!0)});