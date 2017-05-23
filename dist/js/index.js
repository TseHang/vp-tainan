'use strict';

// require('./partial/default.js');
(function (window) {
  var triggerLogo = false;
  $('#logo').on('mouseover', function () {
    $('.logo-speak').css('opacity', 1);
  });

  $('#logo').on('mouseleave', function () {
    $('.logo-speak').css('opacity', 0);
  });

  $('#logo').on('click', function () {
    d3.select('#logo').attr('class', function () {
      triggerLogo = !triggerLogo;
      if (triggerLogo) {
        return 'invert';
      }
      return '';
    });
  });
})();