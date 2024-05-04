import { MainScreenV2 } from '@wallet/screen'
import useTheme from '@wallet/screen/hooks/useTheme'
import { useEffect } from 'react'

import { useWallet } from '~controllers/contexts/WalletContext'
import { StakingService } from '~controllers/services/staking'
import SplashScreen from '~shared/components/Splash'

const TestMainScreen = () => {
  const { isDarkTheme } = useTheme()
  const stakingService = new StakingService('https://rpc.tomochain.com')
  stakingService.initValidatorContract()

  const { services } = useWallet()
  // const handleSaveCurrentNft = (nft: any) => {
  //   dispatch(onSaveCurrentNft(nft))
  // }

  if (!services || !services.isServiceLoaded) {
    return <SplashScreen />
  }

  return (
    <MainScreenV2
      isDarkTheme={isDarkTheme}
      // onSaveCurrentNft={handleSaveCurrentNft}
    />
  )
}

export default TestMainScreen
