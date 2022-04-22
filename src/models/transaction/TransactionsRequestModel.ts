export default class TransactionsRequestModel {
  public fromUserTokenId: string = String()
  public toUserTokenId: string = String()
  public transactionBlock: string = String()
  public gasPrice: number = Number()
  public logType: number = Number()
}