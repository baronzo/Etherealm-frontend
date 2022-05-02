import axios, { AxiosResponse } from "axios";
import OffersLandRequestModel from "../../models/offer/OffersLandRequestModel";
import OffersLandResponseModel from "../../models/offer/OffersLandResponseModel";
import Host from "../Host";

export default class OfferService {
    private readonly host: string = new Host().host

    public async getOffersLandByLandTokenId(bodyOffersRequest: OffersLandRequestModel): Promise<OffersLandResponseModel> {
        let offerLandResponse: AxiosResponse<OffersLandResponseModel> = await axios.patch(`${this.host}/offers/page`, bodyOffersRequest)
        return offerLandResponse.data
    }
}