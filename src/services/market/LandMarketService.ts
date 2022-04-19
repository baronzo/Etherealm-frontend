import axios, { AxiosResponse } from "axios"
import AccountModel from "../../models/auth/AccountModel"
import LandModel from "../../models/lands/LandModel"
import authStore from "../../store/auth"
import AuthStore from "../../store/auth"
import BuyLandOnMarketRequestModel from "../../models/lands/BuyLandOnMarketRequestModel"
import LandMarketModel from "../../models/lands/LandMarketModel"
import Host from "../Host"

class LandMarketService {
  private readonly host: string = new Host().host

  public async getLandsOnMarket(): Promise<Array<LandMarketModel>> {
    let landsMarket: AxiosResponse<Array<LandMarketModel>> = await axios.get(`${this.host}/market/land`)
    return landsMarket.data
}

  public async buyLandOnMarket(buyLandRequest: BuyLandOnMarketRequestModel): Promise<LandModel> {
    let buy: AxiosResponse<LandModel> = await axios.post(`${this.host}/market/land/buy`, buyLandRequest)
    return buy.data
  }
}

export default LandMarketService
