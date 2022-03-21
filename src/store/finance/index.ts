import { action, makeAutoObservable, observable } from 'mobx'


class FinanceStore {

  public fee: number = 0.025

  constructor() {
    makeAutoObservable(this)
  }
}

const financeStore: FinanceStore = new FinanceStore()
export default financeStore
