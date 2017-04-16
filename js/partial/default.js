((window) => {
  let lastScrollY = 0
  let isIndex = false
  let fixHotBarTop = 0

  if (window.location.pathname === '/index') {
    isIndex = true
    fixHotBarTop = $('.hot-bar').offset().top
  }

  $(document).scroll(() => {
    const st = $(window).scrollTop()

    if (st < 80 || st < lastScrollY) {
      $('.nav').removeClass('hide-up')
    } else {
      $('.nav').addClass('hide-up')
    }

    if (isIndex) {
      if (st >= (fixHotBarTop - 10)) {
        $('.hot-bar').addClass('fixed')
      } else {
        $('.hot-bar').removeClass('fixed')
      }
    }
    lastScrollY = st
  })
})(window)
