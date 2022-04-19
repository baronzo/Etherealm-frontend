import React, { useState, useEffect } from 'react'
import { MdLocationOn } from 'react-icons/md'
import { FaGavel } from 'react-icons/fa'
import LandMarketService from '../../services/market/LandMarketService'
import LandModel from '../../models/lands/LandModel'
import '../Market/Market.scss'

export default function Market() {
  
  const [isTab, setIsTab] = useState(true)
  const landMarketService:LandMarketService = new LandMarketService

  useEffect(() => {
    get()
  }, [])

  async function get() {
    await landMarketService.get()
  }

  function onChangeTab(isTab: boolean ) {
    setIsTab(isTab)
  }

  async function buyLandOnMarket(): Promise<void> {
    const result: LandModel = await landMarketService.buyLandOnMarket()
    console.log(result)
  }

  return (
    <div id='market'>
      <div id="menu">
        <div id="menuButton">
        <div className={`for-buy ${isTab ? 'active' : ''}`} onClick={() => onChangeTab(true)}>For Buy</div>
        <div className={`for-rent ${!isTab ? 'active' : ''}`} onClick={() => onChangeTab(false)}>For Rent</div>
        </div>
      </div>
      <div className='show-land'>
        <div className='topic-div'>
          <p className='topic-text'>NFTs Lands</p>
        </div>
        <div className='market-land-container'>
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
              <div className="button">
                <div className='button-buy' onClick={() => buyLandOnMarket()}>Buy 0.5 eth</div>
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
