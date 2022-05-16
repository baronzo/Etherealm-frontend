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
import LandMarketPaginateRequestModel from '../../models/market/LandMarketPaginateRequestModel'
import LandMarketPaginateResponseModel from '../../models/market/LandMarketPaginateResponseModel'

export default function Market() {
  const contractStore = useMemo(() => new ContractStore, [])
  const [isTab, setIsTab] = useState<boolean>(true)
  const landMarketService: LandMarketService = new LandMarketService()
  const [landsMarket, setLandsMarket] = useState<Array<LandMarketModel>>([])
  const [isShowModalRenting, setIsShowModalRenting] = useState<boolean>(false)
  const history = useHistory()
  const [landsRent, setLandsRent] = useState<LandMarketPaginateResponseModel>()
  const [landsSell, setLandsSell] = useState<LandMarketPaginateResponseModel>()
  const [selectedRentLand, setSelectedRentLand] = useState<LandMarketModel>()

  useEffect(() => {
    getLandOnMarketFromAPI()
    getLandRentOnMarketByMarketType()
    getLandSellOnMarketByMarketType()
  }, [])


  function onChangeTab(isTab: boolean) {
    setIsTab(isTab)
  }

  function setSellLoading(loading: boolean, index: number): void {
    let newLand: LandMarketPaginateResponseModel = {...landsSell!}
    newLand.data[index].isLoading = loading
    newLand.data.forEach((item: LandMarketModel, loopIndex: number) => {
      item.isActive = loopIndex === index ? true : false
    })
    setLandsSell(newLand)
  }

  async function buyLandOnMarketFromApi(e: React.MouseEvent<HTMLDivElement>,index: number): Promise<void> {
    setSellLoading(true, index)
    e.stopPropagation()
    if(authStore.account.userTokenId !== landsMarket[index].ownerUserTokenId.userTokenId) {
      const isSuccess: boolean = await contractStore.buyLand(landsMarket[index].landTokenId.landTokenId, landsMarket[index].ownerUserTokenId.userTokenId, landsMarket[index].price)
      if (isSuccess) {
        await getLandSellOnMarketByMarketType()
      }
    }
    setSellLoading(false, index)
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

  async function getLandSellOnMarketByMarketType(): Promise<void> {
    const body: LandMarketPaginateRequestModel = {
      page: 1,
      marketType: 1
    }
    const result: LandMarketPaginateResponseModel = await landMarketService.getLandOnMarketByMarketType(body)
    result.data.forEach(item => {
      item.isActive = item.ownerUserTokenId.userTokenId === authStore.account.userTokenId ? false : true
      item.isLoading = false
    })
    setLandsSell(result)
  }

  async function getLandRentOnMarketByMarketType(): Promise<void> {
    const body: LandMarketPaginateRequestModel = {
      page: 1,
      marketType: 2
    }
    const result: LandMarketPaginateResponseModel = await landMarketService.getLandOnMarketByMarketType(body)
    result.data.forEach(item => {
      item.isActive = item.ownerUserTokenId.userTokenId === authStore.account.userTokenId ? false : true
      item.isLoading = false
    })
    setLandsRent(result)
  }

  function onClickRent(e: React.MouseEvent<HTMLDivElement>, item: LandMarketModel) {
    e.stopPropagation()
    setIsShowModalRenting(true)
    setSelectedRentLand(item)
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
          {isTab && landsSell?.data.map((item: LandMarketModel, index:number) => {
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
                      <div className={`button ${!item.isActive ? 'owner' : ''}`} onClick={(e) => authStore.account.userTokenId === item.landTokenId.landOwnerTokenId ? e.stopPropagation() : buyLandOnMarketFromApi(e, index)}>
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
          {
            !isTab && landsRent?.data.map((item: LandMarketModel, index:number) => {
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
                    {console.log(item)}
                      {!item.isLoading
                      ?
                        <div className={`button ${!item.isActive ? 'owner' : ''}`} onClick={(e) => authStore.account.userTokenId === item.landTokenId.landOwnerTokenId ? e.stopPropagation() : onClickRent(e, item) }>
                          { authStore.account.userTokenId === item.landTokenId.landOwnerTokenId
                            ?
                              <>
                              <i className="fas fa-home icon"></i>
                                <div className='button-buy'>Your owned land</div>
                              </>
                            :
                            <>
                              <i className="fab fa-ethereum icon"></i>
                              <div className='button-buy'>Rent {item.price} eth/{item.rentType.rentTypeText}</div>
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
      {isShowModalRenting && <ModalRenting setIsShowModalHirePurchase={setIsShowModalRenting} landDetails={selectedRentLand!} fetchDetail={getLandRentOnMarketByMarketType} />}
    </div>
  )
}
