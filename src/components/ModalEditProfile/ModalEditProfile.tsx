import React, { useRef, useState } from 'react'
import './ModalEditProfile.scss'
import { MdClose } from 'react-icons/md';

type Props = {
    setIsShowModalEditProfile: (value: boolean) => void
}

interface Status {
    upload: boolean
    link: boolean
}

export default function ModalEditProfile(props: Props) {
    const [isActiveToggle, setIsActiveToggle] = useState<Status>({ upload: true, link: false })
    const [linkImageProfile, setLinkImageProfile] = useState<string>('https://cdn.wallpapersafari.com/7/36/98MpYN.jpg')
    const inputImage = useRef<HTMLInputElement>(null)

    function onChangeImageClick(): void {
        inputImage.current?.click()
    }

    return (
        <div id="modalEditProfile">
            <div id="editProfileBox">
                <div className="topic-label-div">
                    <div className="topic">
                        <p className="topic-label-text">Edit Profile</p>
                    </div>
                    <MdClose className="close-icon" onClick={() => props.setIsShowModalEditProfile(false)} />
                </div>
                <div className="toggle-div">
                    <div className="toggle-upload-link">
                        <div className={`button-upload ${isActiveToggle.upload ? 'active' : ''}`}
                            onClick={() => setIsActiveToggle({ ...isActiveToggle, upload: true, link: false })}>Upload image</div>
                        <div className={`button-link ${isActiveToggle.link ? 'active' : ''}`}
                            onClick={() => setIsActiveToggle({ ...isActiveToggle, upload: false, link: true })}>Link image</div>
                    </div>
                </div>
                <div className="image-upload-or-link">
                    <div className="image-div">
                        <img className="image-profile" src={linkImageProfile} alt="" />
                    </div>
                    <div className="input-image-div">
                        {isActiveToggle.upload &&
                            <>
                                <input type="file" ref={inputImage} name="" className="upload-input" accept="image/*" onChange={e => {}} />
                                <button className="change-image-button" onClick={onChangeImageClick}>Change Image</button>
                            </>
                        }
                        {isActiveToggle.link && 
                            <input type="text" className="link-image-input" 
                            placeholder='Enter your link image' 
                            onChange={e => setLinkImageProfile(e.target.value)}/>
                        }
                    </div>
                </div>
                <div className="name-description">
                    <div className="name-input-div">
                        <p className="label-name">Name</p>
                        <input className="name-input" type="text" />
                    </div>
                    <div className="desc-input-div">
                        <p className="label-desc">Description</p>
                        <textarea  className="desc-input" />
                    </div>
                </div>
                <div className="button-save-div">
                    <button className="button-save">Save</button>
                </div>
            </div>
        </div>
    )
}