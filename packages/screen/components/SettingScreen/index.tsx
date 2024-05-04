
import { resetAllReduxStore } from "../Auth/utils"
import { useAppSelector } from "store"
import useRouting from "../../hooks/useRouting"
import { Button } from "@wallet/ui"

const MainScreen = () => {
  const { navigateScreen } = useRouting()
  const wallets = useAppSelector((state) => state.wallet.wallets)
  const activeWallet = useAppSelector((state) => state.wallet.activeWallet)


  const signOut = () => {
    resetAllReduxStore()
    navigateScreen('/startup')()
  }
  return (
    <div className="flex justify-center items-center h-full">
      <div className="py-4 w-[200px]">
        <Button
          isBlock
          onClick={signOut}>
          Sign out
        </Button>
      </div>
    </div>
  )
}

export default MainScreen
