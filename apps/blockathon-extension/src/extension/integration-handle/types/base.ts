export interface BaseIntegrationRequest {
  id: string
  chain: string
  method: string
  params: any[]
  // eslint-disable-next-line no-undef
  sender?: chrome.runtime.MessageSender
}
