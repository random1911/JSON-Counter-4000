import React, { Component } from "react";
import Header from "./Header";
import ErrorBar from "./ErrorBar";
import Dropbox from "./Dropbox";
import ResultView from "./ResultView";

class App extends Component {
  state = {
    errors: [],
    result: []
  };

  // set errors for error bar
  setError = error => {
    this.setState(prevState => {
      const errors = [...prevState.errors, error];
      return { errors };
    });
  };

  // clear errors for error bar
  clearErrors = () => {
    this.setState({
      errors: []
    });
  };

  // set valid json files to count
  setResult = newResult => {
    this.setState(prevState => {
      const result = [...prevState.result, newResult];
      return { result };
    });
  };

  // reset state function for button on result view
  resetResult = () => {
    this.setState({
      errors: [],
      result: []
    });
  };

  // handler for drag on result view
  dragHandler = e => {
    e.stopPropagation();
    e.preventDefault();
    this.resetResult();
  };

  render() {
    const { errors, result } = this.state;
    const haveErrors = !!errors.length;
    const haveResult = !!result.length;

    return (
      <div className="app-wrapper" onDragEnter={this.dragHandler}>
        <Header />
        <div className="app-body">
          {haveErrors && (
            <ErrorBar errors={errors} clearErrors={this.clearErrors} />
          )}
          {!haveResult ? (
            <Dropbox
              setError={this.setError}
              setResult={this.setResult}
              haveErrors={haveErrors}
              clearErrors={this.clearErrors}
            />
          ) : (
            <ResultView content={result} resetResult={this.resetResult} />
          )}
        </div>
      </div>
    );
  }
}

export default App;
