import axios, { AxiosResponse } from "axios"
import AddLandRentRequestModel from "../../models/rent/AddLandRentRequestModel"
import RentingDetailsModel from "../../models/rent/RentingDetailsModel"
import Host from "../Host"

class RentService {
  private readonly host: string = new Host().host

  public async confirmRenting(bodyRequest: AddLandRentRequestModel) {
    let response = await axios.post(`${this.host}/lands/rent`, bodyRequest)
    return response.data
  }

  public async getRentingDetailsByLandTokenId(landTokenId: string): Promise<RentingDetailsModel> {
    let rentingResponse: AxiosResponse<RentingDetailsModel> = await axios.get(`${this.host}/lands/rent/details/${landTokenId}`)
    return rentingResponse.data
  }

}

export default RentService