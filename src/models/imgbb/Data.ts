import Image from "./Image"
import Thumb from "./Thumb"

export default class Data {
  public id: string = String()
  public title: string = String()
  public url_viewer: string = String()
  public url: string = String()
  public display_url: string = String()
  public size: number = Number()
  public time: string = String()
  public expiration: string = String()
  public image: Image = new Image
  public thumb: Thumb = new Thumb()
  public delete_url: string = String()
}