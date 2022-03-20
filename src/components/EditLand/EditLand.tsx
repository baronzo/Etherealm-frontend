import React, { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import LandModel from '../../models/lands/LandModel'
import LandRequestModel from '../../models/lands/LandRequestModel'
import ImageService from '../../services/imgbb/ImageService'
import LandService from '../../services/lands/LandService'
import './EditLand.scss'

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


  useEffect(() => {
    getLandFromTokenId()
  }, [])

  async function getLandFromTokenId(): Promise<void> {
    const result: LandModel = await landService.getLandByLandTokenId(params.landTokenId)
    setLand(result)
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
    let imagePath: string = await imageService.postImageApi(base64Image)
    let body: LandRequestModel = {
      landTokenId: land.landTokenId,
      landName: land.landName,
      landDescription: land.landDescription,
      landLocation: `${land.landLocation.x},${land.landLocation.y}`,
      landPosition: `${land.landPosition.x},${land.landPosition.y}`,
      landOwnerTokenId: land.landOwnerTokenId,
      landAssets: imagePath,
      landSize: land.landSize.landSizeId,
      landStatus: land.landStatus.landStatusId,
      onRecommend: land.onRecommend
    }
    let result: LandModel = await landService.updateLand(body)
    setLand(result)
  }

  return (
    <div id='editLand'>
      <div id="editBox">
        <div id="title">
          <p className='text-edit'>Edit a Land</p>
        </div>
        <div id="editDetail">
          <div className="image-section">
            <img id="landImage" src={land.landAssets ? land.landAssets : '/map.jpg'} alt=""/>
            <div id="changeImage">
              <input type="file" ref={inputImage} name="" id="uploadInput" onChange={e => onImageSelected(e.target)} accept="image/png, image/jpeg" />
              <button className='button' onClick={onChangeImageClick}>Change Image</button>
            </div>
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
            <div className="button-section">
              <button className='button-save' onClick={() => onSaveClick()}>Save</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
