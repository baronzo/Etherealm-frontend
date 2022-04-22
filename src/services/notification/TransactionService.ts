import axios, { AxiosResponse } from "axios";
import TransactionsResponseModel from "../../models/notifications/TransactionsResponseModel";
import authStore from "../../store/auth";
import Host from "../Host";


export default class TransactionService {
    private readonly host: string = new Host().host;

    public async getNotification(): Promise<Array<TransactionsResponseModel>> {
        let notifications: AxiosResponse<Array<TransactionsResponseModel>> = await axios.get(`${this.host}/transaction/${authStore.account.userTokenId}`);
        return notifications.data;
    }
}
