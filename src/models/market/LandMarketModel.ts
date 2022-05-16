import LandModel from "../lands/LandModel";
import LandTokenIdModel from "../lands/LandTokenIdModel";
import MarketTypeModel from "./MarketTypeModel";
import OwnerUserTokenIdModel from "../lands/OwnerUserTokenIdModel";
import RentTypeModel from "../rent/RentTypeModel";

class LandMarketModel {
    public landMarketId : number = Number();
    public price: number = Number();
    public period: number | null = null;
    public fees: number = Number()
    public landTokenId: LandTokenIdModel = new LandTokenIdModel();
    public ownerUserTokenId: OwnerUserTokenIdModel = new OwnerUserTokenIdModel();
    public marketType: MarketTypeModel = new MarketTypeModel();
    public isActive: boolean = false
    public isLoading: boolean = false
    public rentType: RentTypeModel = new RentTypeModel();
}

export default LandMarketModel