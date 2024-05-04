import { MainLayout } from '@wallet/ui'
import React from 'react'
import { useTranslation } from 'react-i18next'

import type { INFTDetail } from '../../types'

import NFTItem from './components/NFTItem'
import withI18nProvider from '../../provider'

interface IProps {
  nftDetail: INFTDetail
}

const CollectionDetailScreen = (props) => {
  const { t } = useTranslation()
  return (
    <MainLayout title={t('nft.settings')}>
      <div className="p-4">
        <div className="grid grid-cols-2 gap-1">
          <NFTItem className="h-44" />
          <NFTItem className="h-44" />
          <NFTItem className="h-44" />
          <NFTItem className="h-44" />
        </div>
      </div>
    </MainLayout>
  )
}

export default withI18nProvider(CollectionDetailScreen)
