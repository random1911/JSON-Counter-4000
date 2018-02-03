import React, { Component } from 'react';
import Header from './Header';
import Dropbox from './Dropbox';

class App extends Component {
  render() {
    return (
      <div className="app-wrapper">
        <Header />
        <div className="app-body">
          <Dropbox />
        </div>
      </div>
    );
  }
}

export default App;
