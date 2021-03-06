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
import CancelOfferLandRequestModel from '../../../models/offer/CancelOfferLandRequestModel'
import OffersDataOfLandModel from '../../../models/offer/OffersDataOfLandModel'
import OfferService from '../../../services/offer/OfferService'
import ModalRentingOnRent from '../../ModalRentingOnRent/ModalRentingOnRent'
import ModalRentingDetail from '../../ModalRentingDetail/ModalRentingDetail'
import LandRentResponseModel from '../../../models/rent/LandRentResponseModel'
import ModalLoadingPage from '../../ModalLoadingPage/ModalLoadingPage'
import { ToastContainer } from 'react-toastify'

interface IParams {
    userTokenId: string
}

type Props = {}

export default function OthersProfile({ }: Props) {
    const [isShowModalDetailRenting, setIsShowModalDetailRenting] = useState<boolean>(false)
    const [selectedLand, setselectedLand] = useState<LandModel>(new LandModel)
    const [ownedLand, setownedLand] = useState<Array<LandModel>>([])
    const [ownedRentLand, setownedRentLand] = useState<Array<LandRentResponseModel>>([])
    const [userDetails, setUserDetails] = useState<UserModel>(new UserModel())
    const [isShowModalOffer, setIsShowModalOffer] = useState<boolean>(false)
    const landService: LandService = new LandService()
    const userSerive: UserService = new UserService()
    const params: IParams = useParams()
    const offerService: OfferService = new OfferService()
    const [loadingPage, setLoadingPage] = useState<boolean>(false)

    useEffect(() => {
        getDataFromAPI()
    }, [])
    
    async function getLandByOwnerTokenId(): Promise<void> {
        const result: Array<LandModel> = await landService.getLandByOwnerTokenId(params.userTokenId)
        for await (let item of result) {
            const isOffer: boolean = await getCheckIsHaveMyOfferAPI(item.landTokenId, authStore.account.userTokenId)
            item.isOffer = isOffer
        }
        setownedLand(result)
    }

    async function getUserDetails(): Promise<void>{
        const result: UserModel = await userSerive.getUserDetailsByTokenId(params.userTokenId)
        setUserDetails(result)
    }

    async function getDataFromAPI(): Promise<void> {
        setLoadingPage(true)
        await  getLandByOwnerTokenId()
        await getUserDetails()
        setLoadingPage(false)
    }

    async function getCheckIsHaveMyOfferAPI(landTokenId: string, ownerTokenId: string): Promise<boolean> {
        let bodyRequest: CancelOfferLandRequestModel = {
            landTokenId: landTokenId,
            requestUserTokenId: ownerTokenId,
        };
        const offerLandResponse: OffersDataOfLandModel = await offerService.getCheckIsHaveMyOffer(bodyRequest);
        if (!offerLandResponse) {
            return false
        }
        return true
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
            {isShowModalDetailRenting && <ModalRentingDetail setIsShowModalDetailRenting={setIsShowModalDetailRenting} land={selectedLand}/>}
            {<ToastContainer theme='colored' style={{marginTop: '50px'}}/>}
            {loadingPage && <ModalLoadingPage/>}
        </div>
    )
}