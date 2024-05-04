import bech32Word from 'bech32'
import encHex from 'crypto-js/enc-hex'
import ripEmd from 'crypto-js/ripemd160'
import sha256Rip from 'crypto-js/sha256'
import { ec as EC } from 'elliptic'

export const getAddressCosmosFromPrivateKey = (
  privateKeyHex: string,
  prefix: string,
  isRaw?: boolean
) => {
  const ab2hexstring = (arr) => {
    let result = ''
    for (let i = 0; i < arr.length; i++) {
      let str = arr[i].toString(16)
      str = str.length === 0 ? '00' : str.length === 1 ? '0' + str : str
      result += str
    }
    return result
  }

  const sha256ripemd160 = (hex: string) => {
    const hexEncoded = encHex.parse(hex)
    const ProgramSha256 = sha256Rip(hexEncoded)
    return ripEmd(ProgramSha256).toString()
  }

  const curve = new EC('secp256k1')
  const keypair = curve.keyFromPrivate(privateKeyHex, 'hex')

  const publicKeyHex = keypair.getPublic().encode('hex', false)
  const pubKey = curve.keyFromPublic(publicKeyHex, 'hex')
  const pubPoint = pubKey.getPublic()
  const compressed = pubPoint.encodeCompressed()
  const hexed = ab2hexstring(compressed)
  const hash = sha256ripemd160(hexed)

  if (isRaw) {
    return hash
  }

  let words

  if (Buffer.isBuffer(hash)) {
    words = bech32Word.toWords(Buffer.from(hash))
  } else {
    words = bech32Word.toWords(Buffer.from(hash, 'hex'))
  }

  const address = bech32Word.encode(prefix, words)
  return address
}
