import BigNumber from 'bignumber.js'
import get from 'lodash/get'
import Web3 from 'web3'

const baseURl = 'https://master.tomochain.com/api'

export interface PaginationOptions {
  page?: number
  limit?: number
  sortBy?: string
  sortDesc?: boolean
  isPaginate?: boolean
}

export interface CandidateResponse {
  candidate: string
  smartContractAddress: string
  capacity: string
  capacityNumber: number
  createdAt: string
  nodeId: string
  owner: string
  status: string
  updatedAt: string
  rank: number
  latestSignedBlock: number
  name: string
}

export interface CandidateInfo {
  candidate: string
  smartContractAddress: string
  capacity: string
  capacityNumber: number
  createdAt: string
  nodeId: string
  owner: string
  status: string
  updatedAt: string
  rank: number
  latestSignedBlock: number
  name: string
  isMasternode: boolean
  isPenalty: boolean
  slashedTimes: number
  epochDuration: number
  lastEpoch: string
  numberOfMN: number
  voterROI: number
  mnROI: number
}

export interface VoterResponse {
  voter: string
  smartContractAddress: string
  capacity: string
  createdAt: string
  owner: string
  event: string
  name: string
  currentCandidateCap: string
  candidate: string
  tx: string
}

export interface VotersTransactionResponse {
  dataResponse: VoterResponse[]
  isContinue: boolean
}

export class StakingService {
  private account
  private owner
  private web3
  private validator

  constructor(rpcURL: string) {
    this.web3 = new Web3(rpcURL)
  }

  async initValidatorContract() {
    const validatorAbi = require('./ABI/TomoValidatorAbi.json')
    const validator = new this.web3.eth.Contract(
      validatorAbi,
      '0x0000000000000000000000000000000000000088',
      // '0x4da7De2d02d9D9360ECDaDce2248f16B15d5D9f2',
      {
        gasPrice: 250000000,
        gas: 2000000
      }
    )

    this.validator = validator
  }

  async voteCandidate(
    candidateAddress: string,
    privateKey: string,
    amount: string,
    gasPrice: string,
    gas: string,
    chainId: string
  ) {
    const account = this.web3.eth.accounts.privateKeyToAccount(privateKey)
    const owner = account.address
    this.web3.eth.accounts.wallet.add(account)
    this.web3.eth.defaultAccount = owner
    try {
      const response = await this.validator.methods
        // .vote('0x835d5e132039987A994c6288777DbF7d1Bb511A5')
        .vote(candidateAddress)
        .send({
          from: owner,
          value: amount,
          gas: Number(gas),
          gasPrice: Number(gasPrice),
          chainId
        })
      return response
    } catch (error) {
      console.log(error)
      return error
    }
  }

  async unvoteCandidate(
    candidateAddress: string,
    privateKey: string,
    amount: string,
    gasPrice: string,
    gas: string,
    chainId: string
  ) {
    const account = this.web3.eth.accounts.privateKeyToAccount(privateKey)
    const owner = account.address
    this.web3.eth.accounts.wallet.add(account)
    this.web3.eth.defaultAccount = owner
    try {
      const response = await this.validator.methods
        // .unvote('0x835d5e132039987A994c6288777DbF7d1Bb511A5', amount)
        .unvote(candidateAddress, amount)
        .send({
          from: owner,
          gas: Number(gas),
          gasPrice: Number(gasPrice),
          chainId
        })
      return response
    } catch (error) {
      console.log(error)
      return error
    }
  }

  async withDrawStake(
    privateKey: string,
    gasPrice: string,
    gas: string,
    chainId: string
  ) {
    const account = this.web3.eth.accounts.privateKeyToAccount(privateKey)
    const owner = account.address
    this.web3.eth.accounts.wallet.add(account)
    this.web3.eth.defaultAccount = owner
    // get highest block number

    const withdrawList = await this.getListWithdraw(owner)

    // for each withdrawList, withdraw
    const responseData = []

    let currentIndex = 0

    while (true) {
      const currentWithdraw = withdrawList[currentIndex]
      const transactionCount = await this.web3.eth.getTransactionCount(owner)
      const { blockNumber, cap, index } = currentWithdraw
      const response = await this.validator.methods
        .withdraw(blockNumber, index)
        .send(
          {
            from: owner,
            gas: Number(gas),
            gasPrice: Number(gasPrice),
            chainId,
            nonce: transactionCount
          },
          (error, transactionHash) => {
            console.log('withdraw', error, transactionHash)
          }
        )
      const startTime = Date.now()
      while (true) {
        const nextNonce = await this.web3.eth.getTransactionCount(owner)
        if (nextNonce > transactionCount) {
          break
        }

        // Check if the timeout has been reached (e.g., 60 seconds)
        if (Date.now() - startTime > 60000) {
          console.log('Timeout reached. Exiting inner loop.')
          break
        }
      }
      responseData.push(response)
      currentIndex++
      if (currentIndex === withdrawList.length) {
        break
      }
    }

    return responseData
  }

  async getMasterValidators(
    paginationOptions: PaginationOptions
  ): Promise<CandidateResponse[]> {
    const {
      page = 1,
      limit = 50,
      sortBy = 'capacity',
      sortDesc = false,
      isPaginate = false
    } = paginationOptions

    if (isPaginate) {
      try {
        // https://master.tomochain.com/api/candidates/masternodes?page=1&limit=50&sortBy=capacity&sortDesc=true
        const url = `${baseURl}/candidates/masternodes?page=${page}&limit=${limit}&sortBy=${sortBy}&sortDesc=${sortDesc}`
        const response = await fetch(url)
        const data = await response.json()
        const candidates = get(data, 'items', [])
        return candidates
      } catch (error) {
        console.log(error)
        return error
      }
    }

    let pageQuery = page
    const limitQuery = limit
    let continueQuery = true
    let dataResponse = []
    while (continueQuery) {
      try {
        // https://master.tomochain.com/api/candidates/masternodes?page=1&limit=50&sortBy=capacity&sortDesc=true
        const url = `${baseURl}/candidates/masternodes?page=${pageQuery}&limit=${limitQuery}&sortBy=${sortBy}&sortDesc=${sortDesc}`
        const response = await fetch(url)
        const data = await response.json()
        const candidates = get(data, 'items', [])
        dataResponse = [...dataResponse, ...candidates]

        const totalActiveCandidates = get(data, 'activeCandidates', 0)

        if (totalActiveCandidates === 0) {
          continueQuery = false
        }

        if (totalActiveCandidates < limitQuery * pageQuery) {
          continueQuery = false
        }

        pageQuery++
      } catch (error) {
        console.log(error)
        continueQuery = false
        return error
      }
    }
    return dataResponse
  }

  async getAverageRoiVoters() {
    try {
      // https://master.tomochain.com/api/voters/averageroi
      const url = `${baseURl}/voters/averageroi`
      const response = await fetch(url)
      const data = await response.json()
      return data
    } catch (error) {
      console.log(error)
      return error
    }
  }

  async getVoterCandidates(voter: string) {
    let pageQuery = 1
    const limitQuery = 50
    let continueQuery = true
    let dataResponse = []
    let totalVoted = 0
    try {
      // https://master.tomochain.com/api/voters/0xf39136ed9254a46dc727ca1ae3927fd5b7860f9d/candidates?page=1&limit=10&sortBy=capacity&sortDesc=true

      while (continueQuery) {
        const url = `${baseURl}/voters/${voter}/candidates?page=${pageQuery}&limit=${limitQuery}&sortBy=capacity&sortDesc=true`
        const response = await fetch(url)
        const data = await response.json()
        const candidates = get(data, 'items', [])
        dataResponse = [...dataResponse, ...candidates]

        const total = get(data, 'total', 0)
        totalVoted = get(data, 'totalVoted', 0)
        if (total === 0) {
          continueQuery = false
        }

        if (total < limitQuery * pageQuery) {
          continueQuery = false
        }

        pageQuery++
      }

      return { totalVoted, dataResponse }
    } catch (error) {
      console.log(error)
      return error
    }
  }

  async getRewardsOfCandidate(candidate: string, owner: string) {
    let pageQuery = 1
    const limitQuery = 50
    let continueQuery = true
    let dataResponse = []
    try {
      while (continueQuery) {
        const url = `${baseURl}/candidates/${candidate}/${owner}/getRewards?page=${pageQuery}&limit=${limitQuery}`
        const response = await fetch(url)
        const data = await response.json()
        const rewards = get(data, 'items', [])
        dataResponse = [...dataResponse, ...rewards]

        const total = get(data, 'total', 0)
        if (total === 0) {
          continueQuery = false
        }

        if (total < limitQuery * pageQuery) {
          continueQuery = false
        }

        pageQuery++
      }

      return dataResponse
    } catch (error) {
      console.log(error)
      return error
    }
  }

  async getListWithdrawCap(owner: string) {
    let blks = await this.validator.methods
      .getWithdrawBlockNumbers()
      .call({ from: owner })
    // remove duplicate
    blks = [...new Set(blks)]
    const withdraws = []

    await Promise.all(
      blks.map(async (it, index) => {
        const blk = new BigNumber(it).toString()
        if (blk === '0') {
          return null
        }
        if (blk !== '0') {
          // @ts-ignore
          self.aw = true
        }
        const wd = {
          blockNumber: blk
        }
        // @ts-ignore
        wd.cap = await this.validator.methods
          .getWithdrawCap(blk)
          .call({ from: owner })
        withdraws[index] = wd
      })
    )
    return withdraws.filter((it) => it)
  }

  async getListWithdraw(owner: string) {
    return this.web3.eth
      .getBlockNumber()
      .then((blockNumber) => {
        return this.validator.methods
          .getWithdrawBlockNumbers()
          .call({
            from: owner
          })
          .then((result) => {
            const map = result.map(async (it, idx) => {
              it = it.toString(10)
              if (parseInt(it) < blockNumber) {
                const cap = await this.validator.methods
                  .getWithdrawCap(it)
                  .call({ from: owner })
                if (cap.toString(10) === '0') {
                  return null
                }

                return {
                  blockNumber: it,
                  cap,
                  index: idx
                }
              }
            })
            return Promise.all(map)
          })
      })
      .then((result) => {
        return result.filter((it) => it !== null && it !== undefined)
      })
      .catch((e) => console.log(e))
  }

  async getCandidateInfo(candidate: string): Promise<CandidateInfo | {}> {
    let candidateInfo = {}
    try {
      // Candidate Info
      const urlInfo = `${baseURl}/candidates/${candidate}`
      const responseInfo = await fetch(urlInfo)
      const dataInfo = await responseInfo.json()
      candidateInfo = dataInfo

      // Candidate rewards
      const urlReward = `${baseURl}/voters/annualReward?candidate=${candidate}`
      const responseReward = await fetch(urlReward)
      const dataReward = await responseReward.json()
      candidateInfo = { ...candidateInfo, dataReward }
    } catch (error) {
      console.log(error)
      throw error
    }
    return candidateInfo
  }

  async getVoterTransaction(
    voter: string,
    pageQuery: number,
    limitQuery: number
  ): Promise<VotersTransactionResponse | {}> {
    // https://www.vicmaster.xyz/api/transactions/voter/0x13e1b4d54BB3B435470E3C857c74AD9C74e8df08
    let responseWithIsContinue = {}
    let dataResponse = []
    try {
      const url = `${baseURl}/transactions/voter/${voter}?page=${pageQuery}&limit=${limitQuery}`
      const response = await fetch(url)
      const data = await response.json()

      const items = get(data, 'items', [])
      dataResponse = [...dataResponse, ...items]

      const total = get(data, 'total', 0)
      if (total === 0 || total < limitQuery * pageQuery) {
        responseWithIsContinue = {
          dataResponse,
          isContinue: false
        }
        return responseWithIsContinue
      }

      responseWithIsContinue = {
        dataResponse,
        isContinue: true
      }

      return responseWithIsContinue
    } catch (error) {
      console.log(error)
    }
  }

  async getPendingVoter(voter: string): Promise<VoterResponse[] | {}> {
    const dataResponsePending = []
    let pageQuery = 1
    const limitQuery = 20
    let continueQuery = true
    try {
      while (continueQuery) {
        const voterTransactions = await this.getVoterTransaction(
          voter,
          pageQuery,
          limitQuery
        )

        // @ts-ignore
        const { dataResponse, isContinue } = voterTransactions

        // filter event Unvote
        const unvoteTransactions = dataResponse.filter(
          (it) => it.event === 'Unvote'
        )

        // check is createdAt within 48 hours
        const currentTime = Date.now()
        const time48Hours = 48 * 60 * 60 * 1000
        const unvoteTransactionsWithin48Hours = unvoteTransactions.filter(
          (it) =>
            currentTime - new Date(get(it, 'createdAt', '')).getTime() <
            time48Hours
        )
        // if unvoteTransactionsWithin48Hours.length > 0 => add to dataResponsePending
        if (unvoteTransactionsWithin48Hours.length > 0) {
          dataResponsePending.push(...unvoteTransactionsWithin48Hours)
        } else {
          // if there is continue => continue query
          if (!isContinue) {
            continueQuery = false
          }
        }
        pageQuery++
      }
      return dataResponsePending
    } catch (error) {
      console.log(error)
    }
  }
}
