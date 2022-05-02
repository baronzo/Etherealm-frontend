import React, { useState } from 'react'
import { FaCopy } from 'react-icons/fa'
import { MdClose } from 'react-icons/md'
import LandModel from '../../models/lands/LandModel'
import CreateOfferLandRequestModel from '../../models/offer/CreateOfferLandRequestModel'
import CreateOfferLandResponseModel from '../../models/offer/CreateOfferLandResponseModel'
import OfferService from '../../services/offer/OfferService'
import authStore from '../../store/auth'
import './ModalOffer.scss'

type Props = {
  setIsShowModalOffer: (value: boolean) => void
  landOffer: LandModel
}

export default function ModalOffer(props: Props) {
  const [offerPrice, setOfferPrice] = useState<string>('0.001')
  const offerService: OfferService = new OfferService

  async function createOfferLand() {
    const body: CreateOfferLandRequestModel = {
      landTokenId: props.landOffer.landTokenId,
      offerPrice: Number(offerPrice),
      requestUserTokenId: props.landOffer.landOwnerTokenId
    }
    const result: CreateOfferLandResponseModel = await offerService.createOffer(body)
    console.log(result)
  }

  function onChangeOfferPrice(e: React.ChangeEvent<HTMLInputElement>) {
    let value: number = Number(e.target.value)
    if (value < 0.001) {
      setOfferPrice('0.00001')
    } else if (value >= 0.001) {
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
          <img className="image-land" src={props.landOffer.landAssets} alt="" />
        </div>
        <div id="landNameBox">
          <p className='land-name'>{props.landOffer.landName}</p>
        </div>
        <div id="bestOfferBox">
          <div className="best-offer">
            <div className="profile">
              <img className="image-profile" src="/profile.jpg" alt="" />
            </div>
            <div className="detail-best-offer">
              <div className="text-name">
                <p className='name'>Udomsak</p>
                <i className="fas fa-crown icon"></i>
              </div>
              <div className="user-token">
                <p className='token-id'>{authStore.account.userTokenId}</p>
                <button className="copy" >
                  <FaCopy className='copy-icon' />
                </button>
              </div>
              <div className="tag-best-offer">
                <i className="fab fa-ethereum ether"></i>
                <p className='best-price'>Best offer: 999 eth</p>
              </div>
            </div>
          </div>
        </div>
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
            <p className='text-format'>0.0 ETH</p>
          </div>
          <div className="bill-text">
            <p className='text-format'>You will receive</p>
            <p className='text-format'>0.0 ETH</p>
          </div>
        </div>
        <div id="buttonBox">
          <div className="button-section">
            <button className='button' onClick={createOfferLand}>offer</button>
          </div>
        </div>
      </div>
    </div>
  )
}
