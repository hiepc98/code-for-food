// import logoAnimation from '@lottie/logo_app_animation.json'
// import loader from '../../../../public/lottie/loader.json'
import Lottie from 'react-lottie-player'

const LogoAnimation = (props: any) => {
  const { loader } = props
  return <Lottie animationData={loader} {...props} />
}

export default LogoAnimation
