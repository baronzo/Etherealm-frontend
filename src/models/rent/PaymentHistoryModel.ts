import UserModel from "../auth/UserModel";
import RentLogTransactionsModel from "./RentLogTransactionsModel";
import RentModel from "./RentModel";

export default class PaymentHistoryModel {
    public rentPaymentId: number = Number();
    public price: number = Number();
    public fees: number = Number();
    public createAt: Date = new Date();
    public updatedAt: Date = new Date();
    public rentId: RentModel = new RentModel();
    public logTransactionsId: RentLogTransactionsModel = new RentLogTransactionsModel();
    public renterTokenId: UserModel = new UserModel();
}