import React, { useEffect, useState } from 'react'
import './ModalRentingDetail.scss'
import { FaInfoCircle } from 'react-icons/fa'
import { MdClose } from 'react-icons/md'
import LandModel from '../../models/lands/LandModel'
import RentService from '../../services/rent/RentService'
import RentingDetailsModel from '../../models/rent/RentingDetailsModel'
import PaymentHistoryModel from '../../models/rent/PaymentHistoryModel'
import authStore from '../../store/auth'

type Props = {
    setIsShowModalDetailRenting: (value: boolean) => void
    land: LandModel
}

export default function ModalRentingDetail(props: Props) {
    const rentService = new RentService()
    const [rentingDetails, setRentingDetails] = useState<RentingDetailsModel>(new RentingDetailsModel())
    const [totalReceive, setTotalReceive] = useState<number>(0)
    const [totalFee, setTotalFee] = useState<number>(0)
    const [netAmount, setNetAmount] = useState<number>(0)
    const [paymentHistories, setPaymentHistories] = useState<Array<PaymentHistoryModel>>([])
    const [isOwnerOfLand, setIsOwnerOfLand] = useState<boolean>(false)

    useEffect(() => {
        getRentingDetailsAPI()
    }, [])

    async function getRentingDetailsAPI() {
        await getRentingDetails()
    }

    const getRentingDetails = async (): Promise<void> => {
        const rentingResponse = await rentService.getRentingDetailsByLandTokenId(props.land.landTokenId)
        console.log(rentingResponse)
        if (rentingResponse) {
            setRentingDetails(rentingResponse)
            setPaymentHistories(rentingResponse.paymentHistories)
            setIsOwnerOfLand(rentingResponse.landTokenId.landOwnerTokenId === authStore.account.userTokenId ? true : false)
            calculatNetAmount()
        }
    }

    const calculatNetAmount = ():void => {
        let totalReceive:number = 0
        let totalFees:number = 0
        paymentHistories.forEach(element => {
            totalReceive += element.price
            totalFees += element.fees
        });
        let netAmount = totalReceive - totalFees
        setTotalReceive(totalReceive)
        setTotalFee(totalFees)
        setNetAmount(netAmount)
    }

    const goToEtherScan = (transactionHash: string) => {
        let url = 'https://rinkeby.etherscan.io/tx/' + transactionHash
        window.open(url, '_blank')
    }

    return (
        <div id='modalRentindDetail'>
            <div id="detailBox">
                <div id="header">
                    <div className='title-div'>
                        <p className="title-text">Renting Details</p>
                    </div>
                    <div className='close-div'>
                        <MdClose className='close-icon' onClick={() => props.setIsShowModalDetailRenting(false)} />
                    </div>
                </div>
                <div id="detailSection">
                    <div className="image-section">
                        <img className='land-image' src={props.land.landAssets ? props.land.landAssets : "/map.jpg"} alt="" />
                        <div className='land-name'>
                            <p className='land-name-text'>{props.land.landName}</p>
                            <FaInfoCircle className='icon-info' />
                        </div>
                    </div>
                    <div className="detail-section">
                        <div className='land-detail'>
                            <div className='detail-item'>
                                <div className='detail-label'><p className='detail-label-text'>Price (ETH/{rentingDetails.rentType.rentTypeText})</p></div>
                                <div className='detail-value'><p className='detail-value-text'>{rentingDetails.price} ETH/{rentingDetails.rentType.rentTypeText}</p></div>
                            </div>
                            <div className='detail-item'>
                                <div className='detail-label'><p className='detail-label-text'>Rental start date</p></div>
                                <div className='detail-value'><p className='detail-value-text'>{new Date(rentingDetails.startDate).toLocaleString().replace(',', '')}</p></div>
                            </div>
                            <div className='detail-item'>
                                <div className='detail-label'><p className='detail-label-text'>Rental end date</p></div>
                                <div className='detail-value'><p className='detail-value-text'>{new Date(rentingDetails.endDate).toLocaleString().replace(',', '')}</p></div>
                            </div>
                            <div className='detail-item'>
                                <div className='detail-label'><p className='detail-label-text'>Period</p></div>
                                <div className='detail-value'><p className='detail-value-text'>{rentingDetails.period} {rentingDetails.rentType.rentTypeText}</p></div>
                            </div>
                            <div className='detail-item'>
                                <div className='detail-label'><p className='detail-label-text'>Remaining Period</p></div>
                                <div className='detail-value'><p className='detail-value-text'></p></div>
                            </div>
                        </div>
                        {isOwnerOfLand &&
                            <div className='receive-detail'>
                                <div className='receive-item'>
                                    <div className='receive-label'><p className='receive-label-text'>Total receive</p></div>
                                    <div className='receive-value'><p className='receive-value-text'>{totalReceive} ETH</p></div>
                                </div>
                                <div className='receive-item'>
                                    <div className='receive-label'><p className='receive-label-text'>Total fee</p></div>
                                    <div className='receive-value'><p className='receive-value-text'>{totalFee} ETH</p></div>
                                </div>
                                <div className='receive-item'>
                                    <div className='receive-label'><p className='receive-label-text'>Net amount</p></div>
                                    <div className='receive-value'><p className='receive-value-text'>{netAmount} ETH</p></div>
                                </div>
                            </div>
                        }
                        <div className='log'>
                            <div className='log-container'>
                                {paymentHistories.map((item: PaymentHistoryModel) => {
                                    return(
                                        <p className='log-text' onClick={() => goToEtherScan(item.logTransactionsId.transactionBlock)}>{item.logTransactionsId.transactionBlock}</p>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}