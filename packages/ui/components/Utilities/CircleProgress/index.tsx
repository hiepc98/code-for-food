import { cx } from '@wallet/utils';
import React, { FC, useEffect, useRef, useState } from 'react';

interface Props {
  radius?: number;
  stroke?: number;
  className?: string;
  interval: number;
  callback?: () => void | any;
}

const CircleProgress: FC<Props> = ({
  radius = 24,
  stroke = 2,
  interval,
  callback,
  className,
  ...props
}) => {
  const [percent, setPercent] = useState(0);

  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - percent / 100 * circumference
  
  const timer = useRef<any>();

  const onReset = () => {
    setPercent(0)
    typeof callback === 'function' && callback();
  }

  useEffect(() => {
    if (percent > 100) {
      onReset()
    }
  }, [percent]);

  useEffect(() => {
    //@ts-expect-error
    timer.current = setInterval(() => {
      setPercent((state) => state + 1);
    }, interval / 100);

    return () => {
      //@ts-expect-error
      clearInterval(timer.current);
    };
  }, []);

  return (
    <svg height={radius * 2} width={radius * 2} onClick={onReset}>
      <circle
        className="text-white/50 transition-all"
        strokeWidth={stroke}
        stroke="currentColor"
        fill="transparent"
        r={normalizedRadius}
        cx={radius}
        cy={radius}
      />

      <circle
        className='text-yellow transition-all'
        stroke="currentColor"
        fill="transparent"
        strokeWidth={stroke}
        strokeDasharray={circumference + ' ' + circumference}
        style={{ strokeDashoffset }}
        r={normalizedRadius}
        cx={radius}
        cy={radius}
      />
    </svg>
  );
};

export default CircleProgress;
