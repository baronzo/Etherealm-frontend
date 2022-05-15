import axios, { AxiosResponse } from "axios";
import OfferingLandRequestModel from "../../models/offer/OfferingLandRequestModel";
import CreateOfferLandRequestModel from "../../models/offer/CreateOfferLandRequestModel";
import CreateOfferLandResponseModel from "../../models/offer/CreateOfferLandResponseModel";
import OffersLandRequestModel from "../../models/offer/OffersLandRequestModel";
import OffersLandResponseModel from "../../models/offer/OffersLandResponseModel";
import Host from "../Host";
import CancelOfferLandRequestModel from "../../models/offer/CancelOfferLandRequestModel";
import OffersDataOfLandModel from "../../models/offer/OffersDataOfLandModel";

export default class OfferService {
    private readonly host: string = new Host().host

    public async getOffersLandByLandTokenId(bodyOffersRequest: OffersLandRequestModel): Promise<OffersLandResponseModel> {
        let offerLandResponse: AxiosResponse<OffersLandResponseModel> = await axios.patch(`${this.host}/offers/page`, bodyOffersRequest)
        return offerLandResponse.data
    }

    public async getCheckIsHaveMyOffer(bodyMyOfferRequest: CancelOfferLandRequestModel): Promise<OffersDataOfLandModel> {
        let offerLandResponse: AxiosResponse<OffersDataOfLandModel> = await axios.post(`${this.host}/offers/user/land`, bodyMyOfferRequest)
        return offerLandResponse.data
    }

    public async getOfferingLandByUserTokenId(bodyOfferingRequest: OfferingLandRequestModel): Promise<OffersLandResponseModel> {
        let offeringLandResponse: AxiosResponse<OffersLandResponseModel> = await axios.patch(`${this.host}/offers/user/page`, bodyOfferingRequest)
        return offeringLandResponse.data
    }

    public async createOffer(bodyCreateOffer: CreateOfferLandRequestModel): Promise<CreateOfferLandResponseModel> {
        let createOfferResponse: AxiosResponse<CreateOfferLandResponseModel> = await axios.post(`${this.host}/offers/create`, bodyCreateOffer)
        return createOfferResponse.data
    }

    public async cancelOffering(bodyCancelOffer: CancelOfferLandRequestModel): Promise<OffersDataOfLandModel> {
        let cancelOfferResponse: AxiosResponse<OffersDataOfLandModel> = await axios.patch(`${this.host}/offers/cancel`, bodyCancelOffer)
        return cancelOfferResponse.data
    }
}