import { observer } from 'mobx-react'
import React, { Dispatch, SetStateAction, useEffect, useMemo, useState } from 'react'
import { FaExternalLinkAlt } from 'react-icons/fa'
import { MdLocationOn } from 'react-icons/md'
import { useHistory } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import LandModel from '../../models/lands/LandModel'
import LandService from '../../services/lands/LandService'
import UserService from '../../services/user/UserService'
import authStore from '../../store/auth'
import ContractStore from '../../store/contract'
import ModalLoading from '../Loading/ModalLoading'
import ModalHirePurchase from '../ModalHirePurchase/ModalHirePurchase'
import Notify from '../notify/Notify'
import './LandModal.scss'

interface IProps {
  land: LandModel,
  onLandChange: (land: LandModel) => void
}

export default observer(function LandModal(props: IProps) {
  const contractStore = useMemo(() => new ContractStore, [])
  const userService: UserService = new UserService
  const landService: LandService = new LandService
  const [land, setLand] = useState<LandModel>(new LandModel)
  const [isLoading, setisLoading] = useState<boolean>(false)
  const history = useHistory()

  const [isShowModalHirePurchase, setIsShowModalHirePurchase] = useState<boolean>(false)

  useEffect(() => {
    setLand(props.land)
  }, [props.land])

  function onBackgroundClick(): void {
    setLand(new LandModel)
  }

  function mapStatusToClassName(statusId: number): string {
    switch (statusId) {
      case 1:
          return 'no-owner'
      case 2:
        return 'un-listed'
      case 3:
        return 'listed'
      case 4:
        return 'listed'
      case 6:
        return 'hiring'
      default:
        return 'no-owner'
    }
  }

  function mapOptionByLandStatus(): JSX.Element {
    switch (land.landStatus.landStatusId) {
      case 1:
        return (
          <div className="option">
            <button id="hirePurchase" className={isLoading ? 'disabled' : ''} onClick={() => {setIsShowModalHirePurchase(true)}}>Hire Purchase</button>
            <button id="purchase" onClick={onPurchaseClick}>Purchase : {land.price} ETH</button>
          </div>
        )
      case 2:
        return (
          <div className="option">
            <button id="offerLand" onClick={() => goToLandDetail(land.landTokenId)}>View land detail</button>
          </div>
        )
      case 3:
        return (
          <div className="option">
            <button id="offerLand" onClick={() => goToMarketForSell(land.landTokenId)}>Go to market</button>
          </div>
        )
      case 4:
        return (
          <div className="option">
            <button id="offerLand" onClick={() => goToMarketForRent(land.landTokenId)}>Go to market</button>
          </div>
        )
      default:
        break;
    }
    return (
      <div className="option">
        <button id="offerLand" onClick={() => goToLandDetail(land.landTokenId)}>View land detail</button>
      </div>
    )
  }

  async function onPurchaseClick() {
    setisLoading(true)
    try {
      let hash: string = await contractStore.purchaseLand(land.landTokenId, land.price!)
      if (hash) {
        let result: LandModel = await landService.purchaseLand(land.landTokenId, hash)
        setLand(result)
        await authStore.updateAccount()
        const point: number = await contractStore.getPoint(authStore.account.userTokenId)
        authStore.setPoint(point)
        props.onLandChange(result)
        setisLoading(false)
        Notify.notifySuccess('Purchase Land Successfully')
      }     
    } catch (error) {
      console.log(error)
      Notify.notifyError('Purchase Land Failed')
      setisLoading(false)
    }
  }

  function goToLandDetail(landTokenId: string) {
    window.open(`/lands/${landTokenId}/details`)
  }

  function goToMarketForSell(landTokenId: string) {
    window.open('/market?marketType=1')
  }

  function goToMarketForRent(landTokenId: string) {
    window.open('/market?marketType=2')
  }

  function handleOnHirePurchaseSuccess(land: LandModel) {
    setLand(land)
    props.onLandChange(land)
  }

  function onLandWebsiteClick(): void {
    window.open(land.landUrl, '_blank')
  }
  
  return (
    <div id='landModal' className={!land.landTokenId ? 'hide' : ''}>
      <div id="landModelBackground" onClick={onBackgroundClick}></div>
      {!isShowModalHirePurchase ? 
      (
      <div id="landBox">
        <ModalLoading isLoading={isLoading}/>
        <div id="landDetail">
          <div id="landName">
            <div id="landNameText">{land.landName}</div>
            <div id="landCoordinate">
              <MdLocationOn className='location-icon' />
              <div className="x-y">
                X:{land.landLocation.x}, Y: {land.landLocation.y}
              </div>
            </div>
          </div>
          <div className='land-image-div'>
              <img className='land-image' src={land.landAssets ? land.landAssets : '/default.jpg'} alt="" />
          </div>
          <div className={`tags-land ${mapStatusToClassName(land.landStatus.landStatusId)}`}>{land.landStatus.landStatusName}</div>
          {land.landStatus.landStatusId !== 1 &&
            <>
              {land.landUrl
                ?
                <div className="land-url active" onClick={onLandWebsiteClick}>
                  <FaExternalLinkAlt className='link-icon'/>
                  <div className="land-url-text">{land.landUrl}</div>
                </div>
                :
                <div className="land-url">This land doesn't have a website</div>
              }
            </>
          }
          <div className="land-description">
            {land.landDescription}
          </div>
          {mapOptionByLandStatus()}
        </div>
      </div>
      ):(
        <ModalHirePurchase landDetails={props.land} setIsShowModalHirePurchase={setIsShowModalHirePurchase} onHirePurchaseSuccess={handleOnHirePurchaseSuccess}/>
      )
      }
      <ToastContainer theme='colored' style={{marginTop: '50px'}}/>
    </div>
  )
})
