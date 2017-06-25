"use strict";function formatData(t){for(var e={name:t[0].name,budget_106:t[0].budget_106,budget_105:t[0].budget_105,final_accounts_104:t[0].final_accounts_104,compare_106_105:t[0].compare_106_105,children:[]},a=0,r=1;r<t.length;r++){var n=parseInt(t[r].subject,10);n===a+1&&(a+=1),n===a&&(t[r].item?e.children[a-1].children.push({name:t[r].name,budget_106:t[r].budget_106,budget_105:t[r].budget_105,final_accounts_104:t[r].final_accounts_104,compare_106_105:t[r].compare_106_105,item:parseInt(t[r].item,10),children:[]}):e.children.push({name:t[r].name,budget_106:t[r].budget_106,budget_105:t[r].budget_105,final_accounts_104:t[r].final_accounts_104,compare_106_105:t[r].compare_106_105,item:n,children:[]}))}return e}function update(t,e){function a(t){$(".detail-container").addClass("show");var e=Math.floor(Math.random()*$(".ui.bulleted.list .item").length),a=".ui.bulleted.list .item:eq("+e+")",r=parseFloat(t.budget_106.replace(/,/gi,"")),i=parseFloat(t.budget_105.replace(/,/gi,"")),o=parseFloat(t.final_accounts_104.replace(/,/gi,"")),l=parseFloat(t.compare_106_105.replace(/,/gi,""))/i,c=p(r),d=parseFloat(n.budget_106.replace(/,/gi,"")),s=1===t.id?d:parseFloat(t.parent.budget_106.replace(/,/gi,"")),m=t._children?t._children.length:0;r=isNaN(r)?0:r,$("#percentParent").text(g(r,s,$("#percentParent"))),$("#percentAll").text(g(r,d,$("#percentAll"))),$("#children").text(m),$(".ui.bulleted.list .item").hide(),$(a).show(),r=u(r),i=u(i),o=u(o),l=isNaN(l)?0:l,$("#item").text(t.name),$("#budget_106").text(r),$("#budget_105").text(i),$("#compare_106_105").text(function(){return l>=0?($(this).addClass("positive"),"+ "+formatFloat(l,2)+"%"):($(this).removeClass("positive"),formatFloat(l,2)+"%")}),$("#final_accounts_104").text(o),$("#change-drink-num-description").text(function(){var t=parseInt(2e6*c,10),e=parseInt(t/1e4,10);return 0===e?t+" 杯鮮奶茶":e+"(萬) 杯鮮奶茶"}),$("#change-wage-num-description").text(function(){var t=parseInt(c*(1e8/21009),10);return parseInt(t/12,10)+" 年"}),$("#change-money-num-description").text(function(){var t=parseInt(1e8*c/1e5/100,10);parseInt(t/3,10);return t+" 層樓(3公尺/層)"})}var r=!(arguments.length>2&&void 0!==arguments[2])||arguments[2],n="svg-annual-income"===e?root1:root2,i=tree.nodes(n),o=Math.max(150,i.length*barHeight+margin.top+margin.bottom);d3.select("#"+e).transition().duration(duration).attr("height",r?150:o),i.forEach(function(t,e){t.x=e*barHeight}),r&&(i[0]._children=i[0].children,i[0].children=null,i=[i[0]]);var l=d3.select("#"+e+" > g"),c=l.selectAll("g.node").data(i,function(t,e){return t.id||(t.id=++e)}),d=c.enter().append("g").attr("class","node").attr("transform","translate("+t.y0+","+t.x0+")");d.append("rect").attr("y",-barHeight/2).attr("height",barHeight).attr("width",barWidth).attr("class",function(t){return t._children?"rect collapse-close":"rect"}).style("fill",color).on("click",function(t){t.children?(t._children=t.children,t.children=null,d3.select(this).attr("class","rect collapse-close")):(t.children=t._children,t._children=null,d3.select(this).attr("class","rect")),update(t,e,!1)}).on("mouseenter",a).on("mouseleave",function(){$(".detail-container").removeClass("show")}),d.append("text").attr("dy",3.5).attr("dx",5.5).text(function(t){if(1===t.depth){var e=parseFloat(t.budget_106.replace(/,/gi,"")),a=parseFloat(n.budget_106.replace(/,/gi,""));return t.name+"("+formatFloat(e/a*100,1)+"%): "+t.budget_106}return t.name+": "+t.budget_106}),d.append("text").attr("dy",3.5).attr("dx",5.5).attr("class","collapse-mark").attr("transform","translate("+.75*$("#"+e).width()+", 0)").style("display",function(t){return t.depth>=2?"none":"block"}).text("-"),d.transition().duration(duration).attr("transform",function(t){return"translate("+t.y+","+t.x+")"}),c.select(".collapse-mark").text(function(t){return t.children?"-":"+ "}),c.transition().duration(duration).attr("transform",function(t){return"translate("+t.y+","+t.x+")"}).select("rect").style("fill",color),c.exit().transition().duration(duration).attr("transform","translate("+t.y0+","+t.x0+")").remove();var s=l.selectAll("path.link").data(tree.links(i),function(t){return t.target.id});s.enter().insert("path","g").attr("class","link").attr("d",function(){var e={x:t.x0,y:t.y0};return diagonal({source:e,target:e})}).transition().duration(duration).attr("d",diagonal),s.transition().duration(duration).attr("d",diagonal),s.exit().transition().duration(duration).attr("d",function(){var e={x:t.x,y:t.y};return diagonal({source:e,target:e})}).remove(),i.forEach(function(t){t.x0=t.x,t.y0=t.y});var u=function(t){if(isNaN(t))return 0;var e=t/1e5;return e<.005?t/10+" 萬元":formatFloat(e,2)+" 億元"},p=function(t){return isNaN(t)?0:t/1e5},g=function(t,e,a){var r=t/e*100;return r>=10?a.addClass("color-red p-size-big"):a.removeClass("color-red p-size-big"),formatFloat(r,1)}}var d3=window.d3,$=window.$,Vue=window.Vue,formatFloat=formatFloat,isMobile=isMobile,margin={top:30,right:20,bottom:30,left:20},barHeight=isMobile?40:30,barWidth="80%",duration=400,color=function(t){return t._children?"#F34708":t.children?"#FFAA0A":"#D7DAE1"},root1=void 0,root2=void 0,tree=d3.layout.tree().nodeSize([0,20]),diagonal=d3.svg.diagonal().projection(function(t){return[t.y,t.x]}),vm=new Vue({el:"#debt",data:{tableData:[]},delimiters:["${","}"],created:function(){d3.csv("./src/data/money_debt.csv",function(t){$.each(t,function(t,e){vm.tableData.push(e)})})}});$("table").tablesort(),$("thead th.sortByValue").data("sortBy",function(t,e,a){return Number.parseFloat(e.text())}),d3.csv("./src/data/money_revenue_106.csv",function(t){var e=formatData(t);d3.select("#svg-annual-income").append("g").attr("transform","translate("+margin.left+","+margin.top+")"),e.x0=0,e.y0=0,update(root1=e,"svg-annual-income",!1)}),d3.csv("./src/data/money_expenditure_106.csv",function(t){var e=formatData(t);d3.select("#svg-annual-expenditure").append("g").attr("transform","translate("+margin.left+","+margin.top+")"),e.x0=0,e.y0=0,update(root2=e,"svg-annual-expenditure")});