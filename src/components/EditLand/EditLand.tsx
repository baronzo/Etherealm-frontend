import React, { useRef, useState } from 'react'
import LandModel from '../../models/lands/LandModel'
import './EditLand.scss'

export default function EditLand() {
  const inputImage = useRef<HTMLInputElement>(null)
  const [land, setLand] = useState<LandModel>(new LandModel)

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
    setLand(newLand)
  }

  function mapImage(): string {
    if (land.landAssets) {
      return land.landAssets
    }
    return './land.png'
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

  return (
    <div id='editLand'>
      <div id="editBox">
        <div id="title">
          Edit a Land
        </div>
        <div id="editDetail">
          <div className="image-section">
            <img id="landImage" src={land.landAssets ? land.landAssets : './land.png'} alt=""/>
            <div id="changeImage">
              <input type="file" ref={inputImage} name="" id="uploadInput" onChange={e => onImageSelected(e.target)} accept="image/png, image/jpeg" />
              <button className='button' onClick={onChangeImageClick}>Change Image</button>
            </div>
          </div>
          <div className="edit-section">
            <div className="input-box">
              <div className="text">Land Name</div>
              <input type="text"  className='input' />
            </div>
            <div className="input-box">
              <div className="text">Land Description</div>
              <textarea className='input-description' />
            </div>
            <div className="input-box">
              <div className="text">URL</div>
              <input type="text" className='input'/>
            </div>
            <div className="button-section">
              <button className='button-save'>Save</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
