import { ListItem, MainLayout } from '@wallet/ui'
import { useTranslation } from 'react-i18next'

import { SETTING_LIST } from './common/constants'
import useSettingControl from './hooks/useSettingControl'
import { ISettingList } from './common/types'
import withI18nProvider from '../../../provider'

const SettingScreen = () => {
  const { t } = useTranslation()
  const { handleControl } = useSettingControl(t)

  const renderSettingList = () => {
    return SETTING_LIST.map((it: ISettingList) => {
      return (
        <ListItem
          key={it.key}
          icon={it.icon}
          title={t(it.title)}
          description={t(it.description)}
          onClick={handleControl(it)}
          showArrow={it.showArrow}
          className="p-4"
          hideImage
        />
      )
    })
  }

  return (
    <MainLayout
      title={t('setting_screen.discover')}
      hideBack
      stylesContent={{ marginBottom: 0 }}>
      <div className="flex flex-col h-full">
        <div className="flex-1">{renderSettingList()}</div>
      </div>
    </MainLayout>
  )
}

export default withI18nProvider(SettingScreen)
