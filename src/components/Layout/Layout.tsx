import React, { Children, ReactComponentElement, ReactElement, useContext, useEffect, useMemo, useState } from 'react'
import Navbar from '../Navbar/Navbar'
import Home from '../Home/Home'
import Map from '../Map/Map'
import Bid from '../Bid/Bid'
import Market from '../Market/Market'
import Auction from '../Auction/Auction'
import EditLand from '../EditLand/EditLand'
import LandDetail from '../LandDetail/LandDetail'
import '../Layout/Layout.scss'
import { Switch, Route } from 'react-router-dom'
import OwnerProfile from '../profile/ownerProfile/OwnerProfile'
import OthersProfile from '../profile/othersProfile/OthersProfile'
import { observer } from 'mobx-react'
import AuthStore from '../../store/auth'
import AccountModel from '../../models/auth/AccountModel'

interface IProps {
    children: React.FunctionComponent
}

export default observer(function Layout(props: IProps): ReactElement {

    useEffect(() => {
    }, [props.children])

    return (
        <div id='layout' >
            <Navbar/>
            <props.children/>
        </div>
    )
})