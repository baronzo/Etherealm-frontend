import React from 'react'
import './Profile.scss'
import { FaEthereum, FaCopy } from 'react-icons/fa'
import { MdLocationOn } from 'react-icons/md'

type Props = {}

export default function Profile({ }: Props) {
    return (
        <div id='profileMain'>
            <div className='profile-and-log'>
                <div className='profile-container'>
                    <div className='profile'>
                        <div className='profile-image-div'>
                            <img className='profle-image' src="https://cdn.wallpapersafari.com/7/36/98MpYN.jpg" alt="" />
                        </div>
                        <div className='name-div'>
                            <p className='name'>Anicha</p>
                        </div>
                        <div className='value-div'>
                            <div className='value-button'>
                                <FaEthereum className='eth-icon' />
                                <p className='value'>3.28 ETH</p>
                            </div>
                        </div>
                        <div className='wallet-div'>
                            <p className='addreess'>0xcc896c2cdd10abafdgfbfbea84dabjhgjfdjf</p>
                            <div className='copy-buuton'>
                                <FaCopy className='copy-icon' />
                            </div>
                        </div>
                        <div className='user-description-div'>
                            <div className='user-description'>
                                <p className='text-description'>It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='log-container'>
                    <div className='notifications-container'>
                        <div className='notifications'>
                            <div className='topic-div'>
                                <p className='topic-text'>Notifications</p>
                            </div>
                            <div className='log-notifications-div'>
                                <p className='log-notifications-text'>[02:28:2022  1:19AM]  PERTH offer 0.25 ETH for Ham Traco Land</p>
                            </div>
                        </div>
                    </div>
                    <div className='transactions-container'>
                        <div className='transactions'>

                        </div>
                    </div>
                </div>
            </div>
            <div className='my-land'>
                <div className='topic-my-land-div'>
                    <p className='topic-my-land-text'>My Lands</p>
                </div>
                <div className='show-my-land'>
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
                            </div>
                            <div className='status-div'>
                                <div className='status'>
                                    <p className='status-text'>Unlisted on market</p>
                                </div>
                            </div>
                            <div className='offer-div'>
                                <p className='offer-text'>Best Offer : 0.15 ETH</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}