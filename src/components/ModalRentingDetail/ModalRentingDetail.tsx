import React, { useEffect, useState } from 'react'
import './ModalRentingDetail.scss'
import { FaInfoCircle } from 'react-icons/fa'
import { MdClose } from 'react-icons/md'
import LandModel from '../../models/lands/LandModel'
import RentService from '../../services/rent/RentService'
import RentingDetailsModel from '../../models/rent/RentingDetailsModel'
import PaymentHistoryModel from '../../models/rent/PaymentHistoryModel'
import authStore from '../../store/auth'
import HirePurchaseService from '../../services/hirePurchase/HirePurchaseService'
import HirePurchaseDetailResponseModel from '../../models/hirePurchase/HirePurchaseDetailResponseModel'

type Props = {
    setIsShowModalDetailRenting: (value: boolean) => void
    land: LandModel
    isHirePurchase?: boolean 
    rentOrHirePurchase?: number
}

export default function ModalRentingDetail(props: Props) {
    const rentService = new RentService()
    const hirePurchaseService = new HirePurchaseService()
    const [rentingDetails, setRentingDetails] = useState<RentingDetailsModel>(new RentingDetailsModel())
    const [rentPurchaseDetails, setRentPurchaseDetails] = useState<HirePurchaseDetailResponseModel>(new HirePurchaseDetailResponseModel())
    const [totalReceive, setTotalReceive] = useState<number>(0)
    const [totalFee, setTotalFee] = useState<number>(0)
    const [netAmount, setNetAmount] = useState<number>(0)
    const [paymentHistories, setPaymentHistories] = useState<Array<PaymentHistoryModel>>([])
    const [isOwnerOfLand, setIsOwnerOfLand] = useState<boolean>(false)
    const [remainingText, setremainingText] = useState('')

    useEffect(() => {
        getRentingDetailsAPI()
    }, [])

    async function getRentingDetailsAPI() {
        if (props.rentOrHirePurchase) {
            if (props.rentOrHirePurchase === 2) {
                await getRentPurchase()
            }
            else if (props.rentOrHirePurchase === 1) {
                await getRentingDetails()
            }
        } else {
            if (props.land.landStatus.landStatusId === 6) {
                await getRentPurchase()
            }
            else if (props.land.landStatus.landStatusId === 5) {
                await getRentingDetails()
            }
        }
    }

    const getRentingDetails = async (): Promise<void> => {
        console.log(props.land.landTokenId)
        const rentingResponse: RentingDetailsModel = await rentService.getRentingDetailsByLandTokenId(props.land.landTokenId)
        if (rentingResponse) {
            setRentingDetails(rentingResponse)
            setPaymentHistories(rentingResponse.paymentHistories)
            setIsOwnerOfLand(rentingResponse.landTokenId.landOwnerTokenId === authStore.account.userTokenId ? true : false)
            calculatNetAmount(rentingResponse.paymentHistories)
            showRemaining(rentingResponse.endDate)
        }
    }

    const getRentPurchase = async(): Promise<void> => {
        const responseData: HirePurchaseDetailResponseModel = await hirePurchaseService.getHirePurchaseDetail(props.land.landTokenId)
        if (responseData) {
            setRentPurchaseDetails(responseData)
            setPaymentHistories(responseData.paymentHistories)
            setIsOwnerOfLand(responseData.landTokenId.landOwnerTokenId === authStore.account.userTokenId ? true : false)
            showRemaining(responseData.endDate)
        }
    }

    const calculatNetAmount = (paymentList: Array<PaymentHistoryModel>):void => {
        let totalReceive:number = 0
        let totalFees:number = 0
        paymentList.forEach(element => {
            totalReceive += element.price
            totalFees += element.fees
        });
        let netAmount = totalReceive - totalFees
        setTotalReceive(Number(totalReceive.toFixed(6)))
        setTotalFee(Number(totalFees.toFixed(6)))
        setNetAmount(Number(netAmount.toFixed(6)))
    }

    const goToEtherScan = (transactionHash: string) => {
        let url = 'https://rinkeby.etherscan.io/tx/' + transactionHash
        window.open(url, '_blank')
    }

    function showRemaining(endDate: Date) {
        var x = setInterval(function() {
            var now = new Date().getTime();
            var distance = new Date(endDate).getTime() - now;
            var days = Math.floor(distance / (1000 * 60 * 60 * 24));
            var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            var seconds = Math.floor((distance % (1000 * 60)) / 1000);
            if (distance < 0) {
                clearInterval(x);
            }
            setremainingText(`${days}d ${hours}h ${minutes}m ${seconds}s`)
        }, 1000);
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
                        <img className='land-image' src={props.land.landAssets ? props.land.landAssets : "/default.jpg"} alt="" />
                        <div className='land-name'>
                            <p className='land-name-text'>{props.land.landName}</p>
                            <FaInfoCircle className='icon-info' />
                        </div>
                    </div>
                    {props.rentOrHirePurchase === 1 || props.land.landStatus?.landStatusId === 5 ?
                    <div className="detail-section">
                        <div className='land-detail'>
                            <div className='detail-item'>
                                <div className='detail-label'><p className='detail-label-text'>Price (ETH/{rentingDetails.rentType.rentTypeText})</p></div>
                                <div className='detail-value'><p className='detail-value-text'>{rentingDetails.price} ETH/{ rentingDetails.rentType.rentTypeText}</p></div>
                            </div>
                            <div className='detail-item'>
                                <div className='detail-label'><p className='detail-label-text'>Rental start date</p></div>
                                <div className='detail-value'><p className='detail-value-text'>{new Date(rentingDetails.startDate).toLocaleString().replace(',', '')}</p></div>
                            </div>
                            <div className='detail-item'>
                                <div className='detail-label'><p className='detail-label-text'>Rental end date</p></div>
                                <div className='detail-value'><p className='detail-value-text'>{new Date( rentingDetails.endDate).toLocaleString().replace(',', '')}</p></div>
                            </div>
                            <div className='detail-item'>
                                <div className='detail-label'><p className='detail-label-text'>Period</p></div>
                                <div className='detail-value'><p className='detail-value-text'>{(rentingDetails.rentType.rentTypeId === 1 ? rentingDetails.period : rentingDetails.period/30)} {rentingDetails.rentType.rentTypeText}</p></div>
                            </div>
                            <div className='detail-item'>
                                <div className='detail-label'><p className='detail-label-text'>Remaining Period</p></div>
                                <div className='detail-value'><p className='detail-value-text'>{remainingText}</p></div>
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
                                {paymentHistories.map((item: PaymentHistoryModel, index: number) => {
                                    return(
                                        <p className='log-text' key={index} onClick={() => goToEtherScan(item.logTransactionsId.transactionBlock)}>{item.logTransactionsId.transactionBlock}</p>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                    :
                    <div className="detail-section">
                        <div className='land-detail'>
                            <div className='detail-item'>
                                <div className='detail-label'><p className='detail-label-text'>Price (ETH/Month)</p></div>
                                <div className='detail-value'><p className='detail-value-text'>{rentPurchaseDetails.price} ETH/Month</p></div>
                            </div>
                            <div className='detail-item'>
                                <div className='detail-label'><p className='detail-label-text'>Rental start date</p></div>
                                <div className='detail-value'><p className='detail-value-text'>{new Date(rentPurchaseDetails.startDate).toLocaleString().replace(',', '')}</p></div>
                            </div>
                            <div className='detail-item'>
                                <div className='detail-label'><p className='detail-label-text'>Rental end date</p></div>
                                <div className='detail-value'><p className='detail-value-text'>{new Date( rentPurchaseDetails.endDate).toLocaleString().replace(',', '')}</p></div>
                            </div>
                            <div className='detail-item'>
                                <div className='detail-label'><p className='detail-label-text'>Period</p></div>
                                <div className='detail-value'><p className='detail-value-text'>{rentPurchaseDetails.period/30} Month</p></div>
                            </div>
                            <div className='detail-item'>
                                <div className='detail-label'><p className='detail-label-text'>Remaining Period</p></div>
                                <div className='detail-value'><p className='detail-value-text'>{remainingText}</p></div>
                            </div>
                        </div>
                        <div className='log'>
                            <div className='log-container'>
                                {paymentHistories.map((item: PaymentHistoryModel, index: number) => {
                                    return(
                                        <p className='log-text' key={index} onClick={() => goToEtherScan(item.logTransactionsId.transactionBlock)}>{item.logTransactionsId.transactionBlock}</p>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                    }
                </div>
            </div>
        </div>
    )
}