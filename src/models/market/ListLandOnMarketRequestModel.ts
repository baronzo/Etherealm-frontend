export default class ListLandOnMarketRequestModel {
    public landTokenId: string = String();
    public ownerUserTokenId: string = String();
    public marketType: number = Number();
    public price: number = Number();
    public period: number | null = null;
}