import React, { useContext, useEffect, useMemo, useState } from "react";
import { NavLink, useHistory } from "react-router-dom";
import { FaEthereum, FaCopy } from "react-icons/fa";
import { MdAttachMoney, MdControlPoint } from "react-icons/md";
import { RiCoinFill } from "react-icons/ri";
import "./Navbar.scss";
import { observer } from "mobx-react";
import ContractStore from "../../store/contract";
import AccountModel from "../../models/auth/AccountModel";
import authStore from "../../store/auth";
import { BiTransferAlt } from "react-icons/bi";

interface IProps { }

export default observer(function Navbar(props: IProps) {
  const contractStore = useMemo(() => new ContractStore(), []);
  const [isShowModalMenu, setIsShowModalMenu] = useState<boolean>(false);
  const [isShowAddPoint, setIsShowAddPoint] = useState<boolean>(false);
  const [isShowWithdrawPoint, setisShowWithdrawPoint] = useState<boolean>(false)
  const [point, setpoint] = useState<number>(0.00001)
  const [isAddPointLoading, setisAddPointLoading] = useState<boolean>(false)
  const [isWithDrawPointLoading, setisWithDrawPointLoading] = useState(false)
  const [withdrawPoint, setwithdrawPoint] = useState(0.00001)

  const history = useHistory();

  async function onLogin(): Promise<void> {
    const accountResponse = await authStore.login();
    if (accountResponse.userTokenId) {
      const result = await contractStore.getPoint(accountResponse.userTokenId)
      authStore.setPoint(result)
      console.log(result)
    }
  }

  function onLogout(): void {
    authStore.logout();
    setIsShowModalMenu(false);
  }

  async function onAccountChangeHandler(): Promise<void> {
    authStore.accountChange();
  }

  function goToProfilePage(address: string) {
    history.push("/profile/" + address);
    setIsShowModalMenu(false);
  }

  function showProfileMenu() {
    setIsShowModalMenu(!isShowModalMenu);
  }

  async function onAddPointClick(): Promise<void> {
    setisAddPointLoading(true)
    const isSuccess = await contractStore.depositPoints(point)
    if (isSuccess) {
      const result = await contractStore.getPoint(authStore.account.userTokenId)
      await authStore.updateAccount()
      authStore.setPoint(result)
      setIsShowAddPoint(false)
    }
    setisAddPointLoading(false)
  }

  async function onWithdrawPointClick(): Promise<void> {
    setisWithDrawPointLoading(true)
    const isSuccess = await contractStore.withdrawPoints(withdrawPoint)
    if (isSuccess) {
      const result = await contractStore.getPoint(authStore.account.userTokenId)
      await authStore.updateAccount()
      authStore.setPoint(result)
      setisShowWithdrawPoint(false)
    }
    setisWithDrawPointLoading(false)
  }

  function onWithdrawIconClick(): void {
    setisShowWithdrawPoint(!isShowWithdrawPoint)
    setIsShowAddPoint(false)
  }

  function onAddPointIconClick(): void {
    setisShowWithdrawPoint(false)
    setIsShowAddPoint(!isShowAddPoint)
  }

  (window as any).ethereum.on("accountsChanged", onAccountChangeHandler);

  return (
    <div id="navbar">
      <div className="pathname">
        <div className="home">
          <NavLink exact to={"/"}>
            Etherealm
          </NavLink>
        </div>
        <div id="groupPath">
          <div className="path">
            <NavLink to={"/"} exact activeClassName="active">
              Home
            </NavLink>
          </div>
          <div className="path">
            <NavLink to={"/map"} activeClassName="active">
              Map
            </NavLink>
          </div>
          <div className="path">
            <NavLink to={"/market"} activeClassName="active">
              Market
            </NavLink>
          </div>
          <div className="path">
            <NavLink to={"/auction"} activeClassName="active">
              Auction
            </NavLink>
          </div>
          <div className="path">
            <div>About</div>
          </div>
        </div>
      </div>
      {authStore.account.userTokenId ? (
        <div id="account-and-points-div">
          <div id="account">
            <div id="accountPoints">
              <div className="point-label">Points</div>
              <div className="points">
                <FaEthereum className="eth-icon" />
                <p className="value">{authStore.account.point}</p>
                <p className="eth">ETH</p>
              </div>
              <div className="add-point">
                <MdControlPoint className="add-point-icon" onClick={() => onAddPointIconClick()}/>
              </div>
              <div className="add-point">
                {/* <i className="far fa-coins"></i> */}
                <BiTransferAlt className="add-point-icon" onClick={() => onWithdrawIconClick()}/>
              </div>
              {isShowAddPoint && (
                <div id="addPoint">
                  <p className="label">Points (ETH)</p>
                  <input type="number" className="input-point" value={point} onChange={event => setpoint(Number(event.target.value))} step={0.00001}/>
                  {!isAddPointLoading
                    ?
                      <button className="add-point-button" onClick={onAddPointClick}>Deposit Point</button>
                    :
                      <button className={`add-point-button ${isAddPointLoading ? 'disable' : ''}`}><i className="fas fa-spinner fa-spin"></i></button>
                  }
                </div>
              )}
              {isShowWithdrawPoint && (
                <div id="addPoint">
                  <p className="label">Points (ETH)</p>
                  <input type="number" className="input-point" value={withdrawPoint} onChange={event => setwithdrawPoint(Number(event.target.value))} step={0.00001}/>
                  {!isWithDrawPointLoading
                    ?
                      <button className="add-point-button withdraw" onClick={onWithdrawPointClick}>Withdraw Point</button>
                    :
                      <button className={`add-point-button withdraw ${isAddPointLoading ? 'disable' : ''}`}><i className="fas fa-spinner fa-spin"></i></button>
                  }
                </div>
              )}
            </div>
          </div>
          <div id="account">
            <div id="profileBalance" onClick={() => showProfileMenu()}>
            <div className="profile">
                <img
                  className="profile-img"
                  src={authStore.account.userProfilePic}
                  alt=""
                />
              </div>
              <div className="accountBalance">
                <FaEthereum className="eth-icon" />
                <p className="value">{authStore.account.balance} ETH</p>
              </div>
              {isShowModalMenu && (
                <div id="profile-menu">
                  <div
                    className="menu-profile"
                    onClick={() =>
                      goToProfilePage(authStore.account.userTokenId)
                    }
                  >
                    <p className="menu-text">Profile</p>
                  </div>
                  <div className="menu-log-out" onClick={() => onLogout()}>
                    <p className="menu-text">Log out</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="wallet">
          <button className="connect" onClick={() => onLogin()}>
            <img
              className="metamask"
              src="https://cdn.iconscout.com/icon/free/png-256/metamask-2728406-2261817.png"
              width="25px"
              alt="metamask"
            />
            Connect to a wallet
          </button>
        </div>
      )}
    </div>
  );
});
