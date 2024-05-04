import React from 'react';
import { Icons } from '../../constants/Icons';

interface IIcon extends React.HTMLAttributes<HTMLSpanElement> {
  name: (typeof Icons)[number];
}

export type IconType = (typeof Icons)[number];

export const Icon: React.FC<IIcon> = ({ name, className, ...rest }) => {
  const classes = `
    icon-${name}
    ${className ?? ''}
  `;
  return <span className={classes} {...rest}></span>;
};
