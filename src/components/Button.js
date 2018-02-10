import React from 'react';
import '../styles/Button.css';

const Button = (props) => {
  return (
    <button className="button"
            onClick={() => props.onClick()}>
        <span className="button__label">
          {props.text}
        </span>
    </button>
  )
};

export default Button;