import React, { Component } from 'react';
import Header from './Header';
import Dropbox from './Dropbox';
import ErrorBar from './ErrorBar';

class App extends Component {

  state = {
    error: false
  };

  handleError = (error) => {
    this.setState({ error })
  };

  render() {

    let displayError = null;
    if(this.state.error){
      displayError = <ErrorBar errorText={this.state.error} />
    }

    return (
      <div className="app-wrapper">
        <Header />
        <div className="app-body">
          {displayError}
          <Dropbox
            handleError={this.handleError}
            error={this.state.error}
          />
        </div>
      </div>
    );
  }
}

export default App;
