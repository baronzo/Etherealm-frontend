import axios, { AxiosResponse } from "axios"
import LandModel from "../../models/lands/LandModel"
import BuyLandOnMarketRequestModel from "../../models/lands/BuyLandOnMarketRequestModel"
import LandMarketModel from "../../models/lands/LandMarketModel"
import ListLandOnMarketRequestModel from "../../models/lands/ListLandOnMarketRequestModel"
import ListOnMarketResponseModel from "../../models/lands/ListOnMarketResponseModel"
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

  public async listLandOnMarket(listOnMarket: ListLandOnMarketRequestModel): Promise<ListOnMarketResponseModel> {
    let bodyResponse: AxiosResponse<ListOnMarketResponseModel> = await axios.post(`${this.host}/market/land/create`, listOnMarket)
    return bodyResponse.data
  }

}

export default LandMarketService
