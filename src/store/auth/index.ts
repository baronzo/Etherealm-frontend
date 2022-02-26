import { action, makeAutoObservable, observable } from 'mobx'
import AccountModel from '../../models/auth/AccountModel'
import { ethers } from 'ethers'
import Cookies from 'js-cookie'
import { createContext } from 'react'
class AuthStore {

  constructor() {
    makeAutoObservable(this)
  }

  @observable 
  public account: AccountModel = new AccountModel

  @action
  public checkLogin(): void {
    if (Cookies.get('is_login') && window.localStorage.getItem('account')) {
      this.account = JSON.parse(window.localStorage.getItem('account')!)
    }
  }

  @action
  public async getAccount(): Promise<AccountModel> {
    let eth = (window as any).ethereum
    let result: AccountModel = new AccountModel
    if (eth) {
      let accounts = await eth.request({method: 'eth_requestAccounts'})
      let resBalance = await eth.request({method: 'eth_getBalance', params: [accounts[0], 'latest']})
      result = {
        tokenId: accounts[0],
        balance: Number(Number(ethers.utils.formatEther(resBalance)).toFixed(4))
      }
    } else {
      console.error('Please Install Metamask')
    }
    return result
  }

  @action
  public async login(): Promise<AccountModel> {
    this.account = await this.getAccount()
    Cookies.set('is_login', 'true', {expires: 1})
    window.localStorage.setItem('account', JSON.stringify(this.account))
    return this.account
  }

  @action
  public logout(): AccountModel {
    if (Cookies.get('is_login')) {
      Cookies.remove('is_login')
    }
    if (window.localStorage.getItem('account')) {
      window.localStorage.removeItem('account')
    }
    this.account = new AccountModel
    return this.account
  }

}

export const AuthStoreContext = createContext(new AuthStore())
const authStore: AuthStore = new AuthStore()
export type AuthStoreType = typeof authStore
export default AuthStore
