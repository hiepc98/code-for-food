import NFTDetailScreen from '@wallet/screen/components/NFT/NFTDetailScreen'
import React from 'react'
import { useTranslation } from 'react-i18next'

const TestNFTDetailScreen = () => {
  const { t } = useTranslation()

  return (

    <NFTDetailScreen t={t}/>
  )
}

export default TestNFTDetailScreen
