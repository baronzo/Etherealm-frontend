import LandModel from "../lands/LandModel";
import MarketTypeModel from "./MarketTypeModel";
import OwnerUserTokenIdModel from "../lands/OwnerUserTokenIdModel";

export default class ListOnMarketResponseModel {
    public landTokenId: LandModel = new LandModel();
    public ownerUserTokenId: OwnerUserTokenIdModel = new OwnerUserTokenIdModel();
    public period: number | null = null;
    public price: number = Number();
    public marketType: MarketTypeModel = new MarketTypeModel();
    public landMarketId: number = Number();
    public fees: number = Number();
}