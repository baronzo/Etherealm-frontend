export default class RentLogTransactionsModel {
    public logTransactionsId: number = Number();
    public transactionBlock: string = String();
    public gasPrice: number = Number();
    public createdAt: Date = new Date();
}