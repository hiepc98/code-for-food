import { Button } from '@wallet/ui'
import withI18nProvider from '../../../provider'
import { useTranslation } from 'react-i18next'

const UnstakeReminder = () => {
  const { t } = useTranslation()

  const handleCloseModal = () => {
    window.closeModal()
  }

  return (
    <div className="w-full h-full p-5 mt-20 relative flex flex-col overflow-scroll justify-between">
      <div className="flex w-full h-full flex-col all-center">
        <div className="header-03 text-tx-primary mb-4 text-center">
          {t('stake_screen.unstaking_condition', {
            hours: 48
          })}
        </div>
        <div className="body-16-regular text-tx-secondary mb-4">
          {t('stake_screen.unstaking_description', {
            hours: 48
          })}
        </div>
      </div>
      <Button isBlock onClick={handleCloseModal}>
        {t('stake_screen.understand')}
      </Button>
    </div>
  )
}

export default withI18nProvider(UnstakeReminder)
