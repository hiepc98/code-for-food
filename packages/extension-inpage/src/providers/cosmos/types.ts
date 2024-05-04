export enum BroadcastMode {
    Sync = 'sync',
    Async = 'async',
    Block = 'block'
}

/** 
 * ADR036 
 * https://github.com/cosmos/cosmos-sdk/blob/main/docs/architecture/adr-036-arbitrary-signature.md
*/

export type AminoOptions = {
    isMsgString: boolean
}