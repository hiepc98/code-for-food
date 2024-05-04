import logoAnimation from './circle_loading.json'
import Lottie from 'react-lottie-player'

const LottieLoadingCircle = (props) => {
  return <Lottie animationData={logoAnimation} {...props} />
}

interface LoadingCircleProps {
  width?: string
  height?: string
}

const LoadingCircle = ({
  width = '20px',
  height = '20px'
}: LoadingCircleProps) => {
  return (
    <LottieLoadingCircle
      play
      style={{
        width,
        height
      }}
    />
  )
}

export default LoadingCircle
