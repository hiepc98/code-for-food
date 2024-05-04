
import { resetAllReduxStore } from "../Auth/utils"
import { useAppSelector } from "store"
import useRouting from "../../hooks/useRouting"
import { formatNumberBro, truncate } from "@wallet/utils"
import { Button, Icon, Image, Touch } from '@wallet/ui'
import useClipboard from "../../hooks/useClipboard"
import { useTranslation } from "react-i18next"
import { fetchRewardData } from "../../services/supaBase"
import { useEffect } from "react"

const MainScreen = () => {
  const { navigateScreen } = useRouting()
  const wallets = useAppSelector((state) => state.wallet.wallets)
  const activeWallet = useAppSelector((state) => state.wallet.activeWallet)
  const { t } = useTranslation()
  const { onCopyWithTitle } = useClipboard({ t })

  const formatWalletBalance = (balance: number | string) => {
    let val = Number(balance)
    if (Number.isNaN(val) || !val || val <= 0) {
      return '0.0'
    }
    if (val < 10) {
      return formatNumberBro(val, 2)
    }
    return formatNumberBro(val, 1)
  }

  const address = activeWallet.address
  const name = activeWallet.name

  const onCopyAddress = (e: any) => {
    e.stopPropagation()
    onCopyWithTitle(
      address,
      t('main_screen.address')
    )()
  }

  useEffect(() => {
    init()
  }, [])

  const init = async () => {
    const res = await fetchRewardData()
    console.log({ res });
  }


  const onRefFriend = () => {

  }

  const onConnect = () => {

  }

  return (
    <div className="h-full">
      <div className="w-full h-24 bg-[#EEF7FF] flex justify-between items-center border-b border-b-ui01 px-5">
        <div className="text-h3 text-ui04">
          Blockathon app
        </div>

        <div>
          <div className='text-ui04 font-medium text-tiny'>
            {name}
          </div>


          <div className="body-14-regular text-ui03 flex items-center gap-[2px]">
            {truncate(address)}
            <Touch
              onClick={onCopyAddress}
              style={{ width: 20, height: 20 }}>
              <Icon name="copy" />
            </Touch>
          </div>
        </div>
      </div>
      {/* <code>{JSON.stringify(activeWallet, null, 4)}</code> */}
      <div className="w-full flex justify-center items-center h-[60%]">

        <div>
          <div className="text-ui04 text-h2 text-center mb-6" style={{ fontSize: '40px' }}>
            {formatWalletBalance(98000)}
          </div>

          <div>
            Session 1 earning: 50,000
          </div>
        </div>
      </div>

      <div className="flex gap-4 px-5">
        <Button
          isBlock
          onClick={onConnect}>
          Connect
        </Button>

        <Button
          isBlock
          onClick={onRefFriend}>
          Ref a friend
        </Button>
      </div>
    </div>
  )
}

export default MainScreen
