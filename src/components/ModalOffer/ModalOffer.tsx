import React, { useEffect, useState } from 'react'
import { FaCopy } from 'react-icons/fa'
import { MdClose } from 'react-icons/md'
import LandModel from '../../models/lands/LandModel'
import CreateOfferLandRequestModel from '../../models/offer/CreateOfferLandRequestModel'
import CreateOfferLandResponseModel from '../../models/offer/CreateOfferLandResponseModel'
import OfferService from '../../services/offer/OfferService'
import authStore from '../../store/auth'
import OffersLandRequestModel from '../../models/offer/OffersLandRequestModel'
import './ModalOffer.scss'
import OffersLandResponseModel from '../../models/offer/OffersLandResponseModel'

type Props = {
  setIsShowModalOffer: (value: boolean) => void
  landOffer: LandModel
  fetchOffer: () => void
}

export default function ModalOffer(props: Props) {
  const [offerPrice, setOfferPrice] = useState<string>('0.001')
  const [offerResponse, setOfferResponse] = useState<OffersLandResponseModel>()
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const offerService: OfferService = new OfferService

  useEffect(() => {
  }, [])

  async function createOfferLand(): Promise<void> {
    try {
      setIsLoading(true)
      const body: CreateOfferLandRequestModel = {
        landTokenId: props.landOffer.landTokenId,
        offerPrice: Number(offerPrice),
        requestUserTokenId: authStore.account.userTokenId
      }
      const result: CreateOfferLandResponseModel = await offerService.createOffer(body)
      setIsLoading(false)
      props.setIsShowModalOffer(false)
      props.fetchOffer()
    } catch (error) {
      console.error(error)
      setIsLoading(false)
    }
  }

  function onChangeOfferPrice(e: React.ChangeEvent<HTMLInputElement>) {
    let value: number = Number(e.target.value)
    if (value < 0.00001) {
      setOfferPrice('0.00001')
    } else if (value >= 0.00001) {
      setOfferPrice(e.target.value)
    }
  }

  return (
    <div id="modalOffer">
      <div id="modalOfferBox">
        <div id="topBox">
          <div className="topic">
            <p className='text-topic'>offer this land</p>
          </div>
          <MdClose className="close-icon" onClick={() => props.setIsShowModalOffer(false)}/>
        </div>
        <div id="imageLandBox">
          <img className="image-land" src={props.landOffer.landAssets ? props.landOffer.landAssets : "/map.jpg"} alt="" />
        </div>
        <div id="landNameBox">
          <p className='land-name'>{props.landOffer.landName}</p>
        </div>
        {props.landOffer.bestOffer ?
        <div id="bestOfferBox">
          <div className="best-offer">
            <div className="profile-box">
              <img className="image-profile" src={`${props.landOffer.bestOffer?.fromUserTokenId.userProfilePic ? props.landOffer.bestOffer?.fromUserTokenId.userProfilePic : '/profile.jpg' }`} alt="" />
            </div>
            <div className="detail-best-offer">
              <div className="text-name">
                <p className='name'>{props.landOffer.bestOffer?.fromUserTokenId.userName}</p>
                <i className="fas fa-crown icon"></i>
              </div>
              <div className="user-token">
                <p className='token-id'>{props.landOffer.bestOffer?.fromUserTokenId.userTokenId}</p>
                <button className="copy" >
                  <FaCopy className='copy-icon' />
                </button>
              </div>
              <div className="tag-best-offer">
                <i className="fab fa-ethereum ether"></i>
                <p className='best-price'>Best offer : {props.landOffer.bestOffer?.offerPrice ? props.landOffer.bestOffer?.offerPrice : 0 } ETH</p>
              </div>
            </div>
          </div>
        </div>
        :
        <div id="bestOfferBox">
          <div className="best-offer">
            <p className='not-offer'>Not people offer</p>
          </div>
        </div>
        }
        <div id="offerPriceBox">
          <div className="text-price-box">
            <p className='text-bold'>Offer Price</p>
            <p className='text-grey'>(Minimum {props.landOffer.minimumOfferPrice} ETH)</p>
          </div>
          <div className="input-box">
            <input className="input" type="number" value={offerPrice} onChange={onChangeOfferPrice} />
          </div>
        </div>
        <div id="billBox">
          <div className="bill-text">
            <p className='text-format'>Platform Fee (2.5%)</p>
            <p className='text-format'>{Number(offerPrice) * 0.025} ETH</p>
          </div>
          <div className="bill-text">
            <p className='text-format'>You will receive</p>
            <p className='text-format'>{(Number(offerPrice) - Number(offerPrice) * 0.025).toFixed(6)} ETH</p>
          </div>
        </div>
        <div id="buttonBox">
          <div className="button-section">
            {!isLoading 
            ?
            <button className='button' onClick={createOfferLand}>Offer</button>
            : <button className={`button ${isLoading ? 'disable' : ''}`} onClick={createOfferLand}><i className="fas fa-spinner fa-spin"></i></button>
            }
          </div>
        </div>
      </div>
    </div>
  )
}
