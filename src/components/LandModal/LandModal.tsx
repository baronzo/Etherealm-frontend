import React, { useState } from 'react'
import { MdLocationOn } from 'react-icons/md'
import './LandModal.scss'

export default function LandModal() {
  
  return (
    <div id='landModal'>
      <div id="landBox">
        <div id="landDetail">
          <div id="landName">Ham traco Land</div>
          <div id="landCoordinate">
            <MdLocationOn className='location-icon' />
            <div className="x-y">
              X:99, Y: 99
            </div>
          </div>
          <div className='land-image-div'>
              <img className='land-image' src="/land.png" alt="" />
          </div>
          <div className="tags-land">Unlisted on market</div>
          <div className="land-description">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Reiciendis voluptates iusto repellendus suscipit architecto cupiditate fugiat, dicta repellat debitis eos maiores, impedit ipsum incidunt cumque! Molestiae eligendi nulla aut voluptas.
          </div>
          <div className="option">Offer this land</div>
        </div>
      </div>
    </div>
  )
}
