import { useMutation } from '@tanstack/react-query'
import { Key, Wallet } from '@wallet/core'
import {
  type ChangeEvent,
  type FC,
  type PropsWithChildren,
  createContext,
  useContext,
  useState
} from 'react'
import { useHistory } from 'react-router-dom'

import { postSyncWallet } from '../../../services'

import { WalletType } from '../../../types'
import { onImportWallet, store, useAppDispatch } from 'store'
import useViewport from '../../../hooks/useViewport'
import { CHAIN_TYPE } from 'store/constants'
import { get } from 'lodash'

interface IState {
  currentStep: number
  isConfirmReady: boolean
  privateKeyOrPassphrase: string
  name: string
  generatedPhrase: string[]
  sampleVerifyPhrase: string[]
  avatarColor: string
  isOldStandard?: boolean
}

interface CreateWalletContextInterface {
  state: IState
  type: WalletType
  onChangeReady?: (isConfirmReady: boolean) => void
  onChangeSamplePhrase?: (sampleVerifyPhrase: string[]) => void
  onSetDefaultName?: (defaultName: string) => void
  onChangeAvatar?: (avatarType: string) => void
  onChangeIsOldWalletStandard?: (value: boolean) => void
  onConfirmReady?: () => void
  onConfirmBackup?: () => void
  onVerify?: () => void
  onChangeInputState?: (
    name: string
  ) => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
  onRestore?: () => Promise<void>
  onFinishSetupWallet?: () => Promise<void>
  goBack?: () => void
  // wallets: Wallet[]
  isExpand: any
}

const defaultValues: CreateWalletContextInterface = {
  state: {
    currentStep: 0,
    isConfirmReady: false,
    privateKeyOrPassphrase: '',
    name: '',
    generatedPhrase: [],
    sampleVerifyPhrase: [],
    avatarColor: ''
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  type: WalletType.Create,
  // wallets: [],
  isExpand: false
}

interface CreateWalletProviderProps {
  // onImportWallet?: (wallet: Wallet) => void
  encryptService?: any
  baseAdapter: any
  type: WalletType
  // wallets: Wallet[]
}

export const CreateWalletContext =
  createContext<CreateWalletContextInterface>(defaultValues)

export const CreateWalletProvider: FC<
  PropsWithChildren<CreateWalletProviderProps>
> = ({
  children,
  // onImportWallet,
  encryptService,
  baseAdapter,
  type
  // wallets
}) => {
  const { isExpand } = useViewport()
  const history = useHistory()
  const service = window.walletServices && window.walletServices.engines[0]
  // const { state: locationState } = useLocation<{fromSetup: boolean}>()

  const dispatch = useAppDispatch()
  const { mutate: createSyncWallet } = useMutation(postSyncWallet)

  const [state, setState] = useState({
    currentStep: 0,
    isConfirmReady: false,
    name: '',
    privateKeyOrPassphrase: '',
    isOldStandard: false,
    generatedPhrase: [''],
    sampleVerifyPhrase: [''],
    avatarColor: 'bg-primary-bold'
  })

  const onChangeInputState =
    (name: string) =>
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setState((prev) => ({ ...prev, [name]: e.target.value }))
    }

  const onChangeReady = (isConfirmReady: boolean) => {
    setState((prev) => ({ ...prev, isConfirmReady }))
  }

  const onChangeSamplePhrase = (sampleVerifyPhrase: string[]) => {
    setState((prev) => ({ ...prev, sampleVerifyPhrase }))
  }

  const onSetDefaultName = (defaultName: string) => {
    setState((prev) => ({ ...prev, name: defaultName }))
  }

  const onChangeAvatar = (avatarType: string) => {
    setState((prev) => ({ ...prev, avatarColor: avatarType }))
  }

  const onChangeIsOldWalletStandard = (value: boolean) => {
    setState((prev) => ({ ...prev, isOldStandard: value }))
  }

  const onConfirmReady = async () => {
    if (!state.isConfirmReady) return false

    const mnemonic = Key.generateMnemonic(false)

    setState((prev) => ({
      ...prev,
      generatedPhrase: mnemonic.split(' '),
      sampleVerifyPhrase: [],
      currentStep: 1
    }))
  }

  const onConfirmBackup = () => {
    setState((prev) => ({ ...prev, currentStep: 2 }))
  }

  const onVerify = () => {
    setState((prev) => ({ ...prev, currentStep: 3, sampleVerifyPhrase: [] }))
  }

  const onRestore = async () => {
    setState((prev) => ({ ...prev, currentStep: 1 }))
  }

  const onFinishSetupWallet = async () => {
    let createdWallet: any
    const {activeNetwork} = store.getState().setting

    if (type === WalletType.Create) {
      // Create wallet here
      const createOptions = {
        name: state.name,
        mnemonic: state.generatedPhrase.join(' ').toLowerCase(),
        chain: activeNetwork?.chain
      }

      createdWallet = await service.createOrRestore(createOptions)
    } else {
      // Restore wallet here
      const privateKey = Key.isMnemonic(state.privateKeyOrPassphrase)
        ? null
        : state.privateKeyOrPassphrase
      const restoreOptions : any = {
        name: state.name,
        mnemonic: privateKey
          ? null
          : state.privateKeyOrPassphrase.toLowerCase(),
        privateKey,
        isPrivateKey: !!privateKey,
        chain: activeNetwork?.chain
      }

      let restoreOldStandardOptions = {...restoreOptions}
      if(state.isOldStandard){
        const chainName = get(activeNetwork, 'chain', 'evm')
        restoreOldStandardOptions = {
          ...restoreOptions,
          oldStandardOptions: {
            [chainName] : activeNetwork?.chain
          }
        }
      }

      createdWallet = await service.createOrRestore(restoreOldStandardOptions)
    }
    const routing = '/main'
    createdWallet.avatar = state.avatarColor

    if (createdWallet.privateKey) {
      createdWallet.privateKey = encryptService.encrypt(
        createdWallet.privateKey as string
      )
    }

    if (createdWallet.mnemonic) {
      createdWallet.mnemonic = encryptService.encrypt(
        createdWallet.mnemonic as string
      )
    }

    dispatch(onImportWallet(createdWallet.toObject() as Wallet))

    // call sync wallet
    createSyncWallet(createdWallet.toObject() as Wallet, baseAdapter as any)

    return history.push(routing)
  }

  const goBack = () => {
    if (state.currentStep <= 0) {
      return history.goBack()
    }
    return setState((prev) => ({ ...prev, currentStep: prev.currentStep - 1 }))
  }

  return (
    <CreateWalletContext.Provider
      value={{
        state,
        isExpand,
        type,
        onChangeReady,
        onConfirmReady,
        onConfirmBackup,
        onVerify,
        onChangeInputState,
        onChangeSamplePhrase,
        onSetDefaultName,
        onChangeAvatar,
        onChangeIsOldWalletStandard,
        onRestore,
        onFinishSetupWallet,
        goBack
      }}>
      {children}
    </CreateWalletContext.Provider>
  )
}

export const useCreateWalletContext = () => {
  return useContext(CreateWalletContext)
}
