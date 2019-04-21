import React, {FC} from "react";

// from https://github.com/random1911/universal-button

interface IProps {
  type?: "button" | "link" | "label";
  onClick: () => void;
  url?: string;
  inputId?: string;
  baseClass?: string;
  modifier?: string | string[];
  text?: string;
  icon?: string;
  postIcon?: string;
  title?: string;
  disabled?: boolean;
}

const Button: FC<IProps> = ({
  type = 'button',
  onClick = () => {},
  url,
  inputId,
  baseClass = 'button',
  modifier,
  text,
  icon,
  postIcon,
  disabled,
  title
}) => {
  const getCSSModifiers = (modifier: undefined | string | string[]) => {
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

  const renderIcon = (name: string) => {
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
          type={type}
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

export default Button;
