import { MessagePortStream, MessageStream } from '@wallet/extension-stream'

import uniqueId from 'lodash/uniqueId'
import injectScript from 'url:../extension/inpage/index.js'
import { PORT_BACKGROUND, PORT_CONTENT, PORT_EVENT, PORT_INPAGE } from '~common/port'

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
  const script = document.createElement('script')

  script.setAttribute('src', injectScript)

  const container = document.head || document.documentElement

  container.appendChild(script)

  container.removeChild(script)
}

injectDappInterface()
