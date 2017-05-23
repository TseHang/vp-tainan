// require('./partial/default.js');
((window) => {
  let triggerLogo = false
  $('#logo').on('mouseover', () => {
    $('.logo-speak').css('opacity', 1)
  })

  $('#logo').on('mouseleave', () => {
    $('.logo-speak').css('opacity', 0)
  })

  $('#logo').on('click', () => {
    d3.select('#logo').attr('class', () => {
      triggerLogo = !triggerLogo
      if (triggerLogo) {
        return 'invert'
      }
      return ''
    })
  })
})()
