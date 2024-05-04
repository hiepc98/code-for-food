import { useAppSelector } from 'store'

const useTokenLocal = () => {
  const services = window.walletServices

  const [coinLocal, coinGecko, activeNetwork, activeWallet] = useAppSelector((state) => {
    return [
      state.info.coinLocal,
      state.info.coinGecko,
      state.setting.activeNetwork,
      state.wallet.activeWallet
    ]
  })

  // const { tokens } = useManageToken()
  const [tokens] = useAppSelector((state) => {
    return [state.wallet.tokens]
  })

  const getAllToken = () => {
    const list = Object.values(coinLocal)
      .map((token) => token)
      .flat(1)
    return [...list] || []
  }

  const tokensLocal = activeNetwork
    ? [...(coinLocal[activeNetwork.chain] || [])]
    : getAllToken()

  const getTokenMain = (chain?: string) => {
    // const listMain = tokens.filter((item) => item.isMain)
    const mainToken = tokens.find((item) => !item.address)

    return mainToken || {}
  }

  const getInfoTokenByAddress = async (address: string, chain: string) => {
    if (!address || !chain || !services) return {}
    // const token = await services.wallet.getTokenInfo({ chain, address })

    // const walletByChain = getWalletByChain(chain)

    const tokenInfo = await window.walletServices.getTokenInfo({
      chain,
      address,
      wallet: activeWallet
    })

    if (!tokenInfo) return {}
    return { ...tokenInfo, chain, address } || {}
  }

  const getTokenDetailByAddress = (address: string, chain: string) => {
    let tokenInfo = (coinLocal[chain] || []).find(
      (it) => it.address.toLowerCase() === address?.toLowerCase()
    )
    if (!tokenInfo) return null
    const marketInfo = coinGecko.find((it) => it.id === tokenInfo?.cgkId)
    const price = marketInfo?.current_price
      ? Number(marketInfo?.current_price)
      : 0
    tokenInfo = {
      ...tokenInfo,
      market: {
        cgkId: (marketInfo?.id as string) || '',
        volume: Number(marketInfo?.total_volume) || 0,
        market_cap: Number(marketInfo?.market_cap) || 0,
        circulating_supply: Number(marketInfo?.circulating_supply) || 0,
        max_supply: Number(marketInfo?.total_supply) || 0,
        price_change_percentage_24h:
          Number(marketInfo?.price_change_percentage_24h) || 0
      },
      prices: {
        price,
        bitcoin: 0,
        ethereum: 0,
        total: 0
      }
    }
    return tokenInfo
  }

  return {
    tokensLocal,
    getInfoTokenByAddress,
    getTokenMain,
    getTokenDetailByAddress
  }
}

export default useTokenLocal
