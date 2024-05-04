import { Icon, Touch } from '@wallet/ui'
import React, {
  type FC,
  type PropsWithChildren,
  type ReactNode,
  useState
} from 'react'

interface Props extends PropsWithChildren {
  title?: string
  data?: string | ReactNode
  defaultShow?: boolean
  hideTitle?: boolean
}

const ClosableContent: FC<Props> = ({
  title,
  data,
  children,
  hideTitle,
  defaultShow = true
}) => {
  const [show, setShow] = useState(defaultShow)

  return (
    <div>
      <div className="bg-ui01 p-4 rounded-lg">
      {!hideTitle && (
          <div
            className="flex justify-between items-center cursor-pointer"
            onClick={() => setShow(!show)}>
            <div className="text-tiny text-ui03">{title}</div>
            <div className="text-h3">
              <Touch>
                <Icon name="chevron_down" />
              </Touch>
            </div>
          </div>
        )}

        {show && (
          <div className="max-h-[200px] overflow-auto rounded-lg mt-2">
            {children ?? <pre>{data}</pre>}
          </div>
        )}
      </div>
    </div>
  )
}

export default ClosableContent
