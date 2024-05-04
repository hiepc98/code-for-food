
import { resetAllReduxStore } from "../Auth/utils"
import { useAppSelector } from "store"
import useRouting from "../../hooks/useRouting"

const MainScreen = () => {
  const { navigateScreen } = useRouting()
  const wallets = useAppSelector((state) => state.wallet.wallets)
  const activeWallet = useAppSelector((state) => state.wallet.activeWallet)
  
  
  const signOut = () => {
    resetAllReduxStore()
    navigateScreen('/startup')()
  }
  return (
    <div>
      <code>{JSON.stringify(activeWallet, null, 4)}</code>
      
      <div className="mt- auto" onClick={signOut}>sign out</div>
      </div>
  )
}

export default MainScreen
