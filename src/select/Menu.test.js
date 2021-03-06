import React from 'react'
import { shallow } from 'enzyme'

import Menu from './Menu'

it('does not explode', () => {
  const menu = <Menu onOptionClick={() => {}} menuRef={() => {}} />
  const wrapper = shallow(menu)

  expect(wrapper).not.toBeEmpty()
})
