import { RamperProvider } from "./provider"

export class CosmJSOfflineSignerOnlyAmino {
  chainId: string
  instance: RamperProvider

  constructor(chainId: string, instance: RamperProvider) {
    this.chainId = chainId
    this.instance = instance
  }

  async getAccounts() {
    const key = await this.instance.getKey(this.chainId)

    return [
      {
        address: key.bech32Address,
        // Currently, only secp256k1 is supported.
        algo: 'secp256k1',
        pubkey: key.pubKey
      }
    ]
  }

  async signAmino(signerAddress: string, signDoc: any) {
    if (this.chainId !== signDoc.chain_id) {
      throw new Error('Unmatched chain id with the offline signer')
    }

    const key = await this.instance.getKey(signDoc.chain_id)

    if (key.bech32Address !== signerAddress) {
      throw new Error('Unknown signer address')
    }

    return await this.instance.signAmino(this.chainId, signerAddress, signDoc)
  }

  // Fallback function for the legacy cosmjs implementation before the staragte.
  async sign(signerAddress: string, signDoc: any) {
    return await this.signAmino(signerAddress, signDoc)
  }
}

export class CosmJSOfflineSigner extends CosmJSOfflineSignerOnlyAmino {
  constructor(chainId: string, instance: RamperProvider) {
    super(chainId, instance)

    this.chainId = chainId
    this.instance = instance
  }

  async signDirect(signerAddress: string, signDoc: any) {
    if (this.chainId !== signDoc.chainId) {
      throw new Error('Unmatched chain id with the offline signer')
    }

    const key = await this.instance.getKey(signDoc.chainId)

    if (key.bech32Address !== signerAddress) {
      throw new Error('Unknown signer address')
    }

    return await this.instance.signDirect(this.chainId, signerAddress, signDoc)
  }
}