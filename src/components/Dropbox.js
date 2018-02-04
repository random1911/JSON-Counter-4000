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
    const file = event.target.files[0];
    this.handleFile(file);
  };

  handleDragEnter = (e) => {
    e.stopPropagation();
    e.preventDefault();
  };

  handleDragOver = (e) => {
    e.stopPropagation();
    e.preventDefault();
  };

  handleDrop = (e) => {
    e.stopPropagation();
    e.preventDefault();
    console.log('drop');

    const
      dt = e.dataTransfer,
      files = dt.files;

    if(files.length>1){
      //TODO: подумать над вариантом множественной обработки - как и где выводить её результаты
      this.props.handleError(`we can handle only one file`);
    }else{
      this.handleFile(files[0]);
    }
  };

  handleFile = (file) => {

    const
      MAX_FILE_SIZE = 1048576,
      extensionError = `the file must be in .txt or .json format.`,
      sizeError = `the file size must be less than ${(MAX_FILE_SIZE/1024/1024).toFixed(0)}mb`,
      parseError = `uploaded file "${file.name}" can't be parsed as JSON`,
      uploadError = `can't upload "${file.name}"`;

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
    if(fileExtension !== 'json' && fileExtension !== 'txt'){
      this.props.handleError(extensionError);
      return;
    }

    // проверяем на размер файла
    if(file.size>=MAX_FILE_SIZE){
      this.props.handleError(sizeError);
      return;
    }

    const reader = new FileReader();
    reader.onloadstart = (event) => {
      console.log('load start');
      this.setState({uploading: true});
    };
    reader.onloadend = (event) => {
      this.setState({uploading: false});
      let parseResult = false;
      // проверяем, парсится ли полученный объект как JSON
      try {
        parseResult = JSON.parse(event.target.result);
      } catch (err){
        this.props.handleError(parseError);
      }
      if(parseResult){
        this.props.handleError(false);

        console.log(`Yeah, seems like ${file.name} is a JSON`)
        //TODO: собственно считать объекты, причем где-нибудь не тут


      }

    };
    reader.onerror = (event) => {
      this.props.handleError(uploadError);
    };

    reader.readAsText(file);

  };


  render(){

    let
      overlay = null,
      modifier = null;
    if(this.state.uploading){
      overlay = <div className="drop-box__overlay">Loading...</div>
    }
    if(this.props.error){
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

export default Dropbox;