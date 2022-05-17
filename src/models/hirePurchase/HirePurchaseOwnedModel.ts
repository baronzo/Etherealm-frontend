import UserModel from "../auth/UserModel"
import LandModel from "../lands/LandModel"

export default class HirePurchaseOwnedModel {
    public hirePurchaseId: number = Number()
    public period: number = Number()
    public price: number = Number()
    public fees: number = Number()
    public createAt: string = String()
    public updatedAt: string = String()
    public startDate: string = String()
    public endDate: string = String()
    public lastPayment: string = String()
    public isDelete: boolean = Boolean()
    public landTokenId: LandModel = new LandModel()
    public renterTokenId: UserModel = new UserModel()
}