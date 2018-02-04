import React from 'react';
import '../styles/ErrorBar.css';

const ErrorBar = (props) => {

  const
    renderError = (error) => {
      return (
        <li key={error.key}
            className="error-bar__item">
          <strong>Error:</strong> {error.text}
        </li>
      )
    },
    onClearErrors = (e) => {
      e.preventDefault();
      props.clearErrors()
    };


  return (
    <div className="error-bar">
      <ol className="error-bar__content">
        {props.errors.map(renderError)}
      </ol>
      <a href="#"
         tabIndex="0"
         title="Clear errors"
         onClick={(e) => onClearErrors(e)}
         className="error-bar__reset" />
    </div>
  )
};

export default ErrorBar;