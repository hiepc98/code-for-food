import WrapStaking from '../components/WrapStaking'
import withI18nProvider from '../../../provider'
import { StakingProvider } from '../context'

interface IProps {
  stakingService?: any
}

const CosmosStakeScreen = (props: IProps) => {
  const { stakingService } = props

  return (
    <StakingProvider stakingService={stakingService}>
      <WrapStaking />
    </StakingProvider>
  )
}

export default withI18nProvider(CosmosStakeScreen)
