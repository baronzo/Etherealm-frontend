import axios, { AxiosResponse } from "axios"
import AccountModel from "../../models/auth/AccountModel"
import LandModel from "../../models/lands/LandModel"
import authStore from "../../store/auth"
import AuthStore from "../../store/auth"
import BuyLandOnMarketRequestModel from "../../models/lands/BuyLandOnMarketRequestModel"
import Host from "../Host"

class LandMarketService {
  private readonly host: string = new Host().host

  public async get() {
    let res = await axios.get(`${this.host}/market/land`)
    return res
  }

  public async buyLandOnMarket(): Promise<LandModel> {
    let landMarket = await axios.get(`${this.host}/market/land`)
    let account: AccountModel = await authStore.getAccount()
    let body: BuyLandOnMarketRequestModel = {
      fromUserTokenId: landMarket.data.landTokenId.landOwnerTokenId,
      toUserTokenId: account.userTokenId,
      landTokenId: landMarket.data.landTokenId.landTokenId
    }
    let buy: AxiosResponse<LandModel> = await axios.post(`${this.host}/market/land/buy`, body)
    return buy.data
  }
}

export default LandMarketService