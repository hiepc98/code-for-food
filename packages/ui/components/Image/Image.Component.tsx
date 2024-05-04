import React, { FC, ReactNode, useCallback, useEffect, useState } from 'react';
import { cx } from '@wallet/utils';

interface IImage
  extends Omit<React.HTMLAttributes<HTMLImageElement>, 'onError' | 'onLoad'> {
  defaultImage?: string;
  chain?: string;
  src?: string;
  isRounded?: boolean;
  isRenderBlank?: boolean;

  defaultRender?: () => ReactNode;
}

export const Image: FC<IImage> = ({
  defaultImage,
  chain,
  defaultRender,
  isRounded = false,
  src,
  isRenderBlank,
  className,
  ...props
}) => {
  const [imageState, setImageState] = useState({
    isLoaded: false,
    isError: false,
    src,
  });

  const onError = useCallback(() => {
    setImageState((state) => {
      if (defaultRender || defaultImage) {
        return { ...state, isError: true, src: defaultImage, isLoaded: true };
      }
      if (chain) {
        // TODO: Change image path to real path
        return {
          ...state,
          isError: false,
          src: `/public/img/iconSvg/${chain}Not.svg`,
          isLoaded: true,
        };
      }
      if (!isRenderBlank) {
        // TODO: Change image path to real path
        return {
          ...state,
          isError: true,
          src: '/public/img/icons/default-token.svg',
          isLoaded: true,
        };
      }

      return { ...state, isError: true, isLoaded: false };
    });
  }, [imageState.src]);

  const onLoad = useCallback(() => {
    setImageState((state) => ({
      ...state,
      isError: !src ? true : false,
      isLoaded: true,
    }));
  }, [imageState.src]);

  useEffect(() => {
    setImageState((state) => ({ ...state, src }));
  }, [src]);

  const renderClass = cx(
    {
      'opacity-0': !imageState.isLoaded,
      'rounded-full': isRounded,
    },
    className
  );

  // eslint-disable-next-line react/no-unknown-property
  return (
    <img
      loading='lazy'
      src={imageState.src}
      className={renderClass}
      onError={onError}
      onLoad={onLoad}
      {...props}
    />
  );
};
