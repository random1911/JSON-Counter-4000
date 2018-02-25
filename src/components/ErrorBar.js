import React from 'react';
import Button from './Button';

const ErrorBar = (props) => {

  const renderError = (error) => {
    return (
      <li key={error.key}
          className="error-bar__item">
        <strong>Error:</strong> {error.text}
      </li>
    )
  };


  return (
    <div className="error-bar">
      <ol className="error-bar__content">
        {props.errors.map(renderError)}
      </ol>
      <Button
        baseClass="error-bar-reset"
        tip="Clear errors"
        action={props.clearErrors}
      />
    </div>
  )
};

export default ErrorBar;