import { useTranslation } from 'react-i18next'
import { useHistory } from 'react-router-dom'

import type { IListItem } from '~types/common'

const useSettingControl = (t) => {
  // const { t } = useTranslation()
  const history = useHistory()

  const onExpandView = () => {
    if (!window.location.href.includes('expand=true')) {
      return window.open(`${window.location.href}?expand=true`)
    }

    window.openModal({
      type: 'error',
      title: t('hook_setting_controll.attention'),
      content: t('hook_setting_controll.already_expansion_mode'),
      okText: t('hook_setting_controll.i_understand'),
      closable: true
    })
  }

  const onChangePassword = () => {
    // Should call from password services, not inside here
  }

  const onResetExtension = () => {
    // Reset service
    window.openModal({
      type: 'confirm',
      title: t('hook_setting_controll.reset_extension'),
      content: t('hook_setting_controll.reset_extension_confirm'),
      closable: true
    })
  }

  const handleControl = (item: IListItem) => () => {
    switch (item.type) {
      case 'expand':
        return onExpandView()
      case 'change-password':
        return onChangePassword()
      case 'reset':
        return onResetExtension()
      default:
        return item.route ? history.push(item.route) : null
    }
  }

  return { handleControl, onExpandView }
}

export default useSettingControl
