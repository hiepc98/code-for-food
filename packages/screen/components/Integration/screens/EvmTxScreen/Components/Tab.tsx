import { cx } from '@wallet/utils'
import React, { FC, PropsWithChildren, useState } from 'react'

const Tabs: FC<PropsWithChildren> = ({ children, ...props }) => {
  const [active, setActive] = useState(0)
  return (
    <div {...props}>
      <div className="tab-titles flex mb-2 rounded-2xl overflow-hidden">
        {React.Children.map(children, (child, index) => {
          const isActive = index === active
          return (
            <div
              className={cx(
                'px-5 py-2 bg-dark capitalize cursor-pointer last:rounded-e-2xl',
                {
                  'text-yellow': isActive
                }
              )}
              onClick={() => setActive(index)}>
              {child.props.title}
            </div>
          )
        })}
      </div>
      <div className="tab-contents">
        {React.Children.map(children, (child, index) => {
          if (index !== active) return null
          return React.cloneElement(child, { ...child.props })
        })}
      </div>
    </div>
  )
}

export default Tabs
