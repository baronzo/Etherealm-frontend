import React, { Dispatch, SetStateAction, useEffect, useMemo, useState } from 'react'
import { MdLocationOn } from 'react-icons/md'
import LandModel from '../../models/lands/LandModel'
import LandService from '../../services/lands/LandService'
import ContractStore from '../../store/contract'
import ModalLoading from '../Loading/ModalLoading'
import './LandModal.scss'

interface IProps {
  land: LandModel,
  onLandChange: (land: LandModel) => void
}

export default function LandModal(props: IProps) {
  const contractStore = useMemo(() => new ContractStore, [])
  const landService: LandService = new LandService
  const [land, setLand] = useState<LandModel>(new LandModel)
  const [isLoading, setisLoading] = useState<boolean>(false)

  useEffect(() => {
    setLand(props.land)
  }, [props.land])

  function onBackgroundClick(): void {
    setLand(new LandModel)
  }

  function mapStatusToClassName(statusId: number): string {
    switch (statusId) {
      case 1:
          return 'listed'
      case 2:
        return 'un-listed'
      case 3:
        return 'no-owner'
      default:
        return 'no-owner'
    }
  }

  function mapOptionByLandStatus(): JSX.Element {
    switch (land.landStatus.landStatusId) {
      case 1:
        return (
          <div className="option">Offer this land</div>
        )
      case 2:
        return (
          <div className="option">Offer this land</div>
        )
      case 3:
        return (
          <div className="option">
            <button id="hirePurchase" className={isLoading ? 'disabled' : ''}>Hire Purchase</button>
            <button id="purchase" onClick={onPurchaseClick}>Purchase</button>
          </div>
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
    let isSuccess: boolean = await contractStore.purchaseLand(land.landTokenId)
    if (isSuccess) {
      let result: LandModel = await landService.purchaseLand(land.landTokenId)
      setLand(result)
      props.onLandChange(result)
      setisLoading(false)
    }
  }
  
  return (
    <div id='landModal' className={!land.landTokenId ? 'hide' : ''}>
      <div id="landModelBackground" onClick={onBackgroundClick}></div>
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
    </div>
  )
}
