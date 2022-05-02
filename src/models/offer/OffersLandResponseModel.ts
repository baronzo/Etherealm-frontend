import OffersDataOfLandModel from "./OffersDataOfLandModel";

export default class OffersLandResponseModel {
    map(arg0: (item: OffersLandResponseModel) => JSX.Element): import("react").ReactNode {
      throw new Error("Method not implemented.");
    }
    public currentPage: number = Number();
    public pageItem: number = Number();
    public totalPage: number = Number();
    public data: OffersDataOfLandModel = new OffersDataOfLandModel();
}