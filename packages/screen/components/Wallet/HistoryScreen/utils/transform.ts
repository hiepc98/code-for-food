import Web3 from 'web3'

const web3 = new Web3()

const TYPE_TRANSACTION_SUPPORT = ['transfer']

const decodeMessage = (name: string, hexCode: string) => {
  const hexData = '0x' + hexCode.substring(10)
  if (name === 'transfer') {
    const typesArray = ['address', 'uint256']
    return web3.eth.abi.decodeParameters(typesArray, hexData)
  }
  return null
}

const getMethodName = (text: string) => {
  if (!text) return ''
  return text.substring(0, text.indexOf('('))
}

export const convertHistoryData = (transactions: any[]) => {
  const cvTransactions = transactions
    .filter((ts) => {
      const isFnSupport = TYPE_TRANSACTION_SUPPORT.includes(
        getMethodName(ts.functionName)
      )
      return !ts.functionName || isFnSupport
    })
    .map((ts) => {
      const { functionName, input } = ts
      if (!functionName) return ts
      const nameDecode = getMethodName(ts.functionName)
      const readTransfer = decodeMessage(nameDecode, input)
      if (!readTransfer) return ts
      return {
        ...ts,
        contractAddress: ts.to,
        to: readTransfer[0],
        value: readTransfer[1]
      }
    })
  return { data: cvTransactions }
}
