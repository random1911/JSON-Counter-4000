import React from 'react';
import { shallow } from 'enzyme';
import ErrorBar from './ErrorBar';

describe('<ErrorBar />', () => {
  const list = [
    {key:0, text: 'a'},
    {key:1, text: 'b'},
    {key:2, text: 'c'},
  ];


  it('renders wrapper', () => {
    const bar = shallow( <ErrorBar errors={[]} />);
    expect(bar.find('.error-bar').length).toEqual(1);
  });

  it('display all errors from the props', () => {
    const bar = shallow( <ErrorBar errors={list} />);
    expect(bar.find('.error-bar__item').length).toEqual(list.length);
  });

});


