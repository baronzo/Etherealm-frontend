import UserModel from "./UserModel"

class AccountModel extends UserModel {
  public balance: number = Number()
}

export default AccountModel