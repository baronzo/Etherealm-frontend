import React, { useRef, useState } from 'react'
import './ModalEditProfile.scss'
import { MdClose } from 'react-icons/md';
import UserModel from '../../models/auth/UserModel';
import authStore from '../../store/auth';
import UserService from '../../services/user/UserService';

type Props = {
    setIsShowModalEditProfile: (value: boolean) => void
    // updateProfile: (e: React.ChangeEvent<HTMLInputElement>) => void
    fetchDetail: () => void
}

interface Status {
    upload: boolean
    link: boolean
}

export default function ModalEditProfile(props: Props) {
    const [isActiveToggle, setIsActiveToggle] = useState<Status>({ upload: true, link: false })
    const [linkImageProfile, setLinkImageProfile] = useState<string>('https://cdn.wallpapersafari.com/7/36/98MpYN.jpg')
    const inputImage = useRef<HTMLInputElement>(null)
    const userService: UserService = new UserService()
    const [profile, setProfile] = useState<UserModel>({
        userTokenId: '',
        userName: '',
        userDescription: '',
        userProfilePic: ''
    })

    function onChangeImageClick(): void {
        inputImage.current?.click()
    }

    async function updateProfile(): Promise<void> {
        const body: UserModel = {
            userTokenId: authStore.account.userTokenId,
            userName: profile.userName,
            userDescription: profile.userDescription,
            userProfilePic: profile.userProfilePic
        }
        const result: UserModel = await userService.updateUserProfile(body)
        console.log(result)
        props.fetchDetail()
        props.setIsShowModalEditProfile(false)
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
                        <input className="name-input" type="text" value={profile.userName} onChange={(e) => setProfile({...profile, userName: e.target.value})}/>
                    </div>
                    <div className="desc-input-div">
                        <p className="label-desc">Description</p>
                        <textarea  className="desc-input" value={profile.userDescription} onChange={(e) => setProfile({...profile, userDescription: e.target.value})}/>
                    </div>
                </div>
                <div className="button-save-div">
                    <button className="button-save" onClick={e => updateProfile()}>Save</button>
                </div>
            </div>
        </div>
    )
}