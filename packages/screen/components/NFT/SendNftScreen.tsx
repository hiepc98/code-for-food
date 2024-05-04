import React from 'react'

import WrapSendNft from './components/WrapSendNft'
import { SendNftProvider } from './context'

const SendNftScreen = (props) => {
  return (
    <SendNftProvider>
      <WrapSendNft {...props}/>
    </SendNftProvider>
  )
}

export default SendNftScreen
