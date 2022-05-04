import UserModel from "./UserModel"

class AccountModel extends UserModel {
  public balance: number = Number()
  public point: number = Number()
}

export default AccountModel