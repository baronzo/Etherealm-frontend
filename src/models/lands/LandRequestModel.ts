class LandRequestModel {
    public landTokenId: string = String()
    public landName: string = String()
    public landDescription: string = String()
    public landOwnerTokenId: string = String()
    public landLocation: string = String()
    public landPosition: string = String()
    public landStatus: number = Number()
    public landAssets: string = String()
    public landSize: number = Number()
    public onRecommend: boolean = Boolean()
    public minimumOfferPrice: number = Number()
    public landUrl: string = String()
}

export default LandRequestModel