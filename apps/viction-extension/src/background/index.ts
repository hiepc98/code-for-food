/* eslint-disable no-undef */

import { MessagePortStream, PortStream } from '@wallet/extension-stream'
import { log } from 'console'
import injectScript from 'url:../extension/inpage/index.js'

import { bootup } from '~controllers/services/boot'
import { persistor, store } from 'store'
// import { EvmIntegrationRouting } from '~extension/evmIntegration'
import { IntegrationRoutingV2 } from '~extension/integrationV2'
import { PORT_BACKGROUND, PORT_CONTENT } from '~common/port'
// import { IntegrationRouting } from '~extension/integration'

// chrome.tabs.onUpdated.addListener((tabId) => {
//   const filename = injectScript
//     .substring(injectScript.lastIndexOf('/') + 1)
//     .split('?')[0]

//   chrome.scripting.executeScript(
//     {
//       target: {
//         tabId, // the tab you want to inject into
//         allFrames: true
//       },
//       world: 'MAIN', // MAIN to access the window object
//       files: [filename],
//       injectImmediately: true
//     },
//     () => {
//       console.log(
//         '[Viction wallet Injected]: Background script got callback after injection'
//       )
//     }
//   )
// })

const port = new MessagePortStream({
  name: PORT_BACKGROUND,
  target: PORT_CONTENT
})

// Fast tempory solutions
// const routing = new EvmIntegrationRouting()
const routing = new IntegrationRoutingV2()

port.on('data', async (data, writer, sender) => {
  try {
    const result = await routing.handle(Object.assign(data, { sender }))
    writer(result)
  } catch (e) {
    // console.log('port error', e)
  }
})

chrome.action.setBadgeBackgroundColor({
  color: '#00C8B9'
})

persistor.subscribe(async () => {
  const { integration } = store.getState()
  const count = integration.requests.length
  chrome.action.setBadgeText({
    text: count > 0 ? `${integration.requests.length}` : ''
  })
})

chrome.runtime.onMessage.addListener((message, sender, response) => {
  port.handle(message, sender, response)

  if (message?.type === 'FROM_EXT') {
    // @ts-expect-error
    routing.emit(message.id, message.response)
    const findWindow = routing.windows.find(it => it.id === message.id)
    // eslint-disable-next-line no-undef
    chrome.windows.remove(findWindow.window.id)
    return true
  }

  // sendResponse({ message, sender })
  routing.port.forEach(currentPort => {
    try {
      chrome.tabs.sendMessage(currentPort.sender?.tab?.id as number, message)
      // currentPort.postMessage(message)
    } catch (error) {
    }
  })

  return true
})

// chrome.runtime.onMessage.addListener((message, sender, response) => {
//   port.handle(message, sender, response)

//   if (message.type === 'FROM_EXT') {
//     routing.emit(message.id, message.response)
//     const findWindow = routing.windows.find(it => it.id === message.id)
//     // eslint-disable-next-line no-undef
//     return setTimeout(() => {
//       chrome.windows.remove(findWindow.window.id)
//     }, 500)
//   }

//   routing.port.forEach(currentPort => {
//     currentPort.postMessage(message)
//   })
// })

chrome.runtime.onInstalled.addListener(bootup)
// chrome.runtime.setUninstallURL('https://coin98.com/')
