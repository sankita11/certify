import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom'

import CreateCertificate from './containers/CreateCertificate';
import CertificateList from './containers/CertificateList';

import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
  return (

  <BrowserRouter>
    <div className="App bg-light d-flex flex-column">
      <nav className="navbar bg-white">
        <div className="container-fluid justify-content-center">
          <span className="navbar-text">
            Certify your Art
          </span>
        </div>
      </nav>
      <div className="container flex-grow-1 d-flex flex-columnn">
        <Switch>
          <Route path="/" exact component={CertificateList} />
          <Route path="/new" exact component={CreateCertificate} />
        </Switch>
      </div>
    </div>
  </BrowserRouter>
    
  );
}

export default App;
