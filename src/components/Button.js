import React from "react";
import PropTypes from "prop-types";

// from https://github.com/random1911/universal-button

const Button = ({
  type,
  onClick,
  url,
  inputId,
  baseClass,
  modifier,
  text,
  icon,
  postIcon,
  disabled,
  title
}) => {
  const getCSSModifiers = modifier => {
    if (!modifier) return "";
    let modifiers;
    if (typeof modifier === "string") {
      modifiers = modifier.split(",");
    } else if (Array.isArray(modifier)) {
      modifiers = [...modifier];
    }
    if (!modifiers || !modifiers.length) return "";
    const result = modifiers.map(name => `${baseClass}_${name.trim()}`);
    return ` ${result.join(" ")}`;
  };

  const combinedClass = `${baseClass}${getCSSModifiers(modifier)}`;

  const renderIcon = name => {
    const iconClass = `${baseClass}__icon`;
    return <span className={`${iconClass} ${iconClass}_${name}`} />;
  };

  const inner = (
    <span className={`${baseClass}__inner`}>
      {icon && renderIcon(icon)}
      {text && <span className={`${baseClass}__text`}>{text}</span>}
      {text && postIcon && renderIcon(postIcon)}
    </span>
  );

  switch (type) {
    case "link":
      return (
        <a title={title} className={combinedClass} href={url}>
          {inner}
        </a>
      );
    case "label":
      return (
        <label title={title} className={combinedClass} htmlFor={inputId}>
          {inner}
        </label>
      );
    default: {
      return (
        <button
          title={title}
          className={combinedClass}
          disabled={disabled}
          onClick={onClick}
        >
          {inner}
        </button>
      );
    }
  }
};

Button.propTypes = {
  type: PropTypes.oneOf(["button", "link", "label"]),
  onClick: PropTypes.func,
  url: PropTypes.string,
  inputId: PropTypes.string,
  baseClass: PropTypes.string,
  modifier: PropTypes.any,
  text: PropTypes.string,
  icon: PropTypes.string,
  postIcon: PropTypes.string,
  title: PropTypes.string,
  disabled: PropTypes.bool
};
Button.defaultProps = {
  baseClass: "button",
  onClick: () => {},
  type: "button"
};

export default Button;
