// Global Func
const formatFloat = (num, pos) => {
  const size = Math.pow(10, pos)
  return Math.round(num * size) / size
}

((window) => {
  let lastScrollY = 0
  let isIndex = false
  let fixHotBarTop = 0
  const pathname = window.location.pathname

  // include github's location state
  if (pathname.includes('/index') || pathname === '/' || pathname === '/vp-tainan/') {
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