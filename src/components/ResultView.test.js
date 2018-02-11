import React from 'react';
import { shallow } from 'enzyme';
import ResultView from './ResultView';

describe('<ResultView />', () => {
  const fakeResult = [
    {name: 1, body: [{}, {}, []]},
    {name: 2, body: [{}, {}, [{}, {a: []}]]}
  ];

  it('Have same list items as result array length', ()=> {
    const result = shallow( <ResultView content={fakeResult} />);
    expect(result.find('.result-view-item').length).toEqual(fakeResult.length);
  });
  it('Showing count result', () => {
    const result = shallow( <ResultView content={fakeResult} />);
    expect(result.find('.result-view-item').at(0).find('.result-view-item__count').text()).toEqual('3');
    expect(result.find('.result-view-item').at(1).find('.result-view-item__count').text()).toEqual('6');
  });
});