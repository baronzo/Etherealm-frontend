import axios, { AxiosResponse } from "axios"
import LandMarketModel from "../../models/lands/LandMarketModel"
import Host from "../Host"

class LandMarketService {
    private readonly host: string = new Host().host

    public async getLandsOnMarket(): Promise<Array<LandMarketModel>> {
        let landsMarket: AxiosResponse<Array<LandMarketModel>> = await axios.get(`${this.host}/market/land`)
        return landsMarket.data
    }

}

export default LandMarketService
