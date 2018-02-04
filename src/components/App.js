import React, { Component } from 'react';
import Header from './Header';
import ErrorBar from './ErrorBar';
import Dropbox from './Dropbox';
import ResultView from './ResultView';

class App extends Component {

  state = {
    error: false,
    result: []
  };

  // вывести собщения об ошиках
  handleError = (error) => {
    this.setState({ error })
  };

  // передать на подсчет валидные JSON файлы
  setResult = (result) => {
    this.setState({ result })
  };

  // обнуление стейта для кнопки на резльтате
  resetResult = () => {
    this.setState({
      result: []
    })
  };

  // хэндлер на случай, если возникло желание перетянуть что-то на форму результата
  dragHandler = (e) => {
    e.stopPropagation();
    e.preventDefault();
    this.resetResult();
  };

  render() {

    let
      displayError = null,
      contentToDisplay;
    if(this.state.error){
      displayError = <ErrorBar errorText={this.state.error} />
    }
    if(this.state.result.length){
      contentToDisplay = (
        <ResultView
          content={this.state.result}
          resetResult={this.resetResult}
        />
      );
    }else{
      contentToDisplay = (
        <Dropbox
          handleError={this.handleError}
          setResult={this.setResult}
          error={this.state.error}
        />
      );
    }

    return (
      <div className="app-wrapper"
           onDragEnter={this.dragHandler}>
        <Header />
        <div className="app-body">
          {displayError}
          {contentToDisplay}
        </div>
      </div>
    );
  }
}

export default App;
