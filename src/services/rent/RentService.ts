import axios, { AxiosResponse } from "axios"
import AddLandRentRequestModel from "../../models/rent/AddLandRentRequestModel"
import Host from "../Host"

class RentService {
  private readonly host: string = new Host().host

  public async confirmRenting(bodyRequest: AddLandRentRequestModel) {
    let response = await axios.post(`${this.host}/market/lands/rent`, bodyRequest)
    return response.data
  }
}

export default RentService