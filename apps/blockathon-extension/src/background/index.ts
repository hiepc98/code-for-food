import { MessagePortStream } from '@wallet/extension-stream'
import { persistor } from 'store'
import { PORT_BACKGROUND, PORT_CONTENT } from '~common/port'
import { bootup } from '~controllers/services/boot'
import { IntegrationRoutingV2 } from '~extension/integrationV2'

const port = new MessagePortStream({
  name: PORT_BACKGROUND,
  target: PORT_CONTENT
})

const routing = new IntegrationRoutingV2()

port.on('data', async (data, writer, sender) => {
  try {
    console.log('port data', data);
    const result = await routing.handle(Object.assign(data, { sender }))
    writer(result)
  } catch (e) {
    console.log('port error', e)
  }
})

chrome.action.setBadgeBackgroundColor({
  color: '#0000'
})

persistor.subscribe(async () => {
  const count = 0

  chrome.action.setBadgeText({
    text: count > 0 ? `${count}` : ''
  })
})

chrome.runtime.onMessage.addListener((message, sender, response) => {
  port.handle(message, sender, response)

  if (message?.type === 'FROM_EXT') {
    routing.emit(message.id, message.response)
    const findWindow = routing.windows.find((it) => it.id === message.id)
    chrome.windows.remove(findWindow.window.id)
    return true
  }

  routing.port.forEach((currentPort) => {
    try {
      chrome.tabs.sendMessage(currentPort.sender?.tab?.id as number, message)
    } catch (error) {}
  })

  return true
})

chrome.runtime.onInstalled.addListener(bootup)
