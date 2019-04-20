import React, { Component } from "react";
import PropTypes from "prop-types";
import Button from "./Button";

class Dropbox extends Component {
  static propTypes = {
    setError: PropTypes.func.isRequired,
    setResult: PropTypes.func.isRequired,
    clearErrors: PropTypes.func.isRequired,
    haveErrors: PropTypes.bool,
    maxFileSize: PropTypes.number
  };
  static defaultProps = {
    maxFileSize: 1048576
  };
  constructor(props) {
    super(props);
    this.state = {
      uploading: false,
      isDragOver: false
    };
    this._isMounted = false;
    this.maxFileSizeInMb = (props.maxFileSize / 1024 / 1024).toFixed(0);
  }

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
    this.setState({
      isDragOver: false
    });
    if (this.state.uploading) return;
    this.props.clearErrors();
    const dt = e.dataTransfer;
    const files = dt.files;
    this.handleFile(files);
  };

  handleFile = files => {
    const checkFile = (file, index) => {
      const { name, size } = file;
      const extensionError = `"${name}" don't have .json or .txt format.`;
      const sizeError = `"${name}" is grater than ${this.maxFileSizeInMb}mb`;
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
        * First I planned to check Mime type
        * but instead of application/json I've seen just empty string in real json
        * Whats why I check just file extension
        * .json and .txt passes as valid
        * */

      const fileNameSplitted = name.split(".");
      const fileExtension = fileNameSplitted[fileNameSplitted.length - 1];

      if (fileExtension !== "json" && fileExtension !== "txt") {
        handleError(extensionError);
        return;
      }

      if (size >= this.props.maxFileSize) {
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
    const { uploading, isDragOver } = this.state;
    const { haveErrors } = this.props;
    const getModifier = () => {
      const base = " drop-box_";
      if (isDragOver && !uploading) {
        return `${base}drag-over`;
      }
      if (haveErrors) {
        return `${base}error`;
      }
      return "";
    };

    return (
      <form
        onSubmit={this.onSubmit}
        onDragEnter={this.handleDragEnter}
        onDragOver={this.handleDragOver}
        onDragLeave={this.handleDragLeave}
        onDrop={this.handleDrop}
        className={`drop-box${getModifier()}`}
      >
        {uploading && <div className="drop-box__overlay">Loading...</div>}
        <input
          tabIndex="0"
          onChange={this.handleChange}
          type="file"
          id="file"
          multiple
          className="drop-box__input"
        />
        <Button type="label" inputId="file" text="Choose a file" />
        <p className="drop-box__description">
          File have to be JSON in .json/.txt format and less than{" "}
          {this.maxFileSizeInMb}mb
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
