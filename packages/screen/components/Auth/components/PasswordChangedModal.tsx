import { Button, Icon } from '@wallet/ui'
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
      <div className="flex-col gap-2 w-full h-full all-center">
        {/* <img
          src="/public/img/icons/security_outline.svg"
          alt=""
          className="w-24 h-24 mb-10"
        /> */}
        <Icon name="Security_logo" className='text-h1 mb-8'/>
        <p className='text-h5 text-ui04'>{t('password_change_model.passwordChanged')}</p>
        <div className='text-tx-secondary'>{t('password_change_model.passcodeChangedSuccess')}</div>
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
