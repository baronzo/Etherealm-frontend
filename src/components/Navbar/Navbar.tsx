import React, { useContext, useEffect, useMemo, useState } from 'react'
import { NavLink, useHistory } from 'react-router-dom'
import { FaEthereum, FaCopy } from 'react-icons/fa'
import './Navbar.scss'
import { observer } from 'mobx-react'
import ContractStore from '../../store/contract'
import AccountModel from '../../models/auth/AccountModel'
import authStore from '../../store/auth'

interface IProps {

}

export default observer(function Navbar(props: IProps) {
  const contractStore = useMemo(() => new ContractStore, [])
  const [isShowModalMenu, setIsShowModalMenu] = useState<boolean>(false)

  const history = useHistory()

  async function onLogin(): Promise<void> {
    const accountResponse = await authStore.login()
    if (accountResponse.userTokenId) {
      // alert error
    }
  }

  function onLogout(): void {
    authStore.logout()
    setIsShowModalMenu(false)
  }

  async function onAccountChangeHandler(): Promise<void> {
    authStore.accountChange()
  }

  function goToProfilePage(address: string) {
    history.push('/profile/'+ address)
    setIsShowModalMenu(false)
  }

  function showProfileMenu() {
    setIsShowModalMenu(!isShowModalMenu)
  }

  (window as any).ethereum.on('accountsChanged', onAccountChangeHandler)

  return (
    <div id="navbar">
      <div className="pathname">
        <div className="home">
          <NavLink exact to={'/'}>Etherealm</NavLink>
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
      {authStore.account.userTokenId ?
        <div id="account">
          <div id='profileBalance' onClick={() => showProfileMenu()}>
            <div className='profile'><img className='profile-img' src="https://cdn.wallpapersafari.com/7/36/98MpYN.jpg" alt="" /></div>
            <div className="accountBalance"><FaEthereum className='eth-icon' /><p className='value'>{authStore.account.balance} ETH</p></div>
            {isShowModalMenu &&
              <div id='profile-menu'>
                <div className='menu-profile' onClick={() => goToProfilePage(authStore.account.userTokenId)}>
                  <p className='menu-text'>Profile</p>
                </div>
                <div className='menu-log-out' onClick={() => onLogout()}>
                  <p className='menu-text'>Log out</p>
                </div>
              </div>
            }
          </div>
          {/* <button id='logoutBtn' onClick={() => onLogout()}>Logout</button> */}
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
