import LandMarketModel from "./LandMarketModel"

export default class LandMarketPaginateResponseModel {
    public currentPage: number = Number()
    public pageItem: number = Number()
    public totalPage: number = Number()
    public data: Array<LandMarketModel> = new Array<LandMarketModel>()
}