import { useEffect, useRef } from 'react'

const useEffectCustom = (callback, dependencies = []) => {
  const isFirst = useRef(true)

  useEffect(() => {
    if (!isFirst.current) {
      callback()
    }
    isFirst.current = false
  }, dependencies)
}

export default useEffectCustom
