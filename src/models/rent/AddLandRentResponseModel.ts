
import LandTokenIdModel from "../lands/LandTokenIdModel";
import OwnerUserTokenIdModel from "../lands/OwnerUserTokenIdModel";
import PeriodTypeModel from "./PeriodTypeModel";
import RentTypeModel from "./RentTypeModel";

export default class AddLandRentResponseModel {
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
    public landTokenId:LandTokenIdModel = new LandTokenIdModel()
    public rentType: RentTypeModel = new RentTypeModel()
    public periodType: PeriodTypeModel = new PeriodTypeModel()
    public renterTokenId: OwnerUserTokenIdModel = new OwnerUserTokenIdModel()
    public nextPayment: Date = new Date()
}