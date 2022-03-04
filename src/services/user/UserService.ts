import axios, { AxiosResponse } from "axios";
import UserModel from "../../models/auth/UserModel";
import Host from "../Host";

class UserService {

  private readonly host: string = new Host().host

  public async createUser(userTokenId: string): Promise<UserModel> {
    const user: AxiosResponse<UserModel> = await axios.post(`${this.host}/users/create?userTokenId=${userTokenId}`)
    return user.data
  }

  public async getUserDetailsByTokenId(userTokenId: string): Promise<UserModel> {
    const user: AxiosResponse<UserModel> = await axios.get(`${this.host}/users/user/${userTokenId}`)
    return user.data
  }
}

export default UserService