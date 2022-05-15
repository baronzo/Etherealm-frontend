import React, { useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import './Home.scss'

const Home = () => {

  return (
    <>
      <div id="home">
        <img src="" alt="" width="200px" height="200px"/>
        <div id="text">Lorem ipsum</div>
        <div id="description">Lorem ipsum dolor sit amet consectetur adipisicing elit. Pariatur temporibus nostrum animi non voluptate</div>
        <div className="button">
          <button className="wallet">Connect to a wallet</button>
        <button className="map">
          <NavLink to={'/map'}>View Map</NavLink>
        </button>
        </div>
      </div>
      <div id="auction">Auction here</div>
      <div id="land">
        <div className="image">
          <img src="" alt="" width="200" height="200" />
        </div>
        <div className="land-box">
          <div className="title">Why Etherealm ?</div>
          <div className="text-description">Lorem ipsum dolor sit amet consectetur adipisicing elit. Pariatur temporibus nostrum animi non voluptate</div>
          <button className="buy-land">Buy Land</button>
        </div>
      </div>
    </>
  )
}

export default Home
