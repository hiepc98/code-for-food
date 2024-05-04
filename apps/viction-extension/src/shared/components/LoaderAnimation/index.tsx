
import loader from '../../../../public/lottie/loader.json'
import Lottie from 'react-lottie-player'

const LoaderAnimation = (props) => {
  return <Lottie animationData={loader} {...props} />
}

export default LoaderAnimation
