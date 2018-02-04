import React from 'react';
import '../styles/Dropbox.css';

class Dropbox extends React.Component {

  /*
   * Использовалась информация:
   * https://reactjs.org/docs/forms.html
   * https://developer.mozilla.org/en-US/docs/Web/API/File/Using_files_from_web_applications
   * */

  state = {
    uploading: false
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
  };

  handleDragOver = (e) => {
    preventDefaults(e);
  };

  handleDrop = (e) => {
    preventDefaults(e);

    const
      dt = e.dataTransfer,
      files = dt.files;
    this.handleFile(files);
  };

  handleFile = (files) => {

    let result = [];
    const checkFile = (file) => {

      const
        MAX_FILE_SIZE = 1048576,
        extensionError = `${file.name}" don't have .txt or .json format.`,
        sizeError = `"${file.name}" is grater then ${(MAX_FILE_SIZE / 1024 / 1024).toFixed(0)}mb`,
        parseError = `uploaded file "${file.name}" can't be parsed as JSON`,
        uploadError = `can't upload "${file.name}"`;

      const handleError = (text) => {
        //TODO: проверить надобность initErrors
        let initErrors;
        if (!this.props.errors.length) {
          initErrors = []
        } else {
          initErrors = this.props.errors;
        }
        const
          err = {
            text,
            key: Date.now()
          },
          errors = initErrors.concat([err]);
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
          handleError(parseError)
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
          * Но с несколькими то интереснее. Даже с ворнингом.
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
    if(this.props.errors.length){
      modifier = 'drop-box_error'
    }

    return (
      <form onSubmit={this.onSubmit}
            onDragEnter={this.handleDragEnter}
            onDragOver={this.handleDragOver}
            onDrop={this.handleDrop}
            className={"drop-box " + modifier}>
        {overlay}
        <input
          ref={(file) => this.file = file}
          onChange={this.handleChange}
          type="file"
          name="file"
          className="drop-box__input"
        />
        <input
          type="submit"
          value="Submit"
          className="drop-box__submit"
        />
      </form>
    )
  }
}

function preventDefaults(e) {
  e.stopPropagation();
  e.preventDefault();
}

export default Dropbox;