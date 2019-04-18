import React, { Component } from "react";
import PropTypes from "prop-types";
import Button from "./Button";

const MAX_FILE_SIZE = 1048576;
const MAX_FILE_SIZE_IN_MB = (MAX_FILE_SIZE / 1024 / 1024).toFixed(0);

class Dropbox extends Component {
  static propTypes = {
    setError: PropTypes.func.isRequired,
    setResult: PropTypes.func.isRequired,
    clearErrors: PropTypes.func.isRequired,
    haveErrors: PropTypes.bool
  };

  state = {
    uploading: false,
    isDragOver: false
  };
  _isMounted = false;

  onSubmit = e => {
    e.preventDefault();
  };

  handleChange = event => {
    this.props.clearErrors();
    this.handleFile(event.target.files);
  };

  handleDragEnter = e => {
    preventDefaults(e);
    this.setState({
      isDragOver: true
    });
  };

  handleDragOver = e => {
    preventDefaults(e);
  };

  handleDragLeave = e => {
    preventDefaults(e);
    this.setState({
      isDragOver: false
    });
  };

  handleDrop = e => {
    preventDefaults(e);
    if (!this.state.uploading) {
      const dt = e.dataTransfer,
        files = dt.files;
      this.handleFile(files);
      this.setState({
        isDragOver: false
      });
    }
  };

  handleFile = files => {
    const checkFile = (file, index) => {
      const { name, size } = file;
      const extensionError = `"${name}" don't have .json or .txt format.`;
      const sizeError = `"${name}" is grater than ${MAX_FILE_SIZE_IN_MB}mb`;
      const parseError = `uploaded file "${name}" can't be parsed as JSON`;
      const uploadError = `can't upload "${name}"`;

      const handleError = text => {
        const err = {
          text,
          key: `${name}_${index}`
        };
        this.props.setError(err);
      };

      /*
        * well, first I planned to check Mime type
        * but instead of application/json I've seen just empty string in real json
        * Whats why I check just file extension
        * .json and .txt passes as valid
        * */

      const fileNameSpread = name.split(".");
      const fileExtension = fileNameSpread[fileNameSpread.length - 1];

      if (fileExtension !== "json" && fileExtension !== "txt") {
        handleError(extensionError);
        return;
      }

      if (size >= MAX_FILE_SIZE) {
        handleError(sizeError);
        return;
      }

      const reader = new FileReader();
      reader.onloadstart = () => {
        if (this._isMounted) {
          this.setState({ uploading: true });
        }
      };
      reader.onloadend = event => {
        if (this._isMounted) {
          this.setState({ uploading: false });
        }
        let parseResult = false;
        // check if JSON is valid
        try {
          parseResult = JSON.parse(event.target.result);
        } catch (error) {
          handleError(parseError);
          return;
        }
        if (parseResult) {
          const newResult = {
            name,
            body: parseResult
          };

          this.props.setResult(newResult);
        }
      };
      reader.onerror = () => {
        handleError(uploadError);
      };

      reader.readAsText(file);
    };
    Array.from(files).map(checkFile);
  };

  componentDidMount() {
    this._isMounted = true;
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  render() {
    let overlay = null,
      modifier = "";
    if (this.state.uploading) {
      overlay = <div className="drop-box__overlay">Loading...</div>;
    }
    if (this.state.isDragOver && !this.state.uploading) {
      modifier = "drop-box_drag-over";
    }
    if (this.props.haveErrors) {
      modifier = "drop-box_error";
    }

    return (
      <form
        onSubmit={this.onSubmit}
        onDragEnter={this.handleDragEnter}
        onDragOver={this.handleDragOver}
        onDragLeave={this.handleDragLeave}
        onDrop={this.handleDrop}
        className={"drop-box " + modifier}
      >
        {overlay}
        <input
          tabIndex="0"
          ref={file => (this.file = file)}
          onChange={this.handleChange}
          type="file"
          id="file"
          multiple
          className="drop-box__input"
        />
        <Button type="label" inputId="file" text="Choose a file" />
        <p className="drop-box__description">
          File have to be JSON in .json/.txt format and less than{" "}
          {this.MAX_FILE_SIZE_IN_MB}mb
        </p>
      </form>
    );
  }
}

function preventDefaults(e) {
  e.stopPropagation();
  e.preventDefault();
}

export default Dropbox;
