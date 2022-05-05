import OffersDataOfLandModel from "./OffersDataOfLandModel";

export default class OffersLandResponseModel {
    public currentPage: number = Number();
    public pageItem: number = Number();
    public totalPage: number = Number();
    public data: Array<OffersDataOfLandModel> = new Array<OffersDataOfLandModel>();
}