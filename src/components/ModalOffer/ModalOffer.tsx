import React from 'react'
import { FaCopy } from 'react-icons/fa'
import { MdClose } from 'react-icons/md'
import authStore from '../../store/auth'
import './ModalOffer.scss'

export default function ModalOffer() {
  return (
    <div id="modalOffer">
      <div id="modalOfferBox">
        <div id="topBox">
          <div className="topic">
            <p className='text-topic'>offer this land</p>
          </div>
          <MdClose className="close-icon" />
        </div>
        <div id="imageLandBox">
          <img className="image-land" src="./map.jpg" alt="" />
        </div>
        <div id="landNameBox">
          <p className='land-name'>Dome Land</p>
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
            <p className='text-grey'>(Minimum 0.001 ETH)</p>
          </div>
          <div className="input-box">
            <input className="input" type="text" />
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
            <button className='button'>offer</button>
          </div>
        </div>
      </div>
    </div>
  )
}
