"use strict";function formatData(t){for(var e={name:t[0].name,budget_106:t[0].budget_106,budget_105:t[0].budget_105,final_accounts_104:t[0].final_accounts_104,compare_106_105:t[0].compare_106_105,children:[]},a=0,r=1;r<t.length;r++){var n=parseInt(t[r].subject,10);n===a+1&&(a+=1),n===a&&(t[r].item?e.children[a-1].children.push({name:t[r].name,budget_106:t[r].budget_106,budget_105:t[r].budget_105,final_accounts_104:t[r].final_accounts_104,compare_106_105:t[r].compare_106_105,item:parseInt(t[r].item,10),children:[]}):e.children.push({name:t[r].name,budget_106:t[r].budget_106,budget_105:t[r].budget_105,final_accounts_104:t[r].final_accounts_104,compare_106_105:t[r].compare_106_105,item:n,children:[]}))}return e}function update(t,e){function a(t){$(".detail-container").addClass("show");var e=parseFloat(t.budget_106.replace(/,/gi,"")),a=parseFloat(t.budget_105.replace(/,/gi,"")),r=parseFloat(t.final_accounts_104.replace(/,/gi,"")),o=parseFloat(t.compare_106_105.replace(/,/gi,""))/a,i=parseFloat(n.budget_106.replace(/,/gi,"")),l=1===t.id?i:parseFloat(t.parent.budget_106.replace(/,/gi,"")),c=t._children?t._children.length:0;e=isNaN(e)?0:e,$("#percentParent").text(g(e,l,$("#percentParent"))),$("#percentAll").text(g(e,i,$("#percentAll"))),$("#children").text(c),e=u(e),a=u(a),r=u(r),o=isNaN(o)?0:o,$("#item").text(t.name),$("#budget_106").text(e),$("#budget_105").text(a),$("#compare_106_105").text(function(){return o>=0?($(this).addClass("positive"),"+ "+formatFloat(o,2)+"%"):($(this).removeClass("positive"),formatFloat(o,2)+"%")}),$("#final_accounts_104").text(r)}var r=!(arguments.length>2&&void 0!==arguments[2])||arguments[2],n="svg-annual-income"===e?root1:root2,o=tree.nodes(n),i=Math.max(150,o.length*barHeight+margin.top+margin.bottom);d3.select("#"+e).transition().duration(duration).attr("height",r?150:i),o.forEach(function(t,e){t.x=e*barHeight}),r&&(o[0]._children=o[0].children,o[0].children=null,o=[o[0]]);var l=d3.select("#"+e+" > g"),c=l.selectAll("g.node").data(o,function(t,e){return t.id||(t.id=++e)}),d=c.enter().append("g").attr("class","node").attr("transform","translate("+t.y0+","+t.x0+")");d.append("rect").attr("y",-barHeight/2).attr("height",barHeight).attr("width",barWidth).attr("class",function(t){return t._children?"rect collapse-close":"rect"}).style("fill",color).on("click",function(t){t.children?(t._children=t.children,t.children=null,d3.select(this).attr("class","rect collapse-close")):(t.children=t._children,t._children=null,d3.select(this).attr("class","rect")),update(t,e,!1)}).on("mouseenter",a).on("mouseleave",function(){$(".detail-container").removeClass("show")}),d.append("text").attr("dy",3.5).attr("dx",5.5).text(function(t){if(1===t.depth){var e=parseFloat(t.budget_106.replace(/,/gi,"")),a=parseFloat(n.budget_106.replace(/,/gi,""));return t.name+"("+formatFloat(e/a*100,1)+"%): "+t.budget_106}return t.name+": "+t.budget_106}),d.append("text").attr("dy",3.5).attr("dx",5.5).attr("class","collapse-mark").attr("transform","translate("+.75*$("#"+e).width()+", 0)").style("display",function(t){return t.depth>=2?"none":"block"}).text("-"),d.transition().duration(duration).attr("transform",function(t){return"translate("+t.y+","+t.x+")"}),c.select(".collapse-mark").text(function(t){return t.children?"-":"+ "}),c.transition().duration(duration).attr("transform",function(t){return"translate("+t.y+","+t.x+")"}).select("rect").style("fill",color),c.exit().transition().duration(duration).attr("transform","translate("+t.y0+","+t.x0+")").remove();var s=l.selectAll("path.link").data(tree.links(o),function(t){return t.target.id});s.enter().insert("path","g").attr("class","link").attr("d",function(){var e={x:t.x0,y:t.y0};return diagonal({source:e,target:e})}).transition().duration(duration).attr("d",diagonal),s.transition().duration(duration).attr("d",diagonal),s.exit().transition().duration(duration).attr("d",function(){var e={x:t.x,y:t.y};return diagonal({source:e,target:e})}).remove(),o.forEach(function(t){t.x0=t.x,t.y0=t.y});var u=function(t){if(isNaN(t))return 0;var e=t/1e5;return e<.005?t/10+" 萬元":formatFloat(e,2)+" 億元"},g=function(t,e,a){var r=t/e*100;return r>=10?a.addClass("color-red p-size-big"):a.removeClass("color-red p-size-big"),formatFloat(r,1)}}var d3=window.d3,$=window.$,formatFloat=formatFloat,isMobile=isMobile,margin={top:30,right:20,bottom:30,left:20},barHeight=isMobile?40:30,barWidth="80%",duration=400,color=function(t){return t._children?"#F34708":t.children?"#FFAA0A":"#D7DAE1"},root1=void 0,root2=void 0,tree=d3.layout.tree().nodeSize([0,20]),diagonal=d3.svg.diagonal().projection(function(t){return[t.y,t.x]});$("table").tablesort(),$("thead th.sortByValue").data("sortBy",function(t,e,a){return Number.parseFloat(e.text())}),d3.csv("./src/data/money_revenue_106.csv",function(t){var e=formatData(t);d3.select("#svg-annual-income").append("g").attr("transform","translate("+margin.left+","+margin.top+")"),e.x0=0,e.y0=0,update(root1=e,"svg-annual-income",!1)}),d3.csv("./src/data/money_expenditure_106.csv",function(t){var e=formatData(t);d3.select("#svg-annual-expenditure").append("g").attr("transform","translate("+margin.left+","+margin.top+")"),e.x0=0,e.y0=0,update(root2=e,"svg-annual-expenditure")});