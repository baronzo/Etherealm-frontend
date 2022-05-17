import React, { useEffect, useMemo, useState } from 'react'
import ModalListOnMarket from '../../ModalListOnMarket/ModalListOnMarket'
import './OwnerProfile.scss'
import { FaEthereum, FaCopy } from 'react-icons/fa'
import ShowLands from '../showLands/ShowLands'
import LandService from '../../../services/lands/LandService'
import LandModel from '../../../models/lands/LandModel'
import ModalRentingDetail from '../../ModalRentingDetail/ModalRentingDetail'
import { observer } from 'mobx-react'
import authStore from '../../../store/auth'
import AccountModel from '../../../models/auth/AccountModel'
import ModalEditProfile from '../../ModalEditProfile/ModalEditProfile'
import { BsFillGearFill } from 'react-icons/bs'
import NotificationService from '../../../services/notification/NotificationService'
import NotificationsResponseModel from '../../../models/notifications/NotificationsResponseModel'
import { useHistory, useParams } from 'react-router-dom'
import OthersProfile from '../othersProfile/OthersProfile'
import UserModel from '../../../models/auth/UserModel'
import UserService from '../../../services/user/UserService'
import TransactionService from '../../../services/notification/TransactionService'
import TransactionsResponseModel from '../../../models/notifications/TransactionsResponseModel'
import ModalOfferList from '../../ModalOfferList/ModalOfferList'
import ModalMyOfferList from '../../ModalMyOfferList/ModalMyOfferList'
import ModalRentingOnRent from '../../ModalRentingOnRent/ModalRentingOnRent'
import LandRentResponseModel from "../../../models/rent/LandRentResponseModel"

interface IParams {
    userTokenId: string
}

type Props = {}

export default observer(function Profile({ }: Props) {
    const [isShowModalListOnMarket, setIsShowModalListOnMarket] = useState<boolean>(false)
    const [isShowModalDetailRenting, setIsShowModalDetailRenting] = useState<boolean>(false)
    const [isShowModalEditProfile, setIsShowModalEditProfile] = useState<boolean>(false)
    const [isShowModalOfferList, setIsShowModalOfferList] = useState<boolean>(false)
    const [isShowModalMyOfferList, setIsShowModalMyOfferList] = useState<boolean>(false)
    const landService: LandService = new LandService()
    const notificationService: NotificationService = new NotificationService()
    const userService: UserService = new UserService()
    const transactionService: TransactionService = new TransactionService()
    const [ownedLand, setownedLand] = useState<Array<LandModel>>([])
    const [ownedLandRent, setownedLandRent] = useState<Array<LandRentResponseModel>>([])
    const [selectedLand, setselectedLand] = useState<LandModel>(new LandModel)
    const [selectedLandRent, setselectedLandRent] = useState<LandRentResponseModel>(new LandRentResponseModel)
    const [notifications, setNotifications] = useState<Array<NotificationsResponseModel>>([])
    const [transactions, setTransactions] = useState<Array<TransactionsResponseModel>>([])
    const history = useHistory()
    const params: IParams = useParams()
    const [userProfile, setUserProfile] = useState<UserModel>(new UserModel)

    useEffect(() => {
        getDataFromAPI()
    }, [])

    function test (value: boolean) {
        console.log(value);
        setIsShowModalDetailRenting(value)
    }

    async function getDataFromAPI(): Promise<void> {
        await getLandByOwnerTokenId()
        await getNotificationAPI()
        await getUserDetail()
        await getTransactionAPI()
    }

    async function getLandByOwnerTokenId(): Promise<void> {
        const result: Array<LandModel> = await landService.getLandByOwnerTokenId(authStore.account.userTokenId)
        setownedLand(result)
    }

    async function getNotificationAPI(): Promise<void> {
        const result: Array<NotificationsResponseModel> = await notificationService.getNotification()
        setNotifications(result)
    }

    async function getTransactionAPI(): Promise<void> {
        const result: Array<TransactionsResponseModel> = await transactionService.getTransaction()
        setTransactions(result)
    }

    const goToOtherProfile = (addressFromUser: string) => {
        history.push(`/profile/${addressFromUser}`)
    }

    const goToEtherScan = (transactionHash: string) => {
        let url = 'https://rinkeby.etherscan.io/tx/' + transactionHash
        window.open(url, '_blank')
    }

    async function handleWhenListedLandToMarket(): Promise<void> {
        await getLandByOwnerTokenId()
    }

    async function getUserDetail(): Promise<void> {
        const result: UserModel = await userService.getUserDetailsByTokenId(authStore.account.userTokenId)
        setUserProfile(result)
    }

    async function fetchUserProfile(): Promise<void> {
        await getUserDetail()
    }

    async function handleWhenConfirmOffer(): Promise<void> {
        await getLandByOwnerTokenId()
        await getTransactionAPI()
    }

    const ownerProfile = () => {
        return (
            <div id='profileMain'>
                <div className='profile-and-log'>
                    <div className='profile-container'>
                        <div className='profile'>
                            <BsFillGearFill className='edit-icon' onClick={() => setIsShowModalEditProfile(true)}/>
                            <div className='profile-image-div'>
                                <img className='profle-image' src={authStore.account.userProfilePic ? authStore.account.userProfilePic : '/profile.jpg'} alt="" />
                            </div>
                            <div className='name-div'>
                                <p className='name'>{authStore.account.userName || '-'}</p>
                            </div>
                            <div className='value-div'>
                                <div className='value-button'>
                                    <FaEthereum className='eth-icon' />
                                    <p className='value'>{authStore.account.balance.toFixed(2)} ETH</p>
                                </div>
                            </div>
                            <div className='wallet-div'>
                                <p className='addreess'>{authStore.account.userTokenId}</p>
                                <div className='copy-buton' onClick={() => { navigator.clipboard.writeText(authStore.account.userTokenId) }}>
                                    <FaCopy className='copy-icon' />
                                </div>
                            </div>
                            <div className='user-description-div'>
                                <div className='user-description'>
                                    <p className='text-description'>{authStore.account.userDescription || 'No description'}</p>
                                </div>
                            </div>
                            <div className='my-offer-list-div'>
                                <button className='button-my-offer-list' onClick={() => setIsShowModalMyOfferList(true)}>View My Offer List</button>
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
                                    {!notifications.length &&
                                        <div className="no-notification">Not have Notification</div>
                                    }
                                    {notifications.map((item: NotificationsResponseModel, index: number) => {
                                        return (
                                            <div className='log-item' key={index}>
                                                <div className={`status-div ${item.activity}`}><p className='status-text'>{item.activity}</p></div>
                                                <p className='log-notifications-text'>[{item.dateTime}]</p>
                                                <p className='log-address-text' onClick={() => goToOtherProfile(item.fromUserTokenId)}>{item.fromUserTokenId.slice(0, 25)}...</p>
                                                <p className='log-notifications-text'>{item.activity} {item.price} ETH for {item.landName}</p>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        </div>
                        <div className='transactions-container'>
                            <div className='transactions'>
                                <div className='topic-div'>
                                    <p className='topic-text'>Transactions</p>
                                </div>
                                <div className='log-notifications-div'>
                                    {!transactions.length &&
                                        <div className="no-notification">Not have Transaction</div>
                                    }
                                    {transactions.map((item: TransactionsResponseModel) => {
                                        return (
                                            <div className='log-item' key={item.logTransactionsId}>
                                                <div className={`status-div ${item.logType.logTypeName}`}><p className='status-text'>{item.logType.logTypeName}</p></div>
                                                <p className='log-notifications-text'>[{item.createdAt}]</p>
                                                <p className='log-address-text' onClick={() => goToEtherScan(item.transactionBlock)}>{item.transactionBlock}</p>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='my-land'>
                    <ShowLands
                        allLands={ownedLand}
                        setselectedLand={setselectedLand}
                        setselectedLandRent={setselectedLandRent}
                        setIsShowModalListOnMarket={setIsShowModalListOnMarket}
                        setIsShowModalDetailRenting={test}
                        setIsShowModalOfferList={setIsShowModalOfferList}
                    />
                </div>
                {isShowModalListOnMarket && <ModalListOnMarket setIsShowModalListOnMarket={setIsShowModalListOnMarket} land={selectedLand} fetchLands={handleWhenListedLandToMarket} />}
                {isShowModalDetailRenting && <ModalRentingDetail setIsShowModalDetailRenting={test} land={selectedLand}/>}
                {isShowModalEditProfile && <ModalEditProfile setIsShowModalEditProfile={setIsShowModalEditProfile} fetchDetail={fetchUserProfile} />}
                {isShowModalOfferList && <ModalOfferList setIsShowModalOfferList={setIsShowModalOfferList} land={selectedLand} fetchLands={handleWhenConfirmOffer}/>}
                {isShowModalMyOfferList && <ModalMyOfferList setIsShowModalMyOfferList={setIsShowModalMyOfferList}/>}
            </div>
        )
    }
    return (
        <>
            {params.userTokenId === authStore.account.userTokenId ? ownerProfile() : <OthersProfile />}
        </>
    )
})