import React, { useEffect } from 'react'
import { NavLink, useHistory } from 'react-router-dom'
import './Home.scss'

const Home = () => {
  const history = useHistory()

  function goToMarketPage(): void {
    history.push(`/market`)
  }

  function goToMapPage(): void {
    history.push(`/map`)
  }

  return (
    <>
      <div id="home">
        <div className='image-div'>
          <img src="/image1.png" alt="" className="image-main" />
        </div>
        <div id="text">ETHEREALM</div>
        <div id="description">Lorem ipsum dolor sit amet consectetur adipisicing elit. Pariatur temporibus nostrum animi non voluptate</div>
        <div className="button">
          <button className="map" onClick={goToMapPage}>View Map</button>
        </div>
      </div>
      <div id="landMarket">
        <div className="image-matket-div">
          <img className='image-market' src="/imag2.png" alt="" />
        </div>
        <div className="land-box">
          <div className="title">Market in ETHEREALM</div>
          <div className="text-description">$SAND is our main utility token that allows you to buy and sell LANDS and ASSETS in The Sandbox metaverse.</div>
          <button className="buy-land" onClick={goToMarketPage}>Buy Land</button>
        </div>
      </div>
      <div id="landRent">
        <div className="land-box">
          <div className="title">Rent in ETHEREALM</div>
          <div className="text-description">Lorem ipsum dolor sit amet consectetur adipisicing elit. Pariatur temporibus nostrum animi non voluptate</div>
          <button className="buy-land" onClick={goToMarketPage}>Rent Land</button>
        </div>
        <div className="image-matket-div">
          <img className='image-market' src="/image3.png" alt="" />
        </div>
      </div>
      <div id="footer">

      </div>
    </>
  )
}

export default Home
