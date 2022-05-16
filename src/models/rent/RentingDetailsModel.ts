import UserModel from "../auth/UserModel";
import LandModel from "../lands/LandModel";
import PaymentHistoryModel from "./PaymentHistoryModel";
import PeriodTypeModel from "./PeriodTypeModel";
import RentModel from "./RentModel";
import RentTypeModel from "./RentTypeModel";

export default class RentingDetailsModel {
    public rentId: number = Number();
    public period: number = Number();
    public price: number = Number();
    public fees: number = Number();
    public createAt: Date = new Date();
    public updatedAt: Date = new Date();
    public startDate: Date = new Date();
    public endDate: Date = new Date();
    public lastPayment: Date = new Date();
    public isDelete: boolean = Boolean();
    public landTokenId: LandModel = new LandModel();
    public rentType: RentTypeModel = new RentTypeModel();
    public periodType: PeriodTypeModel = new PeriodTypeModel();
    public renterTokenId: UserModel = new UserModel();
    public nextPayment: Date | null = null;
    public paymentHistories: Array<PaymentHistoryModel> = new Array<PaymentHistoryModel>();
}