import axios, { AxiosResponse } from "axios";
import NotificationsResponseModel from "../../models/notifications/NotificationsResponseModel";
import authStore from "../../store/auth";
import Host from "../Host";


export default class NotificationService {
    private readonly host: string = new Host().host;

    public async getNotification(): Promise<Array<NotificationsResponseModel>> {
        let notifications: AxiosResponse<Array<NotificationsResponseModel>> = await axios.get(`${this.host}/notification/${authStore.account.userTokenId}`);
        return notifications.data;
    }
}
