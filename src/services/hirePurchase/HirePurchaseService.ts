import axios, { AxiosResponse } from "axios"
import HirePurchaseDetailResponseModel from "../../models/hirePurchase/HirePurchaseDetailResponseModel"
import HirePurchasePostRequestModel from "../../models/hirePurchase/HirePurchasePostRequestModel"
import HirePurchasePostResponseModel from "../../models/hirePurchase/HirePurchasePostResponseModel"
import Host from "../Host"

class HirePurchaseService {
  private readonly host: string = new Host().host

  public async getHirePurchaseDetail(landTokenId: string): Promise<HirePurchaseDetailResponseModel> {
    let response: AxiosResponse<HirePurchaseDetailResponseModel> = await axios.get(`${this.host}lands/hire/details/${landTokenId}`)
    return response.data
  }

  public async postHirePurchaseLand(bodyRequest: HirePurchasePostRequestModel): Promise<HirePurchasePostResponseModel> {
    let response: AxiosResponse<HirePurchasePostResponseModel> = await axios.post(`${this.host}/lands/hire`, bodyRequest)
    return response.data
  }

}

export default HirePurchaseService