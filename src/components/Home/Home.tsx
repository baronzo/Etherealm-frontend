import React, { useEffect } from 'react'
import { NavLink, useHistory } from 'react-router-dom'
import './Home.scss'

const Home = () => {
  const history = useHistory()

  function goToMarketPage(): void {
    history.push(`/market`)
  }

  function goToRentPage(): void {
    history.push(`/market`)
    window.history.replaceState(null, '', window.location.pathname + "?marketType=2")
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
        <div id="description">Welcome to Ethrealm world,
          Trading and Hire purchase of non-fungible token on the blockchain system
        </div>
        <div className="button">
          <button className="map" onClick={goToMapPage}>View Map</button>
        </div>
      </div>
      <div id='landOnMarket'>
        <div className='topic'>
          <p className='topic-text'>Market in ETHEREALM</p>
        </div>
        <div className='sell-and-rent'>
          <div className='land-sell'>
            <div className="image-matket-div">
              <div className='cycle'></div>
              <img className='image-market' src="/imag2.png" alt="" />
            </div>
            <div className="land-box">
              <div className="title">BUY LAND</div>
              <div className="text-description">Buy and sell LANDS and ASSETS in ETHEREALM world.</div>
              <button className="buy-land" onClick={goToMarketPage}>Buy Land</button>
            </div>
          </div>
          <div className="land-rent">
            <div className="image-matket-div">
              <div className='cycle'></div>
              <img className='image-market' src="/image3.png" alt="" />
            </div>
            <div className="land-box">
              <div className="title">RENT LAND</div>
              <div className="text-description">Don't want to sell at the moment? Rent it!</div>
              <button className="buy-land" onClick={goToRentPage}>Rent Land</button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Home
