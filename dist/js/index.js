"use strict";!function(o){var n=!1;$("#logo").on("mouseover",function(){$(".logo-speak").css("opacity",1)}),$("#logo").on("mouseleave",function(){$(".logo-speak").css("opacity",0)}),$("#logo").on("click",function(){d3.select("#logo").attr("class",function(){return n=!n,n?"invert":""})})}();