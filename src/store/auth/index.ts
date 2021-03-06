import { action, makeAutoObservable, observable } from 'mobx'
import AccountModel from '../../models/auth/AccountModel'
import { ethers } from 'ethers'
import Cookies from 'js-cookie'
import React, { createContext } from 'react'
import UserService from '../../services/user/UserService'
import UserModel from '../../models/auth/UserModel'
import axios from 'axios'

class AuthStore {

  @observable 
  public account: AccountModel = new AccountModel

  private userService = new UserService

  constructor() {
    makeAutoObservable(this)
    this.checkLogin()
  }

  @action
  public async checkLogin(): Promise<void> {
    if (Cookies.get('is_login') && window.localStorage.getItem('account')) {
      this.account = JSON.parse(window.localStorage.getItem('account')!)
      await this.checkUserHaveMetamask()
    }
  }

  @action
  public validateIsLogin(): boolean {
    if (this.account.userTokenId) {
      return true
    }
    return false
  }

  @action
  public async checkUserHaveMetamask(): Promise<boolean> {
    let eth = (window as any).ethereum
    if (eth) {
      let accounts = await eth.request({method: 'eth_requestAccounts'})
      return true
    } else {
      return false
    }
  }

  @action
  public async updateAccountOnCookie(): Promise<void> {
    window.localStorage.setItem('account', JSON.stringify(this.account))
  }

  @action
  public updateAccountDetails(response: UserModel): void {
    let newDetails: AccountModel = {...this.account}
    newDetails.userTokenId = response.userTokenId
    newDetails.userName = response.userName
    newDetails.userProfilePic = response.userProfilePic
    newDetails.userDescription = response.userDescription
    this.account = newDetails
    window.localStorage.setItem('account', JSON.stringify(this.account))
  }

  @action
  public async getAccountInCookies(): Promise<AccountModel> {
    if (Cookies.get('is_login') && window.localStorage.getItem('account')) {
      const storeAccount: AccountModel = JSON.parse(window.localStorage.getItem('account')!)
      const currentAccount: AccountModel = await this.login()
      if (storeAccount.userTokenId === currentAccount.userTokenId) {
        return currentAccount
      } else {
        this.logout()
      }
    }
    return new AccountModel
  }

  @action
  public setPoint(value: number): void {
    this.account.point = value
    this.updateAccountOnCookie()
  }

  @action
  public async getAccount(): Promise<AccountModel> {
    let eth = (window as any).ethereum
    let result: AccountModel = new AccountModel
    if (eth) {
      let accounts = await eth.request({method: 'eth_requestAccounts'})
      let resBalance = await eth.request({method: 'eth_getBalance', params: [accounts[0], 'latest']})
      let userDetails: UserModel = await this.userService.createUser(accounts[0])
      if (userDetails.userTokenId) {
        result = {
          userTokenId: accounts[0],
          balance: Number(Number(ethers.utils.formatEther(resBalance)).toFixed(4)),
          userName: userDetails.userName,
          userDescription: userDetails.userDescription,
          userProfilePic: userDetails.userProfilePic,
          point: 0
        }
      }
    } else {
      console.error('Please Install Metamask')
    }
    return result
  }


  @action
  public async updateAccountData(): Promise<void> {
    await this.login()
    this.setAxiosHeader()
  }

  @action
  public async accountChange(): Promise<void> {
    // await this.checkUserHaveMetamask()
    this.account = await this.getAccount()
    window.localStorage.setItem('account', JSON.stringify(this.account))
    // this.setAxiosHeader()
  }

  @action
  public async updateAccount(): Promise<void> {
    this.account = await this.getAccount()
    Cookies.set('is_login', 'true', {expires: 1})
    window.localStorage.setItem('account', JSON.stringify(this.account))
  }

  @action
  public async login(): Promise<AccountModel> {
    this.account = await this.getAccount()
    Cookies.set('is_login', 'true', {expires: 1})
    window.localStorage.setItem('account', JSON.stringify(this.account))
    return this.account
  }

  private setAxiosHeader(): void {
    const userAccount: AccountModel = JSON.parse(window.localStorage.getItem('account')!)
    axios.defaults.headers.common['Authorization'] = userAccount.userTokenId;
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

const authStore: AuthStore = new AuthStore()
export default authStore
