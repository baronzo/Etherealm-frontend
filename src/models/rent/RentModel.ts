export default class RentModel {
    public rentId: number = Number();
    public period: number = Number();
    public price: number = Number();
    public fees: number = Number();
    public createAt: Date = new Date();
    public updatedAt: Date = new Date();
    public startDate: Date = new Date();
    public endDate: Date = new Date();
    public lastPayment: Date = new Date();
    public isDelete: boolean = Boolean();
}