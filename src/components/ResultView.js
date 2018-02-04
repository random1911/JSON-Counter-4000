import React from 'react';
import Button from './Button';
import '../styles/ResultView.css'

class ResultView extends React.Component {

  renderResultItem = (item) => {
    return (
      <li key={item.name}
          className="result-view-item">
        <div className="result-view-item__summary">
          <div className="result-view-item__summary-row">
            <span className="result-view-item__summary-caption">File name:</span>
            <span className="result-view-item__name">{item.name}</span>
          </div>
          <div className="result-view-item__summary-row">
            <span className="result-view-item__summary-caption">Objects count:</span>
            <span className="result-view-item__count">
              666
            </span>
          </div>
        </div>
        <div className="result-view-item__details">
          TODO: keys that is objects here
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
          <Button text="Count something else" onClick={() => this.props.resetState()} />
        </div>
      </div>
    )
  }
}

export default ResultView;