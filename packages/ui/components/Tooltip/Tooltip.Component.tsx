import React, { FC, useRef, useState } from 'react';
import { usePopper } from 'react-popper';

interface Props extends React.HTMLAttributes<HTMLDivElement> {}

const Tooltip: FC<Props> = ({ children, ...props }) => {
  const [referenceElement, setReferenceElement] = useState(null);
  const [popperElement, setPopperElement] = useState(null);
  const [arrowElement, setArrowElement] = useState(null);
  const { styles, attributes } = usePopper(referenceElement, popperElement, {
    modifiers: [{ name: 'arrow', options: { element: arrowElement } }],
  });

  return (
    <>
      <div {...props} ref={setReferenceElement}>
        {children}
      </div>
      <div ref={setPopperElement} style={styles.popper} {...attributes.popper}>
        Popper element
        <div ref={setArrowElement} style={styles.arrow} />
      </div>
    </>
  );
};

export default Tooltip;
