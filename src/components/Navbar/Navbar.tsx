import { ethers } from 'ethers'
import React, { useState } from 'react'
import { NavLink } from 'react-router-dom'
import './Navbar.scss'

export default function Navbar() {

  const [account, setaccount] = useState('')
  const [balance, setbalance] = useState(0)

  async function getProvider() {
    let eth = (window as any).ethereum
    if (eth) {
      let accounts = await eth.request({method: 'eth_requestAccounts'})
      let resBalance = await eth.request({method: 'eth_getBalance', params: [accounts[0], 'latest']})
      setbalance(Number(Number(ethers.utils.formatEther(resBalance)).toFixed(4)))
      setaccount(accounts[0])
    } else {
      console.error('Install Metamask')
    }
  }

  function logout() {
    setaccount('')
  }
  
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
            <NavLink to={'/market'} activeClassName="active">Market</NavLink>
          </div>
          <div className="path">
            <NavLink to={'/auction'} activeClassName="active">Auction</NavLink>
          </div>
          <div className="path">
            <div>About</div>
          </div>
        </div>
      </div>
      {account ?
        <div id="account">
          <div id="accountBalance">Balance: {balance} ETH |</div>
          <div id="accountAddressToken" title='0x347Aa0FC3E7e4b06AF8515dd265a593410940E05'>0x347Aa0FC3E7e4b06AF8515dd265a593410940E05</div>
          <button id='logoutBtn' onClick={() => logout()}>Logout</button>
        </div>
      :
        <div className="wallet">
          <button className="connect" onClick={() => getProvider()}>
            <img className="metamask" src="https://cdn.iconscout.com/icon/free/png-256/metamask-2728406-2261817.png" width="25px" alt="metamask" />
            Connect to a wallet
          </button>
        </div>
      }
    </div>
  )
}
