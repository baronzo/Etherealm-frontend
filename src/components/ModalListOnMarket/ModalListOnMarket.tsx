import React, { useEffect, useState } from 'react'
import './ModalListOnMarket.scss'
import { FaInfoCircle } from 'react-icons/fa'
import { MdClose } from 'react-icons/md'
import LandModel from '../../models/lands/LandModel'
import ListLandOnMarketRequestModel from '../../models/market/ListLandOnMarketRequestModel'
import LandMarketService from '../../services/market/LandMarketService'
import authStore from '../../store/auth'
import ListOnMarketResponseModel from '../../models/market/ListOnMarketResponseModel'
import ModalLoading from '../Loading/ModalLoading'
import Select from 'react-select'
import ReactSelectOptionModel from '../../models/reactSelect/ReactSelectOptionModel'
import RentTypeModel from '../../models/rent/RentTypeModel'
import Notify from '../notify/Notify'

type Props = {
    setIsShowModalListOnMarket: (value: boolean) => void
    fetchLands: () => void
    land: LandModel
}

interface Status {
    sell: boolean
    rent: boolean
}

export default function ModalListOnMarket(props: Props) {
    const [isActiveToggle, setIsActiveToggle] = useState<Status>({ sell: true, rent: false })
    const landMarketService = new LandMarketService()
    const [price, setPrice] = useState<number>(0.001)
    const [isLoading, setisLoading] = useState<boolean>(false)
    const [totalReceive, setTotalReceive] = useState<number>(0)
    const [fee, setFee] = useState<number>(0)
    const [rentTypes, setRentsType] = useState<Array<RentTypeModel>>([
        {
            rentTypeId: 1,
            rentTypeText: 'Day'
        },
        {
            rentTypeId: 2,
            rentTypeText: 'Month'
        }
    ])
    const [rentType, setRentType] = useState<RentTypeModel>({
        rentTypeId: 1,
        rentTypeText: 'Day'
    })
    const [typeName, setTypeName] = useState<ReactSelectOptionModel>({
        value: 1,
        label: 'Day'
    })

    useEffect(() => {
        calculateReceive()
    }, [price])

    
    async function postListLandOnMarket(): Promise<void> {
        setisLoading(true)
        if (price !== null || price !== "" || price !== 0 || !price) {
            let bodyListLandOnMarket: ListLandOnMarketRequestModel = { 
                landTokenId: props.land.landTokenId,
                ownerUserTokenId: authStore.account.userTokenId,
                marketType: 1,
                price: Number(price),
                period: null,
                rentType: null
            }
            try {
                const bodyResponse: ListOnMarketResponseModel = await landMarketService.listLandOnMarket(bodyListLandOnMarket)
                console.log(bodyResponse)
                setTimeout(() => {
                    setisLoading(false)
                    props.fetchLands()
                    props.setIsShowModalListOnMarket(false)
                }, 2000)
                Notify.notifySuccess('List for sell on market successfully') 
            } catch (error) {
                console.error(error)
                setisLoading(false)
                Notify.notifyError('List for sell on market failed !!!')  
            }
        }else {
            console.error('Price is null')
            Notify.notifyError('Price is null')
        }
    }

    async function rentLandOnMarket(): Promise<void> {
        setisLoading(true)
        if (price !== null || price !== "" || price !== 0 || !price) {
            let bodyListLandOnMarket: ListLandOnMarketRequestModel = { 
                landTokenId: props.land.landTokenId,
                ownerUserTokenId: authStore.account.userTokenId,
                marketType: 2,
                price: Number(price),
                period: null,
                rentType: rentType?.rentTypeId!
            }
            try {
                const bodyResponse: ListOnMarketResponseModel = await landMarketService.listLandOnMarket(bodyListLandOnMarket)
                setTimeout(() => {
                    setisLoading(false)
                    props.fetchLands()
                    props.setIsShowModalListOnMarket(false)
                }, 2000)
                Notify.notifySuccess('List for rent on market successfully')
            } catch (error) {
                console.error(error)
                setisLoading(false)
                Notify.notifyError('List for rent on market failed !!')
            }
        }else {
            console.error('Price is null')
            Notify.notifyError('Price is null')
        }
    }

    const onChangeSellPrice = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value: number = Number(e.target.value)
        if (value < 0) {
            setPrice(0)
        } else if (value >= 0) {
            setPrice(value)
        }
    }

    const calculateReceive = () => {
        let fees = Number(price) * (2.5/100)
        let total = Number(price) - fees
        setFee(parseFloat(fees.toFixed(6)))
        setTotalReceive(parseFloat(total.toFixed(6)))
    }

    const mapRentTypesToOption = ():Array<ReactSelectOptionModel> => {
        const options: Array<ReactSelectOptionModel> = new Array<ReactSelectOptionModel>()
        rentTypes.forEach((type) => {
            const reactSelectOption: ReactSelectOptionModel = new ReactSelectOptionModel()
            reactSelectOption.label = type.rentTypeText
            reactSelectOption.value = type.rentTypeId
            options.push(reactSelectOption)
        })
        return options
    }

    const mapRentTypeToOption = (e:ReactSelectOptionModel): void => {
        const reactSelectOption: ReactSelectOptionModel = e
        let newType = new RentTypeModel
        newType!.rentTypeText = reactSelectOption.label
        newType!.rentTypeId = reactSelectOption.value
        setTypeName(e)
        setRentType(newType)
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
                <div id="detailSection" className={`${isLoading ? 'loading' : ''}`}>
                    <ModalLoading isLoading={isLoading} text='Waiting for listing on market...'/>
                    <div className="image-section">
                        <img className='land-image' src={props.land.landAssets ? props.land.landAssets : "/default.jpg"} alt="" />
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
                                        onChange={(event) => onChangeSellPrice(event)} step={0.001}/>
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
                                    <div className="text-price">Type</div>
                                    <Select id="reactSelect" options={mapRentTypesToOption()} onChange={(e) => mapRentTypeToOption(e as ReactSelectOptionModel) } value={typeName}/>
                                    <div className="text-period">Price (ETH/{rentType?.rentTypeText})</div>
                                    <div className="input-period-div">
                                        <input type="number" className='input-period' value={price} onChange={(event) => onChangeSellPrice(event)} step={0.001}/>
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
                                <div className='button-rent-div'><button className='button-sell' onClick={() => rentLandOnMarket()}>Rent out</button></div>
                            </div>
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}