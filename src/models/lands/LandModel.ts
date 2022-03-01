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
}

export default LandModel