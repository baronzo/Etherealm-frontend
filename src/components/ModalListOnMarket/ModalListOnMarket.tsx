import React, { useEffect, useState } from 'react'
import './ModalListOnMarket.scss'
import { FaInfoCircle } from 'react-icons/fa'
import { MdClose } from 'react-icons/md'
import LandModel from '../../models/lands/LandModel'
import ListLandOnMarketRequestModel from '../../models/lands/ListLandOnMarketRequestModel'
import LandMarketService from '../../services/market/LandMarketService'
import authStore from '../../store/auth'
import ListOnMarketResponseModel from '../../models/lands/ListOnMarketResponseModel'
import ModalLoading from '../Loading/ModalLoading'

type Props = {
    setIsShowModalListOnMarket: (value: boolean) => void
    land: LandModel
    fetchDataAPI: () => Promise<void>
}

interface Status {
    sell: boolean
    rent: boolean
}

export default function ModalListOnMarket(props: Props) {
    const [isActiveToggle, setIsActiveToggle] = useState<Status>({ sell: true, rent: false })
    const landMarketService = new LandMarketService()
    const [price, setPrice] = useState<string>('0.00001')
    const [isLoading, setisLoading] = useState<boolean>(false)
    const [totalReceive, setTotalReceive] = useState<number>(0)
    const [fee, setFee] = useState<number>(0)

    useEffect(() => {
        calculateReceive()
    }, [price])
    

    async function postListLandOnMarket(): Promise<void> {
        setisLoading(true)
        if (price !== null || price !== "" || Number(price) !== 0 || !price) {
            let bodyListLandOnMarket: ListLandOnMarketRequestModel = { 
                landTokenId: props.land.landTokenId,
                ownerUserTokenId: authStore.account.userTokenId,
                marketType: 1,
                price: Number(price),
                period: null
            }
            const bodyResponse: ListOnMarketResponseModel = await landMarketService.listLandOnMarket(bodyListLandOnMarket)
            setisLoading(false)
            props.setIsShowModalListOnMarket(false)
            props.fetchDataAPI()
        }else {
            console.log('Price null')
        }
    }

    const onChangeSellPrice = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value: number = Number(e.target.value)
        console.log(value)
        if (value < 0.00001) {
            console.log('negative')
            setPrice('0.00001')
        } else if (value >= 0.00001) {
            console.log('positive')
            setPrice(e.target.value) 
        }
    }

    const calculateReceive = () => {
        let fees = Number(price) * (2.5/100)
        let total = Number(price) + fees
        setFee(parseFloat(fees.toFixed(6)))
        setTotalReceive(parseFloat(total.toFixed(6)))
    }

    return (
        <div id='modalListOnMarket'>
            <ModalLoading isLoading={isLoading}/>
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
                        <img className='land-image' src={props.land.landAssets ? props.land.landAssets : "./map.jpg"} alt="" />
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
                                        value={price}
                                        onChange={onChangeSellPrice}/>
                                    </div>
                                </div>
                                <div className='fee-div'>
                                    <div className='fee-item'>
                                        <div className='fee-label'><p className='fee-label-text'>Platform Fee (2.5%)</p></div>
                                        <div className='fee-value'><p className='fee-value-text'>{fee} ETH</p></div>
                                    </div>
                                    <div className='fee-item'>
                                        <div className='fee-label'><p className='fee-label-text'>You will receive</p></div>
                                        <div className='fee-value'><p className='fee-value-text'>{totalReceive} ETH</p></div>
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