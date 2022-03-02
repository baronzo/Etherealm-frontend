import { action, makeAutoObservable, observable } from 'mobx'
import { ethers } from 'ethers'
import { createContext } from 'react'
import abi from './abi.json'
import AuthStore from '../auth'

class ContractStore {
  
  @observable 
  public provider: any = null
  
  @observable 
  public signer: any = null
  
  @observable 
  public contract: any = null
  
  private contractAddress = '0x27aF246550457a60Df7B5Bae9c82341a72AbcE98'
  
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
        await this.contract.create(landTokenId, uri)
        return true
      } catch (error) {
        console.error(error)
      }
    }
    return false
  }
}

export const ContractStoreContext = createContext(new ContractStore())
const contractStore: ContractStore = new ContractStore()
export type AuthStoreType = typeof contractStore
export default ContractStore
