import LandModel from "./LandModel";
import LandTokenIdModel from "./LandTokenIdModel";
import MarketTypeModel from "./MarketTypeModel";
import OwnerUserTokenIdModel from "./OwnerUserTokenIdModel";

class LandMarketModel {
    public landMarketId : number = Number();
    public price: number = Number();
    public period: number | null = null;
    public fees: number = Number()
    public landTokenId: LandTokenIdModel = new LandTokenIdModel();
    public ownerUserTokenId: OwnerUserTokenIdModel = new OwnerUserTokenIdModel();
    public marketType: MarketTypeModel = new MarketTypeModel();
    public isActive: boolean = false
}

export default LandMarketModel