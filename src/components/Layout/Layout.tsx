import React, { ReactElement } from 'react'
import Navbar from '../Navbar/Navbar'
import Home from '../Home/Home'
import Map from '../Map/Map'
import Market from '../Market/Market'
import '../Layout/Layout.scss'
import { Switch, Route } from 'react-router-dom'

export default function Layout(): ReactElement {
    return (
        <div id='layout' >
            <Navbar />
            <Switch>
                <Route exact path='/' component={Home}/>
                <Route exact path='/map' component={Map} />
                <Route exact path='/market' component={Market} />
                <Route exact path='*' component={Home} />
            </Switch>
            
        </div>
    )
}