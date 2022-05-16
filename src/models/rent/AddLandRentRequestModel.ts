export default class AddLandRentRequestModel {
    public landTokenId: string = String();
    public rentType: number = Number();
    public periodType: number = Number();
    public period: number = Number();
    public price: number = Number();
    public hash: string = String();
}