import axios, { AxiosResponse } from "axios";
import TransactionsResponseModel from "../../models/notifications/TransactionsResponseModel";
import TransactionsRequestModel from "../../models/transaction/TransactionsRequestModel";
import authStore from "../../store/auth";
import Host from "../Host";


export default class TransactionService {
    private readonly host: string = new Host().host;

    public async getTransaction(): Promise<Array<TransactionsResponseModel>> {
        let notifications: AxiosResponse<Array<TransactionsResponseModel>> = await axios.get(`${this.host}/transaction/${authStore.account.userTokenId}`);
        return notifications.data;
    }

    public async addTransaction(request: TransactionsRequestModel): Promise<TransactionsResponseModel> {
        const result: AxiosResponse<TransactionsResponseModel> = await axios.post(`${this.host}/transaction/add`, request)
        return result.data
    }
}
