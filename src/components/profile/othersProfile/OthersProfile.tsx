import React, { useEffect, useState } from 'react'
import './OtherProfile.scss'
import { FaEthereum, FaCopy } from 'react-icons/fa'
import ShowLands from '../showLands/ShowLands'
import LandModel from '../../../models/lands/LandModel'
import LandService from '../../../services/lands/LandService'
import authStore from '../../../store/auth'
import { useParams } from 'react-router-dom'
import UserModel from '../../../models/auth/UserModel'
import UserService from '../../../services/user/UserService'
import ShowLandsOtherProfile from '../showLandsOtherProfile/ShowLandsOtherProfile'
import ModalOffer from '../../ModalOffer/ModalOffer'

interface IParams {
    userTokenId: string
}

type Props = {}

export default function OthersProfile({ }: Props) {
    const [isShowModalDetailRenting, setIsShowModalDetailRenting] = useState<boolean>(false)
    const [selectedLand, setselectedLand] = useState<LandModel>(new LandModel)
    const [ownedLand, setownedLand] = useState<Array<LandModel>>([])
    const [userDetails, setUserDetails] = useState<UserModel>(new UserModel())
    const [isShowModalOffer, setIsShowModalOffer] = useState<boolean>(true)
    const landService: LandService = new LandService()
    const userSerive: UserService = new UserService()
    const params: IParams = useParams()

    useEffect(() => {
        getDataFromAPI()
    }, [])
    
    async function getLandByOwnerTokenId(): Promise<void> {
        const result: Array<LandModel> = await landService.getLandByOwnerTokenId(params.userTokenId)
        setownedLand(result)
    }

    async function getUserDetails(): Promise<void>{
        const result: UserModel = await userSerive.getUserDetailsByTokenId(params.userTokenId)
        setUserDetails(result)
    }

    async function getDataFromAPI(): Promise<void> {
        await  getLandByOwnerTokenId()
        await getUserDetails()
    }

    return (
        <div id='otherProfileMain'>
            <div className='profile'>
                <div className='profile-container'>
                    <div className='profile-card'>
                        <div className='profile-image-div'>
                            <img className='profle-image' src={userDetails.userProfilePic ? userDetails.userProfilePic : "/profile.jpg"} alt="" />
                        </div>
                        <div className='name-div'>
                            <p className='name'>{userDetails.userName}</p>
                        </div>
                        <div className='wallet-div'>
                            <p className='addreess'>{userDetails.userTokenId}</p>
                            <div className='copy-buuton'>
                                <FaCopy className='copy-icon' onClick={() => { navigator.clipboard.writeText(userDetails.userTokenId)}}/>
                            </div>
                        </div>
                        <div className='user-description-div'>
                            <div className='user-description'>
                                <p className='text-description'>{userDetails.userDescription}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className='my-land'>
                <ShowLandsOtherProfile
                    allLands={ownedLand}
                    setselectedLand={setselectedLand}
                    setIsShowModalDetailRenting={setIsShowModalDetailRenting}
                    fetchDetail={getDataFromAPI}
                    setIsShowModalOffer={setIsShowModalOffer}
                />
            </div>
            {isShowModalOffer && <ModalOffer setIsShowModalOffer={setIsShowModalOffer} landOffer={selectedLand} fetchOffer={getDataFromAPI}/>}
        </div>
    )
}