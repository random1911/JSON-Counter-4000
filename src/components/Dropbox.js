import React from 'react';
import '../styles/Dropbox.css';

class Dropbox extends React.Component {

  state = {
    uploading: false
  };


  //property initializers, конечно, пока экспириментальная возмжность, но вызывать конструктов ради
  // this.methodName = this.methodName.bind(this) как-то тоже не круто.
  onSubmit = (e) => {
    e.preventDefault();
    console.log(e.target)
  };

  /*
    * Использовалась информация:
    * https://reactjs.org/docs/forms.html
    * https://developer.mozilla.org/en-US/docs/Web/API/File/Using_files_from_web_applications
    * */
  handleChange = (event) => {

    const file = event.target.files[0];
    console.log(file);
    console.log(file.type === 'application/json');
    const reader = new FileReader();
    reader.onloadstart = (event) => {
      console.log('load start');
      this.setState({uploading: true});
    };
    reader.onloadend = (event) => {
      this.setState({uploading: false});
      console.log(event.target.result)
    };

    reader.readAsText(file);

    /*
    let reader = new FileReader();
    reader.readAsText(event.target.files[0]);
    reader.onloadstart = (event) => {
      console.log('load start');
    };
    reader.onerror = (event) => {
      console.log('error');
    };
    reader.onloadend = (event) => {
      console.log('load end');
      console.log(event.target.result);
      let obj = JSON.parse(event.target.result);
      console.log(obj);
    };
    reader.onload = (event) => {
      console.log('onload');

    };
    */


  };

  render(){

    let overloay = null;
    if(this.state.uploading){
      overloay = <div className="drop-box__overlay">Loading...</div>
    }

    return (
      <form onSubmit={this.onSubmit}
            className="drop-box">
        {overloay}
        <input
          ref={(file) => this.file = file}
          onChange={this.handleChange}
          accept="application/json"
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