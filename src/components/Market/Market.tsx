import React, { useEffect, useState } from 'react'
import { MdLocationOn } from 'react-icons/md'
import { FaGavel } from 'react-icons/fa'
import LandModel from '../../models/lands/LandModel'
import '../Market/Market.scss'
import LandMarketModel from '../../models/lands/LandMarketModel'
import LandMarketService from '../../services/market/LandMarketService'

export default function Market() {
  const [isTab, setIsTab] = useState<boolean>(true)
  const landMarketService: LandMarketService = new LandMarketService()
  const [landsMarket, setLandsMarket] = useState<Array<LandMarketModel>>([])

  useEffect(() => {
    getLandOnMarketFromAPI()
  }, [])


  function onChangeTab(isTab: boolean) {
    setIsTab(isTab)
  }

  async function buyLandOnMarket(): Promise<void> {
    const result: LandModel = await landMarketService.buyLandOnMarket()
    console.log(result)
  }

  async function getLandOnMarketFromAPI(): Promise<void> {
    const result: Array<LandMarketModel> = await landMarketService.getLandsOnMarket()
    console.log(result)
    setLandsMarket(result)
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
          {landsMarket.map((item: LandMarketModel) => {
            console.log(item)
            return(
              <div className='land-card' key={item.landMarketId}>
                <div className='land-image-div'>
                  <img className='land-image' src={item.landTokenId.landAssets} alt="" />
                </div>
                <div className='land-detail'>
                  <div className='name-location'>
                    <div className='land-name'>
                      <p className='land-name-text'>{item.landTokenId.landName}</p>
                    </div>
                    <div className='location-div'>
                      <MdLocationOn className='location-icon' />
                      <p className='location'>{item.landTokenId.landLocation}</p>
                    </div>
                    <div className='wallet-div'>
                      <p className='owner-wallet'>{item.landTokenId.landOwnerTokenId}</p>
                    </div>
                  </div>
                  <div className="button">
                    <div className='button-buy'>{item.price}</div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
      <div className='pagination-container'>
        <div className='pagination'></div>
      </div>
    </div>
  )
}
