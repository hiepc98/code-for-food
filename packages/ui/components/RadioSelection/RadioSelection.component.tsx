import { useEffect, useState } from 'react'
import { RadioGroup } from '@headlessui/react'

const plans = [
  {
    title: 'First option',
    value: 'value 1',
  },
  {
    title: 'Second option',
    value: 'value 2',

  },
]

const RadioBox = (props :any) => {
  const {isChecked, className, radius} = props

  return (
    <div className={`${className} ${radius} w-5 h-5 border-2 border-${isChecked ? 'primary' : 'ui04'} flex items-center justify-center`}>
      {
        isChecked && 
        <div className={`${radius} w-[8px] h-[8px] bg-primary`}>
        </div>
      }
      
    </div>
  )
}

interface ISelection {
  items: any[]
  defaultValue?: any
  optionClassName?: string
  className?: string
  onChange: (item) => void
  renderMethod?: (item: any) => React.ReactNode
}

export default function RadioSelection(props : ISelection) {
  const {items = plans, defaultValue, onChange, renderMethod, className, optionClassName} = props
  const [selected, setSelected] = useState(defaultValue)

  // useEffect(() => { 
  //   if(defaultValue){
  //     setSelected(defaultValue)
  //   }
  // }, [defaultValue])

  

  const handleChange = (val) => {
    setSelected(val)
    onChange && onChange(val)
  }


  return (
    <div className={`${className} flex mt-2`}>
       <RadioGroup value={selected} onChange={handleChange} className='w-full'>
          <RadioGroup.Label className="sr-only">Server size</RadioGroup.Label>
          <div>
            {items.map((item) => {
              const active = item.title === selected.title
              return (
                <RadioGroup.Option
                  key={item.title}
                  value={item}
                  className={(props :any) => {
                    // const {active} = props
                    return `${active? 'text-yellow': ''} 
                    bg-transparent transition-all outline-none border-none text-sm w-full flex items-end gap-2
                    mb-2 cursor-pointer
                  `
                  }}
                >
                  <div className={`${optionClassName} flex items-center w-full bg-ui01 p-4 mb-2 border-[1px] border-ui02`}>
                    <RadioBox isChecked={active}/>
                    <div className="flex items-center flex-1">
                      <div className="text-sm ml-3 flex-1">
                        {renderMethod ? renderMethod(item) : item.title}
                      </div>
                    </div>
                  </div>
                </RadioGroup.Option>
              )
            })}
          </div>
        </RadioGroup>
    </div>
  )
}
