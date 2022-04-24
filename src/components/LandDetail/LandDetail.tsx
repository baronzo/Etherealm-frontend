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

interface IParams {
  landTokenId: string
}

export default function LandDetail() {
  const params: IParams = useParams()
  const landService: LandService = new LandService
  const userService: UserService = new UserService
  const [landDetails, setlandDetails] = useState<LandModel>(new LandModel)
  const [ownerDetails, setownerDetails] = useState<UserModel>(new UserModel)
  const history = useHistory()
  const [isOwner, setIsOwner] = useState<boolean>(false)
  const [isShowListOnMarket, setIsShowListOnMarket] = useState<boolean>(false)
  const [isShowEditPrice, setIsShowEditPrice] = useState<boolean>(false)
  const contractStore = useMemo(() => new ContractStore, [])
  const landMarketService: LandMarketService = new LandMarketService()
  const [isLoading, setIsLoading] = useState<boolean>(false)

  useEffect(() => {
    getLandDetailsFromApi()
  }, [])

  async function getLandDetailsFromApi(): Promise<void> {
    const result: LandModel = await landService.getLandByLandTokenId(params.landTokenId)
    setlandDetails(result)
    await getOwnerDetailsFromUserTokenId(result.landOwnerTokenId)
    checkLandOwner(result.landOwnerTokenId)
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
    const body: BuyLandDetailOnMarketRequestModel = {
      fromUserTokenId: landDetails.landOwnerTokenId,
      toUserTokenId: authStore.account.userTokenId,
      landTokenId: landDetails.landTokenId
    }
    if (authStore.account.userTokenId !== landDetails.landOwnerTokenId) {
      const isSuccess: boolean = await contractStore.buyLand(landDetails.landTokenId, landDetails.landOwnerTokenId, Number(landDetails.price))
      if (isSuccess) {
        const result: LandModel = await landMarketService.buyLandOnMarket(body)
        getLandDetailsFromApi()
      }
    }
  }

  async function cancelLandOnMarketAPI(landTokenId: string, ownerTokenId: string): Promise<void> {
    setIsLoading(true)
    let bodyCancel: CancelListedOnMarketRequestModel = {landTokenId: landTokenId, ownerTokenId: ownerTokenId}
    const cancelIsSuccess: string = await landMarketService.cancelListedOnMarket(bodyCancel)
    if (cancelIsSuccess) {
      setTimeout(() => {
        getLandDetailsFromApi()
        setIsLoading(false)
      }, 1500);
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
                <div className="text-description">It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.</div>
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
                {!isOwner && landDetails.landStatus.landStatusId === 2 && <button className='button-offer'>offer</button>}
                {!isOwner && landDetails.landStatus.landStatusId === 3 && <button className="button-price-land" onClick={() => buyLandDetailOnMarketFromApi(landDetails)}>Buy {landDetails.price} eth</button>}
                {isOwner && (landDetails.landStatus.landStatusId === 2) && <button className="button-price-land" onClick={() => setIsShowListOnMarket(true)}>List on Market</button>}
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
              </div>
            </div>
          </div>
        </div>
      </div>
      {isShowListOnMarket && <ModalListOnMarket setIsShowModalListOnMarket={setIsShowListOnMarket} land={landDetails} fetchLands={getLandDetailsFromApi}/>}
      {isShowEditPrice && <ModalEditPriceListing setIsShowModalEditPrice={setIsShowEditPrice} fetchDetail={getLandDetailsFromApi} landDetails={landDetails}/>}
    </>
  )
}
