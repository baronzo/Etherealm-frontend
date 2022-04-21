import React, { useEffect, useState } from 'react'
import { MdLocationOn } from 'react-icons/md'
import { FaGavel } from 'react-icons/fa'
import LandModel from '../../models/lands/LandModel'
import BuyLandOnMarketRequestModel from '../../models/lands/BuyLandOnMarketRequestModel'
import '../Market/Market.scss'
import LandMarketModel from '../../models/lands/LandMarketModel'
import LandMarketService from '../../services/market/LandMarketService'
import authStore from '../../store/auth'
import { useHistory } from 'react-router-dom'

export default function Market() {
  const [isTab, setIsTab] = useState<boolean>(true)
  const landMarketService: LandMarketService = new LandMarketService()
  const [landsMarket, setLandsMarket] = useState<Array<LandMarketModel>>([])
  const history = useHistory()

  useEffect(() => {
    getLandOnMarketFromAPI()
  }, [])


  function onChangeTab(isTab: boolean) {
    setIsTab(isTab)
  }

  async function buyLandOnMarketFromApi(e: React.MouseEvent<HTMLDivElement>,index: number): Promise<void> {
    e.stopPropagation()
    const body: BuyLandOnMarketRequestModel = {
      fromUserTokenId: landsMarket[index].ownerUserTokenId.userTokenId,
      toUserTokenId: authStore.account.userTokenId,
      landTokenId: landsMarket[index].landTokenId.landTokenId
    }
    if(authStore.account.userTokenId !== landsMarket[index].ownerUserTokenId.userTokenId) {
      const result: LandModel = await landMarketService.buyLandOnMarket(body)
    }
  }

  async function getLandOnMarketFromAPI(): Promise<void> {
    const result: Array<LandMarketModel> = await landMarketService.getLandsOnMarket()
    result.map((item) => {
      item.isActive = false
      item.ownerUserTokenId.userTokenId === authStore.account.userTokenId ? item.isActive = false : item.isActive = true
    })
    setLandsMarket(result)
  }

  const goToLandDetail = (landToketId: string) => {
    history.push(`/lands/${landToketId}/details`)
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
          {landsMarket.map((item: LandMarketModel, index:number) => {
            return(
              <div className='land-card' key={item.landMarketId} onClick={() => goToLandDetail(item.landTokenId.landTokenId)}>
                <div className='land-image-div'>
                  <img className='land-image' src={item.landTokenId.landAssets ? item.landTokenId.landAssets : '/map.jpg'} alt="" />
                </div>
                <div className='land-detail'>
                  <div className='name-location'>
                    <div className='land-name'>
                      <p className='land-name-text'>{item.landTokenId.landName}</p>
                    </div>
                    <div className='location-div'>
                      <MdLocationOn className='location-icon' />
                      <p className='location'>X: {item.landTokenId.landLocation.split(',')[0]}, Y: {item.landTokenId.landLocation.split(',')[1]}</p>
                    </div>
                    <div className='wallet-div'>
                      <p className='owner-wallet'>{item.landTokenId.landOwnerTokenId}</p>
                    </div>
                  </div>
                    <div className={`button ${!item.isActive ? 'owner' : ''}`} onClick={(e) => buyLandOnMarketFromApi(e, index)}>
                      <i className="fab fa-ethereum icon"></i>
                      <div className='button-buy'>Buy {item.price} eth</div>
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
