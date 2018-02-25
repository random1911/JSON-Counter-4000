import React from 'react';
import Button from './Button';
import '../styles/Dropbox.css';

class Dropbox extends React.Component {

  /*
   * Использовалась информация:
   * https://reactjs.org/docs/forms.html
   * https://developer.mozilla.org/en-US/docs/Web/API/File/Using_files_from_web_applications
   * */

  state = {
    uploading: false,
    isDragOver: false
  };
  _MAX_FILE_SIZE = 1048576;
  MAX_FILE_SIZE_IN_MB = (this._MAX_FILE_SIZE / 1024 / 1024).toFixed(0);

  /*
  * https://reactjs.org/blog/2015/12/16/ismounted-antipattern.html
  * Для решения проблемы
  * Warning: Can only update a mounted or mounting component. This usually means you called setState, replaceState, or forceUpdate on an unmounted component. This is a no-op.
  * */
  _isMounted = false;


  onSubmit = (e) => {
    e.preventDefault();
  };

  handleChange = (event) => {
    this.props.clearErrors();
    this.handleFile(event.target.files);
  };

  handleDragEnter = (e) => {
    preventDefaults(e);
    this.setState({
      isDragOver: true
    })
  };

  handleDragOver = (e) => {
    preventDefaults(e);
  };

  handleDragLeave = (e) => {
    preventDefaults(e);
    this.setState({
      isDragOver: false
    })
  };

  handleDrop = (e) => {
    preventDefaults(e);
    if(!this.state.uploading){
      const
        dt = e.dataTransfer,
        files = dt.files;
      this.handleFile(files);
      this.setState({
        isDragOver: false
      });
    }
  };

  handleFile = (files) => {

    const checkFile = (file) => {

      const
        MAX_FILE_SIZE = this._MAX_FILE_SIZE,
        extensionError = `"${file.name}" don't have .json or .txt format.`,
        sizeError = `"${file.name}" is grater than ${this.MAX_FILE_SIZE_IN_MB}mb`,
        parseError = `uploaded file "${file.name}" can't be parsed as JSON`,
        uploadError = `can't upload "${file.name}"`;

      const handleError = (text) => {
        const
          err = {
            text,
            key: `${file.name}_${Date.now()}`
          };
        this.props.setError(err);
      };

      /*
        * Вообще я планировал сделать проверку на Mime type и пытаться отпарсить
        * application/json и text/plain, и был сильно удивлен, что в file.type в JSON
        * приходит просто пустая строка. Вероятно, это какие-то неведомые мне подводные камни.
        * Остается проверить расшрение файла, допустить .json и .txt, а потом попробовать их отпарсить
        * */

      const
        // чтобы получить расширение файла беру имя файла, режу на массив по точке и беру его последний элемент
        fileNameSpread = file.name.split('.'),
        fileExtension = fileNameSpread[fileNameSpread.length - 1];

      //проверяем расширение
      if (fileExtension !== 'json' && fileExtension !== 'txt') {
        handleError(extensionError);
        return;
      }

      // проверяем на размер файла
      if (file.size >= MAX_FILE_SIZE) {
        handleError(sizeError);
        return;
      }

      const reader = new FileReader();
      reader.onloadstart = (event) => {
        if(this._isMounted){
          this.setState({uploading: true});
        }
      };
      reader.onloadend = (event) => {
        if(this._isMounted){
          this.setState({uploading: false});
        }
        let parseResult = false;
        // проверяем, парсится ли полученный объект как JSON
        try {
          parseResult = JSON.parse(event.target.result);
        } catch (error) {
          handleError(parseError);
          return;
        }
        if (parseResult) {
          const newResult = {
            name: file.name,
            body: parseResult
          };

          this.props.setResult(newResult);
        }

      };
      reader.onerror = (event) => {
        handleError(uploadError);
      };

      reader.readAsText(file);
    };
    for (let i=0; i<files.length; i++) {
      checkFile(files[i]);
    }

  };

  componentDidMount() {
    this._isMounted = true;
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  render(){

    let
      overlay = null,
      modifier = '';
    if(this.state.uploading){
      overlay = <div className="drop-box__overlay">Loading...</div>
    }
    if(this.state.isDragOver && !this.state.uploading){
      modifier = 'drop-box_drag-over';
    }
    if(this.props.errors.length){
      modifier = 'drop-box_error';
    }

    return (
      <form onSubmit={this.onSubmit}
            onDragEnter={this.handleDragEnter}
            onDragOver={this.handleDragOver}
            onDragLeave={this.handleDragLeave}
            onDrop={this.handleDrop}
            className={"drop-box " + modifier}>
        {overlay}
        <input
          tabIndex="0"
          ref={(file) => this.file = file}
          onChange={this.handleChange}
          type="file"
          id="file"
          multiple
          className="drop-box__input"
        />
        <Button
          type="label"
          inputId="file"
          text="Choose a file"
        />
        <p className="drop-box__description">
          File have to be JSON in .json/.txt format and less than {this.MAX_FILE_SIZE_IN_MB}mb
        </p>

      </form>
    )
  }
}

function preventDefaults(e) {
  e.stopPropagation();
  e.preventDefault();
}

export default Dropbox;