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
import NotificationsResponseModel from '../../../models/lands/NotificationsResponseModel'

type Props = {}

export default observer(function Profile({ }: Props) {
    const [isShowModalListOnMarket, setIsShowModalListOnMarket] = useState<boolean>(false)
    const [isShowModalDetailRenting, setIsShowModalDetailRenting] = useState<boolean>(false)
    const [isShowModalEditProfile, setIsShowModalEditProfile] = useState<boolean>(false)
    const landService: LandService = new LandService()
    const notificationService: NotificationService = new NotificationService()
    const [ownedLand, setownedLand] = useState<Array<LandModel>>([])
    const [selectedLand, setselectedLand] = useState<LandModel>(new LandModel)
    const [notifications, setNotifications] = useState<Array<NotificationsResponseModel>>([])

    useEffect(() => {
        getDataFromAPI()
    }, [])

    async function getDataFromAPI(): Promise<void> {
        await getLandByOwnerTokenId()
        await getNotificationAPI()
    }

    async function getLandByOwnerTokenId(): Promise<void> {
        const result: Array<LandModel> = await landService.getLandByOwnerTokenId(authStore.account.userTokenId)
        setownedLand(result)
    }

    async function getNotificationAPI(): Promise<void> {
        const result: Array<NotificationsResponseModel> = await notificationService.getNotification()
        setNotifications(result)
    }

    return (
        <div id='profileMain'>
            <div className='profile-and-log'>
                <div className='profile-container'>
                    <div className='profile'>
                        <BsFillGearFill className='edit-icon' onClick={() => setIsShowModalEditProfile(true)} />
                        <div className='profile-image-div'>
                            <img className='profle-image' src="https://cdn.wallpapersafari.com/7/36/98MpYN.jpg" alt="" />
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
                    </div>
                </div>
                <div className='log-container'>
                    <div className='notifications-container'>
                        <div className='notifications'>
                            <div className='topic-div'>
                                <p className='topic-text'>Notifications</p>
                            </div>
                            <div className='log-notifications-div'>
                                {notifications.map((item: NotificationsResponseModel, index: number) => {
                                    return (
                                        <div className='log-item' key={index}>
                                            <div className='status-div'><p className='status-text'>{item.activity}</p></div>
                                            <p className='log-notifications-text'>[{item.dateTime}] {item.fromUserTokenId.slice(0, 25)}... {item.activity} {item.price} ETH for {item.landName}</p>
                                        </div>
                                    )
                                })}
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
                <ShowLands lands={ownedLand}
                    setselectedLand={setselectedLand}
                    setIsShowModalListOnMarket={setIsShowModalListOnMarket}
                    setIsShowModalDetailRenting={setIsShowModalDetailRenting}
                />
            </div>
            {isShowModalListOnMarket && <ModalListOnMarket setIsShowModalListOnMarket={setIsShowModalListOnMarket} land={selectedLand} />}
            {isShowModalDetailRenting && <ModalRentingDetail setIsShowModalDetailRenting={setIsShowModalDetailRenting} />}
            {isShowModalEditProfile && <ModalEditProfile setIsShowModalEditProfile={setIsShowModalEditProfile} />}
        </div>
    )
})