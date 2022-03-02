import axios, { AxiosResponse } from "axios";
import UserModel from "../../models/auth/UserModel";
import Host from "../Host";

class UserService {

  private readonly host: string = new Host().host

  public async createUser(userTokenId: string): Promise<UserModel> {
    let user: AxiosResponse<UserModel> = await axios.post(`${this.host}/users/create?userTokenId=${userTokenId}`)
    return user.data
  }
}

export default UserService