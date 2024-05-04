import { Wallet, IGasStep, IGasEstimate, Token } from '@wallet/core'
import {
  type FC,
  type PropsWithChildren,
  createContext,
  useContext,
  useState,
  useMemo
} from 'react'

import { useAppDispatch, useAppSelector } from 'store'
import { BaseAdapter } from 'store/service/BaseAPI'
import { QueryClient } from '@tanstack/react-query'
import { get } from 'lodash'
import {
  convertBalanceToWei,
  convertWeiToBalance,
  formatNumberBro
} from '../../../utils'
import { STAKE_STEP, SORT_TYPE } from '../../../types'
import { ADDRESS_ZERO } from '../../../constants'
import cloneDeep from 'lodash/cloneDeep'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import { useTranslation } from 'react-i18next'
import StakeSuccess from '../components/StakeSuccess'
import WithdrawReview from '../components/WithdrawReview'
import { useHistory } from 'react-router-dom'
import { encryptService } from '../../../services'
import round from 'lodash/round'

dayjs.extend(utc)

const queryOption = {
  retry: 1,
  refetchOnWindowFocus: false,
  cacheTime: 5 * 60 * 1000,
  staleTime: 5 * 60 * 1000
}

const queryClient = new QueryClient()

// Set your global query configuration (staleTime, etc.) if needed
queryClient.setDefaultOptions({
  queries: {
    staleTime: 300000 // 5 minutes in milliseconds
  }
})

interface StakingContextInterface {
  amount: string
  bondedTokens: number
  currentSort?: SORT_TYPE
  currentStep: STAKE_STEP
  currentWallet?: Wallet
  gasDecimal?: number
  gasFee: number
  gasLimit?: number
  gasPrice: number
  gasStep?: IGasStep
  isWithdraw?: boolean
  isDelegations?: boolean
  isLoading: boolean
  isLoadingGas: boolean
  isStaking: boolean
  isUnstake?: boolean
  isUserStaked: boolean
  mainToken: Token | null
  memo: string
  selectedValidator: any
  stakingApr: number
  toAddress: string
  tokenSelected: Token | null
  totalRewards?: string
  totalStaked?: string
  unbondingDelegations?: any[]
  validatorList: any[]
  validatorsDelegator?: any[]
  walletSelected: Wallet | null
  withdrawList?: any[]
  setIsWithdraw?: (value: boolean) => void
  setIsUnstake?: (value: boolean) => void
  fetchDelegators?: () => void
  fetchMainToken?: () => Promise<Token>
  fetchWidthdrawList?: () => void
  fetchStakingToken?: () => void
  fetchValidatorList?: () => void
  handleEstGas?: () => void
  handleUserUnstaked: () => void
  setAmount?: (amount: string) => void
  setCurrentStep?: (step: STAKE_STEP) => void
  setGasDecimal?: (value: any) => void
  setGasFee?: (value: number) => void
  setGasLimit?: (value: number) => void
  setGasPrice?: (value: number) => void
  setGasStep?: (value: any) => void
  setIsLoading?: (value: boolean) => void
  setIsLoadingGas?: (value: boolean) => void
  setIsStaking?: (sendTxs: boolean) => void
  setSelectedValidator?: (validator: any) => void
  setUnbondingDelegations?: (value: any) => void
  handleWithdraw?: () => void
  setToAddress?: (address: string) => void
  setTokenSelected?: (token: Token) => void
  handleChangeGas?: (
    gasFee: number | undefined,
    gasPrice?: number | undefined
  ) => void
  handleTransfer?: (
    isEstimateGas?: boolean,
    gasLimitEst?: number
  ) => Promise<any>
  onChangeMemo?: (event: any) => void
  handleSort?: (type: SORT_TYPE) => void
  updateValidator?: (validator: any) => void
  calculateTotalWithdraw?: () => number
  fetchUnbondingDelegations?: () => void
}

interface StakingProviderProps {
  stakingService?: any
}

const defaultValues: StakingContextInterface = {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  amount: '',
  bondedTokens: 0,
  currentStep: STAKE_STEP.Review,
  gasDecimal: 18,
  gasFee: 0,
  gasPrice: 0,
  gasStep: {},
  isStaking: false,
  isUserStaked: false,
  mainToken: null,
  isLoading: false,
  isLoadingGas: false,
  toAddress: '',
  memo: '',
  tokenSelected: null,
  validatorList: [],
  stakingApr: 0,
  walletSelected: null,
  selectedValidator: null,
  isUnstake: false,
  isWithdraw: false,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  handleUserUnstaked: () => {}
}

export const StakingContext = createContext(defaultValues)

export const StakingProvider: FC<PropsWithChildren<StakingProviderProps>> =
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  ({ children, stakingService }) => {
    const [activeWallet, activeNetwork] = useAppSelector((state) => [
      state.wallet.activeWallet,
      state.setting.activeNetwork
    ])

    const { meta } = activeWallet

    const chain = meta?.chain || 'ether'

    const { t } = useTranslation()

    const history = useHistory()

    // GLOBAL
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [isLoadingGas, setIsLoadingGas] = useState<boolean>(false)
    const [memo, setMemo] = useState('')
    const [currentSort, setCurrentSort] = useState<SORT_TYPE>(
      SORT_TYPE.AMOUNT_STAKED
    )

    // VALIDATOR
    const [validatorList, setValidatorList] = useState<any>([])
    const [bondedTokens, setBondedTokens] = useState<number>(0)
    const [stakingApr, setStakingApr] = useState<number>(0)
    const [selectedValidator, setSelectedValidator] = useState<any>(null)

    // WITHDRAW LIST
    const [withdrawList, setWithdrawList] = useState<any[]>([])

    // STAKE
    const [isUserStaked, setIsUserStaked] = useState<boolean>(false)
    const [amount, setAmount] = useState<string>('')
    const [currentStep, setCurrentStep] = useState(STAKE_STEP.Select)
    const [tokenSelected, setTokenSelected] = useState<Token | null>(null)
    const [toAddress, setToAddress] = useState('')
    const [mainToken, setMainToken] = useState<Token | null>(null)
    const [walletSelected, setWalletSelected] = useState<Wallet | null>(
      activeWallet
    )
    const [isStaking, setIsStaking] = useState<boolean>(false)
    const [isUnstake, setIsUnstake] = useState<boolean>(false)
    const [isWithdraw, setIsWithdraw] = useState<boolean>(false)

    // DELEGATOR INFO
    const [delegations, setDelegations] = useState<any[]>([])
    const [totalStaked, setTotalStaked] = useState<string>('0')
    const [totalRewards, setTotalRewards] = useState<string>('0')
    const [validatorsDelegator, setValidatorsDelegator] = useState<any[]>([])
    const [unbondingDelegations, setUnbondingDelegations] = useState<any[]>([])

    const isDelegations = useMemo(() => {
      return delegations.length > 0 || unbondingDelegations.length > 0
    }, [delegations, unbondingDelegations])

    // GAS_FEE
    const [gasFee, setGasFee] = useState(0)
    const [gasPrice, setGasPrice] = useState(0)
    const [gasLimit, setGasLimit] = useState(0)
    const [gasStep, setGasStep] = useState({})
    const [gasDecimal, setGasDecimal] = useState(18)

    const dispatch = useAppDispatch()

    const handleUserUnstaked = () => {
      setIsUserStaked(true)
    }

    const updateValidator = async (validator: any) => {
      try {
        const candidateInfo = get(validator, 'candidate', '')
        // const candidateData = await stakingService.getCandidateInfo(candidateInfo)
        const candidateData = await queryClient.fetchQuery(
          ['candidateInfo', candidateInfo],
          () => stakingService.getCandidateInfo(candidateInfo),
          queryOption
        )
        const validatorListUpdate = cloneDeep(validatorList)
        // update selectedValidator in validatorList
        const index = validatorListUpdate.findIndex(
          (val: any) => val.candidate === validator.candidate
        )

        validatorListUpdate[index] = {
          ...validatorListUpdate[index],
          ...candidateData
        }

        if (get(selectedValidator, 'candidate') === candidateInfo) {
          setSelectedValidator(validatorListUpdate[index])
        }

        setValidatorList(validatorListUpdate)
        // Merge the candidate data into the existing validator object
        Object.assign(validator, candidateData)
      } catch (error: any) {
        // Handle the error, e.g., log it or do nothing
        console.error(`Failed to update validator ${validator}: ${error}`)
        return null // Return null to indicate an error occurred
      }
    }

    // Function to update all validators concurrently
    const updateAllValidators = async (validatorsMaster: any) => {
      try {
        const promises = validatorsMaster.map(updateValidator)
        await Promise.all(promises)
      } catch (error) {
        // Handle any errors that might occur during the Promise.all
        console.error('An error occurred while updating validators:', error)
        return [] // Return an empty array in case of an error
      }
    }

    const fetchValidatorList = async () => {
      try {
        const validatorsMaster = await stakingService.getMasterValidators({})
        setValidatorList(validatorsMaster)
      } catch (error) {
        console.log('error', error)
      }
    }

    const fetchUnbondingDelegations = async () => {
      try {
        const delegator = get(activeWallet, 'address')
        const unbondingDelegationsList =
          await stakingService.getPendingVoter(delegator)
        setUnbondingDelegations(unbondingDelegationsList)
      } catch (error) {
        console.log('error', error)
      }
    }

    const handleSort = (type: SORT_TYPE) => {
      if (validatorList.length === 0) return
      const sortList = cloneDeep(validatorList)
      const sortedList = sortList.sort((a: any, b: any) => {
        if (type === SORT_TYPE.APR) {
          const aCommission = round(
            Number(get(a, 'commission_rate', '0.00')) * 100,
            3
          )
          const bCommission = round(
            Number(get(b, 'commission_rate', '0.00')) * 100,
            3
          )

          const aAPR = round(stakingApr * (1 - Number(aCommission) / 100), 2)
          const bAPR = round(stakingApr * (1 - Number(bCommission) / 100), 2)
          setCurrentSort(SORT_TYPE.APR)
          // sort descending
          return Number(bAPR) - Number(aAPR)
        } else if (type === SORT_TYPE.AMOUNT_STAKED) {
          const aToken = get(a, 'capacity', '0')
          const bToken = get(b, 'capacity', '0')
          setCurrentSort(SORT_TYPE.AMOUNT_STAKED)
          // sort descending
          return Number(bToken) - Number(aToken)
        } else if (type === SORT_TYPE.ALPHABET) {
          const aName = get(a, 'name', 'Validator')
            .toLowerCase()
            .replace(/\s/g, '')
          const bName = get(b, 'name', 'Validator')
            .toLowerCase()
            .replace(/\s/g, '')
          setCurrentSort(SORT_TYPE.ALPHABET)
          // sort ascending
          return aName.localeCompare(bName)
        }
        return 0
      })
      setValidatorList(sortedList)
    }

    const calculateTotalWithdraw = () => {
      let totalRewards = withdrawList.reduce((total: any, item: any) => {
        const amount = get(item, 'cap', '0')
        return total + Number(amount)
      }, 0)

      return totalRewards
    }

    const fetchWidthdrawList = async () => {
      const delegator = get(activeWallet, 'address')
      const listWithDraw = await stakingService.getListWithdraw(delegator)
      setWithdrawList(listWithDraw)
    }

    const fetchDelegators = async () => {
      try {
        const delegator = get(activeWallet, 'address')

        const candidateInfo = await stakingService.getVoterCandidates(
          // '0x99ce33c99f3f3dfcc3bd8f8a57650912e2a5d46b'
          delegator
        )

        const totalVoted = get(candidateInfo, 'totalVoted', 0)
        const delegatorList = get(candidateInfo, 'dataResponse', [])

        const promises = delegatorList.map(async (item: any) => {
          const candidate = get(item, 'candidate', '')
          const stakeAmount = get(item, 'capacityNumber', '0')

          const candidateData = await queryClient.fetchQuery(
            ['candidateInfo', candidate],
            () => stakingService.getCandidateInfo(candidate),
            queryOption
          )

          return {
            stakeData: item,
            ...candidateData,
            stakeAmount,
            validatorRewards: 0
          }
        })

        const delegatorValidator = await Promise.all(promises)

        setTotalStaked(totalVoted)
        setTotalRewards('0')
        setDelegations(delegatorList)
        setValidatorsDelegator(delegatorValidator)
      } catch (e) {
        console.log('e', e)
      }
    }

    const service = useMemo(() => {
      return window.walletServices.engines[0]
    }, [window.walletServices])

    const handleEstGas = async () => {
      setIsLoadingGas(true)
      let gasLimitReturn = 0
      try {
        const config = {
          token: tokenSelected || undefined,
          wallet: walletSelected || undefined,
          amount: amount || '1',
          recipient: get(walletSelected, 'address', 'inj')
        }
        const response = (await service?.estimateGas(config)) as IGasEstimate
        // @ts-ignore
        const { gasPrice, gasStep, decimal, isRaw } = response

        const customGasStep = cloneDeep(gasStep)

        //  TEMP ONLY, WAIT FOR ENGINE TEAM
        const gasPriceTemp = gasPrice * 1.8
        const gasLimit = isRaw
          ? convertBalanceToWei(gasPriceTemp.toString(), decimal)
          : gasPriceTemp

        const gasPriceEst = customGasStep?.standard
        const gasFee = gasLimit * (gasPriceEst ?? 1)
        gasLimitReturn = parseInt(String(gasLimit))
        setGasStep?.(customGasStep)
        setGasLimit?.(parseInt(String(gasLimit)))
        setGasPrice?.(gasPriceEst || 0) // price per GasLimit unit (as I understand)
        setGasDecimal?.(decimal)
        setGasFee?.(gasFee)
      } catch (e) {
        console.log('err', e)
      } finally {
        setIsLoadingGas(false)
        return gasLimitReturn
      }
    }

    const handleTransfer = async (
      isEstimateGas?: boolean,
      gasLimitEst?: number
    ) => {
      setIsStaking?.(true)
      try {
        const wallet = encryptService.decryptWallet(walletSelected as Wallet)

        const formatGasFee = formatNumberBro(
          convertWeiToBalance(gasFee.toString(), gasDecimal),
          8
        )

        const transaction: any = {
          from: get(walletSelected, 'address', ''),
          to: isEstimateGas
            ? ADDRESS_ZERO
            : get(selectedValidator, 'operator_address'),
          amount,
          gasFee: formatGasFee,
          token: tokenSelected,
          memo,
          options: {
            gasPrice
          }
        }

        let response

        try {
          if (!isWithdraw && !isUnstake) {
            response = await stakingService.voteCandidate(
              get(selectedValidator, 'candidate'),
              get(wallet, 'privateKey'),
              convertBalanceToWei(amount, get(tokenSelected, 'decimal')),
              Number(convertBalanceToWei(gasPrice.toFixed(9), 9)),
              gasLimit,
              88
            )
          } else if (isUnstake) {
            response = await stakingService.unvoteCandidate(
              get(selectedValidator, 'candidate'),
              get(wallet, 'privateKey'),
              convertBalanceToWei(amount, get(tokenSelected, 'decimal')),
              Number(convertBalanceToWei(gasPrice.toFixed(9), 9)),
              gasLimit,
              88
            )
          } else if (isWithdraw) {
            response = await stakingService.withDrawStake(
              get(wallet, 'privateKey'),
              Number(convertBalanceToWei(gasPrice.toFixed(9), 9)),
              gasLimit,
              88
            )
          }

          if (
            isWithdraw &&
            response &&
            response.length === withdrawList.length
          ) {
            // for each response logTransaction
            Promise.all(
              response.forEach(async (item: any) => {
                const logTransaction = {
                  ...transaction,
                  chain: get(walletSelected, 'meta.chain', 'inj'),
                  hash: get(item, 'transactionHash', ''),
                  amount,
                  contract: {
                    address: get(transaction, 'asset'),
                    decimals: get(tokenSelected, 'decimals', 18)
                  },
                  timestamp: dayjs.utc().format(),
                  options: {
                    gasFee: (gasLimit * gasPrice).toFixed()
                  }
                }

                delete logTransaction.asset
                await BaseAdapter.post('record/log', logTransaction)
              })
            ).catch((err) => {
              console.log('err', err)
            })

            return onOpenModal(response, gasFee.toString(), false)
          }

          if (typeof response === 'string' && response) {
            const logTransaction = {
              ...transaction,
              chain: get(walletSelected, 'meta.chain', 'inj'),
              hash: get(response, 'transactionHash', ''),
              amount,
              contract: {
                address: get(transaction, 'asset'),
                decimals: get(tokenSelected, 'decimals', 18)
              },
              timestamp: dayjs.utc().format(),
              options: {
                gasFee: (gasLimit * gasPrice).toFixed()
              }
            }

            delete logTransaction.asset
            await BaseAdapter.post('record/log', logTransaction)
          }
        } catch (e) {
          console.log('err', e)
        }

        setIsStaking?.(false)
        if (isEstimateGas) {
          return response
        }

        if (!get(response, 'status')) {
          console.log('err', response)
          return onOpenModal(
            get(response, 'transactionHash', ''),
            gasFee.toString(),
            true
          )
        }
        return onOpenModal(
          get(response, 'transactionHash', ''),
          gasFee.toString(),
          false
        )
      } catch (err) {
        console.log(err)
        return onOpenModal('', gasFee.toString(), true)
      } finally {
        setIsStaking?.(false)
      }
    }

    const onOpenModal = (
      hash: string | string[],
      gasFee: string,
      isFailed: boolean
    ) => {
      window.openModal({
        type: 'none',
        title: isWithdraw
          ? t('stake_screen.withdraw_main', {
              token: get(tokenSelected, 'symbol', 'INJ')
            })
          : isUnstake
            ? t('stake_screen.unstaked_main', {
                token: get(tokenSelected, 'symbol', 'INJ')
              })
            : t('stake_screen.staked_main', {
                token: get(tokenSelected, 'symbol', 'INJ')
              }),
        content: (
          <StakeSuccess
            mainBalance={get(mainToken, 'balance', '0')}
            gasFee={gasFee}
            gasDecimal={gasDecimal}
            tokenSelected={tokenSelected}
            walletSelected={walletSelected}
            isStaking={isStaking}
            amount={amount}
            selectedValidator={selectedValidator}
            stakingApr={stakingApr}
            hash={hash}
            chain={chain}
            isFailed={isFailed}
            isWithdraw={isWithdraw}
            isStake={!isWithdraw && !isUnstake}
            isUnstake={!isWithdraw && isUnstake}
            withdrawList={withdrawList}
          />
        ),
        contentType: 'other',
        closable: true,
        onCancel: () => {
          history.push('/main', {
            isReload: true
          })
        }
      })
    }

    const handleWithdraw = async () => {
      setIsWithdraw(true)
      try {
        await handleEstGas()
      } catch (e) {
        console.log('err', e)
      } finally {
        window.openModal({
          type: 'none',
          title: t('stake_screen.withdraw_confirm'),
          content: (
            <WithdrawReview
              tokenSelected={tokenSelected}
              validatorSelected={selectedValidator}
              handleTransfer={handleTransfer}
              handleEstGas={handleEstGas}
              gasLimit={gasLimit}
            />
          ),
          contentType: 'other',
          closable: true,
          onCancel: () => {
            history.replace('/main')
          }
        })
      }
    }

    const handleChangeGas = (
      gasFee: number | undefined,
      gasPrice?: number | undefined
    ) => {
      setGasFee?.(gasFee || 0)
      setGasPrice?.(gasPrice || 0)
    }

    const fetchMainToken = async () => {
      const tokens = await service.tokens({
        address: walletSelected?.address,
        chain
      })
      const mainToken = tokens.find((item: Token) => !item.address) as Token
      setMainToken(mainToken)
      return mainToken
    }

    const fetchStakingToken = async () => {
      const token = await fetchMainToken()
      setMainToken(token)
      setTokenSelected(token)
    }

    const onChangeMemo = (event: any) => {
      setMemo?.(event.target.value)
    }

    return (
      <StakingContext.Provider
        value={{
          amount,
          bondedTokens,
          currentStep,
          gasDecimal,
          gasFee,
          gasLimit,
          gasPrice,
          gasStep,
          isDelegations,
          isLoading,
          isLoadingGas,
          isStaking,
          isUserStaked,
          mainToken,
          memo,
          selectedValidator,
          stakingApr,
          toAddress,
          tokenSelected,
          totalRewards,
          totalStaked,
          validatorList,
          validatorsDelegator,
          walletSelected,
          isUnstake,
          isWithdraw,
          unbondingDelegations,
          currentSort,
          withdrawList,
          setIsUnstake,
          fetchDelegators,
          fetchMainToken,
          fetchWidthdrawList,
          fetchStakingToken,
          fetchValidatorList,
          handleChangeGas,
          handleEstGas,
          handleTransfer,
          handleUserUnstaked,
          onChangeMemo,
          setAmount,
          setCurrentStep,
          setGasDecimal,
          setGasFee,
          setGasLimit,
          setGasPrice,
          setGasStep,
          setIsLoading,
          setIsLoadingGas,
          setIsStaking,
          setSelectedValidator,
          setToAddress,
          setUnbondingDelegations,
          handleWithdraw,
          setIsWithdraw,
          handleSort,
          updateValidator,
          calculateTotalWithdraw,
          fetchUnbondingDelegations
        }}>
        {children}
      </StakingContext.Provider>
    )
  }

export const useStakingContext = () => {
  return useContext(StakingContext)
}
