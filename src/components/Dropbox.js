import React from 'react';
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
    const
      dt = e.dataTransfer,
      files = dt.files;
    this.handleFile(files);
    this.setState({
      isDragOver: false
    });
  };

  handleFile = (files) => {

    let result = [];
    const checkFile = (file) => {

      const
        MAX_FILE_SIZE = 1048576,
        extensionError = `${file.name}" don't have .json or .txt format.`,
        sizeError = `"${file.name}" is grater then ${(MAX_FILE_SIZE / 1024 / 1024).toFixed(0)}mb`,
        parseError = `uploaded file "${file.name}" can't be parsed as JSON`,
        uploadError = `can't upload "${file.name}"`;

      const handleError = (text) => {
        const
          err = {
            text,
            key: `${file.name}_${Date.now()}`
          },
          errors = this.props.errors;
        /*
        * гайды в интернете не рекомендуют использовать push и склоняют к concat, типа что push - очень медленный,
        * тем не менее, c concat этот код реботал неадекватно и показывал не все ошибки, а с push - все.
        * */
        errors.push(err);
        this.props.setError(errors);
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
        this.setState({uploading: true});
      };
      reader.onloadend = (event) => {
        this.setState({uploading: false});
        let parseResult = false;
        // проверяем, парсится ли полученный объект как JSON
        try {
          parseResult = JSON.parse(event.target.result);
        } catch (error) {
          handleError(parseError);
          return;
        }
        if (parseResult) {

          const resultObject = {
            name: file.name,
            body: parseResult
          };

          result = result.concat([resultObject]);
          /*
          * TODO: Warning: Can only update a mounted or mounting component. This usually means you called setState, replaceState, or forceUpdate on an unmounted component. This is a no-op.
          * Хз, как быть с этой асинхронной магией, но он вроде как работает и ворнинга бы не было, если бы стояло ограничение на 1 файл
          * Но с несколькими-то интереснее. Даже с ворнингом.
          *
          * JavaScript разработчик решил использовать асинхронные запросы, чтобы решить свои проблемы
          * две проблемы
          * Теперь у него
          *
          * */

          this.props.setResult(result);
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


  render(){

    let
      overlay = null,
      modifier = '';
    if(this.state.uploading){
      overlay = <div className="drop-box__overlay">Loading...</div>
    }
    if(this.state.isDragOver){
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
        <label htmlFor="file"
               className="drop-box__button">
          Choose a file
        </label>
        <p className="drop-box__description">
          File have to be JSON in .json/.txt format and less than 1mb
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