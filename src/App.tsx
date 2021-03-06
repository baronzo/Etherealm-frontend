import React from 'react';
import Layout from './components/Layout/Layout';
import './App.scss';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Home from './components/Home/Home';
import Market from './components/Market/Market';
import Auction from './components/Auction/Auction';
import Bid from './components/Bid/Bid';
import OwnerProfile from './components/profile/ownerProfile/OwnerProfile';
import EditLand from './components/EditLand/EditLand';
import LandDetail from './components/LandDetail/LandDetail';
import Map from './components/Map/Map';
import TestMap from './components/Map/TestMap';
import About from './components/About/About';

function App() {

  return (
    <BrowserRouter>
      <React.Fragment>
        <Switch>
          <Route exact path='/'><Layout children={Home}/></Route>
          <Route exact path='/map'><Layout children={Map}/></Route>
          <Route exact path='/map2'><Layout children={TestMap}/></Route>
          <Route exact path='/market'><Layout children={Market}/></Route>
          <Route exact path='/auction'><Layout children={Auction}/></Route>
          <Route exact path='/bid'><Layout children={Bid}/></Route>
          <Route exact path='/profile/:userTokenId'><Layout children={OwnerProfile}/></Route>
          <Route exact path='/lands/:landTokenId/edit'><Layout children={EditLand}/></Route>
          <Route exact path='/lands/:landTokenId/details'><Layout children={LandDetail}/></Route>
          <Route exact path='/about'><Layout children={About}/></Route>
          <Route exact path='*'><Layout children={Home}/></Route>
        </Switch>
      </React.Fragment>
    </BrowserRouter>
  );
}

export default App;
