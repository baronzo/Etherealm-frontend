import axios, { AxiosResponse } from "axios"
import AddLandRentRequestModel from "../../models/rent/AddLandRentRequestModel"
import LandRentResponseModel from "../../models/rent/LandRentResponseModel"
import PeopleRentingOwnedModel from "../../models/rent/PeopleRentingOwnedModel"
import RentingDetailsModel from "../../models/rent/RentingDetailsModel"
import Host from "../Host"

class RentService {
  private readonly host: string = new Host().host

  public async confirmRenting(bodyRequest: AddLandRentRequestModel) {
    let response = await axios.post(`${this.host}/lands/rent`, bodyRequest)
    return response.data
  }
  public async getRentLandByRenterTokenId(userTokenId: string): Promise<Array<LandRentResponseModel>> {
    let RentLandresponse: AxiosResponse<Array<LandRentResponseModel>> = await axios.get(`${this.host}/lands/rent/owned?renterTokenId=${userTokenId}`)
    return RentLandresponse.data;
  }

  public async getRentingDetailsByLandTokenId(landTokenId: string): Promise<RentingDetailsModel> {
    let rentingResponse: AxiosResponse<RentingDetailsModel> = await axios.get(`${this.host}/lands/rent/details/${landTokenId}`)
    return rentingResponse.data
  }

  public async getPeopleAreRentingByOwnerLandTokenId(ownerTokenId: string): Promise<Array<PeopleRentingOwnedModel>> {
    let response: AxiosResponse<Array<PeopleRentingOwnedModel>> = await axios.get(`${this.host}/lands/rent/owned/people?landOwnerTokenId=${ownerTokenId}`)
    return response.data
  }

}

export default RentService