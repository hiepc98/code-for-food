export const IntegrateError = {
  reject: {
    code: 4001,
    standard: 'EIP-1193',
    message: 'User rejected the request.'
  },
  authorized: {
    code: 4100,
    standard: 'EIP-1193',
    message:
      'The requested account and/or method has not been authorized by the user.'
  },
  notSupported: {
    code: 4200,
    standard: 'EIP-1193',
    message: 'The requested method is not supported by this Ethereum provider.'
  },
  disconnected: {
    code: 4900,
    standard: 'EIP-1193',
    message: 'The provider is disconnected from all chains.'
  },
  disconnectedChain: {
    code: 4901,
    standard: 'EIP-1193',
    message: 'The provider is disconnected from the specified chain.'
  },
  invalidJsonReceiver: {
    code: -32700,
    standard: 'JSON RPC 2.0',
    message:
      'Invalid JSON was received by the server. An error occurred on the server while parsing the JSON text.'
  },
  invalidRequestObject: {
    code: -32600,
    standard: 'JSON RPC 2.0',
    message: 'The JSON sent is not a valid Request object.'
  },
  methodDoesNotExists: {
    code: -32601,
    standard: 'JSON RPC 2.0',
    message: 'The method does not exist / is not available.'
  },
  invalidParams: {
    code: -32602,
    standard: 'JSON RPC 2.0',
    message: 'Invalid method parameter(s).'
  },
  internalJsonRpc: {
    code: -32603,
    standard: 'JSON RPC 2.0',
    message: 'Internal JSON-RPC error.'
  },
  invalidInput: {
    code: -32000,
    standard: 'EIP-1474',
    message: 'Invalid input.'
  },
  resourceNotFound: {
    code: -32001,
    standard: 'EIP-1474',
    message: 'Resource not found.'
  },
  resouceUnavailable: {
    code: -32002,
    standard: 'EIP-1474',
    message: 'Resource unavailable.'
  },
  transactionReject: {
    code: -32003,
    standard: 'EIP-1474',
    message: 'Transaction rejected.'
  },
  methodNotSupported: {
    code: -32004,
    standard: 'EIP-1474',
    message: 'Method not supported.'
  },
  requestLimitExceed: {
    code: -32005,
    standard: 'EIP-1474',
    message: 'Request limit exceeded.'
  }
}
