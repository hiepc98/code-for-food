const ALPHABET = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz'
const ALPHABET_MAP = {}
for (let i = 0; i < ALPHABET.length; i++) {
  ALPHABET_MAP[ALPHABET.charAt(i)] = i
}
const BASE = 58

export const encode = (buffer: Uint8Array | any): string => {
  if (buffer.length === 0) return ''

  let i
  let j
  const digits = [0]
  for (i = 0; i < buffer.length; i++) {
    for (j = 0; j < digits.length; j++) digits[j] <<= 8

    digits[0] += buffer[i]

    let carry = 0
    for (j = 0; j < digits.length; ++j) {
      digits[j] += carry

      carry = (digits[j] / BASE) | 0
      digits[j] %= BASE
    }

    while (carry) {
      digits.push(carry % BASE)

      carry = (carry / BASE) | 0
    }
  }

  // deal with leading zeros
  for (i = 0; buffer[i] === 0 && i < buffer.length - 1; i++) digits.push(0)

  // convert digits to a string
  let stringOutput = ''
  for (let i: any = digits.length - 1; i >= 0; i--) {
    stringOutput = stringOutput + ALPHABET[digits[i]]
  }
  return stringOutput
}
