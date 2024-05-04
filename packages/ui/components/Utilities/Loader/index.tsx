import React, { FC } from 'react';
// import Lottie from 'react-lottie-light'
import { cx } from '@wallet/utils';
// import animationData from '../../../assets/lottie/subLoading.json'
import { MoonLoader } from 'react-spinners';

interface ILoader extends React.HTMLAttributes<HTMLDivElement> {
  isFullScreen?: boolean;
  size?: number;
  speed?: number;
}

export const Loader: FC<ILoader> = ({
  isFullScreen,
  size = 50,
  speed = 1,
  ...props
}) => {
  return (
    <div
      className={cx('all-center', {
        'fixed top-0 left-0 right-0 bottom-0': isFullScreen,
      })}
    >
      <MoonLoader color='var(--ui04)' size={60} speedMultiplier={0.5} />
      {/* <img src="/public/img/brand/logo.svg" alt="Ramper logo" className='moving-animation w-[96px] h-[96px]' /> */}
      {/* <Lottie
          isClickToPauseDisabled={true}
          options={{
            loop: true,
            autoplay: true,
            animationData
          }}
          height={size}
          width={size}
          speed={speed}
          {...props}
        /> */}
    </div>
  );
};
