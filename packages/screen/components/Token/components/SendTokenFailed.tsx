import { Button } from '@wallet/ui'
import { useTranslation } from 'react-i18next'
import withI18nProvider from '../../../provider'

interface IProps {
  history?: any
}

const SendTokenFailed = (props: IProps) => {
  const { history } = props
  const { t } = useTranslation()

  const onClose = () => {
    history.push('/main')
    window.closeModal()
  }

  return (
    <div className="flex flex-1 flex-col all-center h-full w-full p-5">
      <div className="flex-col w-full h-full all-center">
        <img
          src="/public/img/icons/error_outline.svg"
          alt=""
          className="w-16 h-16 mb-4"
        />
        <div className="text-ui04 text-sub leading-[24px] font-bold mb-2">
          {t('setting_screen.title_error_transation')}
        </div>
        <div className="text-ui03 text-base leading-[24px] text-center">
          {t('setting_screen.message_error')}
        </div>
      </div>

      <div className="w-full mt-auto">
        <Button type="primary" isBlock onClick={onClose}>
          {t('wrap_send_nft.i_got_it')}
        </Button>
      </div>
    </div>
  )
}

export default withI18nProvider(SendTokenFailed)
