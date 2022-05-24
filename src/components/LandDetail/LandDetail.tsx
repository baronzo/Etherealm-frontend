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
import ModalOfferList from '../ModalOfferList/ModalOfferList'
import ModalRentingDetail from '../ModalRentingDetail/ModalRentingDetail'
import RentService from '../../services/rent/RentService'
import RentingDetailsModel from '../../models/rent/RentingDetailsModel'
import ModalRenting from '../ModalRenting/ModalRenting'
import LandMarketModel from '../../models/market/LandMarketModel'
import HirePurchaseDetailResponseModel from '../../models/hirePurchase/HirePurchaseDetailResponseModel'
import HirePurchaseService from '../../services/hirePurchase/HirePurchaseService'
import ModalLoadingPage from '../ModalLoadingPage/ModalLoadingPage'
import { ToastContainer } from 'react-toastify'
import Notify from '../notify/Notify'

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
  const [isShowModalOffreList, setIsShowModalOffreList] = useState<boolean>(false)
  const contractStore = useMemo(() => new ContractStore, [])
  const landMarketService: LandMarketService = new LandMarketService()
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isShowCancelOffer, setIsShowCancelOffer] = useState<boolean>(false)
  const [isCancelLoading, setisCancelLoading] = useState<boolean>(false)
  const [isYourBestOffer, setIsYourBestOffer] = useState<boolean>(false)
  const [isShowModalDetailRenting, setIsShowModalDetailRenting] = useState<boolean>(false)
  const rentService = new RentService()
  const [rentingDetails, setRentingDetails] = useState<RentingDetailsModel>(new RentingDetailsModel())
  const [isShowModalrenting, setIsShowModalrenting] = useState<boolean>(false)
  const [landDetailsForRenting, setLandDetailsForRenting] = useState<LandMarketModel>(new LandMarketModel())
  const marketService = new LandMarketService()
  const [renter, setRenter] = useState<RentingDetailsModel>(new RentingDetailsModel)
  const hirePurchaseService: HirePurchaseService = new HirePurchaseService()
  const [hirePurchase, setHirePurchase] = useState<HirePurchaseDetailResponseModel>(new HirePurchaseDetailResponseModel())
  const [isLoadingBuy, setIsLoadingBuy] = useState<boolean>(false)
  const [loadingPage, setLoadingPage] = useState<boolean>(false)

  useEffect(() => {
    getDataFromApi()
  }, [])

  async function getDataFromApi(): Promise<void> {
    setLoadingPage(true)
    await getLandDetailsFromApi()
    await getLandRentingAPI()
    await getDetailHiringAPI()
    setTimeout(() => {
      setLoadingPage(false)
    }, 1100);
  }
  
  async function getLandDetailsFromApi(): Promise<void> {
    const result: LandModel = await landService.getLandByLandTokenId(params.landTokenId)
    console.log(result)
    setlandDetails(result)
    checkYouIsBestOffer(result)
    await getOwnerDetailsFromUserTokenId(result.landOwnerTokenId)
    checkLandOwner(result.landOwnerTokenId)
    await getCheckIsHaveMyOfferAPI(result.landTokenId, authStore.account.userTokenId)
    await getIsRenter(result.landTokenId)
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
    setIsLoadingBuy(true)
    try {
      if (authStore.account.userTokenId !== landDetails.landOwnerTokenId) {
        const isSuccess: boolean = await contractStore.buyLand(landDetails.landTokenId, landDetails.landOwnerTokenId, Number(landDetails.price))
        if (isSuccess) {
          setTimeout(() => {
            getLandDetailsFromApi()
            setIsLoadingBuy(false)
          }, 1500);
        }
        Notify.notifySuccess('Buy this land successfully')
      }
    } catch (error) {
      Notify.notifyError('Buy this land failed !!')
    }
  }

  async function cancelLandOnMarketAPI(landTokenId: string, ownerTokenId: string): Promise<void> {
    setIsLoading(true)
    let bodyCancel: CancelListedOnMarketRequestModel = { landTokenId: landTokenId, ownerTokenId: ownerTokenId }
    try {
      const cancelIsSuccess: string = await landMarketService.cancelListedOnMarket(bodyCancel)
      if (cancelIsSuccess) {
        setTimeout(() => {
          getLandDetailsFromApi()
          setIsLoading(false)
        }, 1500);
        Notify.notifySuccess('Cancel land list on market successfully')
      }
    } catch (error) {
      Notify.notifyError('Cancel land list on market failed !!')
    }
  }

  async function getCheckIsHaveMyOfferAPI(landTokenId: string, ownerTokenId: string): Promise<void> {
    let bodyRequest: CancelOfferLandRequestModel = { landTokenId: landTokenId, requestUserTokenId: ownerTokenId }
    const offerLandResponse: OffersDataOfLandModel = await offerService.getCheckIsHaveMyOffer(bodyRequest)
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
    try {
      const cancelOfferResponse: OffersDataOfLandModel = await offerService.cancelOffering(bodyOfferingRequest);
      if (cancelOfferResponse) {
        setTimeout(() => {
          getLandDetailsFromApi()
          setisCancelLoading(false)
          setIsShowCancelOffer(false)
        }, 1300);
      }
      Notify.notifySuccess('Cancel offering this land successfully')
    } catch (error) {
      Notify.notifyError('Cancel offering this land failed !!')
    }
  }

  const checkYouIsBestOffer = (result: LandModel): void => {
    if (result.bestOffer?.fromUserTokenId.userTokenId === authStore.account.userTokenId) {
      setIsYourBestOffer(true)
    }
  }

  const getLandRentingAPI = async (): Promise<void> => {
    const landResponse = await marketService.getLandForRintingDetail(params.landTokenId)
    if (landResponse) {
      setLandDetailsForRenting(landResponse)
    }
  }

  async function getIsRenter(landTokenId: string): Promise<void> {
    const result: RentingDetailsModel = await rentService.getRentingDetailsByLandTokenId(landTokenId)
    setRenter(result)
  }

  async function getDetailHiringAPI() {
    const result: HirePurchaseDetailResponseModel = await hirePurchaseService.getHirePurchaseDetail(params.landTokenId)
    setHirePurchase(result)
  }

  function onLandWebsiteClick(): void {
    window.open(landDetails.landUrl, '_blank')
  }

  return (
    <>
      <div id="landDetail">
        <div id="detailBox">
          <div id="header">
            <BiArrowBack className="icon-back" onClick={history.goBack} />
            <div className="title-text">{landDetails.landName}</div>
            <div className="edit-and-tag">
              {isOwner && landDetails.landStatus.landStatusId === 2 && <div className="edit-land" onClick={() => goToEditPage(landDetails.landTokenId)}><BsFillGearFill className="edit-icon" /> Edit this land</div>}
              {landDetails.landStatus.landStatusId === 6 && hirePurchase.renterTokenId.userTokenId === authStore.account.userTokenId && <button className='detail-rent' onClick={() => setIsShowModalDetailRenting(true)}><i className="far fa-file-alt icon-doc"></i></button> }
              {landDetails.landStatus.landStatusId === 6 && hirePurchase.renterTokenId.userTokenId === authStore.account.userTokenId && <div className="edit-land" onClick={() => goToEditPage(hirePurchase.landTokenId.landTokenId)}><BsFillGearFill className="edit-icon" /> Edit this land</div>}
              {landDetails.landStatus.landStatusId === 5 && !isOwner && <button className='detail-rent' onClick={() => setIsShowModalDetailRenting(true)}><i className="far fa-file-alt icon-doc"></i></button> }
              {landDetails.landStatus.landStatusId === 5 && isOwner && <button className='detail-rent' onClick={() => setIsShowModalDetailRenting(true)}><i className="far fa-file-alt icon-doc"></i></button> }
              {authStore.account.userTokenId === renter.renterTokenId.userTokenId && <div className="edit-land" onClick={() => goToEditPage(renter.landTokenId.landTokenId)}><BsFillGearFill className="edit-icon" /> Edit this land</div>  }
              <div className="tags">{landDetails.landStatus.landStatusName}</div>
            </div>
          </div>
          <div id="detailSection">
            <div className="image-section">
              <img className="image-land" src={landDetails.landAssets ? landDetails.landAssets : "/default.jpg"} alt="" />
            </div>
            <div className="detail-section">
              <div className="detail-desc">
                <div className="text-title">Description</div>
                <div className="text-description">{landDetails.landDescription}</div>
              </div>
              <div className="detail-url">
                <div className="text-title">Link</div>
                <div className="text-url" onClick={onLandWebsiteClick}>{landDetails.landUrl ? landDetails.landUrl : '-'}</div>
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
                { landDetails.landStatus.landStatusId === 6 ?
                <div className="profile-box" onClick={() => goToProfile(hirePurchase.renterTokenId.userTokenId)}>
                  <div className="image-box">
                    <img className="profile-image" src={hirePurchase.renterTokenId.userProfilePic || '/profile.jpg'} alt="" />
                  </div>
                  <div className="detail-profile">
                    <div className="name">{hirePurchase.renterTokenId.userName ? hirePurchase.renterTokenId.userName : '-'}</div>
                    <div className="box">
                      <div className="token-id">{hirePurchase.renterTokenId.userTokenId}</div>
                      <button className="copy" onClick={(e) => copyAddess(e)}>
                        <FaCopy className='copy-icon' />
                      </button>
                    </div>
                  </div>
                </div>
                :
                <>
                  {landDetails.landStatus.landStatusId === 5
                    ?
                    <div className="profile-box" onClick={() => goToProfile(renter.renterTokenId.userTokenId)}>
                      <div className="image-box">
                        <img className="profile-image" src={renter.renterTokenId.userProfilePic || '/profile.jpg'} alt="" />
                      </div>
                      <div className="detail-profile">
                        <div className="name">{renter.renterTokenId.userName ? renter.renterTokenId.userName : '-'} <p className='role'>(Renter)</p></div>
                        <div className="box">
                          <div className="token-id">{renter.renterTokenId.userTokenId}</div>
                          <button className="copy" onClick={(e) => copyAddess(e)}>
                            <FaCopy className='copy-icon' />
                          </button>
                        </div>
                      </div>
                    </div>
                    :
                    <div className="profile-box" onClick={() => goToProfile(ownerDetails.userTokenId)}>
                      <div className="image-box">
                        <img className="profile-image" src={ownerDetails.userProfilePic || '/profile.jpg'} alt="" />
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
                  }
                </>
                
                }
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
                          (<button className='cancel-offer' onClick={() => cancelOffering(landDetails.landTokenId)}>Cancel Offering</button>)
                          :
                          (<button className="cancel-offer"><i className="fas fa-spinner fa-spin"></i></button>)
                        }
                      </>
                    }
                  </div>
                }
                {!isOwner && landDetails.landStatus.landStatusId === 3 && (
                  !isLoadingBuy ? <button className={`button-price-land ${!authStore.validateIsLogin() ? 'disable' : ''}`} onClick={() => authStore.validateIsLogin() ? buyLandDetailOnMarketFromApi(landDetails) : undefined}>Buy {landDetails.price} eth</button> 
                  :
                  <button className="button-price-land"><i className="fas fa-spinner fa-spin"></i></button>
                )}
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
                {isOwner && landDetails.landStatus.landStatusId === 2 && <button className='button-view-offer' onClick={() => setIsShowModalOffreList(true)}>View offer list</button>}
                {isOwner && landDetails.landStatus.landStatusId === 4 && 
                  <div className='cancel-rent'>
                    <p className='text-price'>Listed on market for {landDetailsForRenting.price} ETH / {landDetailsForRenting.rentType.rentTypeText}</p>
                    {!isLoading ?
                      (<button className="button-cancel-land" onClick={() => cancelLandOnMarketAPI(landDetails.landTokenId, ownerDetails.userTokenId)}>Cancel Listing</button>)
                      :
                      (<button className="button-cancel-land"><i className="fas fa-spinner fa-spin"></i></button>)
                    }
                  </div>
                }
                {!isOwner && landDetails.landStatus.landStatusId === 4 && 
                  <div className='cancel-rent'>
                    <p className='text-price'>Payable {landDetails.price} ETH / {landDetailsForRenting.rentType.rentTypeText}</p>
                    <button className="button-price-land" onClick={() => setIsShowModalrenting(true)}>Rent {landDetails.price} ETH / {landDetailsForRenting.rentType.rentTypeText}</button>
                  </div>
                }
                { authStore.account.userTokenId === renter.renterTokenId.userTokenId ?
                  <div className='payable'>
                    <p className='text-price'>Payable {landDetails.price} ETH / {renter.rentType.rentTypeText}</p>
                    {renter.rentType.rentTypeId === 2 && <p className='text-price'>Next payment {new Date(renter.nextPayment!).toLocaleString().replace(',', '')}</p>}
                    { new Date(Date.now()).toLocaleString().replace(',', '').slice(0, 9) === new Date(renter.nextPayment!).toLocaleString().replace(',', '').slice(0, 9) ?<button className="button-payable">Pay {landDetails.price} ETH</button> : ''}
                  </div>
                  : ''
                }
                {landDetails.landStatus.landStatusId === 6 && hirePurchase.renterTokenId.userTokenId === authStore.account.userTokenId && 
                  <div className='cancel-rent'>
                    <p className='text-price'>Payable {hirePurchase.price} ETH / Month</p>
                    <p className='text-price'>(Next Payment {new Date(hirePurchase.nextPayment).toLocaleString().replace(',', '')})</p>
                    { new Date(Date.now()).toLocaleString().replace(',', '').slice(0, 9) === new Date(hirePurchase.nextPayment!).toLocaleString().replace(',', '').slice(0, 9) ? <button className="button-price-land">Pay {landDetails.price} ETH </button> : ''}
                  </div>
                }
                {landDetails.landStatus.landStatusId === 6 && hirePurchase.renterTokenId.userTokenId !== authStore.account.userTokenId &&
                  <div className='cancel-rent'>
                    <p className='text-price'>Payable {hirePurchase.price} ETH / Month </p>
                  </div>
                }
              </div>
            </div>
          </div>
        </div>
      </div>
      {isShowListOnMarket && <ModalListOnMarket setIsShowModalListOnMarket={setIsShowListOnMarket} land={landDetails} fetchLands={getLandDetailsFromApi}/>}
      {isShowEditPrice && <ModalEditPriceListing setIsShowModalEditPrice={setIsShowEditPrice} fetchDetail={getLandDetailsFromApi} landMarketDetails={landDetailsForRenting} landDetails={landDetails} />}
      {isShowModalOffer && <ModalOffer setIsShowModalOffer={setIsShowModalOffer} landOffer={landDetails} fetchOffer={getLandDetailsFromApi} />}
      {isShowModalOffreList && <ModalOfferList setIsShowModalOfferList={setIsShowModalOffreList} land={landDetails} fetchLands={getDataFromApi}/>}
      {isShowModalDetailRenting && <ModalRentingDetail setIsShowModalDetailRenting={setIsShowModalDetailRenting} land={landDetails} />}
      {isShowModalrenting && <ModalRenting setIsShowModalRenting={setIsShowModalrenting} land={landDetailsForRenting} fetchDetail={getDataFromApi}/>}
      {<ToastContainer theme='colored' style={{marginTop: '50px'}}/>}
      {loadingPage && <ModalLoadingPage/>}
    </>
  )
}
