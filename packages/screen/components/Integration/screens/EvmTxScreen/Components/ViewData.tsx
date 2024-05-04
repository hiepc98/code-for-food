import { cx } from '@wallet/utils'
import React, { useMemo, useState } from 'react'

type Tab = {
  name: string
  content: any
}

interface IProps {
  tabs: Tab[]
  data?: any
  className?: string
}

const ViewData = ({ tabs, className }: IProps) => {
  const [activeTab, setActiveTab] = useState<string>('Data')

  const typeTab = useMemo(() => {
    return tabs.find((it) => it.name === activeTab)
  }, [activeTab])

  const onChangeTabActive = (tab: string) => () => {
    setActiveTab(tab)
  }

  return (
    <div className={className}>
      <div className="px-5 mb-6 flex items-center justify-between">
        <div className="flex flex-1 items-center gap-4 text-[18px] leading-6">
          {tabs.map((tab) => (
            <div
              key={tab.name}
              className={cx(
                'transition pb-1 cursor-pointer all-center font-bold text-ui04',
                {
                  'text-ui02': typeTab.name !== tab.name,
                  'border-b-2 border-ui04 font-bold': typeTab.name === tab.name
                }
              )}
              onClick={onChangeTabActive(tab.name)}>
              {tab.name}
            </div>
          ))}
        </div>
      </div>
      <div className="px-5 text-ui04">{typeTab.content}</div>
    </div>
  )
}

export default ViewData
