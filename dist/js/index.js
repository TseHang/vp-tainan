"use strict";!function(o){var c=!1;$("#logo").on("mouseover",function(){$(".logo-speak").css("opacity",1)}),$("#logo").on("mouseleave",function(){$(".logo-speak").css("opacity",0)}),$("#logo").on("click",function(){d3.select("#logo").attr("class",function(){return c=!c,c?"invert":""})}),$(".collapse-toggle").addClass("active")}();