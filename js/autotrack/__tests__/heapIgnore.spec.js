/**
 * @jest-environment jsdom
 */
import React from 'React';
import { shallow, mount, render } from 'enzyme';

const Foo = (props) => {
  return 'asdf';
}

const wrapper = mount(<Foo />);

describe('Common autotrack utils', () => {
  it('is true', () => {
    expect(true).toBe(true);
    const myComponents = wrapper.find(Foo);
    console.log(myComponents);
    console.log(myComponents.getElement());
  });
});
