import { useEffect, useRef, useState } from 'react'
import useEffectCustom from './useEffectCustom'

const useRefreshTimer = (callback, timer = 5) => {
  const finishTime = timer
  const timerRef = useRef<any>()
  const timingRefresh = useRef(timer)
  const isFirst = useRef(true)
  const [time, setTime] = useState(timingRefresh.current)

  useEffect(() => {
    if (!isFirst.current) {
      if (timingRefresh.current === 0) {
        timingRefresh.current = finishTime
        setTime(finishTime)
        callback()
        // executeSomethingHere()
        return
      }
      timerRef.current = setInterval(() => {
        timingRefresh.current -= 1
        setTime(timingRefresh.current)
      }, 1000)
  
      return () => {
        clearInterval(timerRef.current)
      }
    }

    isFirst.current = false
    
  })
}

export default useRefreshTimer
