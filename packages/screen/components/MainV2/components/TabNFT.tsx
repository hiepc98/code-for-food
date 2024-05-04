/* eslint-disable multiline-ternary */
import { isEmpty } from 'lodash'
import { type FC, useEffect, useMemo, useState } from 'react'

import { getLength } from '../../../utils'
import CollectionNFT from '../../shared/CollectionNFT'
import NFTItem from '../../shared/NFTItem'
import { EmptyData } from '@wallet/ui'
import { useMainContext } from '../context'
import { useAppSelector } from 'store'
import useScrollAnimation from '../../../hooks/useScrollAnimation'
import { Collection } from '@wallet/core'
import { useTranslation } from 'react-i18next'

const TabNFT: FC = () => {
  const {
    fetchCollections,
    loadingFetchNFTs,
    isDarkTheme
  } = useMainContext()

  const { t } = useTranslation()

  const [activeWallet, tokens, activeTypeDisplay, listCollections] = useAppSelector((state) => {
    return [
      state.wallet.activeWallet,
      state.wallet.tokens,
      state.wallet.activeTypeDisplay,
      state.wallet.listCollections
    ]
  })

  const { onWheel } = useScrollAnimation(tokens)

  useEffect(() => {
    fetchCollections?.()
  }, [activeWallet])

  // get array nfts from data fields in listCollections
  const arrayNfts = useMemo(() => {
    if (!listCollections) return []
    const listNfts = listCollections.map((item) => {
      const { data } = item
      return data
    })
    return listNfts.flat()
  }, [listCollections])

  const checkEmptyCollections = getLength(listCollections) === 0

  const renderNFTList = () => {
    if (loadingFetchNFTs && checkEmptyCollections) {
      return (
        <div className="flex justify-center items-center h-full">
        <EmptyData
          isLoading={loadingFetchNFTs && checkEmptyCollections}
          title={((!loadingFetchNFTs && checkEmptyCollections) && t('setting_screen.no_nft_were_found')) || ''}
          isDarkTheme={isDarkTheme}
        />
      </div>
      )
    }
    if (getLength(arrayNfts) === 0) {
      return (
        <div className="flex justify-center items-center h-full">
          <EmptyData
            title={
              ((!loadingFetchNFTs && checkEmptyCollections) && t('setting_screen.no_nft_were_found')) || ''
            }
            isDarkTheme={isDarkTheme}
          />
        </div>
      )
    }

    return (
      <div className="grid grid-cols-2 gap-2 px-5 pb-5 overflow-scroll">
        {arrayNfts.map((item) => (
          <NFTItem key={`${item.address}-${item.id}`} nftDetail={item} />
        ))}
      </div>
    )
  }

  return (
    <div className={'flex-1 overflow-auto'} onWheel={onWheel}>
      {activeTypeDisplay?.typeToken === 'NFTs' && activeTypeDisplay?.typeDisplay
        ? renderNFTList()
        : <CollectionComponent listCollections={listCollections!} loadingFetchNFTs={loadingFetchNFTs!} checkEmptyCollections={checkEmptyCollections}/>
        // : renderCollectionList()
      }
    </div>
  )
}
export default TabNFT

interface CCProps {
  listCollections: Collection[]
  loadingFetchNFTs: boolean
  checkEmptyCollections: boolean
}

export const CollectionComponent = ({ listCollections, loadingFetchNFTs, checkEmptyCollections }: CCProps) => {
  const {
    isDarkTheme
  } = useMainContext()

  const { t } = useTranslation()


  // if (getLength(listCollections) === 0) {
  //   return (
  //     <div className="flex justify-center items-center h-full">
  //       <EmptyData
  //         title={
  //           ((!loadingFetchNFTs && checkEmptyCollections) && t('setting_screen.no_nft_were_found')) || ''
  //         }
  //         isDarkTheme={isDarkTheme}
  //       />
  //     </div>
  //   )
  // }
  return (
    <div>
      {listCollections?.map((item, index) => {
        return (
          <CollectionNFT
            key={index}
            collectionDetail={item as unknown as any[]}
          />
        )
      })}
    </div>
  )
}
