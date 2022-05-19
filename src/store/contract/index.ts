import { action, makeAutoObservable, observable } from 'mobx'
import { ethers } from 'ethers'
import { BigNumber} from 'ethers'
import { createContext } from 'react'
import abi from './abi.json'
import AuthStore from '../auth'
import TransactionsRequestModel from '../../models/transaction/TransactionsRequestModel'
import TransactionService from '../../services/notification/TransactionService'
import TransactionsResponseModel from '../../models/notifications/TransactionsResponseModel'
import LandService from '../../services/lands/LandService'
import BuyLandOnMarketRequestModel from '../../models/market/BuyLandOnMarketRequestModel'
import authStore from '../auth'
import LandMarketModel from '../../models/market/LandMarketModel'
import LandMarketService from '../../services/market/LandMarketService'
import ConfirmOfferLandRequestModel from '../../models/offer/ConfirmOfferLandRequestModel'
import OfferService from '../../services/offer/OfferService'

class ContractStore {
  
  @observable 
  public provider: any = null
  
  @observable 
  public signer: any = null
  
  @observable 
  public contract: any = null
  
  private contractAddress = '0xc8b4Fa3B9fDD201c562866FF07Aa976280CB6D6e'

  private transactionService: TransactionService = new TransactionService()
  private landMarketService: LandMarketService = new LandMarketService()
  private landService: LandService = new LandService()
  private offerService: OfferService = new OfferService()

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
    }
  }

  @action
  public async purchaseLand(landTokenId: string, price: number): Promise<string> {
    if (this.contract) {
      try {
        let uri: string = `http://etherealm1.ddns.net/api/lands/land/${landTokenId}`
        let tx = await this.contract.create(landTokenId, uri, {value: ethers.utils.parseEther(String(price))})
        return tx.hash
      } catch (error) {
        console.error(error)
      }
    }
    return ''
  }

  @action
  public async hirePurchase(landTokenId: string, price: number, endDate: number): Promise<string> {
    if (this.contract) {
      let uri: string = `http://etherealm1.ddns.net/api/lands/land/${landTokenId}`
      let tx = await this.contract.hirePurchase(landTokenId, uri, endDate,{ value: ethers.utils.parseEther(String(price))})
      return tx.hash
    }
    return ''
  }

  @action
  public async buyLand(landTokenId: string, ownerTokenId: string, price: number): Promise<boolean> {
    if (this.contract) {
      try {
        let tx = await this.contract.buy(landTokenId, ownerTokenId, { value: ethers.utils.parseEther(String(price)) })
        const body: BuyLandOnMarketRequestModel = this.mapTxtoBuyLandOnMarketRequestModel(tx, landTokenId, ownerTokenId)
        await this.landMarketService.buyLandOnMarket(body)
        return true
      } catch (error) {
        console.error(error)
      }
    }
    return false
  }

  @action
  public async confirmOffer(landTokenId: string, ownerOfferUserTokenId: string, price: number) {
    if (this.contract) {
      try {
        let tx = await this.contract.confirmOffer(landTokenId, ownerOfferUserTokenId, ethers.utils.parseEther(String(price)))
        const body: ConfirmOfferLandRequestModel = this.mapTxToConfirmOfferLandRequestModel(tx, landTokenId, ownerOfferUserTokenId)
        await this.offerService.confirmOfferland(body)
        await this.updateUserPoints()
        return true
      } catch (error) {
        console.error(error)
      }
    }
    return false
  }

  @action
  public async getPoint(userTokenId: string): Promise<number> {
    const points = await this.contract.pointOf(userTokenId)
    return Number(ethers.utils.formatEther(points))
  }

  @action
  public async depositPoints(value: number): Promise<boolean> {
    console.log(ethers.utils.parseEther(String(value)))
    const tx = await this.contract.depositPoint({value: ethers.utils.parseEther(String(value))})
    const receipt = await this.waitTransactionConfirm(tx)
    return receipt[0]
  }

  @action
  public async withdrawPoints(value: number): Promise<boolean> {
    const tx = await this.contract.withdrawPoint(ethers.utils.parseEther(String(value)))
    const receipt = await this.waitTransactionConfirm(tx)
    return receipt[0]
  }

  @action
  public async transferEther(toUserTokenId: string, price: number): Promise<string> {
    const tx = await this.contract.transferEther(toUserTokenId, {value: ethers.utils.parseEther(String(price))})
    return tx.hash
  }

  private async updateUserPoints(): Promise<void> {
    const points: number = await this.getPoint(authStore.account.userTokenId)
    authStore.setPoint(points)
  }

  private mapTxToConfirmOfferLandRequestModel(tx: ethers.providers.TransactionResponse, landTokenId: string, ownerOfferUserTokenId: string): ConfirmOfferLandRequestModel {
    const body: ConfirmOfferLandRequestModel = {
      landTokenId: landTokenId,
      offerOwnerTokenId: ownerOfferUserTokenId,
      hash: tx.hash
    }
    return body
  }

  private mapTxtoBuyLandOnMarketRequestModel(tx: ethers.providers.TransactionResponse, landTokenId: string, ownerTokenId: string): BuyLandOnMarketRequestModel {
    const body: BuyLandOnMarketRequestModel = {
      fromUserTokenId: ownerTokenId,
      toUserTokenId: authStore.account.userTokenId,
      landTokenId: landTokenId,
      hash: tx.hash
    }
    return body
  }

  private mapReceiptToTransactionRequestModel(receipt: any, owner: string, type: number): TransactionsRequestModel {
    const result: TransactionsRequestModel = {
      fromUserTokenId: receipt.from,
      toUserTokenId: owner,
      logType: type,
      transactionBlock: receipt.transactionHash,
      gasPrice: Number(ethers.utils.formatEther(receipt.gasUsed.mul(receipt.effectiveGasPrice)))
    }
    return result
  }

  private async waitTransactionConfirm(tx: any) {
    let receipt = await tx.wait()
    if (receipt.status) {
      return [true, receipt]
    }
    return [false, receipt]
  }
}

export const ContractStoreContext = createContext(new ContractStore())
const contractStore: ContractStore = new ContractStore()
export type ContractStoreType = typeof contractStore
export default ContractStore
