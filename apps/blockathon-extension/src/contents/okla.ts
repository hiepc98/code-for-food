const heightInit = document.scrollingElement.scrollHeight
let scrollBefore = 0
const handleScroll = () => {
  const scrolled = window.scrollY
  console.log('scroll')
  if (scrollBefore >= scrolled) {
    // console.log("ScrollUP");
  } else {
    scrollBefore = scrolled
    // console.log("ScrollDOWN");
    let point = 10000
    if (scrolled > heightInit) {
      point = 10
    }

    console.log('oh yeah', point)
    chrome.runtime.sendMessage({ name: 'countPoint', point })

    // browser.runtime.sendMessage(point)
    // chrome.runtime.sendMessage({ name: 'test' })
  }
}
window.addEventListener('scroll', (event) => {
  debounce(handleScroll, 500)
})

function debounce(method, delay) {
  clearTimeout(method._tId)
  method._tId = setTimeout(function() {
    method()
  }, delay)
}
