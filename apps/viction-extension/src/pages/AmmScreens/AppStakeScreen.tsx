import { CHAIN_DATA } from '@wallet/constants'
import CosmosStakeScreen from '@wallet/screen/components/Stake/screens'
import get from 'lodash/get'

import { StakingService } from '../../controllers/services/staking'

const AppStakeScreen = () => {
  const stakingService = new StakingService(
    get(CHAIN_DATA, 'tomo.rpcURL', 'https://rpc.viction.xyz') as string
  )
  stakingService.initValidatorContract()
  return <CosmosStakeScreen stakingService={stakingService} />
}

export default AppStakeScreen
