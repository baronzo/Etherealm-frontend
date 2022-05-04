import UserModel from "../auth/UserModel";
import LandModel from "../lands/LandModel";

export default class CreateOfferLandResponseModel {
  public offerId: number = Number()
  public fromUserTokenId: UserModel = new UserModel()
  public landTokenId: LandModel = new LandModel()
  public offerPrice: number = Number()
  public fees: number = Number()
  public isEnoughPoint: boolean = Boolean()
  public isDelete: boolean = Boolean()
  public createAt: Date = new Date()
  public updatedAt: Date = new Date(0)
}