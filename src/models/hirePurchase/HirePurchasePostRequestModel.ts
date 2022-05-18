export default class HirePurchasePostRequestModel {
    public landTokenId: string = String();
    public period: number = Number();
    public price: number = Number();
    public hash: string = String();
    public startDate: Date = new Date()
    public endDate: Date = new Date()
    public fees: number = Number()
}