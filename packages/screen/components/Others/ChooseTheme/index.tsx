import { Button, Icon } from '@wallet/ui'
import { cx } from '@wallet/utils'
import { useHistory } from 'react-router-dom'

import useTheme from '../../../hooks/useTheme'
import { ThemeApp, ThemeType } from 'store/types'
import { useTranslation } from 'react-i18next'
import withI18nProvider from '../../../provider'

const themeOptions = [
  {
    value: ThemeApp.Light,
    title: 'choose_theme.light_theme',
    icon: 'light_mode'
  },
  {
    value: ThemeApp.Dark,
    title: 'choose_theme.dark_theme',
    icon: 'dark_mode'
  }
]

const ChooseThemeScreen = () => {
  const history = useHistory()
  const { t } = useTranslation()
  const { theme, isDarkTheme, handleChangeTheme } = useTheme()

  const onContinue = () => {
    history.push('/startup')
  }

  const onChangeTheme = (theme: ThemeType) => {
    handleChangeTheme(theme)
  }

  return (
    <div className="relative flex flex-col items-center justify-center bg-startup w-full h-screen bg-ui00">
      <img
        src={`/public/img/brand/${
          isDarkTheme ? 'logo-dark' : 'logo-light'
        }.svg`}
        className="w-[56px] mb-[54px]"
        alt="logo"
      />

      <p className="text-[18px] text-ui04 font-bold mb-8 leading-6">
        {t('choose_theme.select_appearance')}
      </p>

      <div className="grid grid-cols-2 gap-5 w-full mb-10">
        {themeOptions.map((item) => {
          const isActive = item.value === theme
          return (
            <div
              key={item.value}
              className={cx(
                'col-span-1 flex flex-col items-center justify-center w-full h-[280px] rounded-[4px] cursor-pointer transition ease-out',
                {
                  'bg-primary border border-ui04': isActive,
                  'border border-ui02': !isActive
                }
              )}
              onClick={() => onChangeTheme(item.value)}>
              <Icon
                name={item.icon}
                className={cx('leading-none text-[30px] text-ui04', {
                  'text-white': isActive
                })}
              />
              <div
                className={cx('leading-none text-h3 text-ui04 mt-4', {
                  'text-white': isActive
                })}>
                {t(item.title)}
              </div>
            </div>
          )
        })}
      </div>

      <div className="mt-4 w-full">
        <Button type="primary" isBlock onClick={onContinue}>
          {t('login_email_screen.continue')}
        </Button>
      </div>
    </div>
  )
}

export default withI18nProvider(ChooseThemeScreen)
