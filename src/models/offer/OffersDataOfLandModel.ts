import LandModal from "../../components/LandModal/LandModal";
import UserModel from "../auth/UserModel";
import LandModel from "../lands/LandModel";

export default class OffersDataOfLandModel {
    public offerId: number = Number();
    public offerPrice: number = Number();
    public isEnoughPoint: boolean = Boolean();
    public createAt: Date = new Date();
    public updatedAt: Date = new Date();
    public isDelete: boolean = Boolean();
    public fees: number = Number();
    public fromUserTokenId: UserModel = new UserModel();
    public landTokenId: LandModel = new LandModel();
    public isWarning: boolean = Boolean()
    public isLoading: boolean = Boolean()
    public isDisable: boolean = Boolean()
}