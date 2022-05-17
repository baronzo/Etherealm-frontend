import UserModel from "../auth/UserModel"
import LandModel from "../lands/LandModel"
import PeriodTypeModel from "./PeriodTypeModel"
import RentTypeModel from "./RentTypeModel"

export default class PeopleRentingOwnedModel {
    public rentId: number = Number()
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
    public rentType: RentTypeModel = new RentTypeModel()
    public periodType: PeriodTypeModel = new PeriodTypeModel()
    public renterTokenId: UserModel = new UserModel()
}