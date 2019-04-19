import React from "react";
import PropTypes from "prop-types";
import Button from "./Button";

const ErrorBar = ({ errors, clearErrors }) => {
  const renderError = ({ key, text }) => {
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

ErrorBar.propTypes = {
  errors: PropTypes.arrayOf(
    PropTypes.shape({ text: PropTypes.string, key: PropTypes.string })
  ).isRequired,
  clearErrors: PropTypes.func.isRequired
};

export default ErrorBar;
