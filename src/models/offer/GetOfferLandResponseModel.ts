import UserModel from "../auth/UserModel";
// import LandModel from "../lands/LandModel";

export default class GetOfferLandResponseModel {
    public offerId: number = Number();
    public offerPrice: number = Number();
    public isEnoughPoint: boolean = Boolean();
    public createAt: Date = new Date();
    public updatedAt: Date = new Date();
    public isDelete: boolean = Boolean();
    public fees: number = Number();
    public fromUserTokenId: UserModel = new UserModel();
}