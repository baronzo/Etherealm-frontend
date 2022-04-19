import axios, { AxiosResponse } from "axios"
import AccountModel from "../../models/auth/AccountModel"
import LandMarketModel from "../../models/lands/LandMarketModel"
import ListLandOnMarketRequestModel from "../../models/lands/ListLandOnMarketRequestModel"
import ListOnMarketResponseModel from "../../models/lands/ListOnMarketResponseModel"
import authStore from "../../store/auth"
import Host from "../Host"

class LandMarketService {
    private readonly host: string = new Host().host

    public async getLandsOnMarket(): Promise<Array<LandMarketModel>> {
        let landsMarket: AxiosResponse<Array<LandMarketModel>> = await axios.get(`${this.host}/market/land`)
        return landsMarket.data
    }

    // public async purchaseLand(landTokenId: string): Promise<LandModel> {
    //     let account: AccountModel = await authStore.getAccount()
    //     let body: PurchaseLandRequestModel = {
    //       landTokenId: landTokenId,
    //       ownerTokenId: account.userTokenId
    //     }
    //     let land: AxiosResponse<LandModel> = await axios.post(`${this.host}/lands/purchase`, body)
    //     return land.data
    //   }

    public async listLandOnMarket(listOnMarket: ListLandOnMarketRequestModel): Promise<ListOnMarketResponseModel> {
        let bodyResponse: AxiosResponse<ListOnMarketResponseModel> = await axios.post(`${this.host}/market/land/create`, listOnMarket)
        return bodyResponse.data
    }

}

export default LandMarketService
