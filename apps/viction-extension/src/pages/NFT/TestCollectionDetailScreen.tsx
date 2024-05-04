import CollectionDetailScreen from '@wallet/screen/components/NFT/CollectionDetailScreen'
import React from 'react'
import { useTranslation } from 'react-i18next'

const TestCollectionDetailScreen = () => {
  const { t } = useTranslation()

  return (

    <CollectionDetailScreen t={t}/>
  )
}

export default TestCollectionDetailScreen
