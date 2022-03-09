import { createBrowserHistory } from 'history'
import React from 'react'
import { MdLocationOn } from 'react-icons/md'
import { Redirect, useHistory } from 'react-router-dom'
import LandModel from '../../../models/lands/LandModel'
import './ShowLands.scss'

type Props = {
    lands: Array<LandModel>
    setIsShowModalListOnMarket: (value: boolean) => void
    setIsShowModalDetailRenting: (value: boolean) => void
}

export default function ShowLands(props: Props) {

    const history = useHistory()

    function goToDetailsPage(landTokenId: string) {
        history.push(`/lands/${landTokenId}/details`)
    }

    function mapOwnedLands(): JSX.Element {
        const data: Array<LandModel> = props.lands.filter(item => item.landStatus.landStatusId === 2)
        return (
            <>
                {data.map((item: LandModel) => {
                    return (
                        <div id='ShowLandsMain' key={item.landTokenId}>
                            <div className='topic-my-land-div'>
                                <p className='topic-my-land-text'>Owned Lands</p>
                            </div>
                            <div className='show-my-land'>
                                <div className='land-card'>
                                    <div className='land-image-div'>
                                        <img className='land-image' src="/map.jpg" alt="" />
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
                                                <p className='button-text-detail'>Land Detail</p>
                                            </div>
                                            <div className='list-to-market'>
                                                <p className='button-text-list'>List to Market</p>
                                            </div>
                                        </div>
                                        <div className='offer-div'>
                                            <p className='offer-text'>Best Offer : 0.15 ETH</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </>
            
        )
    }
    return (
        <>
            {mapOwnedLands()}
            <div id='ShowLandsMain'>
                <div className='topic-my-land-div'>
                    <p className='topic-my-land-text'>Lands for Sell  on Market</p>
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
            <div id='ShowLandsMain'>
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
            <div id='ShowLandsMain'>
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
            <div id='ShowLandsMain'>
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
            <div id='ShowLandsMain'>
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
                                    <p className='button-text-detail' onClick={() => {props.setIsShowModalDetailRenting(true)}}>Land are renting Deatil</p>
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