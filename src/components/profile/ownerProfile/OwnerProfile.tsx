import React, { useEffect, useMemo, useState } from 'react'
import './OwnerProfile.scss'
import ModalListOnMarket from '../../ModalListOnMarket/ModalListOnMarket'
import './OwnerProfile.scss'
import { FaEthereum, FaCopy } from 'react-icons/fa'
import ShowLands from '../showLands/ShowLands'
import LandService from '../../../services/lands/LandService'
import LandModel from '../../../models/lands/LandModel'
import AccountModel from '../../../models/auth/AccountModel'
import ModalRentingDetail from '../../ModalRentingDetail/ModalRentingDetail'
import { observer } from 'mobx-react'
import authStore from '../../../store/auth'

type Props = {}

export default observer(function Profile({ }: Props) {
    const [isShowModalListOnMarket, setIsShowModalListOnMarket] = useState<boolean>(false)
    const [isShowModalDetailRenting, setIsShowModalDetailRenting] = useState<boolean>(true)
    const landService: LandService = new LandService
    const [account, setaccount] = useState<AccountModel>(new AccountModel)
    const [ownedLand, setownedLand] = useState<Array<LandModel>>([])

    useEffect(() => {
        getDataFromAPI()
    }, [])

    async function getDataFromAPI(): Promise<void> {
        await getLandByOwnerTokenId()
    }
    
    async function getLandByOwnerTokenId(): Promise<void> {
        const result: Array<LandModel> = await landService.getLandByOwnerTokenId(authStore.account.userTokenId)
        setownedLand(result)
    }

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
                <ShowLands lands={ownedLand}
                    setIsShowModalListOnMarket={setIsShowModalListOnMarket}
                    setIsShowModalDetailRenting={setIsShowModalDetailRenting}
                />
            </div>
            {isShowModalListOnMarket && <ModalListOnMarket setIsShowModalListOnMarket={setIsShowModalListOnMarket} />}
            {isShowModalDetailRenting && <ModalRentingDetail setIsShowModalDetailRenting={setIsShowModalDetailRenting} />}
        </div>
    )
})