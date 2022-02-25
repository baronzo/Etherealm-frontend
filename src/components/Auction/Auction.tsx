import React from 'react'
import './Auction.scss'
import { MdLocationOn } from 'react-icons/md'
import { FaGavel } from 'react-icons/fa'
import Pagination from '../pagination/Pagination'

type Props = {}

export default function Auction({ }: Props) {
  return (
    <div id='auctionPageMain'>
      <div className='top'>
        <div className='auction-div'><p className='auction-text'>Auction</p></div>
      </div>
      <div className='show-land'>
        <div className='topic-div'>
          <p className='topic-text'>NFTs Lands For Auction</p>
        </div>
        <div className='auction-land-container'>
          <div className='land-card'>
            <div className='land-image-div'>
              <img className='land-image' src="/land.png" alt="" />
            </div>
            <div className='land-detail'>
              <div className='name-location'>
                <div className='land-name'>
                  <p className='land-name-text'>LAND (99, 199)</p>
                </div>
                <div className='location-div'>
                  <MdLocationOn className='location-icon' />
                  <p className='location'>X: 99, Y: 199</p>
                </div>
                <div className='wallet-div'>
                  <p className='owner-wallet'>0xcc896c2cdd10abaea84da606344x3455u8gh366989836778256dgh33</p>
                </div>
              </div>
              <div className='timer-price'>
                <div className='timer-div'>
                  <p className='timer-text'>00:00:01</p>
                </div>
                <div className='price-div'>
                  <FaGavel className='gavel-icon' />
                  <p className='price-of-land'>0.05 eth</p>
                </div>
              </div>
            </div>
          </div>
          <div className='land-card'></div>
          <div className='land-card'></div>
          <div className='land-card'></div>
          <div className='land-card'></div>
          <div className='land-card'></div>
          <div className='land-card'></div>
          <div className='land-card'></div>
          <div className='land-card'></div>
          <div className='land-card'></div>
          <div className='land-card'></div>
          <div className='land-card'></div>
          <div className='land-card'></div>
          <div className='land-card'></div>
          <div className='land-card'></div>
          <div className='land-card'></div>
          <div className='land-card'></div>
          <div className='land-card'></div>
          <div className='land-card'></div>
          <div className='land-card'></div>
        </div>
      </div>
      <div className='pagination-container'>
        <div className='pagination'></div>
      </div>
    </div>
  )
}