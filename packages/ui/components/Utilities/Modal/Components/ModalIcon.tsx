import React, { FC, useMemo } from 'react';
import { cx } from '@wallet/utils';
import { Icon, IconType } from '../../../Icon/Icon.component';

interface IModalIcon {
  type?: string;
  iconType?: 'danger' | 'error' | 'warning';
}

interface IIcon {
  name: IconType;
  color: string;
}

const ModalIcon: FC<IModalIcon> = ({ type, iconType }) => {
  if (type === 'none' || !type) return null;

  const icon: IIcon = useMemo(() => {
    switch (type) {
      case 'confirm':
        return {
          name: 'Alert',
          color: 'text-red',
        };
      case 'warning':
        return {
          name: 'Warning',
          color: 'text-orange',
        };
      case 'success':
        return {
          name: 'Alert',
          color: 'text-green',
        };
      default:
        return {
          name: 'Alert',
          color: 'text-red',
        };
    }
  }, [type]);

  const renderIcon = () => {
    if (iconType) {
      switch (iconType) {
        case 'danger':
          return (
            <Icon name='Alert' className='text-red' />
            // <img
            //   src='/public/img/icons/alert_outline.svg'
            //   className='w-[54px] h-[54px]'
            //   alt=''
            // />
          );
        case 'warning':
          return (
            <Icon name='Warning' className='text-orange' />
            // <img
            //   src='/public/img/icons/warning_outline.svg'
            //   className='w-[54px] h-[54px]'
            //   alt=''
            // />
          );
        case 'error':
          return (
            <img
              src='/public/img/icons/error_outline.svg'
              className='w-[54px] h-[54px]'
              alt=''
            />
          );
      }
    }

    return <Icon name={icon.name} />;
  };

  return (
    <div
      className={cx(
        'modal-icon-inner all-center w-14 h-14 text-[54px]',
        icon.color
      )}
    >
      {renderIcon()}
    </div>
  );
};

export default ModalIcon;
