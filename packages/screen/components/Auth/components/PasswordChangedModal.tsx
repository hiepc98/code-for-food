import { Button } from '@wallet/ui'
import { useHistory } from 'react-router-dom'

interface PasswordChangedModalProps {
  t: (key: string, params?: any) => string
}

const PasswordChangedModal = ({ t }: PasswordChangedModalProps) => {
  const history = useHistory()

  const onClose = () => {
    history.push('/main')
    window.closeModal()
  }

  return (
    <div className="flex flex-1 flex-col all-center h-full w-full p-5">
      <div className="flex-col w-full h-full all-center">
        <img
          src="/public/img/icons/security_outline.svg"
          alt=""
          className="w-24 h-24 mb-10"
        />
        <div className='header-03 text-tx-primary'>{t('password_change_model.password_changed')}</div>
        <div className='body-16-regular text-tx-secondary'>{t('password_change_model.passcodeChangedSuccess')}</div>
      </div>

      <div className="w-full mt-auto">
        <Button type="primary" isBlock onClick={onClose}>
          {t('password_change_model.done')}
        </Button>
      </div>
    </div>
  )
}

export default PasswordChangedModal
