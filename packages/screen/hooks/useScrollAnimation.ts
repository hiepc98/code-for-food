const useScrollAnimation = (tokens: any) => {
  const checkMinimumBalance = tokens.some(
    (it: any) => Number(it.rawBalance) > 0
  )

  const onMouseMove = (e: any) => {
    e.cancelable && e.preventDefault()
    const clientY = e.clientY
    if (!checkMinimumBalance) return
    if (clientY > 82 && clientY < 114) {
      const balanceElement = window.document.getElementById('balance')!
      balanceElement.style.cssText = 'height: 64px; minHeight: 64px'
      const numberElement = window.document.getElementById('number')!
      numberElement.style.cssText = 'font-size: 48px; line-height: 64px'
      const btnActionElement = window.document.getElementById('btn-action')!
      btnActionElement.style.cssText = 'height: 40px'
      const sendElement = window.document.getElementById('send')!
      sendElement.style.cssText = 'padding: auto; visibility: visible'
      const receiveElement = window.document.getElementById('receive')!
      receiveElement.style.cssText = 'padding: auto; visibility: visible'
      const historyElement = window.document.getElementById('history')!
      historyElement.style.cssText = 'padding: auto; visibility: visible'
    }
  }

  const onWheel = (e: any) => {
    e.cancelable && e.preventDefault()
    if (!checkMinimumBalance) return
    const position = e.deltaY
    if (position > 0 && document.getElementById('balance')) {
      const balanceElement = window.document.getElementById('balance')!
      balanceElement.style.cssText =
        'height: 24px; margin: 0 0 16px 0; minHeight: 24px'
      const numberElement = window.document.getElementById('number')!
      numberElement.style.cssText = 'font-size: 24px; line-height: 24px'
      const btnActionElement = window.document.getElementById('btn-action')!
      btnActionElement.style.cssText = 'height: 0; margin: 0 '
      const sendElement = window.document.getElementById('send')!
      sendElement.style.cssText = 'padding: 0; visibility: hidden'
      const receiveElement = window.document.getElementById('receive')!
      receiveElement.style.cssText = 'padding: 0; visibility: hidden'
      const historyElement = window.document.getElementById('history')!
      historyElement.style.cssText = 'padding: 0; visibility: hidden'
    }
    if (position < 0 && document.getElementById('balance')) {
      const balanceElement = window.document.getElementById('balance')!
      balanceElement.style.cssText =
        'height: 64px; minHeight: 64px'
      const numberElement = window.document.getElementById('number')!
      numberElement.style.cssText = 'font-size: 48px; line-height: 64px'
      const btnActionElement = window.document.getElementById('btn-action')!
      btnActionElement.style.cssText = 'height: 40px'
      const sendElement = window.document.getElementById('send')!
      sendElement.style.cssText = 'padding: auto; visibility: visible'
      const receiveElement = window.document.getElementById('receive')!
      receiveElement.style.cssText = 'padding: auto; visibility: visible'
      const historyElement = window.document.getElementById('history')!
      historyElement.style.cssText = 'padding: auto; visibility: visible'
    }
  }

  return {
    onMouseMove,
    onWheel
  }
}

export default useScrollAnimation
