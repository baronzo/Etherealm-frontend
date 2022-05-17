import LandModel from "../lands/LandModel"
import OwnerUserTokenIdModel from "../lands/OwnerUserTokenIdModel"
import PaymentHistoryModel from "../rent/PaymentHistoryModel"

export default class HirePurchaseDetailResponseModel {
    public hirePurchaseId: number = Number()
    public period: number = Number()
    public price: number = Number()
    public fees: number = Number()
    public createAt: Date = new Date()
    public updatedAt: Date = new Date()
    public startDate: Date = new Date()
    public endDate: Date = new Date()
    public lastPayment: Date = new Date()
    public isDelete: Date = new Date()
    public landTokenId: LandModel = new LandModel()
    public renterTokenId: OwnerUserTokenIdModel = new OwnerUserTokenIdModel()
    public nextPayment: Date = new Date()
    public paymentHistories: Array<PaymentHistoryModel> = new Array<PaymentHistoryModel>();
}