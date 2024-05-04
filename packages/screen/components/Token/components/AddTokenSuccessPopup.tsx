import { Button, Image } from '@wallet/ui'
import { useTranslation } from 'react-i18next'

import useRouting from '../../../hooks/useRouting'

interface IProps {
  iconUrl?: string
  symbol?: string,
  t?: any
}
const AddTokenSuccessPopup = (props: IProps) => {
  const { iconUrl, symbol, t } = props

  // const { t } = useTranslation()
  const { navigateScreen } = useRouting()

  const handleBackToMainScreen = () => {
    window.closeModal()
    navigateScreen('/main', {
      isReload: true
    })()
  }

  return (
    <div className="flex flex-col justify-between w-full h-full px-4 pb-4">
      <div></div>
      <div className="flex flex-col items-center">
        <Image src={iconUrl} className="w-24 h-24 rounded-full contain" />
        <div className="break-all text-center mt-4 text-ui04 text-h3">
          <span className='uppercase mr-2'>{symbol}</span>
           token added
        </div>
        <div className="text-tx-secondary mt-4 text-center text-body-16-regular">
          {t('custom_token.add_token_success')}
        </div>
      </div>

      <Button className="w-100" onClick={handleBackToMainScreen}>
        {t('custom_token.check_my_wallet')}
      </Button>
    </div>
  )
}

export default AddTokenSuccessPopup
