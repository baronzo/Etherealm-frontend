import React, { useState } from 'react'
import './ModalListOnMarket.scss'
import { FaInfoCircle } from 'react-icons/fa'
import { MdClose } from 'react-icons/md'
import LandModel from '../../models/lands/LandModel'
import ListLandOnMarketRequestModel from '../../models/lands/ListLandOnMarketRequestModel'
import LandMarketService from '../../services/market/LandMarketService'
import authStore from '../../store/auth'
import ListOnMarketResponseModel from '../../models/lands/ListOnMarketResponseModel'

type Props = {
    setIsShowModalListOnMarket: (value: boolean) => void
    land: LandModel
}

interface Status {
    sell: boolean
    rent: boolean
}

export default function ModalListOnMarket(props: Props) {
    const [isActiveToggle, setIsActiveToggle] = useState<Status>({ sell: true, rent: false })
    const landMarketService = new LandMarketService()
    const [price, setPrice] = useState<number>(0)

    async function postListLandOnMarket(): Promise<void> {
        let bodyListLandOnMarket: ListLandOnMarketRequestModel = { 
            landTokenId: props.land.landTokenId,
            ownerUserTokenId: authStore.account.userTokenId,
            marketType: 1,
            price: price,
            period: null
        }
        const bodyResponse: ListOnMarketResponseModel = await landMarketService.listLandOnMarket(bodyListLandOnMarket)
    }

    return (
        <div id='modalListOnMarket'>
            <div id="detailBox">
                <div id="header">
                    <div className='title-div'>
                        <p className="title-text">List on Market</p>
                    </div>
                    <div className='close-div'>
                        <MdClose className='close-icon' onClick={() => props.setIsShowModalListOnMarket(false)}/>
                    </div>
                </div>
                <div id="detailSection">
                    <div className="image-section">
                        <img className='land-image' src="./map.jpg" alt="" />
                        <div className='land-name'>
                            <p className='land-name-text'>{props.land.landName}</p>
                            <FaInfoCircle className='icon-info' />
                        </div>
                    </div>
                    <div className="detail-section">
                        <div className='toggle-sell-rent'>
                            <div className={`button-sell ${isActiveToggle.sell ? 'active' : ''}`}
                                onClick={() => setIsActiveToggle({ ...isActiveToggle, sell: true, rent: false })}>For Sell</div>
                            <div className={`button-rent ${isActiveToggle.rent ? 'active' : ''}`}
                                onClick={() => setIsActiveToggle({ ...isActiveToggle, sell: false, rent: true })}>For Rent</div>
                        </div>
                        {isActiveToggle.sell &&
                            <div className="detail-sell">
                                <div className='price-div'>
                                    <div className="text-price">Price (ETH)</div>
                                    <div className="input-price-div">
                                        <input type="number" className='input-price' 
                                        onChange={e => {setPrice(Number(e.target.value))}}/>
                                    </div>
                                </div>
                                <div className='fee-div'>
                                    <div className='fee-item'>
                                        <div className='fee-label'><p className='fee-label-text'>Platform Fee (2.5%) 0.0 ETH</p></div>
                                        <div className='fee-value'><p className='fee-value-text'>0.0 ETH</p></div>
                                    </div>
                                    <div className='fee-item'>
                                        <div className='fee-label'><p className='fee-label-text'>You will receive</p></div>
                                        <div className='fee-value'><p className='fee-value-text'>0.0 ETH</p></div>
                                    </div>
                                </div>
                                <div className='button-sell-div'><button className='button-sell' onClick={() => postListLandOnMarket()}>Sell</button></div>
                            </div>
                        }
                        {isActiveToggle.rent &&
                            <div className="detail-rent">
                                <div className='price-div'>
                                    <div className="text-price">Price (ETH/Month)</div>
                                    <div className="input-price-div">
                                        <input type="text" className='input-price' />
                                    </div>
                                    <div className="text-period">Period (Month)</div>
                                    <div className="input-period-div">
                                        <input type="text" className='input-period' />
                                    </div>
                                </div>
                                <div className='fee-div'>
                                    <div className='fee-item'>
                                        <div className='fee-label'><p className='fee-label-text'>Platform Fee (2.5%) 0.0 ETH</p></div>
                                        <div className='fee-value'><p className='fee-value-text'>0.0 ETH</p></div>
                                    </div>
                                    <div className='fee-item'>
                                        <div className='fee-label'><p className='fee-label-text'>You will receive</p></div>
                                        <div className='fee-value'><p className='fee-value-text'>0.0 ETH</p></div>
                                    </div>
                                </div>
                                <div className='button-rent-div'><button className='button-sell'>Rent out</button></div>
                            </div>
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}