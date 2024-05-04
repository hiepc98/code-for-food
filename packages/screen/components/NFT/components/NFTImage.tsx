import { Image } from '@wallet/ui'
import { cx } from '@wallet/utils'
import React from 'react'

interface IProps {
  src: string
  className?: string
}

const NFTImage = (props: IProps) => {
  const { src, className } = props
  const clsx = cx(`w-full h-full object-contain ${className}`, {})

  return <Image className={clsx} src={src || ''} />
}

export default NFTImage
