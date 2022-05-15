import React, { useEffect, useMemo, useState } from 'react'
import { MdLocationOn } from 'react-icons/md'
import { FaGavel } from 'react-icons/fa'
import LandModel from '../../models/lands/LandModel'
import BuyLandOnMarketRequestModel from '../../models/market/BuyLandOnMarketRequestModel'
import '../Market/Market.scss'
import LandMarketModel from '../../models/market/LandMarketModel'
import LandMarketService from '../../services/market/LandMarketService'
import authStore from '../../store/auth'
import { useHistory } from 'react-router-dom'
import ContractStore from '../../store/contract'
import ModalRenting from '../ModalRenting/ModalRenting'

export default function Market() {
  const contractStore = useMemo(() => new ContractStore, [])
  const [isTab, setIsTab] = useState<boolean>(true)
  const landMarketService: LandMarketService = new LandMarketService()
  const [landsMarket, setLandsMarket] = useState<Array<LandMarketModel>>([])
  const [isShowModalRenting, setIsShowModalRenting] = useState<boolean>(true)
  const history = useHistory()

  useEffect(() => {
    getLandOnMarketFromAPI()
  }, [])


  function onChangeTab(isTab: boolean) {
    setIsTab(isTab)
  }

  function setLoading(loading: boolean, index: number): void {
    let newLand: Array<LandMarketModel> = [...landsMarket]
    newLand[index].isLoading = loading
    newLand.forEach((item: LandMarketModel, loopIndex: number) => {
      item.isActive = loopIndex === index ? true : false
    })
    setLandsMarket(newLand)
  }

  async function buyLandOnMarketFromApi(e: React.MouseEvent<HTMLDivElement>,index: number): Promise<void> {
    setLoading(true, index)
    e.stopPropagation()
    if(authStore.account.userTokenId !== landsMarket[index].ownerUserTokenId.userTokenId) {
      const isSuccess: boolean = await contractStore.buyLand(landsMarket[index].landTokenId.landTokenId, landsMarket[index].ownerUserTokenId.userTokenId, landsMarket[index].price)
      if (isSuccess) {
        getLandOnMarketFromAPI()
      }
    }
    setLoading(false, index)
  }

  async function getLandOnMarketFromAPI(): Promise<void> {
    const result: Array<LandMarketModel> = await landMarketService.getLandsOnMarket()
    result.map((item) => {
      item.isActive = item.ownerUserTokenId.userTokenId === authStore.account.userTokenId ? false : true
      item.isLoading = false
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
                      <p className='owner-wallet'>{item.landTokenId.landTokenId}</p>
                    </div>
                  </div>
                    {!item.isLoading
                    ?
                      <div className={`button ${!item.isActive ? 'owner' : ''}`} onClick={(e) => authStore.account.userTokenId === item.landTokenId.landOwnerTokenId ? undefined : buyLandOnMarketFromApi(e, index)}>
                        { authStore.account.userTokenId === item.landTokenId.landOwnerTokenId
                          ?
                            <>
                            <i className="fas fa-home icon"></i>
                              <div className='button-buy'>Your owned land</div>
                            </>
                          :
                          <>
                            <i className="fab fa-ethereum icon"></i>
                            <div className='button-buy'>Buy {item.price} ETH</div>
                          </>
                            
                        }
                        
                      </div>
                    :
                      <div className={`button ${item.isLoading ? 'loading' : ''}`}>
                        <i className="fas fa-spinner fa-spin"></i>
                      </div>
                    }
                    
                </div>
              </div>
            )
          })}
        </div>
      </div>
      <div className='pagination-container'>
        <div className='pagination'></div>
      </div>
      {isShowModalRenting && <ModalRenting setIsShowModalHirePurchase={setIsShowModalRenting} landDetails={landsMarket[0]}/>}
    </div>
  )
}
