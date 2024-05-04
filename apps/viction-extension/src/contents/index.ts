import { MessagePortStream, MessageStream } from '@wallet/extension-stream'
// import rawInject from 'data-text:~src/extension/inpage/index.js'

import injectScript from 'url:../extension/inpage/index.js'
import uniqueId from 'lodash/uniqueId'
import { PORT_BACKGROUND, PORT_CONTENT, PORT_EVENT, PORT_INPAGE } from '~common/port'

// const injectedScript = async () => {
//   const isInjected = window.document.querySelector('#TomoWallet_Injected')

//   if (isInjected) {
//     // Remove duplicated injected code
//     isInjected.remove()
//   }

//   const inscript = rawInject
//   const el = document.createElement('script')
//   el.innerHTML = inscript
//   el.id = 'TomoWallet_Injected'
//   document.head.appendChild(el)
// }

// injectedScript()

// const stream = new MessageStream({
//   name: 'Tomo:ContentScript',
//   target: 'Tomo:Inpage'
// })

// const port = new PortStream({
//   name: 'Tomo:ContentScript',
//   target: 'Tomo:BackgroundScript',
//   context: 'CS'
// })

// stream.on('data', async (payload, writer) => {
//   const result = await port.write({ id: uniqueId(), data: payload })
//   if (writer) {
//     return writer.write(result)
//   }
//   return stream.write(payload)
// })

// eslint-disable-next-line no-undef
// const eventPort = chrome.runtime.connect({
//   name: 'Tomo:EventScript'
// })

// eventPort.onMessage.addListener((msg, port) => {
//   const { data, event } = msg

//   if (!data && !event) return false

//   return stream.write({
//     id: event,
//     data,
//     sender: port.sender
//   })
// })

export const config = {
  matches: ['<all_urls>'],
  all_frames: true,
  run_at: 'document_start'
}

// Remove all long-live port

const stream = new MessageStream({
  name: PORT_CONTENT,
  target: PORT_INPAGE
})

const port = new MessagePortStream({
  name: PORT_CONTENT,
  target: PORT_BACKGROUND
})

stream.on('data', async (payload, writer) => {
  try {
    const result = await port.write({ id: uniqueId(), data: payload })
    if (writer) {
      return writer.write(result)
    }
    return stream.write(payload)
  } catch (error) {
  }
})

// eslint-disable-next-line no-undef
chrome.runtime.onMessage.addListener((msg, sender) => {
  const { data, event } = msg

  if (!data && !event) return false

  return stream.write({
    id: event,
    data,
    sender
  })
})

// Raise connect for saving senders for events change
// eslint-disable-next-line no-undef
chrome.runtime.connect({
  name: PORT_EVENT
})

function injectDappInterface (override?: any) {
  // if (override) {
  //   window.localStorage.setItem('override', JSON.stringify(override))
  // }

  // const scriptCosmos = document.createElement('script')
  const script = document.createElement('script')

  // scriptCosmos.setAttribute('src', injectCosmosScript)
  script.setAttribute('src', injectScript)

  const container = document.head || document.documentElement

  // container.insertBefore(scriptCosmos, container.firstElementChild)
  // container.insertBefore(script, container.firstElementChild)
  container.appendChild(script)
  // container.appendChild(scriptCosmos)
  // ---
  // container.removeChild(scriptCosmos)
  container.removeChild(script)
}

// // eslint-disable-next-line no-undef
// chrome.storage.local.get(['persist:root'], response => {
// const { setting } = JSON.parse(response['persist:root'])
// const { override } = JSON.parse(setting)
// injectDappInterface(override)
// })

injectDappInterface()
