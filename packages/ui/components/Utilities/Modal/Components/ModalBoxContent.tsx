import React, { Fragment } from 'react';
import type { FC, ReactNode } from 'react';

// DefaultBox For Non-Custom Modal

interface IBoxDefault {
  content: string | ReactNode;
}

interface IModalBoxContent {
  content: string | ReactNode;
  type?: 'default' | 'with-background' | 'other';
}

const BoxDefault: FC<IBoxDefault> = (props) => {
  return (
    <div className='relative mt-2 text-center text-ui03 text-body-14-regular'>
      {props.content}
    </div>
  );
};

const BoxWithDecorator: FC<IBoxDefault> = ({ content }) => {
  return (
    <div>
      <figure className='popup-decorator absolute inset-0 m-0 z-0 w-full h-full rounded-3xl overflow-hidden bg-gray1'>
        <img
          className='w-full h-full object-cover object-center'
          src='/public/img/bgPopup.png'
          alt=''
        />
      </figure>
      <div className='popup-with-decorator-content relative z-10 h-full'>
        {content}
      </div>
    </div>
  );
};

const ModalBoxContent: FC<IModalBoxContent> = ({
  content,
  type = 'default',
}) => {
  if (type === 'default' && typeof content === 'string') {
    return <BoxDefault content={content} />;
  }

  if (type === 'with-background') {
    return <BoxWithDecorator content={content} />;
  }

  return <Fragment>{content}</Fragment>;
};

export default ModalBoxContent;
