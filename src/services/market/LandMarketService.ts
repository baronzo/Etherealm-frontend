import axios, { AxiosResponse } from "axios"
import LandModel from "../../models/lands/LandModel"
import BuyLandOnMarketRequestModel from "../../models/market/BuyLandOnMarketRequestModel"
import CancelListedOnMarketRequestModel from "../../models/market/CancelListedOnMarketRequestModel"
import LandMarketModel from "../../models/market/LandMarketModel"
import ListLandOnMarketRequestModel from "../../models/market/ListLandOnMarketRequestModel"
import ListOnMarketResponseModel from "../../models/market/ListOnMarketResponseModel"
import UpdatePriceListedOnMarketRequestModel from "../../models/market/UpdatePriceListedOnMarketRequestModel"
import LandMarketPaginateRequestModel from "../../models/market/LandMarketPaginateRequestModel"
import LandMarketPaginateResponseModel from "../../models/market/LandMarketPaginateResponseModel"
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

  public async cancelListedOnMarket(bodyCancelListed: CancelListedOnMarketRequestModel): Promise<string> {
    let cancelResponse: AxiosResponse<string> = await axios.post(`${this.host}/market/land/remove`, bodyCancelListed)
    return cancelResponse.data
  }

  public async updatePriceListedOnMarket(bodyUpdateListed: UpdatePriceListedOnMarketRequestModel): Promise<ListOnMarketResponseModel> {
    let updateResponse: AxiosResponse<ListOnMarketResponseModel> = await axios.post(`${this.host}/market/land/update/price`, bodyUpdateListed)
    return updateResponse.data
  }

  public async getLandOnMarketByMarketType(bodyRequest: LandMarketPaginateRequestModel): Promise<LandMarketPaginateResponseModel> {
    let marketResponse: AxiosResponse<LandMarketPaginateResponseModel> = await axios.patch(`${this.host}/market/land`, bodyRequest)
    return marketResponse.data
  }

}

export default LandMarketService
