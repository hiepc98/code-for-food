import { onChangeTheme, useAppDispatch, useAppSelector } from 'store'
import { ThemeApp, ThemeType } from 'store/types'

const useTheme = () => {
  const dispatch = useAppDispatch()

  const theme = useAppSelector((state) => state.setting.theme)

  const isDarkTheme = theme === ThemeApp.Dark
  const isLightTheme = theme === ThemeApp.Light

  const handleChangeTheme = (type: ThemeType) => {
    handleSetTheme(type)
    dispatch(onChangeTheme(type))
  }

  const handleSetTheme = (type: ThemeType) => {
    if (type === ThemeApp.Dark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  return { theme, isDarkTheme, isLightTheme, handleSetTheme, handleChangeTheme }
}

export default useTheme
