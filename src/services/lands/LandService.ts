import axios, { AxiosResponse } from "axios"
import AccountModel from "../../models/auth/AccountModel"
import LandModel from "../../models/lands/LandModel"
import PurchaseLandRequestModel from "../../models/lands/PurchaseLandRequestModel"
import AuthStore from "../../store/auth"
import Host from "../Host"

class LandService {
  private readonly host: string = new Host().host

  public async getLands(): Promise<Array<LandModel>> {
    let lands: AxiosResponse<Array<LandModel>> = await axios.get(`${this.host}/lands`)
    return lands.data
  }

  public async purchaseLand(landTokenId: string): Promise<LandModel> {
    let account: AccountModel = await new AuthStore().getAccount()
    let body: PurchaseLandRequestModel = {
      landTokenId: landTokenId,
      ownerTokenId: account.userTokenId
    }
    let land: AxiosResponse<LandModel> = await axios.post(`${this.host}/lands/purchase`, body)
    return land.data
  }
}

export default LandService