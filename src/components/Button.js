import React from 'react';
import '../styles/Button.css';

class Button extends React.Component{
  /*
  * Почему я пишу всё это, вместо того, чтобы использовать тег button?
  * Стилизация. К button не добавляются псевдоэлементы,
  * а ИЕ и вовсе "продавливает" нажатия, и это не отключить
  * Сам реакт говорит мне, что я не прав, но они там, наверное, последний раз видели ИЕ очень давно
  * */

  handleClick = (e) => {
    e.preventDefault();
    this.props.onClick();
  };

  render(){
    return (
      <a onClick={(e) => this.handleClick(e)}
         href="#"
         tabIndex="0"
         className="button">
        {this.props.text}
      </a>
    )
  }
}

export default Button;