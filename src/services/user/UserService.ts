import axios, { AxiosResponse } from "axios";
import UserModel from "../../models/auth/UserModel";
import authStore from "../../store/auth";
import Host from "../Host";

class UserService {

  private readonly host: string = new Host().host

  public async createUser(userTokenId: string): Promise<UserModel> {
    try {
      const user: AxiosResponse<UserModel> = await axios.post(`${this.host}/users/create?userTokenId=${userTokenId}`)
      return user.data
    } catch (error) {
      console.error(error)
      return new UserModel 
    }
  }

  public async getUserDetailsByTokenId(userTokenId: string): Promise<UserModel> {
    try {
      const user: AxiosResponse<UserModel> = await axios.get(`${this.host}/users/user/${userTokenId}`)
      return user.data
    } catch (error) {
      console.error(error)
      return new UserModel
    }
  }

  public async updateUserProfile(updateProfileRequest: UserModel):Promise<UserModel> {
    try {
      const user: AxiosResponse<UserModel> = await axios.post(`${this.host}/users/user/update`, updateProfileRequest)
      await authStore.updateAccountDetails(user.data)
      return user.data
    } catch (error) {
      console.error(error)
      return new UserModel
    }
  }
}

export default UserService