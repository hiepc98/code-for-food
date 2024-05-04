import { Suspense, lazy } from 'react'

import LoaderAnimation from '~shared/components/LoaderAnimation'

// const LoaderAnimation = lazy(() => import('~shared/components/LoaderAnimation'))

interface LoaderProps {
  width?: string
  height?: string
}

const Loader = ({ width = '40px', height = '40px' }: LoaderProps) => {
  return (
    <Suspense>
      <LoaderAnimation
        play
        loop
        style={{
          width,
          height
        }}
      />
    </Suspense>
  )
}

export default Loader
