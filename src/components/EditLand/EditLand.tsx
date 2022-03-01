import React from 'react'
import './EditLand.scss'

export default function EditLand() {
  return (
    <div id='editLand'>
      <div id="editBox">
        <div id="title">
          Edit a Land
        </div>
        <div id="editDetail">
          <div className="image-section">
            <img id="landImage" src="./land.png" alt=""/>
            <div id="changeImage">
              <button className='button'>Change Image</button>
            </div>
          </div>
          <div className="edit-section">
            <div className="input-box">
              <div className="text">Land Name</div>
              <input type="text"  className='input' />
            </div>
            <div className="input-box">
              <div className="text">Land Description</div>
              <input type="text" className='input-description' />
            </div>
            <div className="input-box">
              <div className="text">URL</div>
              <input type="text" className='input'/>
            </div>
            <div className="button-section">
              <button className='button-save'>Save</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
