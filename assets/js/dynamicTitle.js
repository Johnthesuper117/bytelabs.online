window.onload = function () {
  const favicon = document.getElementById('favicon')
  const pageTitle = document.title
  const attentionMessage = 'Come back pls 🙏'

  document.addEventListener('visibilitychange', function () {
    const isPageActive = !document.hidden
    toggle(isPageActive)
  })

  function toggle(isPageActive) {
    if (isPageActive) {
      document.title = pageTitle
      favicon.href = './favicon.ico'
    } else {
      document.title = attentionMessage
      favicon.href = './assets/images/favicon.ico'
    }
  }
}
