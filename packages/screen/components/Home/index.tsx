
import { resetAllReduxStore } from "../Auth/utils"
import { useAppSelector } from "store"
import useRouting from "../../hooks/useRouting"
import { formatNumberBro, truncate } from "@wallet/utils"
import { Button, Icon, Image, Touch } from '@wallet/ui'
import useClipboard from "../../hooks/useClipboard"
import { useTranslation } from "react-i18next"
import supabase from "../../services/supaBase"
import { useEffect, useState } from "react"
import NumCountUp from '../Countup'

const MainScreen = () => {
  const { navigateScreen } = useRouting()
  const wallets = useAppSelector((state) => state.wallet.wallets)
  const activeWallet = useAppSelector((state) => state.wallet.activeWallet)
  const { t } = useTranslation()
  const { onCopyWithTitle } = useClipboard({ t })

  const [pointBalance, setPointBalance] = useState(0)
  const [isLoading, setIsLoading] = useState(false)

  const formatWalletBalance = (balance: number | string) => {
    let val = Number(balance)
    if (Number.isNaN(val) || !val || val <= 0) {
      return '0.0'
    }
    if (val < 10) {
      return formatNumberBro(val, 2)
    }
    if (isLoading) return formatNumberBro(val, 2)
    // return formatNumberBro(val, 1)
    return <NumCountUp endNum={Number(val)} duration={1} decimals={2}/>
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
    setIsLoading(true)
    const { data, error } = await supabase.from('reward').select().eq('address', activeWallet.address)
    if(data){
      setPointBalance(data[0].point)
      setIsLoading(false)
    }
    setIsLoading(false)
  }


  const onRefFriend = () => {

  }

  const onRefresh = () => {
    init()
  }

  return (
    <div className="h-full">
      <div className="w-full h-20 flex justify-between items-center border-b border-b-ui01 px-5">
        <div>
          <div className='text-ui04 font-medium text-tiny'>
            {name}
          </div>



        </div>

        <div className="text-h3 text-ui04">
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
          <div className="mb-2 text-center text-ui04 flex items-center justify-center">
            <p className="mr-2">Points</p>
            <Icon className="cursor-pointer text-[24px]" name="refresh" onClick={onRefresh}/>
          </div>
          <div className="text-ui04 text-h2 text-center mb-6" style={{ fontSize: '40px' }}>
            {formatWalletBalance(pointBalance)}
          </div>

          {/* <div>
            Session 1 earning: 50,000
          </div> */}
        </div>
      </div>

      <div className="flex gap-4 px-5">
        <Button
          isBlock
          onClick={onRefresh}>
          Refresh
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
