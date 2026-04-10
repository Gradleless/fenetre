(function () {
  var script = document.currentScript
  var url = (script?.dataset.url || window.BOOKING_URL || '').replace(/\/$/, '')
  var username = script?.dataset.username || window.BOOKING_USERNAME || ''

  function openModal(src) {
    var overlay = document.createElement('div')
    overlay.style.cssText = [
      'position:fixed;inset:0;background:rgba(0,0,0,.5)',
      'display:flex;align-items:center;justify-content:center',
      'z-index:999999;padding:16px'
    ].join(';')

    var wrap = document.createElement('div')
    wrap.style.cssText = [
      'position:relative;width:100%;max-width:720px;height:85vh',
      'background:#f4f0e8;border-radius:16px;overflow:hidden',
      'box-shadow:0 24px 64px rgba(0,0,0,.2)'
    ].join(';')

    var closeBtn = document.createElement('button')
    closeBtn.innerHTML = '&#x2715;'
    closeBtn.style.cssText = [
      'position:absolute;top:12px;right:12px;z-index:1',
      'background:rgba(244,240,232,.9);backdrop-filter:blur(4px)',
      'border:none;border-radius:50%;width:32px;height:32px',
      'cursor:pointer;font-size:14px;line-height:1',
      'box-shadow:0 1px 4px rgba(0,0,0,.15)',
      'display:flex;align-items:center;justify-content:center'
    ].join(';')
    closeBtn.onclick = function () { document.body.removeChild(overlay) }

    var iframe = document.createElement('iframe')
    iframe.src = src
    iframe.style.cssText = 'width:100%;height:100%;border:none'

    overlay.onclick = function (e) { if (e.target === overlay) document.body.removeChild(overlay) }

    window.addEventListener('message', function handler(e) {
      if (e.data?.type === 'fenetre:confirm' || e.data?.type === 'fenetre:close') {
        if (document.body.contains(overlay)) document.body.removeChild(overlay)
        window.removeEventListener('message', handler)
      }
    })

    wrap.appendChild(closeBtn)
    wrap.appendChild(iframe)
    overlay.appendChild(wrap)
    document.body.appendChild(overlay)
  }

  // [data-booking] → picker (/{username})
  document.querySelectorAll('[data-booking]').forEach(function (el) {
    el.addEventListener('click', function (e) {
      e.preventDefault()
      var user = el.dataset.username || username
      var from = el.dataset.from || 'portfolio'
      openModal(url + '/' + user + '?from=' + from + '&embed=1')
    })
  })

  // [data-event] → direct event (/{username}/{slug})
  document.querySelectorAll('[data-event]').forEach(function (el) {
    el.addEventListener('click', function (e) {
      e.preventDefault()
      var user = el.dataset.username || username
      var from = el.dataset.from || 'portfolio'
      openModal(url + '/' + user + '/' + el.dataset.event + '?from=' + from + '&embed=1')
    })
  })
})()
