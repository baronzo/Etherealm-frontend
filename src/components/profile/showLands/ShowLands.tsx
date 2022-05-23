import React, { useState, useEffect } from 'react'
import { MdLocationOn } from 'react-icons/md'
import { Redirect, useHistory } from 'react-router-dom'
import LandModel from '../../../models/lands/LandModel'
import ActiveFillterStatusModel from '../../../models/showLand/ActiveFillterStatusModel'
import LandRentResponseModel from "../../../models/rent/LandRentResponseModel"
import RentService from '../../../services/rent/RentService'
import authStore from '../../../store/auth'
import './ShowLands.scss'
import HirePurchaseOwnedModel from '../../../models/hirePurchase/HirePurchaseOwnedModel'
import HirePurchaseService from '../../../services/hirePurchase/HirePurchaseService'
import PeopleRentingOwnedModel from '../../../models/rent/PeopleRentingOwnedModel'

type Props = {
    allLands: Array<LandModel>
    setIsShowModalListOnMarket: (value: boolean) => void
    setIsShowModalDetailRenting: (value: boolean) => void
    setIsShowModalOfferList: (value: boolean) => void;
    setselectedLand: (land: LandModel) => void;
    setselectedLandRent: (rent: LandRentResponseModel) => void;
    setIsHirePurchase: (value: boolean) => void
    setRentOrHirePurchase: (value: number) => void
}

export default function ShowLands(props: Props) {
    const [ownedRentLand, setOwnedRentLand] = useState<Array<LandRentResponseModel>>([])
    const [ownedHireLand, setOwnedHireLand] = useState<Array<HirePurchaseOwnedModel>>([])
    const [ownedPeopleAreRenting, setOwnedPeopleAreRenting] = useState<Array<PeopleRentingOwnedModel>>([])
    const rentService: RentService = new RentService()
    const hirePurchaseService = new HirePurchaseService()
    const [isActive, setIsActive] = useState<ActiveFillterStatusModel>({
        mapOwnedLands: true,
        landForSellOnMarket: false,
        landForRentOnMarket: false,
        landRent: false,
        landRentPurchase: false,
        landPeopleAreRenting: false
    })

    useEffect(() => {
        getDataFromAPI()
    }, [])

    async function getDataFromAPI(): Promise<void> {
        await getRentLandByRenterTokenId()
        await getOwnedHirePurchaseAPI()
        await getPeopleAreRentingByOwnerLandTokenId()
    }

    async function getOwnedHirePurchaseAPI(): Promise<void> {
        const hireResponse: Array<HirePurchaseOwnedModel> = await hirePurchaseService.getOwnedHirePurchase(authStore.account.userTokenId)
        if (hireResponse) {
            setOwnedHireLand(hireResponse)
        }
    }

    async function getPeopleAreRentingByOwnerLandTokenId(): Promise<void> {
        const response: Array<PeopleRentingOwnedModel> = await rentService.getPeopleAreRentingByOwnerLandTokenId(authStore.account.userTokenId)
        if (response) {
            setOwnedPeopleAreRenting(response)
        }
    }

    async function getRentLandByRenterTokenId(): Promise<void> {
        const result: Array<LandRentResponseModel> = await rentService.getRentLandByRenterTokenId(authStore.account.userTokenId)
        setOwnedRentLand(result)
    }

    function onClickShowModalLandRent(selectedLandRent: LandRentResponseModel, e: React.MouseEvent<HTMLDivElement>): void {
        e.stopPropagation()
        props.setRentOrHirePurchase(1)
        props.setselectedLand(selectedLandRent.landTokenId)
        props.setIsShowModalDetailRenting(true)
    }

    const history = useHistory()

    function goToDetailsPage(landTokenId: string) {
        history.push(`/lands/${landTokenId}/details`)
    }

    function goToMarketPage(e: React.MouseEvent<HTMLDivElement>) {
        e.stopPropagation()
        history.push(`/market`)
    }

    function onClickShowModalPeopleRening(selectedLand: PeopleRentingOwnedModel, e: React.MouseEvent<HTMLDivElement>): void {
        e.stopPropagation()
        props.setRentOrHirePurchase(1)
        props.setselectedLand(selectedLand.landTokenId)
        props.setIsShowModalDetailRenting(true)
    }

    function onClickShowModalHiringDetails(selectedLand: HirePurchaseOwnedModel, e: React.MouseEvent<HTMLDivElement>): void {
        e.stopPropagation()
        props.setRentOrHirePurchase(2)
        props.setIsHirePurchase(true)
        props.setselectedLand(selectedLand.landTokenId)
        props.setIsShowModalDetailRenting(true)
    }

    function onClickListOnMarket(selectedLand: LandModel, e: React.MouseEvent<HTMLDivElement>): void {
        e.stopPropagation()
        props.setselectedLand(selectedLand)
        props.setIsShowModalListOnMarket(true)
    }

    const onClickShowModalOfferList = (selectedLand: LandModel, e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation()
        props.setselectedLand(selectedLand)
        props.setIsShowModalOfferList(true)
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
        }, 1000);
    }

    function mapOwnedLands(): JSX.Element {
        const data: Array<LandModel> = props.allLands.filter(item => item.landStatus.landStatusId === 2)
        return (
            <>
                <div id='ShowLandsMain'>
                    <div className='topic-my-land-div'>
                        <p className='topic-my-land-text'>Owned Lands</p>
                    </div>
                    {!data.length &&
                        <div className="no-land-data">Not have Land</div>
                    }
                    <div className='show-my-land'>
                        {data.map((item: LandModel) => {
                            return (
                                <div className='land-card' key={item.landTokenId} onClick={() => goToDetailsPage(item.landTokenId)}>
                                    <div className='land-image-div'>
                                        <img className='land-image' src={item.landAssets ? item.landAssets : '/default.jpg'} alt="" />
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
                                            <div className='view-detail' onClick={(e: React.MouseEvent<HTMLDivElement>) => onClickShowModalOfferList(item, e)}>
                                                <p className='button-text-detail'>Veiw Offer list</p>
                                            </div>
                                            <div className='list-to-market' onClick={(e: React.MouseEvent<HTMLDivElement>) => onClickListOnMarket(item, e)}>
                                                <p className='button-text-list'>List to Market</p>
                                            </div>
                                        </div>
                                        <div className='offer-div'>
                                            <p className='offer-text'>{item.bestOffer ? `Best Offer is ${item.bestOffer.offerPrice} ETH` : "Not people offer"}</p>
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
        return (
            <>
                <div id='ShowLandsMain'>
                    <div className='topic-my-land-div'>
                        <p className='topic-my-land-text'>Lands for Sell on Market</p>
                    </div>
                    {!data.length &&
                        <div className="no-land-data">Not have Land</div>
                    }
                    <div className='show-my-land'>
                        {data.map((item: LandModel) => {
                            return (
                                <div className='land-card' key={item.landTokenId} onClick={() => goToDetailsPage(item.landTokenId)}>
                                    <div className='land-image-div'>
                                        <img className='land-image' src={item.landAssets ? item.landAssets : '/default.jpg'} alt="" />
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
                                        <div className="land-description">{item.landDescription}</div>
                                        <div className='status-div'>
                                            <div className='go-to-market' onClick={(e) => goToMarketPage(e)}>
                                                <p className='button-text'>View on Market</p>
                                            </div>
                                        </div>
                                        {/* <div className='offer-div'>
                                            <p className='offer-text'></p>
                                        </div> */}
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
                <div id='ShowLandsMain'>
                    <div className='topic-my-land-div'>
                        <p className='topic-my-land-text'>Lands for Rent  on Market</p>
                    </div>
                    {!data.length &&
                        <div className="no-land-data">Not have Land</div>
                    }
                    <div className='show-my-land'>
                        {data.map((item: LandModel) => {
                            return (
                                <div className='land-card' key={item.landTokenId} onClick={() => goToDetailsPage(item.landTokenId)}>
                                    <div className='land-image-div'>
                                        <img className='land-image' src={item.landAssets ? item.landAssets : "/default.jpg"} alt="" />
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
                                        <div className="land-description">{item.landDescription}</div>
                                        <div className='status-div'>
                                            <div className='go-to-market' onClick={(e) => goToMarketPage(e)}>
                                                <p className='button-text' >View on Market</p>
                                            </div>
                                        </div>
                                        {/* <div className='offer-div'>
                                        </div> */}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </>
        )
    }

    function landRent(): JSX.Element {
        return (
            <>
                <div id='ShowLandsMain'>
                    <div className='topic-my-land-div'>
                        <p className='topic-my-land-text'>Rented Lands</p>
                    </div>
                    {!ownedRentLand.length &&
                        <div className="no-land-data">Not have Land</div>
                    }
                    <div className='show-my-land'>
                        {ownedRentLand.map((item: LandRentResponseModel) => {
                            return (
                                <div className='land-card' key={item.landTokenId.landTokenId} onClick={() => goToDetailsPage(item.landTokenId.landTokenId)}>
                                    <div className='land-image-div'>
                                        <img className='land-image' src={item.landTokenId.landAssets ? item.landTokenId.landAssets : "/default.jpg"} alt="" />
                                    </div>
                                    <div className='land-detail'>
                                        <div className='name-location'>
                                            <div className='land-name'>
                                                <p className='land-name-text'>{item.landTokenId.landName}</p>
                                            </div>
                                            <div className='location-div'>
                                                <MdLocationOn className='location-icon' />
                                                <p className='location'>X: {item.landTokenId.landLocation.x}, Y: {item.landTokenId.landLocation.y}</p>
                                            </div>
                                        </div>
                                        <div className='status-div'>
                                            <div className='view-detail-rent' onClick={(e) => onClickShowModalLandRent(item, e)}>
                                                <p className='button-text-detail'>View Renting Details</p>
                                            </div>
                                        </div>
                                        <div className="land-rent-remaining">Ended Date: {new Date(item.endDate).toLocaleString().replace(',', '').split(' ')[0]}</div>
                                        <div className='offer-div'>
                                            <p className='offer-text'>Price : {item.price} ETH/{item.rentType.rentTypeText}</p>
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

    function landRentPurchase(): JSX.Element {
        return (
            <>
                <div id='ShowLandsMain'>
                    <div className='topic-my-land-div'>
                        <p className='topic-my-land-text'>Hire Purchased Land</p>
                    </div>
                    {!ownedHireLand.length &&
                        <div className="no-land-data">Not have Land</div>
                    }
                    <div className='show-my-land'>
                        {ownedHireLand.map((item: HirePurchaseOwnedModel) => {
                            return (
                                <div className='land-card' key={item.hirePurchaseId} onClick={() => goToDetailsPage(item.landTokenId.landTokenId)}>
                                    <div className='land-image-div'>
                                        <img className='land-image' src={item.landTokenId.landAssets ? item.landTokenId.landAssets : "/default.jpg"} alt="" />
                                    </div>
                                    <div className='land-detail'>
                                        <div className='name-location'>
                                            <div className='land-name'>
                                                <p className='land-name-text'>{item.landTokenId.landName}</p>
                                            </div>
                                            <div className='location-div'>
                                                <MdLocationOn className='location-icon' />
                                                <p className='location'>X: {item.landTokenId.landLocation.x}, Y: {item.landTokenId.landLocation.y}</p>
                                            </div>
                                        </div>
                                        <div className='status-div'>
                                            <div className='view-detail-rent' onClick={(e) => onClickShowModalHiringDetails(item, e)}>
                                                <p className='button-text-detail'>View Hiring Details</p>
                                            </div>
                                        </div>
                                        <div className="land-rent-remaining">Ended Date: {new Date(item.endDate).toLocaleString().replace(',', '').split(' ')[0]}</div>
                                        <div className='offer-div'>
                                            <p className='offer-text'>Price : {item.price} ETH / Month</p>
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

    function landPeopleAreRenting(): JSX.Element {
        return (
            <>
                <div id='ShowLandsMain'>
                    <div className='topic-my-land-div'>
                        <p className='topic-my-land-text'>Rented Out Lands</p>
                    </div>
                    {!ownedPeopleAreRenting.length &&
                        <div className="no-land-data">Not have Land</div>
                    }
                    <div className='show-my-land'>
                        {ownedPeopleAreRenting.map((item: PeopleRentingOwnedModel) => {
                            return (
                                <div className='land-card' key={item.rentId} onClick={() => goToDetailsPage(item.landTokenId.landTokenId)}>
                                    <div className='land-image-div'>
                                        <img className='land-image' src={item.landTokenId.landAssets ? item.landTokenId.landAssets : "/default.jpg"} alt="" />
                                    </div>
                                    <div className='land-detail'>
                                        <div className='name-location'>
                                            <div className='land-name'>
                                                <p className='land-name-text'>{item.landTokenId.landName}</p>
                                            </div>
                                            <div className='location-div'>
                                                <MdLocationOn className='location-icon' />
                                                <p className='location'>X: {item.landTokenId.landLocation.x}, Y: {item.landTokenId.landLocation.y}</p>
                                            </div>
                                        </div>
                                        <div className='status-div'>
                                            <div className='view-detail-rent'>
                                                <p className='button-text-detail' onClick={(e) => onClickShowModalPeopleRening(item, e)}>View Renting Details</p>
                                            </div>
                                        </div>
                                        <div className="land-rent-remaining">Ended Date: {new Date(item.endDate).toLocaleString().replace(',', '').split(' ')[0]}</div>
                                        <div className='offer-div'>
                                            <p className='offer-text'>Price : {item.price} ETH / {item.rentType.rentTypeText}</p>
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
                    <p className='type-text'>Rented Lands</p>
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
                    <p className='type-text'>Hire Purchased Lands</p>
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
                    <p className='type-text'>Rented Out Lands</p>
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