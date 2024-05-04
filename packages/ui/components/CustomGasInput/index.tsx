import type { Chain } from '@wallet/core'
import { Input, TypeInput } from '../Input'
import get from 'lodash/get'
import {
  type ChangeEvent,
  type FC,
  type PropsWithChildren,
  useEffect,
  useState
} from 'react'

interface Props extends PropsWithChildren {
  gasLimit: number
  gasFee: number
  chain?: string
  onChange: (value: string) => void
  networks: Chain[]
  t
}

interface IState {
  chain?: string
  gasPrice: string
  txsData: string
  nonce: string
}
const CustomGasInput: FC<Props> = (props) => {
  const { gasLimit, gasFee, chain, onChange, networks, t } = props

  const activeNetwork = networks.find((network) => network.chain === chain)

  const [state, setState] = useState<IState>({
    gasPrice: '1',
    txsData: '0x00',
    nonce: '1'
  })

  useEffect(() => {
    // keep gasPrice case stepTo back to stepFrom
    if (gasFee) {
      const gasPrice = gasFee / gasLimit
      setState({ ...state, gasPrice: gasPrice.toString() })
    }
  }, [])

  const handleChangeGas = (e: ChangeEvent<HTMLInputElement>) => {
    const value: string = e.target.value
    onChange && onChange(value)
  }

  return (
    <div className="grid grid-cols-2 gap-3 mt-2">
      <Input
        typeInput={TypeInput.Number}
        className="bg-ui00 mb-0"
        maxLength={10}
        label={t('transaction_screen.gas_price', {
          unit: get(activeNetwork, 'symbol')
        })}
        value={state.gasPrice}
        onChange={handleChangeGas}
      />
      <Input
        typeInput={TypeInput.Number}
        className="bg-ui00 mb-0 cursor-not-allowed"
        maxLength={10}
        disabled
        label={t('custom_gas_input.gas_limit')}
        value={gasLimit.toString()}
      />
    </div>
  )
}

export default CustomGasInput
