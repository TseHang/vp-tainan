'use strict';

// Global Func
var formatFloat = function formatFloat(num, pos) {
  var size = Math.pow(10, pos);
  return Math.round(num * size) / size;
};

(function (window) {
  var lastScrollY = 0;
  var isIndex = false;
  var fixHotBarTop = 0;
  var pathname = window.location.pathname;

  // include github's location state
  if (pathname.includes('/index') || pathname === '/' || pathname === '/vp-tainan/') {
    isIndex = true;
    fixHotBarTop = $('.hot-bar').offset().top;
  }

  $(document).scroll(function () {
    var st = $(window).scrollTop();

    if (st < 80 || st < lastScrollY) {
      $('.nav').removeClass('hide-up');
    } else {
      $('.nav').addClass('hide-up');
    }

    if (isIndex) {
      if (st >= fixHotBarTop - 10) {
        $('.hot-bar').addClass('fixed');
      } else {
        $('.hot-bar').removeClass('fixed');
      }
    }
    lastScrollY = st;
  });

  // Fix semantic-ui's click's jump
  $('.collapse-toggle').click(function (e) {
    e.preventDefault();
    var id = $(this).data('id');
    $('#' + id).slideToggle(200);
  });
})(window);