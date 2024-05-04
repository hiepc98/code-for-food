import { Icon, ListItem, MainLayout, Switch } from '@wallet/ui'
import get from 'lodash/get'
import { useHistory } from 'react-router-dom'

import useTheme from '../../../hooks/useTheme'

import { CURRENCIES } from '../CurrencyScreen/common/constants'
import { LANGUAGES } from '../LanguageScreen/common/constants'
import type { ILanguage } from '../LanguageScreen/common/types'

import {
  onChangeNotification,
  onChangeShowSmallBalance,
  onChangeShowUnknownTokens,
  useAppDispatch,
  useAppSelector
} from 'store'
import { ThemeApp } from 'store/types'
import withI18nProvider from '../../../provider'
import { useTranslation } from 'react-i18next'

const GeneralScreen = () => {
  const history = useHistory()
  const { t } = useTranslation()
  // const dispatch = useAppDispatch()
  const { isDarkTheme, handleChangeTheme } = useTheme()

  // const { notification, showSmallBalance, showUnknownTokens } = useAppSelector(
  //   (state) => state.setting
  // )
  const language = useAppSelector((state) => state.setting.language)

  const languageSelected: ILanguage =
    LANGUAGES.find((item: any) => item.key === language) || null

  const onRoute = (path: string) => () => {
    return history.push(path)
  }

  // const handleChangeNotification = () => {
  //   dispatch(onChangeNotification())
  // }

  // const handleChangeHideSmallBalance = () => {
  //   dispatch(onChangeShowSmallBalance())
  // }

  // const handleChangeHideTokens = () => {
  //   dispatch(onChangeShowUnknownTokens())
  // }

  const onChangeTheme = () => {
    handleChangeTheme(isDarkTheme ? ThemeApp.Light : ThemeApp.Dark)
  }

  return (
    <MainLayout title={t('setting_screen.general')}>
      <ListItem
        title={t('setting_screen.language')}
        onClick={onRoute('/setting/general/language')}
        rightView={
          <div className="ml-auto flex items-center">
            <div className="text-base text-ui02">
              {get(languageSelected, 'name')}
            </div>
            <div className="h-full all-center ml-auto text-h2 flex item-center">
              <Icon name="chevron_right" className="text-ui02" />
            </div>
          </div>
        }
        hideImage
      />
      <ListItem
        title={t('setting_screen.currency')}
        onClick={onRoute('/setting/general/currency')}
        rightView={
          <div className="ml-auto flex items-center">
            <div className="text-base text-ui02">
              {get(CURRENCIES[0], 'key')}
            </div>
            <div className="h-full all-center ml-auto text-h2 flex item-center">
              <Icon name="chevron_right" className="text-ui02" />
            </div>
          </div>
        }
        hideImage
      />
      <div className="flex items-center justify-between py-5 border-b border-ui01 last:border-0 hover:bg-ui01 px-5">
        <div className="text-base font-semibold text-ui04 header-05">
          {t('setting_screen.dark_mode')}
        </div>
        <div className="cursor-pointer">
          <Switch checked={isDarkTheme} onChange={() => onChangeTheme()} />
        </div>
      </div>
      {/* <ListItem
        title={t('setting_screen.notifications')}
        rightView={
          <div className="ml-auto">
            <Switch
              checked={notification}
              onChange={handleChangeNotification}
            />
          </div>
        }
        hideImage
      />
      <ListItem
        title={t('setting_screen.hide_small_balances')}
        rightView={
          <div className="ml-auto">
            <Switch
              checked={showSmallBalance}
              onChange={handleChangeHideSmallBalance}
            />
          </div>
        }
        hideImage
      />
      <ListItem
        title={t('setting_screen.hide_unknown_tokens')}
        rightView={
          <div className="ml-auto">
            <Switch
              checked={showUnknownTokens}
              onChange={handleChangeHideTokens}
            />
          </div>
        }
        hideImage
      /> */}
    </MainLayout>
  )
}

export default withI18nProvider(GeneralScreen)
