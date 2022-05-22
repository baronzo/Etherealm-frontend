import React, { useEffect, useState } from 'react'
import { MdClose } from 'react-icons/md'
import './ModalUploadImage.scss'
import Cropper from "react-easy-crop";
import getCroppedImg from '../../utils/cropImage'
import { RiUpload2Fill } from 'react-icons/ri';
import { AiOutlineCheckCircle } from 'react-icons/ai';
import Select from 'react-select'
import ReactSelectOptionModel from '../../models/reactSelect/ReactSelectOptionModel';

type Props = {
  onImageCropped: (base64Image: string) => void,
  setisShowModalUploadImage: (isShow: boolean) => void
}

export default function ModalUploadImage(props: Props) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const triggerFileSelectPopup = () => inputRef.current!.click();
  const [image, setImage] = React.useState<string>('');
  const [inputUrlImage, setinputUrlImage] = useState<string>('')
  const [urlImage, seturlImage] = useState<string>('')
	const [croppedArea, setCroppedArea] = React.useState(null);
	const [crop, setCrop] = React.useState({ x: 0, y: 0 });
	const [zoom, setZoom] = React.useState(1);
  const [croppedImage, setcroppedImage] = useState<string>('')
  const [selectedType, setselectedType] = useState<ReactSelectOptionModel>({ value: 1, label: 'Upload from computer'  })
  const typeSelectOptions = [
    { value: 1, label: 'Upload from computer'  },
    { value: 2, label: 'Upload from url'  }
  ]

	const onCropComplete = async (croppedAreaPercentage: any, croppedAreaPixels: any) => {
    let cropped: Blob = new Blob
    if (selectedType.value === 1) {
      cropped = await getCroppedImg(image, croppedAreaPixels)
    } else {
      cropped = await getCroppedImg(urlImage, croppedAreaPixels)
    }
    convertBlobToBase64(cropped)
	};

	const onSelectFile = (event: any) => {
		if (event.target.files && event.target.files.length > 0) {
			const reader = new FileReader();
			reader.readAsDataURL(event.target.files[0]);
			reader.addEventListener("load", () => {
        console.log(reader.result)
				setImage(reader.result as string);
			});
		}
	};

   function convertBlobToBase64(blobImage: Blob) {
    var reader = new FileReader();
    reader.readAsDataURL(blobImage!); 
    reader.onloadend = function() {
      let base64data: string = reader.result as string;                
      setcroppedImage(base64data)
    }
  }

  function onConfirmClick(): void {
    props.onImageCropped(croppedImage!)
    props.setisShowModalUploadImage(false)
  }

  async function onPasteUrlImage(url: string) {
    setinputUrlImage(url)
    await getBase64FromUrl(url)
  }

  const getBase64FromUrl = async (url: string) => {
    const data = await fetch(url);
    const blob = await data.blob();
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(blob); 
      reader.onloadend = () => {
        const base64data = reader.result;   
        seturlImage(base64data as string)
        resolve(base64data);
      }
    });
  }

    return (
        <div id='uploadMainBox'>
            <div id="uploadBodyBox">
              <div id="headerBox">
                <div id="uploadHeader">Upload Image</div>
                <div id="closeIconBox">
                  <MdClose className="close-icon" onClick={() => props.setisShowModalUploadImage(false)}/>
                </div>
              </div>
              <div id="uploadBodyContent">
                <div id="cropImageBox">
                {!image && 
                  <div id='noUploadImageText'>Please upload image</div>
                }
                  <Cropper
                    image={selectedType.value === 1 ? image! : urlImage}
                    crop={crop}
                    zoom={zoom}
                    zoomSpeed={0.1}
                    aspect={1}
                    onCropChange={setCrop}
                    onZoomChange={setZoom}
                    onCropComplete={onCropComplete}
                  />
                </div>
                <div id="detailsBox">
                  <div id="previewImageBox">
                    <div id="previewImageText">Preview Image</div>
                    <img id='previewImage' src={croppedImage ? croppedImage : '/no-image.jpg'} alt="" />
                  </div>
                  <div id="buttonBox">
                    <input type="file" name="" accept='image/*' id="inputFile" ref={inputRef!} onChange={onSelectFile}/>
                    <Select id="selectSort" options={typeSelectOptions} value={selectedType} onChange={(e) => setselectedType(e as ReactSelectOptionModel)}/>
                    {selectedType.value === 1
                      ?
                      <button onClick={triggerFileSelectPopup} id="uploadButton"><RiUpload2Fill id='uploadIcon' />Upload Image</button>
                      :
                      <input type="text" id='uploadUrlInput' value={inputUrlImage} onChange={e => onPasteUrlImage(e.target.value)} placeholder='Paste link here' />
                    }
                    <button id="confirmButton" onClick={onConfirmClick}><AiOutlineCheckCircle id='confirmIcon'/>Confirm Image</button>
                  </div>
                </div>
              </div>
            </div>
        </div>
    )
}