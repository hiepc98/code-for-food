/* eslint-disable react/display-name */
import * as React from 'react'
import { I18nextProvider } from 'react-i18next'
import i18n from 'i18n'

const withI18nProvider = (Component: any) => (props: any) => (
  <I18nextProvider i18n={i18n} defaultNS={'translation'}>
    <Component {...props} />
  </I18nextProvider>
)

export default withI18nProvider
