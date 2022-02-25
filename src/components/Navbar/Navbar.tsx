import React from 'react'
import { NavLink } from 'react-router-dom'
import './Navbar.scss'

export default function Navbar() {

  return (
    <div id="navbar">
      <div className="pathname">
        <div className="home">
          <NavLink  exact to={'/'}>Etherealm</NavLink>
        </div>
        <div id="groupPath">
          <div className="path">
            <NavLink to={'/'} exact activeClassName="active">Home</NavLink>
          </div>
          <div className="path">
            <NavLink to={'/map'} activeClassName="active">Map</NavLink>
          </div>
          <div className="path">
            <div>Market</div>
          </div>
          <div className="path">
            <NavLink to={'/auction'} activeClassName="active">Auction</NavLink>
          </div>
          <div className="path">
            <div>About</div>
          </div>
        </div>
      </div>
      <div className="wallet">
        <button className="connect">
          <img className="metamask" src="https://cdn.iconscout.com/icon/free/png-256/metamask-2728406-2261817.png" width="25px" alt="metamask" />
          Connect to a wallet
        </button>
      </div>
    </div>
  )
}
