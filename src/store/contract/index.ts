import { action, makeAutoObservable, observable } from 'mobx'
import { ethers } from 'ethers'
import { createContext } from 'react'
import abi from './abi.json'
import AuthStore from '../auth'
import TransactionsRequestModel from '../../models/transaction/TransactionsRequestModel'
import TransactionService from '../../services/notification/TransactionService'
import TransactionsResponseModel from '../../models/notifications/TransactionsResponseModel'

class ContractStore {
  
  @observable 
  public provider: any = null
  
  @observable 
  public signer: any = null
  
  @observable 
  public contract: any = null
  
  private contractAddress = '0x62f9DF627FfA82Bbdd75601E52e3ef643d5E630E'

  private transactionService: TransactionService = new TransactionService()
  
  constructor() {
    makeAutoObservable(this)
    this.getContract()
  }

  @action
  public async getContract(): Promise<void> {
    let eth = (window as any).ethereum
    if (eth) {
      let tempProvider = new ethers.providers.Web3Provider(eth)
      this.provider = tempProvider
      let tempSigner = tempProvider.getSigner()
      this.signer = tempSigner
      let tempContract = new ethers.Contract(this.contractAddress, abi, tempSigner)
      this.contract = tempContract
    }
  }

  @action
  public async getBalance(userTokenId: string): Promise<void> {
    if (this.contract) {
      let balance = await this.contract.balanceOf(userTokenId)
      console.log(ethers.utils.formatUnits(balance, 0))
    }
  }

  @action
  public async purchaseLand(landTokenId: string): Promise<boolean> {
    if (this.contract) {
      try {
        console.log(landTokenId)
        let uri: string = `http://etherealm.ddns.net/api/lands/land/${landTokenId}`
        let tx = await this.contract.create(landTokenId, uri)
        const result = await this.waitTransactionConfirm(tx)
        const request: TransactionsRequestModel = this.mapReceiptToTransactionRequestModel(result[1], '0x347Aa0FC3E7e4b06AF8515dd265a593410940E05', 1)
        const response: TransactionsResponseModel = await this.transactionService.addTransaction(request)
        return result[0]
      } catch (error) {
        console.error(error)
      }
    }
    return false
  }

  @action
  public async buyLand(landTokenId: string, ownerTokenId: string, price: number): Promise<boolean> {
    if (this.contract) {
      try {
        let tx = await this.contract.buy(landTokenId, ownerTokenId, { value: ethers.utils.parseEther(String(price)) })
        const result = await this.waitTransactionConfirm(tx)
        const request: TransactionsRequestModel = this.mapReceiptToTransactionRequestModel(result[1], ownerTokenId, 1)
        const response: TransactionsResponseModel = await this.transactionService.addTransaction(request)
        console.log(response)
        return result[0]
      } catch (error) {
        console.error(error)
      }
    }
    return false
    // const result = await this.provider.getTransaction("0xe59bb2585ae3848ba2eaa9ec5c87c42b0d5c49fb4f14197037e21348fda2793b")
    // console.log(result)
    // console.log(Number(ethers.utils.formatEther(result.gasPrice.mul(result.gasLimit))))
    // return false
  }

  private mapReceiptToTransactionRequestModel(receipt: any, owner: string, type: number): TransactionsRequestModel {
    const result: TransactionsRequestModel = {
      fromUserTokenId: receipt.from,
      toUserTokenId: owner,
      logType: type,
      transactionBlock: receipt.transactionHash,
      gasPrice: Number(ethers.utils.formatEther(receipt.gasUsed.mul(receipt.effectiveGasPrice)))
      // gasPrice: 0.1
    }
    return result
  }

  private async waitTransactionConfirm(tx: any) {
    let receipt = await tx.wait()
    if (receipt.status) {
      console.log(receipt)
      console.log(Number(ethers.utils.formatEther(receipt.gasUsed.mul(receipt.effectiveGasPrice))))
      return [true, receipt]
    }
    return [false, receipt]
  }
}

export const ContractStoreContext = createContext(new ContractStore())
const contractStore: ContractStore = new ContractStore()
export type AuthStoreType = typeof contractStore
export default ContractStore
