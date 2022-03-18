import axios, { AxiosResponse } from "axios"
import AccountModel from "../../models/auth/AccountModel"
import LandModel from "../../models/lands/LandModel"
import LandRequestModel from "../../models/lands/LandRequestModel"
import PurchaseLandRequestModel from "../../models/lands/PurchaseLandRequestModel"
import authStore from "../../store/auth"
import AuthStore from "../../store/auth"
import Host from "../Host"

class LandService {
  private readonly host: string = new Host().host

  public async getLands(): Promise<Array<LandModel>> {
    let lands: AxiosResponse<Array<LandModel>> = await axios.get(`${this.host}/lands`)
    return lands.data
  }

  public async getLandByLandTokenId(landTokenId: string): Promise<LandModel> {
    let lands: AxiosResponse<LandModel> = await axios.get(`${this.host}/lands/land/${landTokenId}`)
    return lands.data
  }

  public async getLandByOwnerTokenId(ownerTokenId: string): Promise<Array<LandModel>> {
    let lands: AxiosResponse<Array<LandModel>> = await axios.get(`${this.host}/lands/ownerTokenId?ownerTokenId=${ownerTokenId}`)
    return lands.data
  }

  public async purchaseLand(landTokenId: string): Promise<LandModel> {
    let account: AccountModel = await authStore.getAccount()
    let body: PurchaseLandRequestModel = {
      landTokenId: landTokenId,
      ownerTokenId: account.userTokenId
    }
    let land: AxiosResponse<LandModel> = await axios.post(`${this.host}/lands/purchase`, body)
    return land.data
  }

  public async updateLand(landRequestBody: LandRequestModel): Promise<LandModel> {
    let land: AxiosResponse<LandModel> = await axios.post(`${this.host}/lands/land/update`, landRequestBody)
    return land.data
  }

}

export default LandService