import React, { useEffect, useState, useMemo } from 'react'
import { MdLocationOn } from 'react-icons/md'
import { FaCopy } from 'react-icons/fa'
import { BsFillGearFill } from 'react-icons/bs'
import { BiArrowBack } from 'react-icons/bi'
import './LandDetail.scss'
import { useHistory, useParams } from 'react-router-dom'
import LandService from '../../services/lands/LandService'
import LandModel from '../../models/lands/LandModel'
import UserService from '../../services/user/UserService'
import UserModel from '../../models/auth/UserModel'
import authStore from '../../store/auth'
import BuyLandDetailOnMarketRequestModel from '../../models/market/BuyLandOnMarketRequestModel'
import ContractStore from '../../store/contract'
import LandMarketService from '../../services/market/LandMarketService'
import ModalListOnMarket from '../ModalListOnMarket/ModalListOnMarket'
import CancelListedOnMarketRequestModel from '../../models/market/CancelListedOnMarketRequestModel'
import UpdatePriceListedOnMarketRequestModel from '../../models/market/UpdatePriceListedOnMarketRequestModel'
import ListOnMarketResponseModel from '../../models/market/ListOnMarketResponseModel'
import ModalEditPriceListing from '../ModalEditPriceListing/ModalEditPriceListing'
import ModalOffer from '../ModalOffer/ModalOffer'
import OfferService from '../../services/offer/OfferService'
import CancelOfferLandRequestModel from '../../models/offer/CancelOfferLandRequestModel'
import OffersDataOfLandModel from '../../models/offer/OffersDataOfLandModel'

interface IParams {
  landTokenId: string
}

export default function LandDetail() {
  const params: IParams = useParams()
  const landService: LandService = new LandService()
  const userService: UserService = new UserService()
  const offerService: OfferService = new OfferService()
  const [landDetails, setlandDetails] = useState<LandModel>(new LandModel)
  const [ownerDetails, setownerDetails] = useState<UserModel>(new UserModel)
  const history = useHistory()
  const [isOwner, setIsOwner] = useState<boolean>(false)
  const [isShowListOnMarket, setIsShowListOnMarket] = useState<boolean>(false)
  const [isShowEditPrice, setIsShowEditPrice] = useState<boolean>(false)
  const [isShowModalOffer, setIsShowModalOffer] = useState<boolean>(false)
  const contractStore = useMemo(() => new ContractStore, [])
  const landMarketService: LandMarketService = new LandMarketService()
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isShowCancelOffer, setIsShowCancelOffer] = useState<boolean>(false)
  const [isCancelLoading, setisCancelLoading] = useState<boolean>(false)
  const [isYourBestOffer, setIsYourBestOffer] = useState<boolean>(false)

  useEffect(() => {
    getDataFromApi()
  }, [])

  async function getDataFromApi(): Promise<void> {
    await getLandDetailsFromApi()
  }

  async function getLandDetailsFromApi(): Promise<void> {
    const result: LandModel = await landService.getLandByLandTokenId(params.landTokenId)
    setlandDetails(result)
    checkYouIsBestOffer(result)
    await getOwnerDetailsFromUserTokenId(result.landOwnerTokenId)
    checkLandOwner(result.landOwnerTokenId)
    await getCheckIsHaveMyOfferAPI(result.landTokenId, authStore.account.userTokenId)
  }

  async function getOwnerDetailsFromUserTokenId(ownerTokenId: string): Promise<void> {
    const result: UserModel = await userService.getUserDetailsByTokenId(ownerTokenId)
    setownerDetails(result)
  }

  function checkLandOwner(landOwnerTokenId: string): void {
    if (landOwnerTokenId === authStore.account.userTokenId) {
      setIsOwner(true)
    } else {
      setIsOwner(false)
    }
  }

  function goToEditPage(landTokenId: string) {
    history.push(`/lands/${landTokenId}/edit`)
  }

  const goToProfile = (userToketId: string) => {
    history.push(`/profile/${userToketId}`)
  }

  const copyAddess = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.stopPropagation()
    navigator.clipboard.writeText(ownerDetails.userTokenId)
  }

  async function buyLandDetailOnMarketFromApi(landDetails: LandModel): Promise<void> {
    if (authStore.account.userTokenId !== landDetails.landOwnerTokenId) {
      const isSuccess: boolean = await contractStore.buyLand(landDetails.landTokenId, landDetails.landOwnerTokenId, Number(landDetails.price))
      if (isSuccess) {
        getLandDetailsFromApi()
      }
    }
  }

  async function cancelLandOnMarketAPI(landTokenId: string, ownerTokenId: string): Promise<void> {
    setIsLoading(true)
    let bodyCancel: CancelListedOnMarketRequestModel = { landTokenId: landTokenId, ownerTokenId: ownerTokenId }
    const cancelIsSuccess: string = await landMarketService.cancelListedOnMarket(bodyCancel)
    if (cancelIsSuccess) {
      setTimeout(() => {
        getLandDetailsFromApi()
        setIsLoading(false)
      }, 1500);
    }
  }

  async function getCheckIsHaveMyOfferAPI(landTokenId: string, ownerTokenId: string): Promise<void> {
    let bodyRequest: CancelOfferLandRequestModel = { landTokenId: landTokenId, requestUserTokenId: ownerTokenId }
    const offerLandResponse: OffersDataOfLandModel = await offerService.getCheckIsHaveMyOffer(bodyRequest)
    console.log(offerLandResponse)
    if (offerLandResponse) {
      setIsShowCancelOffer(true)
    }
  }

  const cancelOffering = async (landTokenId: string): Promise<void> => {
    setisCancelLoading(true)
    const bodyOfferingRequest: CancelOfferLandRequestModel = {
      landTokenId: landTokenId,
      requestUserTokenId: authStore.account.userTokenId
    };
    const cancelOfferResponse: OffersDataOfLandModel = await offerService.cancelOffering(bodyOfferingRequest);
    if (cancelOfferResponse) {
      setTimeout(() => {
        getLandDetailsFromApi()
        setisCancelLoading(false)
        setIsShowCancelOffer(false)
      }, 2000);
    }
  }

  const checkYouIsBestOffer = (result: LandModel): void => {
    if (result.bestOffer?.fromUserTokenId.userTokenId === authStore.account.userTokenId) {
      setIsYourBestOffer(true)
    }
  }

  return (
    <>
      <div id="landDetail">
        <div id="detailBox">
          <div id="header">
            <BiArrowBack className="icon-back" onClick={history.goBack} />
            <div className="title-text">{landDetails.landName}</div>
            <div className="edit-and-tag">
              {isOwner && <div className="edit-land" onClick={() => goToEditPage(landDetails.landTokenId)}><BsFillGearFill className="edit-icon" /> Edit this land</div>}
              <div className="tags">{landDetails.landStatus.landStatusName}</div>
            </div>
          </div>
          <div id="detailSection">
            <div className="image-section">
              <img className="image-land" src={landDetails.landAssets ? landDetails.landAssets : "/map.jpg"} alt="" />
            </div>
            <div className="detail-section">
              <div className="detail-desc">
                <div className="text-title">Description</div>
                <div className="text-description">{landDetails.landDescription}</div>
              </div>
              <div className="detail-url">
                <div className="text-title">Link</div>
                <div className="text-url">http://www.google.com</div>
              </div>
              <div className="button-section">
                <button className='button-size'>SIZE: 1x1</button>
                <button className='button-parcel'>1 PARCEL</button>
                <button className='button-coord'>
                  <div className="group">
                    <MdLocationOn className='location-icon' />
                    <div className="x-y">X:{landDetails.landLocation.x}, Y:{landDetails.landLocation.y}</div>
                  </div>
                </button>
              </div>
              <div id="profile">
                <div className="profile-box" onClick={() => goToProfile(ownerDetails.userTokenId)}>
                  <div className="image-box">
                    <img className="profile-image" src="https://cdn.wallpapersafari.com/7/36/98MpYN.jpg" alt="" />
                  </div>
                  <div className="detail-profile">
                    <div className="name">{ownerDetails.userName ? ownerDetails.userName : '-'}</div>
                    <div className="box">
                      <div className="token-id">{ownerDetails.userTokenId}</div>
                      <button className="copy" onClick={(e) => copyAddess(e)}>
                        <FaCopy className='copy-icon' />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="offer">
                {!isOwner && landDetails.landStatus.landStatusId === 2 &&
                  <div className='best-offer'>
                    <p className='text-price-offer'>{landDetails.bestOffer? `Best offer ${landDetails.bestOffer?.offerPrice} ETH ${isYourBestOffer ? " ( You )" : ''}` : "Not people offer"}</p>
                  </div>
                }
                {!isOwner && landDetails.landStatus.landStatusId === 2 &&
                  <div className='button-offer'>
                    {!isShowCancelOffer ?
                      <button className='button-offer' onClick={() => setIsShowModalOffer(true)}>offer</button>
                      :
                      <>
                        {!isCancelLoading ?
                          (
                            <button className='cancel-offer' onClick={() => cancelOffering(landDetails.landTokenId)}>Cancel Offering</button>)
                          :
                          (
                            <button className="button-cancel-land"><i className="fas fa-spinner fa-spin"></i></button>
                          )
                        }
                      </>
                    }
                  </div>
                }
                {!isOwner && landDetails.landStatus.landStatusId === 3 && <button className="button-price-land" onClick={() => buyLandDetailOnMarketFromApi(landDetails)}>Buy {landDetails.price} eth</button>}
                {isOwner && landDetails.landStatus.landStatusId === 2 && <button className="button-price-land" onClick={() => setIsShowListOnMarket(true)}>List on Market</button>}
                {isOwner && landDetails.landStatus.landStatusId === 3 &&
                  <div className='cancel-edit'>
                    <p className='text-price'>Listed on market for {landDetails.price} ETH</p>
                    {!isLoading ?
                      <button className="button-cancel-land" onClick={() => cancelLandOnMarketAPI(landDetails.landTokenId, ownerDetails.userTokenId)}>Cancel Listing</button>
                      :
                      <button className="button-cancel-land"><i className="fas fa-spinner fa-spin"></i></button>
                    }
                    <button className="button-edit-price-land" onClick={() => setIsShowEditPrice(true)} >Edit Price</button>
                  </div>
                }
                {isOwner && landDetails.landStatus.landStatusId === 2 && <button className='button-view-offer'>View offer list</button>}
              </div>
            </div>
          </div>
        </div>
      </div>
      {isShowListOnMarket && <ModalListOnMarket setIsShowModalListOnMarket={setIsShowListOnMarket} land={landDetails} fetchLands={getLandDetailsFromApi} />}
      {isShowEditPrice && <ModalEditPriceListing setIsShowModalEditPrice={setIsShowEditPrice} fetchDetail={getLandDetailsFromApi} landDetails={landDetails} />}
      {isShowModalOffer && <ModalOffer setIsShowModalOffer={setIsShowModalOffer} landOffer={landDetails} fetchOffer={getLandDetailsFromApi} />}
    </>
  )
}
