
import { SafeEvent } from "../../utils/safeEvent"
import { CosmJSOfflineSigner, CosmJSOfflineSignerOnlyAmino } from "./offlineSigner"
import { BroadcastMode } from "./types";
import { decode, encode } from "../../utils/crypto";
import { uniqueId } from "../../utils";

export class RamperProvider extends SafeEvent {
    name: string = 'Blockathon Wallet'
    version: string = '0.0.1'

    constructor() {
        super();
        //Local state will appear here
    }

    // TODO: Enigma support in future version 

    /**
     * @deprecated remove in future version
     */
    enable = async (chainId: string) => {
        return this.request({
            method: 'enable',
            params: [
                chainId
            ]
        })
    }

    disconnect = async () => {
        return this.request({
            method: 'disconnect'
        })
    }
    /**
     * Get account functions
     */
    getKey = async (chainId: string) => {
        return this.request({
            method: 'getKey',
            params: [
                chainId
            ]
        })
    }

    signAmino = async (chainId: string, signer: string, signDoc: any, options?: any) => {
        return this.request({
            method: "signAmino",
            params: [
                chainId,
                signer,
                signDoc,
                options
            ]
        })
    }

    signDirect = async (chainId: string, signer: string, signDoc: any) => {
        return this.request({
            method: "signDirect",
            params: [
                chainId,
                signer,
                this.transformData(signDoc)
            ]
        })
    }

    sendTx = async (chainId: string, tx: Uint8Array, mode: BroadcastMode) => {
        return this.request({
            method: "sendTx",
            params: [
                chainId,
                encode(tx),
                mode
            ]
        })
    }

    experimentalSuggestChain = async (config: object) => {
        //Currently
        return this.request({
            method: 'experimentalSuggestChain',
            params: [
                null,
                null,
                config
            ]
        })
    }


    signArbitrary = async (chainId: string, signer: string, data: string | any) => {
        const toSignData: string = encode(Buffer.from(data))
        const isMsgString: boolean = typeof data === "string"
        //Same format data
        const stdSignDoc = this.makeStdDoc(signer, toSignData)

        const { signature } = await this.signAmino(chainId, signer, stdSignDoc, {
            isMsgString
        })

        return signature
    }



    // TODO: Verify Message Method
    verifyMessage = (_chainId: string, _signer: string, _data: string | any, _signature: string) => {
        throw new Error("Method not implemented")
    }


    watchAsset = async (chainId: string, contractAddress: string) => {
        return this.request({
            method: 'watchAsset',
            params: [
                chainId,
                contractAddress
            ]
        })
    }

    //Offline signer
    getOfflineSigner = (chainId: string) => {
        return new CosmJSOfflineSigner(chainId, this);
    }

    getOfflineSignerAuto = async (chainId: string) => {
        const key: any = await this.getKey(chainId)
        if (key.isNanoLedger) {
            return new CosmJSOfflineSignerOnlyAmino(chainId, this)
        }
        return new CosmJSOfflineSigner(chainId, this)
    }

    getOfflineSignerOnlyAmino = (chainId: string) => {
        return new CosmJSOfflineSignerOnlyAmino(chainId, this)
    }


    //@ts-expect-error
    recursiveDecode(obj: any) {
        if (typeof obj === "object" && obj.isEncoded) {
            return decode(obj.encodedString)
        }

        if (typeof obj === "object") {
            Object.keys(obj).forEach(k => {
                if (typeof obj[k] === "object" && obj[k].isEncoded) {
                    obj[k] = decode(obj[k].encodedString)
                }

                if (typeof obj[k] === "object") {
                    this.recursiveDecode(obj[k])
                }
            })
        }
    }

    // Private methods
    public request(args: any, callback?: any): any {
        const { method, params, callback: callbackFunction } = typeof args === 'object'
            ? args
            : {
                method: arguments[0],
                params: arguments[1],
                callback: arguments[2]
            }

        if ((!args && typeof args !== 'object')) {
            throw new Error('Invalid arguments')
        }

        if (typeof method !== 'string' || !method || method.length === 0) {
            throw Error('Invalid Method')
        }

        const santinizedParams = this.transformData(params)

        return new Promise((resolve, reject) => {
            const requestId = uniqueId()

            this.once(requestId, data => {
                if (typeof data === "object" && data.isEncoded) {
                    data = this.recursiveDecode(data)
                } else {
                    this.recursiveDecode(data)
                }

                const executeFunction = callback ?? callbackFunction
                if (typeof executeFunction === 'function') {
                    executeFunction(data)
                }

                if (data?.error) {
                    reject(data?.error); return
                }

                resolve(data)
            })

            this.stream.write({
                id: requestId,
                data: {
                    method,
                    params: santinizedParams
                }
            })
        })
    }

    private transformData(data: object) {
        const cloneObject = Object.assign({}, data)
        Object.keys(cloneObject).forEach(it => {
            if (ArrayBuffer.isView(cloneObject[it])) {
                cloneObject[it] = encode(cloneObject[it])
            }
        })
        return cloneObject;
    }



    private makeStdDoc = (signer: string, data: string) => {
        return {
            chain_id: '',
            account_number: '0',
            sequence: '0',
            fee: {
                gas: '0',
                amount: []
            },
            msgs: [
                {
                    type: 'sign/MsgSignData',
                    value: {
                        signer,
                        data
                    }
                }
            ],
            memo: ''
        }
    }
}
