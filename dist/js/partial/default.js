'use strict';

var isMobile = $(window).width() < 768 ? true : false;

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

  // For mobile
  if (isMobile) {
    $('body').on({
      touchmove: function touchmove(e) {
        var st = $(this).scrollTop();
        if (st < 80 || st < lastScrollY) {
          $('.nav').removeClass('hide-up');
        } else {
          $('.nav').addClass('hide-up');
          $('.m-menu-list').removeClass('open');
          $('#m-menu-button').removeClass('open');
        }

        if (isIndex) {
          if (st >= fixHotBarTop - 10) {
            $('.hot-bar').addClass('fixed');
            $('.news-right').addClass('fixed');
          } else {
            $('.hot-bar').removeClass('fixed');
            $('.news-right').removeClass('fixed');
          }
        }
        lastScrollY = st;
      }
    });
  } else {
    $(document).scroll(function () {
      var st = $(window).scrollTop();

      if (st < 80 || st < lastScrollY) {
        $('.nav').removeClass('hide-up');
      } else {
        $('.nav').addClass('hide-up');
        $('.m-menu-list').removeClass('open');
        $('#m-menu-button').removeClass('open');
      }

      if (isIndex) {
        if (st >= fixHotBarTop - 10) {
          $('.hot-bar').addClass('fixed');
          $('.news-right').addClass('fixed');
        } else {
          $('.hot-bar').removeClass('fixed');
          $('.news-right').removeClass('fixed');
        }
      }
      lastScrollY = st;
    });
  }

  $('#m-menu-button').click(function (e) {
    $(this).toggleClass('open');
    $('.m-menu-list').toggleClass('open');
  });

  $('.m-menu-list>a').click(function (e) {
    $('#m-menu-button').removeClass('open');
    $('.m-menu-list').removeClass('open');
  });

  // Fix semantic-ui's click's jump
  $('.collapse-toggle').click(function (e) {
    e.preventDefault();
    var id = $(this).data('id');
    $(this).toggleClass('active');
    $('#' + id).slideToggle(200);
  });
})(window);