import { Fade, Icon, ListItem, MainLayout } from '@wallet/ui'
import React from 'react'
import { useTranslation } from 'react-i18next'

import { CURRENCIES } from './common/constants'
import withI18nProvider from '../../../provider'

const CurrencyScreen = () => {
  const {t} = useTranslation()
  const renderCurrencyList = () => {
    return CURRENCIES.map((lang) => {
      const isActive = true
      return (
        <ListItem
          key={lang.key}
          onClick={() => {}}
          title={lang.key}
          description={lang.name}
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
    <MainLayout title={t('setting_screen.currency')}>
      {renderCurrencyList()}
    </MainLayout>
  )
}

export default withI18nProvider(CurrencyScreen)
