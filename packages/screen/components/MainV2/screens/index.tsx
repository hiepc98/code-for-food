import { MainProvider } from '../context'
import WrapMain from '../components/WrapMain'
import withI18nProvider from '../../../provider'

interface MainScreenProps {
  isDarkTheme?: boolean
  // onSaveCurrentNft: (nft: any) => void
}

const MainScreenV2 = ({
  isDarkTheme // onSaveCurrentNft
}: MainScreenProps) => {
  return (
    <MainProvider
      isDarkTheme={isDarkTheme}
      // onSaveCurrentNft={onSaveCurrentNft}
    >
      <WrapMain />
    </MainProvider>
  )
}

export default withI18nProvider(MainScreenV2)
