import React from 'react';
import './About.scss'

export default function About() {
  return (
    <div id='about'>
      <div className="title">
        <p className='text'>Our Team Members</p>
      </div>
      <div id="card">
        <div className="card-members">
          <div className="image-rounded">
            <img className='image-member' src="/matupoom.png" alt="" />
          </div>
          <div className="profile-section">
            <p className='name-text'>Matupoom Chaiwan</p>
          </div>
          <div className="position">
            <button className='button'>Developer</button>
          </div>
        </div>
        <div className="card-members">
          <div className="image-rounded">
            <img className='image-member' src="/arnicha.jpg" alt="" />
          </div>
          <div className="profile-section">
            <p className='name-text'>Arnicha Michai</p>
          </div>
          <div className="position">
            <button className='button'>Developer</button>
          </div>
        </div>
        <div className="card-members">
          <div className="image-rounded">
            <img className='image-member' src="/udomsak.jpg" alt="" />
          </div>
          <div className="profile-section">
            <p className='name-text'>Udomsak Makemark</p>
          </div>
          <div className="position">
            <button className='button'>Developer</button>
          </div>
        </div>
        <div className="card-members">
          <div className="image-rounded">
            <img className='image-member' src="/purin.png" alt="" />
          </div>
          <div className="profile-section">
            <p className='name-text'>Purin Tadsorn</p>
          </div>
          <div className="position">
            <button className='button'>Developer</button>
          </div>
        </div>
      </div>
    </div>
  )
}