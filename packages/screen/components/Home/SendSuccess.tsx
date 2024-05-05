import { Button, Icon } from '@wallet/ui'
import { viewScan } from '@wallet/utils'
import { useTranslation } from 'react-i18next'
import { useHistory } from 'react-router-dom'

interface IProps {
  hash: string
}

const SendSuccess = (props: IProps) => {
  const {
    hash,
  } = props

  const { t } = useTranslation()

  const history = useHistory()

  const onCloseModalSuccess = () => {
    window.closeModal()
  }

  const openScan = () => {
    viewScan(hash, false)
  }

  return (
    <div className="w-full h-full p-5 relative flex flex-col overflow-scroll">
      <div className="w-full h-full flex flex-col items-center pt-20 justify-center">
        <div className="text-h3 text-ui04 text-center pb-5">
          Claim success
        </div>

        <div className=" text-white all-center text-[56px]">
              <Icon name="status_checked" className="text-green" />
            </div>

        <div className='pt-5'>
          <Button
            onClick={openScan}
            className="w-full p-2 pb-5"
            type="transparent">
            View on block explorer
          </Button>
      </div>
      </div>
    </div>
  )
}

export default SendSuccess
