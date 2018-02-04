import React from 'react';
import Button from './Button';
import '../styles/ResultView.css'

class ResultView extends React.Component {

  getCountResult = (json) => {
    let
      counter = 0,
      keys = []
    function registerObject(key) {
      counter++;
      keys = keys.concat([key]);
    }

    function countObject(target){
      for(let key in target){
        if( typeof target[key] === 'object' && target[key]!== null){
          console.log(key + ' is object');
          registerObject(key);
          countObject(target[key]);
        }
      }
    }
    countObject(json);
    return {counter, keys};
  };

  renderResultItem = (item) => {
    const
      countResult = this.getCountResult(item.body);
    //console.log(countResult.keys.map(addLineEnding));
    const keys = countResult.keys.join('\n');

    return (
      <li key={item.name}
          className="result-view-item">
        <div className="result-view-item__summary">
          <div className="result-view-item__summary-row">
            <span className="result-view-item__label">File name:</span>
            <span className="result-view-item__name">{item.name}</span>
          </div>
          <div className="result-view-item__summary-row">
            <span className="result-view-item__label">Objects count:</span>
            <span className="result-view-item__count">
              {countResult.counter}
            </span>
          </div>
        </div>
        <div className="result-view-item__details">
          <span className="result-view-item__label">Keys:</span>
          <textarea
            readOnly="true"
            className="result-view-item__keys-list"
            defaultValue={keys}>
          </textarea>
        </div>
      </li>
    )
  };

  render(){

    return (
      <div className="result-view">
        <h2 className="result-view-caption">Here is a counting result:</h2>
        <ul className="result-view-list">
          {this.props.content.map(this.renderResultItem)}
        </ul>
        <div className="result-view-footer">
          <Button text="Count something else" onClick={() => this.props.resetResult()} />
        </div>
      </div>
    )
  }
}

export default ResultView;