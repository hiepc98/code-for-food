export const STRICT_METHODS = [
  'eth_sign',
  'eth_sendTransaction',
  'personal_sign',
  'eth_signTypedData',
  'eth_signTypedData_v1',
  'eth_signTypedData_v3',
  'eth_signTypedData_v4',
  'eth_decrypt',
  'eth_getEncryptionPublicKey',
  // 'eth_requestAccounts',
  // 'wallet_getPermissions',
  'wallet_requestPermissions',
  'wallet_registerOnboarding',
  'wallet_getAvailableWallet'
]

export const ENCRYPT_DECRYPT_METHOD = [
  'eth_decrypt',
  'eth_getEncryptionPublicKey'
]

export const CONNECT_METHOD = ['eth_requestAccounts']

export const AUTHORIZED_METHOD = [
  'eth_requestAccounts',
  'eth_accounts',
  'wallet_switchEthereumChain',
  'wallet_addEthereumChain',
  'eth_chainId'
]

export const MESSAGE_METHOD = [
  'eth_sign',
  'personal_sign',
  'eth_signTypedData',
  'eth_signTypedData_v1',
  'eth_signTypedData_v3',
  'eth_signTypedData_v4'
]

export const TRANSACTION_METHOD = ['eth_sendTransaction']
