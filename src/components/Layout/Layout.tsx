import React, { ReactElement } from 'react'
import Navbar from '../Navbar/Navbar'
import Home from '../Home/Home'
import '../Layout/Layout.scss'

export default function Layout(): ReactElement {
    return (
        <div id='layout' >
            <Navbar />
            <Home />
        </div>
    )
}