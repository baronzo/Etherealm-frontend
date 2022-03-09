import React from 'react'
import './ModalRentingDetail.scss'
import { FaInfoCircle } from 'react-icons/fa'
import { MdClose } from 'react-icons/md'

type Props = {
    setIsShowModalDetailRenting: (value: boolean) => void
}

export default function ModalRentingDetail({ setIsShowModalDetailRenting }: Props) {
    return (
        <div id='modalRentindDetail'>
            <div id="detailBox">
                <div id="header">
                    <div className='title-div'>
                        <p className="title-text">List on Market</p>
                    </div>
                    <div className='close-div'>
                        <MdClose className='close-icon' onClick={() => setIsShowModalDetailRenting(false)} />
                    </div>
                </div>
                <div id="detailSection">
                    <div className="image-section">
                        <img className='land-image' src="./map.jpg" alt="" />
                        <div className='land-name'>
                            <p className='land-name-text'>Anicha Land</p>
                            <FaInfoCircle className='icon-info' />
                        </div>
                    </div>
                    <div className="detail-section">
                        <div className='land-detail'>
                            <div className='detail-item'>
                                <div className='detail-label'><p className='detail-label-text'>Price (ETH/Month)</p></div>
                                <div className='detail-value'><p className='detail-value-text'>0.000000001 ETH/Month</p></div>
                            </div>
                            <div className='detail-item'>
                                <div className='detail-label'><p className='detail-label-text'>Rental start date</p></div>
                                <div className='detail-value'><p className='detail-value-text'>10/01/2022</p></div>
                            </div>
                            <div className='detail-item'>
                                <div className='detail-label'><p className='detail-label-text'>Rental end date</p></div>
                                <div className='detail-value'><p className='detail-value-text'>10/01/2022</p></div>
                            </div>
                            <div className='detail-item'>
                                <div className='detail-label'><p className='detail-label-text'>Period</p></div>
                                <div className='detail-value'><p className='detail-value-text'>9 Month</p></div>
                            </div>
                            <div className='detail-item'>
                                <div className='detail-label'><p className='detail-label-text'>Remaining Period</p></div>
                                <div className='detail-value'><p className='detail-value-text'>6 Month 10 day</p></div>
                            </div>
                        </div>
                        <div className='receive-detail'>
                            <div className='receive-item'>
                                <div className='receive-label'><p className='receive-label-text'>Total receive</p></div>
                                <div className='receive-value'><p className='receive-value-text'>0.000000003 ETH</p></div>
                            </div>
                            <div className='receive-item'>
                                <div className='receive-label'><p className='receive-label-text'>Total fee</p></div>
                                <div className='receive-value'><p className='receive-value-text'>0.00000000000001 ETH</p></div>
                            </div>
                            <div className='receive-item'>
                                <div className='receive-label'><p className='receive-label-text'>Net amount</p></div>
                                <div className='receive-value'><p className='receive-value-text'>0.00000000299999 ETH</p></div>
                            </div>
                        </div>
                        <div className='log'>
                            <div className='log-container'>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}