import React, { Component } from 'react';
import Header from './Header';
import ErrorBar from './ErrorBar';
import Dropbox from './Dropbox';
import ResultView from './ResultView';

class App extends Component {

  state = {
    errors: [],
    result: []
  };

  // вывести собщения об ошиках
  setError = (error) => {
    this.setState(prevState => {
      const errors = prevState.errors.concat(error);
      return {errors};
    })
  };

  // очистить сообщения об ошибках
  clearErrors = () => {
    this.setState({
      errors: []
    })
  };

  // передать на подсчет валидные JSON файлы
  setResult = (newResult) => {
    //this.setState({ result })
    this.setState(prevState => {
      const result = prevState.result.concat(newResult);
      return {result};
    })
  };

  // обнуление стейта для кнопки на резльтате
  resetResult = () => {
    this.setState({
      errors: [],
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
    if(this.state.errors.length){
      displayError = (
        <ErrorBar
          errors={this.state.errors}
          clearErrors={this.clearErrors}
        />
      )
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
          setError={this.setError}
          setResult={this.setResult}
          errors={this.state.errors}
          clearErrors={this.clearErrors}
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
