import React from 'react';
import Layout from './components/Layout/Layout';
import './App.scss';
import { BrowserRouter } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <React.Fragment>
        <Layout />
      </React.Fragment>
    </BrowserRouter>
  );
}

export default App;
