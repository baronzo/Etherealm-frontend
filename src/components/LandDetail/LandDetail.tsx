import React, { useEffect, useState } from 'react'
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
  const [isShowListOnMarket, setIsShowListOnMarket] = useState(false)
  
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
    }else {
      setIsOwner(false)
    }
    console.log(isOwner)
  }

  function goToEditPage(landTokenId: string) {
    history.push(`/lands/${landTokenId}/edit`)
}

  return (
    <div id="landDetail">
      <div id="detailBox">
        <div id="header">
          <BiArrowBack className="icon-back" onClick={history.goBack}/>
          <div className="title-text">{landDetails.landName}</div>
          <div className="edit-and-tag">
            {isOwner &&  <div className="edit-land" onClick={() => goToEditPage(landDetails.landTokenId)}><BsFillGearFill className="edit-icon"/> Edit this land</div>}
            <div className="tags">{landDetails.landStatus.landStatusName}</div>
          </div>
        </div>
        <div id="detailSection">
          <div className="image-section">
            <img className="image-land" src="/map.jpg" alt="" />
          </div>
          <div className="detail-section">
            <div className="detail-desc">
              <div className="text-title">Description</div>
              <div className="text-description">{landDetails.landDescription}</div>
            </div>
            <div className="detail-url">
              <div className="text-title">URL</div>
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
              <div className="profile-box">
                <div className="image-box">
                  <img className="profile-image" src="https://cdn.wallpapersafari.com/7/36/98MpYN.jpg" alt=""/>
                </div>
                <div className="detail-profile">
                  <div className="name">Anicha</div>
                  <div className="box">
                    <div className="token-id">{ownerDetails.userTokenId}</div>
                    <button className="copy">
                      <FaCopy className='copy-icon' />
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="offer">
              {landDetails.landStatus.landStatusId === 1 && <button className='button-offer'>offer</button>}
              {landDetails.landStatus.landStatusId === 3 && <button className="button-price-land">Buy 0.5 eth</button>}
              {isOwner && (landDetails.landStatus.landStatusId === 2) && <button className="button-price-land">List on Market</button>}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
