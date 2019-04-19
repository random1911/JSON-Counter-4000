import React, { Component } from "react";
import PropTypes from "prop-types";
import Button from "./Button";

class ResultView extends Component {
  static propTypes = {
    resetResult: PropTypes.func.isRequired,
    content: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string,
        body: PropTypes.oneOfType([PropTypes.object, PropTypes.array])
      })
    )
  };
  getCountResult = json => {
    let counter = 0;
    let keys = [];
    const registerObject = key => {
      counter += 1;
      // register keys/indexes where objects was found
      keys = [...keys, key];
    };

    // recursive function for counting arrays and objects
    const countObject = target => {
      const keys = Object.keys(target);
      keys.forEach(key => {
        const current = target[key];
        if (typeof current === "object" && current !== null) {
          registerObject(key);
          countObject(current);
        }
      });
    };
    countObject(json);
    return { counter, keys };
  };

  renderResultItem = ({ name, body }) => {
    const countResult = this.getCountResult(body);
    const keys = countResult.keys.join("\n");
    return (
      <li key={name} className="result-view-item">
        <div className="result-view-item__summary">
          <div className="result-view-item__summary-row">
            <span className="result-view-item__label">File name:</span>
            <span className="result-view-item__name">{name}</span>
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
            readOnly
            className="result-view-item__keys-list"
            defaultValue={keys}
          />
        </div>
      </li>
    );
  };

  render() {
    const { content, resetResult } = this.props;
    return (
      <div className="result-view">
        <h2 className="result-view-caption">Here is a counting result:</h2>
        <ul className="result-view-list">
          {content.map(this.renderResultItem)}
        </ul>
        <div className="result-view-footer">
          <Button text="Count something else" onClick={resetResult} />
        </div>
      </div>
    );
  }
}

export default ResultView;
