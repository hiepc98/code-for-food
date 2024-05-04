import { useEffect, useState, useMemo } from 'react'
import { Button, MainLayout} from '@wallet/ui'
import { useTranslation } from 'react-i18next'
import useTheme from '../../../hooks/useTheme'
import cn from 'classnames'
import useRouting from '../../../hooks/useRouting'
import withI18nProvider from '../../../provider'
import Loader from '../../shared/Loader'

const StakeIntroScreen = () => {
  const { t } = useTranslation()
  const { isDarkTheme } = useTheme()
  const { navigateScreen } = useRouting()

  const [isLoading, setIsLoading] = useState(false)

  const onStakeNow = () => {
    navigateScreen('/staking', {
      fromScreen: 'stake-intro',
      isFullScreen: true
    })()
  }

  return (
    <MainLayout
      title={t('stake_screen.stake')}
      hideBack
      stylesContent={{ marginBottom: 0 }}
    >
      <div className="flex flex-col h-full w-full all-center justify-between p-4">
        <img
          className={cn('block h-[15rem] w-[15rem]', {})}
          src={`/public/img/brand/${
            isDarkTheme ? 'stake-dark' : 'stake-light'
          }.svg`}
        />
        <div className="flex all-center flex-col">
          <p className="header-03 text-tx-primary text-center">
            {t('stake_screen.stake_subtitle')}
          </p>
          {/* <p className="header-05 text-brandkey-brand-highlight">
            {t('stake_screen.reward_apr', { apr: 8.45, aprMax: 24.5 })}
          </p> */}
          <p className="body-14-regular text-tx-secondary text-center">
            {t('stake_screen.stake_description')}
          </p>
        </div>
        <Button
          className="button-01 flex w-full text-btn-on-primary bg-primary self-end h-[2.75rem]"
          onClick={onStakeNow}>
          {t('stake_screen.stake_now')}
        </Button>
      </div>
    </MainLayout>
  )
}

export default withI18nProvider(StakeIntroScreen)
