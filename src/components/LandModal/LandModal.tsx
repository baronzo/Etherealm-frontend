import { observer } from 'mobx-react'
import React, { Dispatch, SetStateAction, useEffect, useMemo, useState } from 'react'
import { MdLocationOn } from 'react-icons/md'
import { useHistory } from 'react-router-dom'
import LandModel from '../../models/lands/LandModel'
import LandService from '../../services/lands/LandService'
import authStore from '../../store/auth'
import ContractStore from '../../store/contract'
import ModalLoading from '../Loading/ModalLoading'
import ModalHirePurchase from '../ModalHirePurchase/ModalHirePurchase'
import './LandModal.scss'

interface IProps {
  land: LandModel,
  onLandChange: (land: LandModel) => void
}

export default observer(function LandModal(props: IProps) {
  const contractStore = useMemo(() => new ContractStore, [])
  const landService: LandService = new LandService
  const [land, setLand] = useState<LandModel>(new LandModel)
  const [isLoading, setisLoading] = useState<boolean>(false)
  const history = useHistory()

  const [isShowModalHirePurchase, setIsShowModalHirePurchase] = useState<boolean>(false)

  useEffect(() => {
    setLand(props.land)
    console.log(props.land)
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
            <button id="offerLand" onClick={() => goToOffer(land.landTokenId)}>Offer this land</button>
          </div>
        )
      case 3:
        return (
          <div className="option">Offer this land</div>
        )
      default:
        break;
    }
    return (
      <div className="option">Offer this land</div>
    )
  }

  async function onPurchaseClick() {
    setisLoading(true)
    let hash: string = await contractStore.purchaseLand(land.landTokenId, land.price!)
    if (hash) {
      let result: LandModel = await landService.purchaseLand(land.landTokenId, hash)
      setLand(result)
      await authStore.updateAccount()
      props.onLandChange(result)
      setisLoading(false)
    }
  }

  function goToOffer(landTokenId: string) {
    history.push(`/lands/${landTokenId}/details`)
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
              <img className='land-image' src={land.landAssets ? land.landAssets : '/land.png'} alt="" />
          </div>
          <div className={`tags-land ${mapStatusToClassName(land.landStatus.landStatusId)}`}>{land.landStatus.landStatusName}</div>
          <div className="land-description">
            {land.landDescription}
          </div>
          {mapOptionByLandStatus()}
        </div>
      </div>
      ):(
        <ModalHirePurchase landDetails={props.land} setIsShowModalHirePurchase={setIsShowModalHirePurchase} onHirePurchaseSuccess={props.onLandChange}/>
      )
      }
    </div>
  )
})
