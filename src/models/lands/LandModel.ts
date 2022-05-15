import BestOfferModel from "../offer/BestOfferModel"
import CoordinatesModel from "./CoordinatesModel"
import LandSizeModel from "./LandSizeModel"
import LandStatusModel from "./LandStatusModel"

class LandModel {
  public landTokenId: string = String()
  public landName: string = String()
  public landDescription: string = String()
  public landOwnerTokenId: string = String()
  public landLocation: CoordinatesModel = new CoordinatesModel()
  public landPosition: CoordinatesModel = new CoordinatesModel()
  public landAssets: string = String()
  public onRecommend: boolean = Boolean()
  public landStatus: LandStatusModel = new LandStatusModel
  public landSize: LandSizeModel = new LandSizeModel
  public price: number | null = null
  public minimumOfferPrice: string = String()
  public bestOffer: BestOfferModel | null = null
  public isOffer: boolean = Boolean()
  public isLoading: boolean = Boolean()
  public isDisable: boolean = Boolean()
}

export default LandModel