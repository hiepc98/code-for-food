import { useHistory } from 'react-router-dom'

const useRouting = () => {
  const history = useHistory()

  const navigateScreen =
    <T extends any>(path: string, state?: T) =>
    () => {
      history.push(path, state)
    }

  const goBack = () => {
    window.goBack()
  }

  return {
    navigateScreen,
    goBack
  }
}

export default useRouting
