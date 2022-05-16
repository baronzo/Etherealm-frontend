import LandModel from "../lands/LandModel";
import MarketTypeModel from "./MarketTypeModel";
import OwnerUserTokenIdModel from "../lands/OwnerUserTokenIdModel";
import RentTypeModel from "../rent/RentTypeModel";

export default class ListOnMarketResponseModel {
    public landTokenId: LandModel = new LandModel();
    public ownerUserTokenId: OwnerUserTokenIdModel = new OwnerUserTokenIdModel();
    public period: number | null = null;
    public price: number = Number();
    public marketType: MarketTypeModel = new MarketTypeModel();
    public landMarketId: number = Number();
    public fees: number = Number();
    public createdAt: Date = new Date();
    public updatedAt: Date = new Date();
    public isDelete: boolean = Boolean();
    public rentType: RentTypeModel = new RentTypeModel();
}