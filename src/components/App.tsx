import React, { Component, DragEvent } from "react";
import Header from "./Header";
import ErrorBar, { IError } from "./ErrorBar";
import Dropbox from "./Dropbox";
import ResultView, { IJsonFile } from "./ResultView";

interface IState {
  errors: IError[];
  files: IJsonFile[];
}

class App extends Component<{}, IState> {
  state = {
    errors: [],
    files: []
  };

  // set errors for error bar
  setError = (error: IError) => {
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
  setFiles = (newFile: IJsonFile) => {
    this.setState(prevState => {
      const files = [...prevState.files, newFile];
      return { files };
    });
  };

  // reset state function for button on result view
  resetResult = () => {
    this.setState({
      errors: [],
      files: []
    });
  };

  // handler for drag on result view
  dragHandler = (e: DragEvent) => {
    e.stopPropagation();
    e.preventDefault();
    this.resetResult();
  };

  render() {
    const { errors, files } = this.state;
    const haveErrors: boolean = !!errors.length;
    const haveResult: boolean = !!files.length;

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
              setResult={this.setFiles}
              haveErrors={haveErrors}
              clearErrors={this.clearErrors}
            />
          ) : (
            <ResultView content={files} resetResult={this.resetResult} />
          )}
        </div>
      </div>
    );
  }
}

export default App;
