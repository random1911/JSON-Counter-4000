import React, { Component, FormEvent, DragEvent, ChangeEvent } from "react";
import Button from "./Button";
import { IError } from "./ErrorBar";
import { IJsonFile } from "./ResultView";

interface IProps {
  setError: (error: IError) => void;
  setResult: (newFile: IJsonFile) => void;
  clearErrors: () => void;
  haveErrors: boolean;
  maxFileSize: number;
}
interface IState {
  uploading: boolean;
  isDragOver: boolean;
  maxFileSizeInMb: string;
}

interface InputFile extends FormEvent {
  target: HTMLInputElement & EventTarget;
}

class Dropbox extends Component<IProps, IState> {
  static defaultProps: Partial<IProps> = {
    maxFileSize: 1048576
  };
  constructor(props: IProps) {
    super(props);
    this.state = {
      uploading: false,
      isDragOver: false,
      maxFileSizeInMb: props.maxFileSize
        ? (props.maxFileSize / 1024 / 1024).toFixed(0)
        : "0"
    };
    this._isMounted = false;
  }
  _isMounted: boolean;

  onSubmit = (e: FormEvent) => {
    e.preventDefault();
  };

  handleChange = (e: InputFile) => {
    this.props.clearErrors();
    this.handleFile(e.target.files);
  };

  handleDragEnter = (e: DragEvent) => {
    preventDefaults(e);
    this.setState({
      isDragOver: true
    });
  };

  handleDragOver = (e: DragEvent) => {
    preventDefaults(e);
  };

  handleDragLeave = (e: DragEvent) => {
    preventDefaults(e);
    this.setState({
      isDragOver: false
    });
  };

  handleDrop = (e: DragEvent) => {
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

  handleFile = (files: FileList | null) => {
    if (!files) return;
    const { setError, maxFileSize } = this.props;
    const checkFile = (currentFile: File, index: number) => {
      const { name, size } = currentFile;
      const extensionError = `"${name}" don't have .json or .txt format.`;
      const sizeError = `"${name}" is grater than ${
        this.state.maxFileSizeInMb
      }mb`;
      const parseError = `uploaded file "${name}" can't be parsed as JSON`;
      const uploadError = `can't upload "${name}"`;

      const handleError = (text: string) => {
        const err = {
          text,
          key: `${name}_${index}`
        };
        setError(err);
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

      if (size >= maxFileSize) {
        handleError(sizeError);
        return;
      }

      const reader = new FileReader();
      reader.onloadstart = () => {
        if (this._isMounted) {
          this.setState({ uploading: true });
        }
      };
      reader.onloadend = () => {
        if (this._isMounted) {
          this.setState({ uploading: false });
        }
        let parseResult = false;
        // check if JSON is valid
        try {
          const { result } = reader;
          if (result) {
            parseResult = JSON.parse(result.toString());
          }
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

      reader.readAsText(currentFile);
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
          tabIndex={0}
          onChange={this.handleChange}
          type="file"
          id="file"
          multiple
          className="drop-box__input"
        />
        <Button type="label" inputId="file" text="Choose a file" />
        <p className="drop-box__description">
          File have to be JSON in .json/.txt format and less than{" "}
          {this.state.maxFileSizeInMb}mb
        </p>
      </form>
    );
  }
}

function preventDefaults(e: DragEvent) {
  e.stopPropagation();
  e.preventDefault();
}

export default Dropbox;
