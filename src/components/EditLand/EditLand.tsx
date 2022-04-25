import React, { useEffect, useRef, useState } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import LandModel from '../../models/lands/LandModel'
import LandRequestModel from '../../models/lands/LandRequestModel'
import ImageService from '../../services/imgbb/ImageService'
import LandService from '../../services/lands/LandService'
import './EditLand.scss'
import { BiArrowBack } from 'react-icons/bi'

interface IParams {
  landTokenId: string
}

export default function EditLand() {
  const landService: LandService = new LandService
  const imageService: ImageService = new ImageService
  const inputImage = useRef<HTMLInputElement>(null)
  const [land, setLand] = useState<LandModel>(new LandModel)
  const [base64Image, setbase64Image] = useState<string>('')
  const params: IParams = useParams()
  const [isTab, setIsTab] = useState(true)
  const [linkImage, setLinkImage] = useState<string>('')
  const [prevImage, setPrevImage] = useState<string>('')
  const [prevData, setprevData] = useState<LandModel>(new LandModel)
  const [isLoading, setisLoading] = useState<boolean>(false)
  const history = useHistory()


  useEffect(() => {
    getLandFromTokenId()
  }, [])

  async function getLandFromTokenId(): Promise<void> {
    const result: LandModel = await landService.getLandByLandTokenId(params.landTokenId)
    setPrevImage(result.landAssets)
    setLand(result)
    setprevData(result)
  }

  function onChangeImageClick(): void {
    inputImage.current?.click()
  }

  async function onImageSelected(e: HTMLInputElement): Promise<void> {
    const target: HTMLInputElement = e
    let image: FileList  = target.files as FileList 
    let type: string = image[0].type.split('/')[1]
    let base64Image = await convertImageToBase64(image[0])
    let newLand = {...land}
    newLand.landAssets = base64Image
    base64Image = formatBase64Image(base64Image, type)
    setbase64Image(base64Image)
    setLand(newLand)
  }

  function formatBase64Image(base64Image: string, type: string): string {
    return base64Image.replace(`data:image/${type};base64,`, '')
  }

  function convertImageToBase64(image: File): Promise<string> {
    return new Promise(resolve => {
      let reader = new FileReader();
      reader.readAsDataURL(image);
      reader.onload = () => {
        resolve(String(reader.result))
      };
    });
  }

  async function onSaveClick(): Promise<void> {
    setisLoading(true)
    let imagePath: string = ''
    if (!linkImage && base64Image) {
      imagePath = await imageService.postImageApi(base64Image)
    }
    let body: LandRequestModel = {
      landTokenId: land.landTokenId,
      landName: land.landName,
      landDescription: land.landDescription,
      landLocation: `${land.landLocation.x},${land.landLocation.y}`,
      landPosition: `${land.landPosition.x},${land.landPosition.y}`,
      landOwnerTokenId: land.landOwnerTokenId,
      landAssets: linkImage ? linkImage : imagePath ? imagePath : land.landAssets,
      landSize: land.landSize.landSizeId,
      landStatus: land.landStatus.landStatusId,
      onRecommend: land.onRecommend
    }
    let result: LandModel = await landService.updateLand(body)
    onChangeTab(true)
    setLand(result)
    setprevData(result)
    setisLoading(false)
  }

  function onChangeTab(isTab: boolean ) {
    let newLand = land
    newLand.landAssets = prevData.landAssets
    setLinkImage('')
    setLand(newLand)
    setIsTab(isTab)
  }

  function checkDataIsChange(): boolean {
    let result: boolean = JSON.stringify(land) === JSON.stringify(prevData) ? false : true
    if (linkImage && linkImage !== prevData.landAssets) {
      result = true
    }
    return result
  }

  return (
    <div id='editLand'>
      <div id="editBox">
        <div id="title">
          <BiArrowBack className="icon-back" onClick={history.goBack}/>
          <p className='text-edit'>Edit a Land</p>
        </div>
        <div id="editDetail">
          <div className="image-section">
            <div className="menu">
              <div className="menu-button">
                <div className={`upload-image ${isTab ? 'active' : ''}`} onClick={() => onChangeTab(true)}>Uplaod Image</div>
                <div className={`link-image ${!isTab ? 'active' : ''}`} onClick={() => onChangeTab(false)}>Link Image</div>
              </div>
            </div>
            <img id="landImage" src={linkImage ? linkImage : land.landAssets ? land.landAssets : "/map.jpg"}  alt=""/>
            { isTab ? 
              <div id="changeImage">
                <input type="file" ref={inputImage} name="" id="uploadInput" onChange={e => onImageSelected(e.target)} accept="image/png, image/jpeg" />
                <button className='button' onClick={onChangeImageClick}>Change Image</button>
              </div> 
              :
              <div className='link'>
                <input type="text" className='link-input' value={linkImage} placeholder='Enter your link image' onChange={(e) => setLinkImage(e.target.value)}/>
              </div>
            }
          </div>
          <div className="edit-section">
            <div className="input-box">
              <div className="text">Land Name</div>
              <input type="text"  className='input' value={land.landName} onChange={e => setLand({...land, ...{landName: e.target.value}})} />
            </div>
            <div className="input-box">
              <div className="text">Land Description</div>
              <textarea className='input-description' value={land.landDescription} onChange={e => setLand({...land, ...{landDescription: e.target.value}})}/>
            </div>
            <div className="input-box">
              <div className="text">URL</div>
              <input type="text" className='input'/>
            </div>
            <div className="input-box">
              <div className="text">Minimum Offer (ETH)</div>
              <input type="text" className='input'/>
            </div>
            <div className="button-section">
              {!isLoading 
              ?
                <button className={`button-save ${checkDataIsChange() ? 'change' : 'disable'}`} onClick={() => checkDataIsChange() ? onSaveClick() : undefined}>Save</button>
              :
                <button className={`button-save ${isLoading ? 'loading' : ''}`}><i className="fas fa-spinner fa-spin"></i></button>
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
