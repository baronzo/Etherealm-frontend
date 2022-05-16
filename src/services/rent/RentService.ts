import axios, { AxiosResponse } from "axios"
import AddLandRentRequestModel from "../../models/rent/AddLandRentRequestModel"
import LandRentResponseModel from "../../models/rent/LandRentResponseModel"
import Host from "../Host"

class RentService {
  private readonly host: string = new Host().host

  public async confirmRenting(bodyRequest: AddLandRentRequestModel) {
    let response = await axios.post(`${this.host}/market/lands/rent`, bodyRequest)
    return response.data
  }
  public async getRentLandByRenterTokenId(userTokenId: string): Promise<Array<LandRentResponseModel>> {
    let RentLandresponse: AxiosResponse<Array<LandRentResponseModel>> = await axios.get(`${this.host}/lands/rent/owned?renterTokenId=${userTokenId}`)
    return RentLandresponse.data;
  }
}

export default RentService