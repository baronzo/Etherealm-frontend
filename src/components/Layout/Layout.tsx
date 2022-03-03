import React, { ReactElement, useContext, useEffect, useMemo } from 'react'
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

export default function Layout(): ReactElement {
    return (
        <div id='layout' >
            <Navbar />
            <Switch>
                <Route exact path='/' component={Home}/>
                <Route exact path='/map' component={Map} />
                <Route exact path='/market' component={Market} />
                <Route exact path='/auction' component={Auction}/>
                <Route exact path='/bid' component={Bid} />
                <Route exact path='/profile' component={OwnerProfile}/>
                <Route exact path='/profile/1' component={OthersProfile}/>
                <Route exact path='/:landTokenId/edit' component={EditLand} />
                <Route exact path='/detail' component={LandDetail} />
                <Route exact path='*' component={Home} />
            </Switch>
        </div>
    )
}