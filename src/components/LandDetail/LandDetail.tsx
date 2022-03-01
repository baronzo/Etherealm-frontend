import React from 'react'
import { MdLocationOn } from 'react-icons/md'
import { FaCopy } from 'react-icons/fa'
import './LandDetail.scss'

export default function LandDetail() {
  return (
    <div id='landDetail'>
      <div id="detailBox">
        <div id="header">
          <div className="title-text">Ham traco Land</div>
          <div className="tags">Unlisted on market</div>
        </div>
        <div id="detailSection">
          <div className="image-section">
            <img src="./land.png" alt="" width='300' height='300' />
          </div>
          <div className="detail-section">
            <div className="detail">
              <div className="text-title">Description</div>
              <div className="text-description">It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.</div>
            </div>
            <div className="detail">
              <div className="text-title">URL</div>
              <div className="text-url">http://www.google.com</div>
            </div>
            <div className="button-section">
              <button className='button-size'>SIZE: 1x1</button>
              <button className='button-parcel'>1 PARCEL</button>
              <button className='button-coord'>
                <div className="group">
                  <MdLocationOn className='location-icon' />
                  <div className="x-y">X:15, Y: 399</div>
                </div>
              </button>
            </div>
            <div id="profile">
              <div className="profile-box">
                <div className="image-box">
                  <img className="profile-image" src="https://cdn.wallpapersafari.com/7/36/98MpYN.jpg" alt="" />
                </div>
                <div className="detail-profile">
                  <div className="name">Anicha</div>
                  <div className="box">
                    <div className="token-id">0xcc896c2cdd10aasderhdfgsdf...</div>
                    <button className="copy">
                      <FaCopy className='copy-icon' />
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="offer">
              <button className='button-offer'>offer</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
