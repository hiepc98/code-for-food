import { Fade, Icon, Image, ListItem, MainLayout } from '@wallet/ui'
import React from 'react'

import { LANGUAGES } from './common/constants'
import { onChangeLanguage, useAppDispatch, useAppSelector } from 'store'
import withI18nProvider from '../../../provider'
import i18n from 'i18n'
import { useTranslation } from 'react-i18next'

const LanguageScreen = () => {
  const { t } = useTranslation()
  const language = useAppSelector((state) => state.setting.language)
  const dispatch = useAppDispatch()

  const handleChangeLanguage = (lang: string) => () => {
    i18n.changeLanguage(lang)
    dispatch(onChangeLanguage(lang))
  }

  const renderLanguageList = () => {
    return LANGUAGES.map((lang) => {
      const isActive = language === lang.key
      return (
        <ListItem
          key={lang.key}
          onClick={handleChangeLanguage(lang.key)}
          title={lang.name}
          hideImage
          rightView={
            <div className="ml-auto">
              <Fade show={isActive}>
                <Icon className="text-h3 mr-1 text-ui04" name="check" />
              </Fade>
            </div>
          }
        />
      )
    })
  }

  return (
    <MainLayout title={t('setting_screen.language')}>
      {renderLanguageList()}
    </MainLayout>
  )
}

export default withI18nProvider(LanguageScreen)
