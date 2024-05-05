
import { resetAllReduxStore } from "../Auth/utils"
import { useAppSelector } from "store"
import useRouting from "../../hooks/useRouting"
import { formatNumberBro, truncate } from "@wallet/utils"
import { Button, EmptyData, Icon, Image, Touch } from '@wallet/ui'
import useClipboard from "../../hooks/useClipboard"
import { useTranslation } from "react-i18next"
import supabase, { updatePointAfterClaim } from "../../services/supaBase"
import NumCountUp from '../Countup'
import { fetchRewardData } from "../../services/supaBase"
import { useEffect, useState } from "react"
import { encryptService } from '../../services/encryption'
import Web3 from "web3"
import SendSuccess from "./SendSuccess"
// import { CLAIM_POINT } from "../../constants"

const abiContract: any = [
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "rewardToken",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "vault",
        "type": "address"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "claim",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "to",
        "type": "address"
      }
    ],
    "name": "getLv",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "to",
        "type": "address"
      }
    ],
    "name": "getReward",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "setReward",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "uplevel",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  }
]

const abiToken: any = [{ "inputs": [], "stateMutability": "nonpayable", "type": "constructor" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "owner", "type": "address" }, { "indexed": true, "internalType": "address", "name": "spender", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "value", "type": "uint256" }], "name": "Approval", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "from", "type": "address" }, { "indexed": true, "internalType": "address", "name": "to", "type": "address" }, { "indexed": true, "internalType": "address", "name": "issuer", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "value", "type": "uint256" }], "name": "Fee", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": false, "internalType": "address", "name": "account", "type": "address" }], "name": "Frozen", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "previousOwner", "type": "address" }, { "indexed": true, "internalType": "address", "name": "newOwner", "type": "address" }], "name": "OwnershipTransferred", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "from", "type": "address" }, { "indexed": true, "internalType": "address", "name": "to", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "value", "type": "uint256" }], "name": "Transfer", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": false, "internalType": "address", "name": "account", "type": "address" }], "name": "Unfrozen", "type": "event" }, { "inputs": [], "name": "DOMAIN_SEPARATOR", "outputs": [{ "internalType": "bytes32", "name": "", "type": "bytes32" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "acceptOwnership", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "owner", "type": "address" }, { "internalType": "address", "name": "spender", "type": "address" }], "name": "allowance", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "spender", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "approve", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "account", "type": "address" }], "name": "balanceOf", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "burn", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "sender", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "burnFrom", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "decimals", "outputs": [{ "internalType": "uint8", "name": "", "type": "uint8" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "spender", "type": "address" }, { "internalType": "uint256", "name": "subtractedValue", "type": "uint256" }], "name": "decreaseAllowance", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "value", "type": "uint256" }], "name": "estimateFee", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "freeze", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "frozen", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "spender", "type": "address" }, { "internalType": "uint256", "name": "addedValue", "type": "uint256" }], "name": "increaseAllowance", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "issuer", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "minFee", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "account", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "mint", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "name", "outputs": [{ "internalType": "string", "name": "", "type": "string" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "owner", "type": "address" }], "name": "nonces", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "owner", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "owner", "type": "address" }, { "internalType": "address", "name": "spender", "type": "address" }, { "internalType": "uint256", "name": "value", "type": "uint256" }, { "internalType": "uint256", "name": "deadline", "type": "uint256" }, { "internalType": "uint8", "name": "v", "type": "uint8" }, { "internalType": "bytes32", "name": "r", "type": "bytes32" }, { "internalType": "bytes32", "name": "s", "type": "bytes32" }], "name": "permit", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "numerator", "type": "uint256" }, { "internalType": "uint256", "name": "denominator", "type": "uint256" }, { "internalType": "uint256", "name": "fee", "type": "uint256" }], "name": "setFee", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "symbol", "outputs": [{ "internalType": "string", "name": "", "type": "string" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "totalSupply", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "recipient", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "transfer", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "sender", "type": "address" }, { "internalType": "address", "name": "recipient", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "transferFrom", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "newOwner", "type": "address" }], "name": "transferOwnership", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "unfreeze", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "token_", "type": "address" }, { "internalType": "address", "name": "destination_", "type": "address" }, { "internalType": "uint256", "name": "amount_", "type": "uint256" }], "name": "withdraw", "outputs": [], "stateMutability": "nonpayable", "type": "function" }]
const addressContractFud = '0x0525ADe5CF744629e24F6F22713815224bF6B421'
const addressToken = '0xbDafd74Df8a7311689dA9501E347F152Ab4818fb'

const web3 = new Web3("https://rpc.tomochain.com");
const contractFud = new web3.eth.Contract(
  abiContract,
  addressContractFud
);
const contractToken = new web3.eth.Contract(
  abiToken,
  addressToken
);

const sendTx = async (privateKey: string, raw: string) => {
  try {
    const account = web3.eth.accounts.privateKeyToAccount(privateKey)
    const nonce = await web3.eth.getTransactionCount(account.address)
    const gasPrice = await web3.eth.getGasPrice()
    const networkId = await web3.eth.net.getId()


    const rawTransaction: any = {
      from: account.address,
      to: addressContractFud,
      data: raw
    }

    const gas = await web3.eth.estimateGas(rawTransaction)

    rawTransaction.gasPrice = gasPrice
    rawTransaction.nonce = nonce
    rawTransaction.chainId = networkId
    rawTransaction.gas = gas

    const signedTransaction = await account.signTransaction(rawTransaction)

    const receipt = await web3.eth.sendSignedTransaction(signedTransaction.rawTransaction!);
    return receipt.transactionHash
  } catch (err) {
    console.log("🦅 ~ err:", err)

  }
}

const MainScreen = () => {
  const { navigateScreen } = useRouting()
  const [balance, setBalance] = useState(0)
  const [point, setPoint] = useState(0)
  const wallets = useAppSelector((state) => state.wallet.wallets)
  const activeWallet = useAppSelector((state) => state.wallet.activeWallet)
  const { t } = useTranslation()
  const { onCopyWithTitle } = useClipboard({ t })

  const [pointBalance, setPointBalance] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingFud, setIsLoadingFud] = useState(false)

  const formatWalletBalance = (balance: number | string) => {
    let val = Number(balance)
    if (Number.isNaN(val) || !val || val <= 0) {
      return '0.0'
    }
    if (val < 10) {
      return formatNumberBro(val, 2)
    }
    if (isLoading) return formatNumberBro(val, 2)
    // return formatNumberBro(val, 1)
    return <NumCountUp endNum={Number(val)} duration={1} decimals={2} />
  }

  const updateBalance = async () => {
    try {
      const wallet = encryptService.decryptWallet(wallets[0], true)
      const balanceFud = await contractToken.methods.balanceOf(wallet.toObject().address).call()
      console.log("🦅 ~ balanceFud:", balanceFud)
      setBalance(balanceFud / 10 ** 18)
    } catch (err) {
      console.log("🦅 ~ err:", err)

    }
  }

  const address = activeWallet.address
  const name = activeWallet.name

  const onCopyAddress = (e: any) => {
    e.stopPropagation()
    onCopyWithTitle(
      address,
      t('main_screen.address')
    )()
  }

  useEffect(() => {
    init()
  }, [])

  const init = async () => {
    setIsLoading(true)
    const { data, error } = await supabase.from('reward').select().eq('address', activeWallet.address)
    if (data) {
      setPointBalance(data[0].point)
      setIsLoading(false)
    }
    setIsLoading(false)
  }


  const onRefFriend = (e: any) => {
    e.stopPropagation()
    const url = `https://www.coode4fud.xyz/ref/${address}`
    onCopyWithTitle(
      url,
      t('main_screen.address')
    )()
  }

  const onRefresh = () => {
    init()
  }

  const onUpdatePointAfterClaim = async () => {
    const data = await updatePointAfterClaim({ address: activeWallet.address, point: pointBalance })
    setPointBalance(prev => prev - pointBalance)
  }
  const onClaim = async () => {
    setIsLoadingFud(true)
    const wallet = encryptService.decryptWallet(wallets[0], true)
    console.log("wallets", (wallet.toObject().privateKey! as string).slice(2))

    // const balanceReward = pointBalance / 500 * 10**18
    const dadad18 = web3.utils.toBN('1000000000000000000')
    const balanceReward = web3.utils.toBN(pointBalance).mul(dadad18).div(web3.utils.toBN(500))
    // const ddada = web3.utils.toBN(1)
    console.log("dadadadaddas", balanceReward.toString())
    const raw = contractFud.methods.claim(balanceReward).encodeABI()

    const hash = await sendTx((wallet.toObject().privateKey! as string).slice(2), raw)
    console.log("🦅 ~ hash:", hash)
    updateBalance()
    await onUpdatePointAfterClaim()
    setIsLoadingFud(false)

    return window.openModal({
      type: 'none',
      title: '',
      content: (
        <SendSuccess
          hash={hash as any}
        />
      ),
      contentType: 'other',
      closable: true
    })
  }

  useEffect(() => {
    updateBalance()
  }, [])

  console.log("isLoadingFud && pointBalance >= 50", isLoadingFud && pointBalance < 50)

  return (
    <div className="h-full">
      <div className="w-full h-20 flex justify-between items-center border-b border-b-ui01 px-5">
        <div>
          <div className='text-ui04 font-medium text-tiny'>
            {name}
          </div>

          <div className='body-14-regular text-ui03'>
            Level: Beginner
          </div>



        </div>

        <div className="text-h3 text-ui04">
          <div className="body-14-regular text-ui03 flex items-center gap-[2px]">
            {truncate(address)}
            <Touch
              onClick={onCopyAddress}
              style={{ width: 20, height: 20 }}>
              <Icon name="copy" />
            </Touch>
          </div>
        </div>
      </div>
      {/* <code>{JSON.stringify(activeWallet, null, 4)}</code> */}
      <div className="w-full flex justify-center items-center h-[60%]">

        <div>
          <div className="mb-2 text-center text-ui04 flex items-center justify-center">
            <p className="mr-2">Points</p>
            <Icon className="cursor-pointer text-[24px]" name="refresh" onClick={onRefresh} />
          </div>
          <div className="text-ui04 text-h2 text-center mb-6" style={{ fontSize: '40px' }}>
            {formatWalletBalance(pointBalance)}
          </div>

          <div className="mt-3 w-full text-[24px] text-center text-ui04 flex items-center justify-center">
            <p className="mr-2">FUD </p>
            <div className="text-ui04 text-[24px] text-center">
              {formatWalletBalance(balance)}
            </div>
          </div>


          <div>
            {/* Session 1 earning: 50,000 */}
          </div>
        </div>
      </div>

      <div className="flex gap-4 px-5">
        <Button
          isBlock
          disabled={isLoadingFud || pointBalance < 50}
          onClick={onClaim}>
          {
            isLoadingFud
              ? <EmptyData isLoading />
              : 'Claim'
          }

        </Button>

        <Button
          isBlock
          onClick={onRefFriend}>
          Ref a friend
        </Button>
      </div>
    </div>
  )
}

export default MainScreen
