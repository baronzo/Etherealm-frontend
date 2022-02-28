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
  
  private contractAddress = '0xdfC21A652fAD49C6Dc1b52391D22F3b1404c9994'
  
  constructor() {
    makeAutoObservable(this)
    this.getData()
  }

  @action
  public async getData(): Promise<void> {
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
  public async getBalance(tokenId: string): Promise<void> {
    if (this.contract) {
      let balance = await this.contract.balanceOf(tokenId)
      console.log(ethers.utils.formatUnits(balance, 0))
    }
  }
}

export const ContractStoreContext = createContext(new ContractStore())
const contractStore: ContractStore = new ContractStore()
export type AuthStoreType = typeof contractStore
export default ContractStore
