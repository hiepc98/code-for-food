import type { RamperChain } from '../types'

export const CHAIN_TYPE = {
  // EVM
  tomo: 'tomo',
  tomoTestnet: 'tomoTestnet'
  // ether: 'ether',
  // matic: 'matic',
  // binanceSmart: 'binanceSmart',
  // sei: 'sei',
  // solana: 'solana'
} as const

export const CHAIN_SUPPORT = Object.keys(CHAIN_TYPE).map((chain) => chain)

export const COIN_IMAGE = {
  TOMO: 'https://coin98.s3.ap-southeast-1.amazonaws.com/Coin/Tomo.png',
  ETH: 'https://coin98.s3.ap-southeast-1.amazonaws.com/Coin/ETH.png',
  BNB: 'https://coin98.s3.ap-southeast-1.amazonaws.com/Coin/BNBVer2.png',
  MATIC: 'https://coin98.s3.ap-southeast-1.amazonaws.com/Coin/polygon.png',
  SEI: 'https://coin98.s3.ap-southeast-1.amazonaws.com/Currency/sei.png',
  SOL: 'https://coin98.s3.ap-southeast-1.amazonaws.com/Coin/solana.jpg'
}

export const CHAIN_IMAGE = {
  tomo: COIN_IMAGE.TOMO,
  ether: COIN_IMAGE.ETH,
  binanceSmart: COIN_IMAGE.BNB,
  matic: COIN_IMAGE.MATIC,
  sei: COIN_IMAGE.SEI,
  solana: COIN_IMAGE.SOL
} as any

export const DefaultNetworks: RamperChain[] = [
  {
    path: 889,

    numChainId: 88,
    chainId: '0x58',

    order: 2,
    isToken: true,
    standard: 'VRC25',
    nftStandard: 'VRC721',
    isSupportedNFT: true,
    // nftMint: '0xAE12C5930881c53715B369ceC7606B70d8EB229f',

    isWeb3: true,
    isFee: true,
    icon: 'app_viction',
    balanceContract: '0xf7eEe3A8363731C611A24CdDfCBcaDE9C153Cfe8',
    multiTransferContract: '0x5C93F4B35d3dD97Ef481881aA33d00F76806FdAD',

    id: 'tomochain',
    name: 'Viction',
    shortName: 'Vic',
    logo: COIN_IMAGE.TOMO,
    symbol: 'VIC',
    chain: CHAIN_TYPE.tomo,
    tokenStandard: 'VRC VRC25',
    rpcURL: 'https://rpc.tomochain.com',
    scan: 'https://vicscan.xyz'
  },
  {
    path: 889,

    numChainId: 89,
    chainId: '0x59',

    order: 2,
    isToken: true,
    standard: 'VRC25',
    nftStandard: 'VRC721',
    isSupportedNFT: true,
    isCrawlNFTServices: true,
    // nftMint: '0xAE12C5930881c53715B369ceC7606B70d8EB229f',

    isWeb3: true,
    // isFee: true,
    icon: 'app_viction',
    balanceContract: '0xf7eEe3A8363731C611A24CdDfCBcaDE9C153Cfe8',
    multiTransferContract: '0x5C93F4B35d3dD97Ef481881aA33d00F76806FdAD',

    id: 'tomochainTestnet',
    name: 'Viction Testnet',
    shortName: 'Vic',
    logo: COIN_IMAGE.TOMO,
    symbol: 'VIC',
    chain: CHAIN_TYPE.tomoTestnet,
    tokenStandard: 'VIC VRC25',
    rpcURL: 'https://rpc-testnet.viction.xyz',
    scan: 'https://testnet.vicscan.xyz'
  },
  // {
  //   numChainId: 1,
  //   chainId: '0x1',
  //   order: 1,
  //   isToken: true,
  //   standard: 'ERC20',
  //   nftStandard: 'ERC721',
  //   balanceContract: '0x38bb7b9b87bdfbed883aaf50a2f411d330fe32d6',
  //   multiTransferContract: '0xaEC945e04baF28b135Fa7c640f624f8D90F1C3a6',
  //   isSupportedEIP1559: true,
  //   isSupportedNFT: true,
  //   isWeb3: true,
  //   isFee: true,
  //   icon: 'app_ethereum',
  //   id: 'ethereum',
  //   name: 'Ethereum',
  //   shortName: 'Ethereum',
  //   logo: COIN_IMAGE.ETH,
  //   symbol: 'ETH',
  //   chain: CHAIN_TYPE.ether,
  //   tokenStandard: 'ETH ERC20 ERC721',
  //   rpcURL: 'https://mainnet.infura.io/v3/92d53cee52834368b0fabb42fa1b5570',
  //   scan: 'https://etherscan.io'
  // },
  // {
  //   numChainId: 56,
  //   chainId: '0x38',
  //   order: 1,
  //   isToken: true,
  //   isSupportedNFT: true,
  //   nftStandard: 'BEP721',
  //   standard: 'BEP20',
  //   replacementSymbol: 'BSC',
  //   balanceContract: '0xA6762c710852681c4593C10c4304C5211FB2122c',
  //   multiTransferContract: '0x2E1D30460265bFEBedacf5bb6f9A80F0E74B7498',

  //   subName: 'BSC',

  //   isWeb3: true,
  //   isFee: true,
  //   icon: 'app_binance',

  //   id: 'binancecoin',
  //   name: 'BNB Smart Chain',
  //   shortName: 'BSC',
  //   logo: COIN_IMAGE.BNB,
  //   symbol: 'BNB',
  //   chain: CHAIN_TYPE.binanceSmart,
  //   tokenStandard: 'BNB BEP20',
  //   rpcURL:
  //     'https://bsc-mainnet.nodereal.io/v1/5c4ed7c647c0479f9ae118b0b62c745c',
  //   scan: 'https://bscscan.com'
  // },
  // {
  //   numChainId: 137,
  //   chainId: '0x89',
  //   order: 2,
  //   isToken: true,
  //   standard: 'PRC20',
  //   nftStandard: 'PRC721',
  //   isFee: true,
  //   isWeb3: true,
  //   balanceContract: '0x963e1BcD1f82724bD8Fa16a3B6962D100fB287FC',
  //   multiTransferContract: '0x67807b9f5B9757C0c79347F0b3f360C15c5E6aFF',
  //   // //nftMint: '0x9aE5c1cf82aF51CBB83D9A7B1C52aF4B48E0Bb5E',

  //   isSupportedNFT: true,
  //   id: 'matic-network',
  //   name: 'Polygon',
  //   icon: 'app_polygon',
  //   logo: COIN_IMAGE.MATIC,
  //   symbol: 'MATIC',
  //   chain: CHAIN_TYPE.matic,
  //   tokenStandard: 'MATIC PRC20',
  //   rpcURL:
  //     'https://polygon-mainnet.infura.io/v3/92d53cee52834368b0fabb42fa1b5570',
  //   scan: 'https://polygonscan.com'
  // },
  // {
  //   path: 889,

  //   numChainId: 88,
  //   chainId: '0x58',

  //   order: 2,
  //   isToken: true,
  //   standard: 'TRC21',
  //   nftStandard: 'TRC721',
  //   isSupportedNFT: true,
  //   // nftMint: '0xAE12C5930881c53715B369ceC7606B70d8EB229f',

  //   isWeb3: true,
  //   isFee: true,
  //   icon: 'app_tomochain',
  //   balanceContract: '0xf7eEe3A8363731C611A24CdDfCBcaDE9C153Cfe8',
  //   multiTransferContract: '0x5C93F4B35d3dD97Ef481881aA33d00F76806FdAD',

  //   id: 'tomochain',
  //   name: 'TomoChain',
  //   shortName: 'Tomo',
  //   logo: COIN_IMAGE.TOMO,
  //   symbol: 'TOMO',
  //   chain: CHAIN_TYPE.tomo,
  //   tokenStandard: 'TOMO TRC21',
  //   rpcURL: 'https://rpc.tomochain.com',
  //   scan: 'https://scan.tomochain.com'
  // },
  // {
  //   rpc: 'https://rpc-sei-testnet.rhinostake.com',
  //   rpcURL: 'https://rpc-sei-testnet.rhinostake.com',
  //   scan: 'https://www.seiscan.app/atlantic-2',
  //   rpcConfig: '',
  //   chain: CHAIN_TYPE.sei,
  //   rest: 'https://rest-sei-testnet.rhinostake.com',
  //   restConfig: '',
  //   name: 'Sei Testnet',
  //   icon: 'app_sei',
  //   chainId: 'atlantic-2',
  //   isCosmos: true,
  //   logo: COIN_IMAGE.SEI,
  //   symbol: 'SEI',
  //   chainName: 'Sei Testnet',
  //   stakeCurrency: {
  //     coinDenom: 'SEI',
  //     coinMinimalDenom: 'usei',
  //     coinDecimals: 6,
  //     coinGeckoId: 'sei'
  //   },
  //   bip44: {
  //     coinType: 118
  //   },
  //   bech32Config: {
  //     bech32PrefixAccAddr: 'sei',
  //     bech32PrefixAccPub: 'seipub',
  //     bech32PrefixValAddr: 'seivaloper',
  //     bech32PrefixValPub: 'seivaloperpub',
  //     bech32PrefixConsAddr: 'seivalcons',
  //     bech32PrefixConsPub: 'seivalconspub'
  //   },
  //   currencies: [
  //     {
  //       coinDenom: 'SEI',
  //       coinMinimalDenom: 'usei',
  //       coinDecimals: 6,
  //       coinGeckoId: 'sei'
  //     }
  //   ],
  //   feeCurrencies: [
  //     {
  //       coinDenom: 'SEI',
  //       coinMinimalDenom: 'usei',
  //       coinDecimals: 6,
  //       coinGeckoId: 'sei'
  //     }
  //   ],
  //   coinType: 118,
  //   features: ['ibc-transfer', 'ibc-go'],
  //   defaultFee: 0.01, // min_gas_price
  //   gasPriceStep: {
  //     low: 0.01,
  //     average: 0.025,
  //     high: 0.03
  //   }
  // },
  // {
  //   isToken: true,
  //   // trcToken: 'SPL',
  //   // nftToken: 'SPL NFT',
  //   // multisend: true,
  //   // isBridge: true,
  //   // isSupportedNFT: true,
  //   // image: 'app_solana',
  //   id: 'solana',
  //   icon: 'app_sol',
  //   name: 'Solana',
  //   shortName: 'Solana',
  //   logo: COIN_IMAGE.SOL,
  //   symbol: 'SOL',
  //   chain: CHAIN_TYPE.solana,
  //   // trcName: 'SOL SPL',
  //   rpcURL: 'https://information.coin98.com/api/solanaV4',
  //   scan: 'https://solscan.io'
  // }
]
