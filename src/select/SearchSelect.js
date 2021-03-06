import _ from 'lodash'
import React, { Component } from 'react'
import PropTypes from 'prop-types'

import SimpleSelect from './SimpleSelect'

class SearchSelect extends Component {
  static propTypes = {
    value: PropTypes.object,
    inputValue: PropTypes.string.isRequired,
    onChange: PropTypes.func,
    onInputChange: PropTypes.func.isRequired
  }

  static defaultProps = {
    value: null,
    onChange: null
  }

  constructor(props) {
    super(props)

    this.state = { value: null }
  }

  onChange = (eventContext, event) => {
    this.setState({ value: eventContext.value })

    if (this.props.onChange) {
      this.props.onChange(eventContext, event)
    }
  }

  render() {
    const props = _.omit(this.props, 'onChange')
    const value = this.props.value || this.state.value

    return (
      <SimpleSelect
        {...props}
        value={value}
        onChange={this.onChange}
        clearInputOnBlur={false}
        clearInputOnSelect={false}
        showInput
      />
    )
  }
}

export default SearchSelect
