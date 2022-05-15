import LogTypeModel from "./LogTypeModel";

export default class TransactionsResponseModel {
    public logTransactionsId: number = Number();
    public fromUserTokenId: string = String();
    public toUserTokenId: string = String();
    public transactionBlock: string = String();
    public gasPrice: number = Number();
    public logType: LogTypeModel = new LogTypeModel();
    public createdAt: string = String();
}