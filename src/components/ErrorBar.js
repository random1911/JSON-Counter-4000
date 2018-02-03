import React from 'react';
import '../styles/ErrorBar.css';

const ErrorBar = (props) => {
  return (
    <div className="error-bar">
      <strong>Error:</strong> {props.errorText}
    </div>
  )
};

export default ErrorBar;