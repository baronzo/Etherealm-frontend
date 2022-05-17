import axios, { AxiosResponse } from "axios"
import ImageModel from "../../models/imgbb/ImageModel"

class ImageService {

  public async postImageApi(imageBase64: string): Promise<string> {
    const path: string = 'https://api.imgbb.com/1/upload?expiration=2592000&key=27a07cc9c38cccf83c919bb18bda4fb7'
    const formData: FormData = new FormData
    formData.append('image', imageBase64)
    let instance = axios.create();
    delete instance.defaults.headers.common['Authorization'];
    let result: AxiosResponse<ImageModel> = await instance.post<ImageModel>(path, formData)
    return result.data.data.display_url
  }

}

export default ImageService