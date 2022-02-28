import React, { useEffect, useState } from 'react'
import { MdLocationOn } from 'react-icons/md'
import LandModel from '../../models/lands/LandModel'
import './LandModal.scss'

interface IProps {
  land: LandModel
}

export default function LandModal(props: IProps) {
  const [land, setLand] = useState<LandModel>(new LandModel)

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
  
  return (
    <div id='landModal' className={!land.landTokenId ? 'hide' : ''}>
      <div id="landModelBackground" onClick={onBackgroundClick}></div>
      <div id="landBox">
        <div id="landDetail">
          <div id="landName">
            <div id="landNameText">{land.landName}</div>
            <div id="landCoordinate">
              <MdLocationOn className='location-icon' />
              <div className="x-y">
                X:{land.landLocation.split(',')[0]}, Y: {land.landLocation.split(',')[1]}
              </div>
            </div>
          </div>
          <div className='land-image-div'>
              <img className='land-image' src="/land.png" alt="" />
          </div>
          <div className={`tags-land ${mapStatusToClassName(land.landStatus.landStatusId)}`}>{land.landStatus.landStatusName}</div>
          <div className="land-description">
            {land.landDescription}
          </div>
          <div className="option">Offer this land</div>
        </div>
      </div>
    </div>
  )
}
