import React, { useEffect, useRef, useState } from 'react'
import './ModalEditProfile.scss'
import { MdClose } from 'react-icons/md';
import UserModel from '../../models/auth/UserModel';
import authStore from '../../store/auth';
import UserService from '../../services/user/UserService';
import ImageService from '../../services/imgbb/ImageService';
import ModalUploadImage from '../ModalUploadImage/ModalUploadImage';

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
    const [isActiveToggle, setIsActiveToggle] = useState(true)
    const [linkImageProfile, setLinkImageProfile] = useState<string>('')
    const inputImage = useRef<HTMLInputElement>(null)
    const userService: UserService = new UserService()
    const [profile, setProfile] = useState<UserModel>(new UserModel)
    const [base64Image, setbase64Image] = useState<string>('')
    const imageService: ImageService = new ImageService
    const [prevData, setprevData] = useState<UserModel>(new UserModel)
    const [prevImage, setPrevImage] = useState<string>('')
    const [isLoading, setisLoading] = useState(false)
    const [isShowModalUploadImage, setisShowModalUploadImage] = useState<boolean>(false)

    useEffect(() => {
        getDataFromAPI()
    }, [])

    async function getDataFromAPI(): Promise<void> {
        await getUserDetail()
    }

    async function getUserDetail(): Promise<void> {
        const result: UserModel = await userService.getUserDetailsByTokenId(authStore.account.userTokenId)
        setPrevImage(result.userProfilePic)
        setProfile(result)
        setprevData(result)
    }
    
    function onChangeImageClick(): void {
        // inputImage.current?.click()
        setisShowModalUploadImage(true)
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

    async function onImageSelected(e: HTMLInputElement): Promise<void> {
        const target: HTMLInputElement = e
        let image: FileList  = target.files as FileList 
        let type: string = image[0].type.split('/')[1]
        let base64Image = await convertImageToBase64(image[0])
        let newProfile = {...profile}
        newProfile.userProfilePic = base64Image
        base64Image = formatBase64Image(base64Image, type)
        setbase64Image(base64Image)
        setProfile(newProfile)
    }

    async function updateProfile(): Promise<void> {
        setisLoading(true)
        let imagePath: string = ''
        if (!linkImageProfile && base64Image) {
            imagePath = await imageService.postImageApi(base64Image)
        }
        const body: UserModel = {
            userTokenId: authStore.account.userTokenId,
            userName: profile.userName,
            userDescription: profile.userDescription,
            userProfilePic: linkImageProfile ? linkImageProfile : imagePath ? imagePath : profile.userProfilePic
        }
        const result: UserModel = await userService.updateUserProfile(body)
        onChangeTab(true)
        setProfile(result)
        setprevData(result)
        props.fetchDetail()
        setisLoading(false)
        props.setIsShowModalEditProfile(false)
    }

    function onChangeTab(isTab: boolean ) {
        let newImage = profile
        newImage.userProfilePic = prevData.userProfilePic
        setLinkImageProfile('')
        setProfile(newImage)
        setIsActiveToggle(isTab)
    }

    function checkDataIsChange(): boolean {
        let result: boolean = JSON.stringify(profile) === JSON.stringify(prevData) ? false : true
        if (linkImageProfile && linkImageProfile !== prevData.userProfilePic) {
            result = true
        }
        return result
    }

    function handleOnUploadImage(base64Image: string): void {
        if (base64Image) {
            let newProfile = {...profile}
            newProfile.userProfilePic = base64Image
            base64Image = formatBase64Image(base64Image, 'jpeg')
            setbase64Image(base64Image)
            setProfile(newProfile)
        }
      }

    return (
        <div id="modalEditProfile">
            {isShowModalUploadImage && <ModalUploadImage setisShowModalUploadImage={setisShowModalUploadImage} onImageCropped={handleOnUploadImage} />}
            <div id="editProfileBox">
                <div className="topic-label-div">
                    <div className="topic">
                        <p className="topic-label-text">Edit Profile</p>
                    </div>
                    <MdClose className="close-icon" onClick={() => props.setIsShowModalEditProfile(false)} />
                </div>
                {/* <div className="toggle-div">
                    <div className="toggle-upload-link">
                        <div className={`button-upload ${isActiveToggle ? 'active' : ''}`}
                            onClick={() => onChangeTab(true)}>Upload image</div>
                        <div className={`button-link ${!isActiveToggle ? 'active' : ''}`}
                            onClick={() => onChangeTab(false)}>Link image</div>
                    </div>
                </div> */}
                <div className="image-upload-or-link">
                    <div className="image-div">
                        <img className="image-profile" src={linkImageProfile ? linkImageProfile : profile.userProfilePic ? profile.userProfilePic : '/profile.jpg'} alt="" />
                    </div>
                    <div className="input-image-div">
                        {isActiveToggle &&
                            <>
                                <input type="file" ref={inputImage} name="" className="upload-input" accept="image/*" onChange={e => onImageSelected(e.target)} />
                                <button className="change-image-button" onClick={onChangeImageClick}>Change Image</button>
                            </>
                        }
                        {!isActiveToggle && 
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
                    {!isLoading
                        ?
                            <button className={`button-save ${checkDataIsChange() ? '' : 'disable'}`} onClick={e => checkDataIsChange() ? updateProfile() : undefined}>Save</button>
                        :
                            <button className={`button-save`}><i className="fas fa-spinner fa-spin"></i></button>
                    }
                </div>
            </div>
        </div>
    )
}