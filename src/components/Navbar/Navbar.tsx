import React, { useEffect, useMemo } from 'react'
import { NavLink } from 'react-router-dom'
import './Navbar.scss'
import AuthStore from '../../store/auth'
import { observer } from 'mobx-react'

export default observer(function Navbar() {
  const authStore = useMemo(() => new AuthStore, [])

  useEffect(() => {
    authStore.checkLogin()
  }, [])

  async function onLogin(): Promise<void> {
    await authStore.login()
  }

  function onLogout(): void {
    authStore.logout()
  }

  async function onAccountChangeHandler(): Promise<void> {
    authStore.accountChange()
  }

  (window as any).ethereum.on('accountsChanged', onAccountChangeHandler)

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
      {authStore.account.tokenId ?
        <div id="account">
          <div id="accountBalance">Balance: {authStore.account.balance} ETH |</div>
          <div id="accountAddressToken" title={authStore.account.tokenId}>{authStore.account.tokenId}</div>
          <button id='logoutBtn' onClick={() => onLogout()}>Logout</button>
        </div>
      :
        <div className="wallet">
          <button className="connect" onClick={() => onLogin()}>
            <img className="metamask" src="https://cdn.iconscout.com/icon/free/png-256/metamask-2728406-2261817.png" width="25px" alt="metamask" />
            Connect to a wallet
          </button>
        </div>
      }
    </div>
  )
})
