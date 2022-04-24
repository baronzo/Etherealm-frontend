import { createBrowserHistory } from 'history'
import React, { useEffect, useState } from 'react'
import { MdLocationOn } from 'react-icons/md'
import { Redirect, useHistory } from 'react-router-dom'
import LandModel from '../../../models/lands/LandModel'
import ActiveFillterStatusModel from '../../../models/showLand/ActiveFillterStatusModel'
import './ShowLandsOtherProfile.scss'

type Props = {
    allLands: Array<LandModel>
    setIsShowModalDetailRenting: (value: boolean) => void
    setselectedLand: (land: LandModel) => void
}

export default function ShowLandsOtherProfile(props: Props) {
    const [isActive, setIsActive] = useState<ActiveFillterStatusModel>({
        mapOwnedLands: true,
        landForSellOnMarket: false,
        landForRentOnMarket: false,
        landRent: false,
        landRentPurchase: false,
        landPeopleAreRenting: false
    })

    const history = useHistory()

    function goToDetailsPage(landTokenId: string) {
        history.push(`/lands/${landTokenId}/details`)
    }

    function mapOwnedLands(): JSX.Element {
        const data: Array<LandModel> = props.allLands.filter(item => item.landStatus.landStatusId === 2)
        console.log(data)
        return (
            <>
                <div id='ShowLandsOtherMain'>
                    <div className='topic-my-land-div'>
                        <p className='topic-my-land-text'>Owned Lands</p>
                    </div>
                    <div className='show-my-land'>
                        {data.map((item: LandModel) => {
                            return (
                                <div className='land-card' key={item.landTokenId}>
                                    <div className='land-image-div'>
                                        <img className='land-image' src={item.landAssets ? item.landAssets : '/map.jpg'} alt="" />
                                    </div>
                                    <div className='land-detail'>
                                        <div className='name-location'>
                                            <div className='land-name'>
                                                <p className='land-name-text'>{item.landName}</p>
                                            </div>
                                            <div className='location-div'>
                                                <MdLocationOn className='location-icon' />
                                                <p className='location'>X: {item.landLocation.x}, Y: {item.landLocation.y}</p>
                                            </div>
                                        </div>
                                        <div className='status-div'>
                                            <div className='view-detail' onClick={() => goToDetailsPage(item.landTokenId)}>
                                                <p className='button-text-detail'>Land Details</p>
                                            </div>
                                            <div className='list-to-market'>
                                                <p className='button-text-list'>Offer</p>
                                            </div>
                                        </div>
                                        <div className='offer-div'>
                                            <p className='offer-text'>Best Offer : 0.15 ETH</p>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </>

        )
    }

    function landForSellOnMarket(): JSX.Element {
        const data: Array<LandModel> = props.allLands.filter(item => item.landStatus.landStatusId === 3)
        console.log(data)
        return (
            <>
                <div id='ShowLandsOtherMain'>
                    <div className='topic-my-land-div'>
                        <p className='topic-my-land-text'>Lands for Sell on Market</p>
                    </div>
                    <div className='show-my-land'>
                        {data.map((item: LandModel) => {
                            return (
                                <div className='land-card' key={item.landTokenId}>
                                    <div className='land-image-div'>
                                        <img className='land-image' src={item.landAssets ? item.landAssets : '/map.jpg'} alt="" />
                                    </div>
                                    <div className='land-detail'>
                                        <div className='name-location'>
                                            <div className='land-name'>
                                                <p className='land-name-text'>{item.landName}</p>
                                            </div>
                                            <div className='location-div'>
                                                <MdLocationOn className='location-icon' />
                                                <p className='location'>X: {item.landLocation.x}, Y: {item.landLocation.y}</p>
                                            </div>
                                        </div>
                                        <div className='status-div'>
                                            <div className='view-detail' onClick={() => goToDetailsPage(item.landTokenId)}>
                                                <p className='button-text-detail'>Land Details</p>
                                            </div>
                                            <div className='list-to-market'>
                                                <p className='button-text-list'>Buy 0.05 ETH</p>
                                            </div>
                                        </div>
                                        <div className='offer-div'>
                                            <p className='offer-text'>Best Offer : 0.15 ETH</p>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </>
        )
    }

    function landForRentOnMarket(): JSX.Element {
        const data: Array<LandModel> = props.allLands.filter(item => item.landStatus.landStatusId === 4)
        return (
            <>
                <div id='ShowLandsOtherMain'>
                    <div className='topic-my-land-div'>
                        <p className='topic-my-land-text'>Lands for Rent  on Market</p>
                    </div>
                    <div className='show-my-land'>
                        <div className='land-card'>
                            <div className='land-image-div'>
                                <img className='land-image' src="/map.jpg" alt="" />
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
                                </div>
                                <div className='status-div'>
                                    <div className='view-detail'>
                                        <p className='button-text-detail'>Land Detail</p>
                                    </div>
                                    <div className='list-to-market'>
                                        <p className='button-text-list'>Buy 0.5 ETH</p>
                                    </div>
                                </div>
                                <div className='offer-div'>
                                    <p className='offer-text'>Best Offer : 0.15 ETH</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        )
    }

    function landRent(): JSX.Element {
        const data: Array<LandModel> = props.allLands.filter(item => item.landStatus.landStatusId === 5)
        return (
            <>
                <div id='ShowLandsOtherMain'>
                    <div className='topic-my-land-div'>
                        <p className='topic-my-land-text'>Land Rent</p>
                    </div>
                    <div className='show-my-land'>
                        <div className='land-card'>
                            <div className='land-image-div'>
                                <img className='land-image' src="/map.jpg" alt="" />
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
                                </div>
                                <div className='status-div'>
                                    <div className='view-detail'>
                                        <p className='button-text-detail'>Land Detail</p>
                                    </div>
                                    <div className='list-to-market'>
                                        <p className='button-text-list'>View on Market</p>
                                    </div>
                                </div>
                                <div className='offer-div'>
                                    <p className='offer-text'>Best Offer : 0.15 ETH</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        )
    }

    function landRentPurchase(): JSX.Element {
        const data: Array<LandModel> = props.allLands.filter(item => item.landStatus.landStatusId === 6)
        return (
            <>
                <div id='ShowLandsOtherMain'>
                    <div className='topic-my-land-div'>
                        <p className='topic-my-land-text'>Land Rent Purchase</p>
                    </div>
                    <div className='show-my-land'>
                        <div className='land-card'>
                            <div className='land-image-div'>
                                <img className='land-image' src="/map.jpg" alt="" />
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
                                </div>
                                <div className='status-div'>
                                    <div className='view-detail'>
                                        <p className='button-text-detail'>Land Detail</p>
                                    </div>
                                    <div className='list-to-market'>
                                        <p className='button-text-list'>View on Market</p>
                                    </div>
                                </div>
                                <div className='offer-div'>
                                    <p className='offer-text'>Best Offer : 0.15 ETH</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        )
    }

    function landPeopleAreRenting(): JSX.Element {
        const data: Array<LandModel> = props.allLands.filter(item => item.landStatus.landStatusId === 7)
        return (
            <>
                <div id='ShowLandsOtherMain'>
                    <div className='topic-my-land-div'>
                        <p className='topic-my-land-text'>People are Renting</p>
                    </div>
                    <div className='show-my-land'>
                        <div className='land-card'>
                            <div className='land-image-div'>
                                <img className='land-image' src="/map.jpg" alt="" />
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
                                </div>
                                <div className='status-div'>
                                    <div className='view-detail'>
                                        <p className='button-text-detail' onClick={() => { props.setIsShowModalDetailRenting(true) }}>Land are renting Deatil</p>
                                    </div>
                                </div>
                                <div className='offer-div'>
                                    <p className='offer-text'>Best Offer : 0.15 ETH</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        )
    }

    return (
        <>
            <div id='typeOfLand'>
                <div className={`button-item ${isActive.mapOwnedLands ? 'active' : ''}`}
                    onClick={() => {
                        setIsActive({
                            ...isActive,
                            mapOwnedLands: true,
                            landForSellOnMarket: false,
                            landForRentOnMarket: false,
                            landRent: false,
                            landRentPurchase: false,
                            landPeopleAreRenting: false
                        })
                    }}>
                    <p className='type-text'>Owned Lands</p>
                </div>
                <div className={`button-item ${isActive.landForSellOnMarket ? 'active' : ''}`}
                    onClick={() => {
                        setIsActive({
                            ...isActive,
                            mapOwnedLands: false,
                            landForSellOnMarket: true,
                            landForRentOnMarket: false,
                            landRent: false,
                            landRentPurchase: false,
                            landPeopleAreRenting: false
                        })
                    }}>
                    <p className='type-text'>Lands for Sell on Market</p>
                </div>
                <div className={`button-item ${isActive.landForRentOnMarket ? 'active' : ''}`}
                    onClick={() => {
                        setIsActive({
                            ...isActive,
                            mapOwnedLands: false,
                            landForSellOnMarket: false,
                            landForRentOnMarket: true,
                            landRent: false,
                            landRentPurchase: false,
                            landPeopleAreRenting: false
                        })
                    }}>
                    <p className='type-text'>Lands for Rent  on Market</p>
                </div>
                <div className={`button-item ${isActive.landRent ? 'active' : ''}`}
                    onClick={() => {
                        setIsActive({
                            ...isActive,
                            mapOwnedLands: false,
                            landForSellOnMarket: false,
                            landForRentOnMarket: false,
                            landRent: true,
                            landRentPurchase: false,
                            landPeopleAreRenting: false
                        })
                    }}>
                    <p className='type-text'>Land Rent</p>
                </div>
                <div className={`button-item ${isActive.landRentPurchase ? 'active' : ''}`}
                    onClick={() => {
                        setIsActive({
                            ...isActive,
                            mapOwnedLands: false,
                            landForSellOnMarket: false,
                            landForRentOnMarket: false,
                            landRent: false,
                            landRentPurchase: true,
                            landPeopleAreRenting: false
                        })
                    }}>
                    <p className='type-text'>Land Rent Purchase</p>
                </div>
                <div className={`button-item ${isActive.landPeopleAreRenting ? 'active' : ''}`}
                    onClick={() => {
                        setIsActive({
                            ...isActive,
                            mapOwnedLands: false,
                            landForSellOnMarket: false,
                            landForRentOnMarket: false,
                            landRent: false,
                            landRentPurchase: false,
                            landPeopleAreRenting: true
                        })
                    }}>
                    <p className='type-text'>People are Renting</p>
                </div>
            </div>
            {isActive.mapOwnedLands && mapOwnedLands()}
            {isActive.landForSellOnMarket && landForSellOnMarket()}
            {isActive.landForRentOnMarket && landForRentOnMarket()}
            {isActive.landRent && landRent()}
            {isActive.landRentPurchase && landRentPurchase()}
            {isActive.landPeopleAreRenting && landPeopleAreRenting()}
        </>
    )
}