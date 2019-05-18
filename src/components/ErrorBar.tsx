import React, { FC } from "react";
import Button from "./Button";

export interface IError {
  key: string;
  text: string;
}

interface IProps {
  errors: IError[];
  clearErrors: () => void;
}

const ErrorBar: FC<IProps> = ({ errors, clearErrors }) => {
  const renderError = ({ key, text }: IError) => {
    return (
      <li key={key} className="error-bar__item">
        <strong>Error:</strong> {text}
      </li>
    );
  };

  return (
    <div className="error-bar">
      <ol className="error-bar__content">{errors.map(renderError)}</ol>
      <Button
        baseClass="error-bar-reset"
        title="Clear errors"
        onClick={clearErrors}
      />
    </div>
  );
};

export default ErrorBar;
