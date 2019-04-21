import React, { FC } from "react";
import Button from "./Button";

export interface IJsonFile {
  name: string;
  body: any;
}

interface IProps {
  content: IJsonFile[];
  resetResult: () => void;
}

const ResultView: FC<IProps> = ({ content, resetResult }) => {
  console.log('content', content)
  const getCountResult = (json: any) => {
    let counter: number = 0;
    let keys: string[] = [];
    const registerObject = (key: string) => {
      counter += 1;
      // register keys/indexes where objects were found
      keys = [...keys, key];
    };

    // recursive function for counting arrays and objects
    const countObject = (target: any) => {
      const keys = Object.keys(target);
      keys.forEach(key => {
        const current = target[key];
        if (typeof current === "object" && current !== null) {
          registerObject(key.toString());
          countObject(current);
        }
      });
    };
    countObject(json);
    return { counter, keys };
  };

  const renderResultItem = ({ name, body }: IJsonFile) => {
    const countResult = getCountResult(body);
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

  return (
    <div className="result-view">
      <h2 className="result-view-caption">Here is a counting result:</h2>
      <ul className="result-view-list">{content.map(renderResultItem)}</ul>
      <div className="result-view-footer">
        <Button text="Count something else" onClick={resetResult} />
      </div>
    </div>
  );
};

export default ResultView;
