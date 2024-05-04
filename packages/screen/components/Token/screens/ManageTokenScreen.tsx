import { Icon, Image, MainLayout, Switch } from '@wallet/ui'
// import { upperCase } from '@wallet/utils'
import get from 'lodash/get'
import { type FC, useMemo } from 'react'
import { upperCase } from '../../../common/functions'
import {
  useAppDispatch,
  useAppSelector,
  onRemoveCustomToken,
  saveTokens
} from 'store'
import cn from 'classnames'
// import { getSymbol } from '~config/helpers'
import useManageToken from '../../../hooks/useManageToken'
import useRouting from '../../../hooks/useRouting'
// import {
//   onRemoveCustomToken,
//   saveTokens
// } from '~controllers/stores/reducers/storages/walletSlice'
import Loader from '../../../components/shared/Loader'
import { CHAIN_IMAGE } from 'store/constants'
import { useTranslation } from 'react-i18next'
import withI18nProvider from '../../../provider'
import { cx } from '@wallet/utils'
import useTheme from '../../../hooks/useTheme'

const ManageTokenScreen = () => {
  const { t } = useTranslation()
  const { isDarkTheme } = useTheme()
  const { navigateScreen } = useRouting()

  const [isLoading] = useAppSelector((state) => [state.wallet.isLoading])

  const dispatch = useAppDispatch()

  const {
    listTokenManagePage: tokens,
    addIdToHiddenArray,
    removeIdToHiddenArray,
    getIdHiddenArrayByUser,
    showAll,
    hiddenAll
  } = useManageToken()

  const handleCustom = () => {
    navigateScreen('add-token')()
  }

  const handleToggleStatusAll = () => {
    if (isHiddenAll) {
      return showAll()
    }

    const filterTokens = tokens.filter(item => item.address)

    const idsHidden = filterTokens.map(
      (token) => token.chain + '/' + (token.address || '')
    )
    return hiddenAll(idsHidden)
  }

  const handleUpdateToken = (e, token) => {
    if (e) {
      return removeIdToHiddenArray(token)
    }
    addIdToHiddenArray(token)
  }

  // const clearCustomToken = () => {
  //   dispatch(saveCustomTokens([]))
  // }

  const handleRemoveToken = (chain: string, token: any) => {

    window.openModal({
      type: 'confirm',
      // title: t('connection_screen.revoke_title'),
      iconType: 'warning',
      content: (
        <div className="mt-3 text-ui04 text-sub font-bold text-center break-words">
        {t('manage_token_screen.remove_token_content', {
          symbol: upperCase(get(token, 'symbol', ''))
        })}
      </div>
      ),
      btnType: 'confirm',
      closable: false,
      displayType: 'compact',
      onOk: () => {
        dispatch(onRemoveCustomToken({ chain, token }))
        const cvTokenList = tokens.filter(
          (item) => item.address !== token.address
        )
        dispatch(saveTokens(cvTokenList))
      },
      okText: t('manage_token_screen.remove')
    })
  }

  const idArrayAvailable = Object.values(getIdHiddenArrayByUser())

  const isHiddenAll = useMemo(() => {
    const isCheck = tokens.some((token) => {
      const id = token.chain + '/' + (token.address || '')
      const isChecked = idArrayAvailable.includes(id)
      return isChecked
    })
    return isCheck
  }, [tokens, idArrayAvailable])

  const renderListToken = () => {
    if (isLoading) {
      return (
        <div className="w-full h-full flex justify-center items-center">
          <img
            className={cx('block h-12 w-12 animate-bounce', {})}
            src={`/public/img/brand/${isDarkTheme ? 'logo-dark' : 'logo-light'}.svg`}
          />
          {/* <Loader width="100px" height="100px" /> */}
        </div>
      )
    }
    return (
      <div className="px-3 relative flex-1 overflow-auto">
        <div>
          {tokens.map((token, index) => {
            const id = token.chain + '/' + (token.address || '')
            const isChecked = !idArrayAvailable.includes(id)
            const isMainToken = !get(token, 'address')

            return (
              <div
                key={index}
                className="flex items-center justify-between py-5 border-b border-ui01 last:border-0 hover:bg-ui01 px-2">
                <div className="flex items-center gap-3">
                  <div className="relative flex-shrink-0">
                    <Image
                      className="w-10 h-10 rounded-full"
                      src={get(token, 'image', '') || '_'}
                    />
                    {/* <div className="rounded-full overflow-hidden border-ui00 border-2 absolute bottom-[-4px] right-[-8px]">
                      <Image
                        className="w-4 h-4 rounded-full"
                        src={CHAIN_IMAGE[token.chain]}
                      />
                    </div> */}
                    {token.isCustomToken && (
                      <Image
                        className="rounded-full absolute cursor-pointer"
                        src="/public/img/icons/delete.svg"
                        style={{ top: 0, left: '-8px' }}
                        onClick={() => handleRemoveToken(token.chain, token)}
                      />
                    )}
                  </div>
                  <p className="font-semibold text-base text-ui04 uppercase break-all">
                    {get(token, 'symbol', '')}
                  </p>
                </div>

                <div className={cn("cursor-pointer", {
                  'hidden': isMainToken
                })}>
                  <Switch
                    checked={isChecked}
                    onChange={(e) => handleUpdateToken(e, token)}
                  />
                </div>
              </div>
            )
          })}
        </div>

        {/* <div onClick={clearCustomToken}>clear</div> */}
      </div>
    )
  }

  return (
    <MainLayout
      title={t('manage_token_screen.manage_token')}
      className="overflow-auto !mb-0">
      {renderListToken()}
      <div className="relative left-0 bottom-0 w-full z-10 flex justify-between pt-6 pb-8 px-5 border-t border-ui02">
        <div
          className="flex items-center cursor-pointer hover:opacity-50"
          onClick={handleCustom}>
          <Icon name="add" className="text-h2 mr-2 text-ui04" />
          <p className="text-base font-normal text-ui04 ">
            {t('custom_token.custom_token')}
          </p>
        </div>
        <div
          className="text-base font-normal text-ui04 cursor-pointer hover:opacity-50 flex items-center"
          onClick={handleToggleStatusAll}
          style={{ minWidth: '92px' }}>
          {isHiddenAll
            ? t('manage_token_screen.show_all')
            : t('manage_token_screen.hide_all')}
          <Icon name={isHiddenAll ? 'eye_on' : 'eye_off'} className="ml-2 text-h3" />

        </div>
      </div>
    </MainLayout>
  )
}

export default withI18nProvider(ManageTokenScreen)
