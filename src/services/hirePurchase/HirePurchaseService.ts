import axios, { AxiosResponse } from "axios"
import HirePurchaseDetailResponseModel from "../../models/hirePurchase/HirePurchaseDetailResponseModel"
import Host from "../Host"

class HirePurchaseService {
  private readonly host: string = new Host().host

  public async getHirePurchaseDetail(landTokenId: string): Promise<HirePurchaseDetailResponseModel> {
    let response: AxiosResponse<HirePurchaseDetailResponseModel> = await axios.get(`${this.host}lands/hire/details/${landTokenId}`)
    return response.data
  }
}

export default HirePurchaseService