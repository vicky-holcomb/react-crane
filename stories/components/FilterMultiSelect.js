import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import { MultiSelect } from '../../src'
import { filterOptions, flattenOptions, getLabel, getSelectValue } from '../../src/select/utils'

export default class FilterMultiSelect extends React.Component {
  static propTypes = {
    allowSelectAll: PropTypes.bool,
    allOption: PropTypes.object,
    getLabel: PropTypes.func,
    getOptionLabel: PropTypes.func,
    groupByKey: PropTypes.string,
    groupTitleKey: PropTypes.string,
    groupValueKey: PropTypes.string,
    labelKey: PropTypes.string,
    name: PropTypes.string,
    options: PropTypes.array.isRequired,
    onChange: PropTypes.func,
    value: PropTypes.array,
    valueKey: PropTypes.string
  }

  static defaultProps = {
    allowSelectAll: false,
    allOption: {
      value: 'Select All',
      id: '*'
    },
    getLabel,
    getOptionLabel: getLabel,
    groupByKey: '',
    groupTitleKey: 'title',
    groupValueKey: 'groupId',
    labelKey: '',
    name: '',
    onChange: null,
    value: null,
    valueKey: 'value'
  }

  constructor(props) {
    super(props)

    this.state = {
      inputValue: '',
      value: []
    }
  }

  onChange = (event) => {
    const { onChange } = this.props

    this.setState({ value: event.value.map(val => (val[this.props.valueKey])) })

    if (onChange) {
      onChange(event)
    }
  }

  onInputChange = (event) => {
    this.setState({ inputValue: event.value })
  }

  getSelectValue = (vals) => {
    const { value } = vals
    const { allOption, allowSelectAll, options } = this.props
    const flatOpts = flattenOptions(options, allowSelectAll, allOption)
    const selectValueProps = {
      ...this.props,
      value,
      options: flatOpts
    }
    return getSelectValue(selectValueProps)
  }

  isAllSelected = (values) => {
    const { allOption, allowSelectAll, options } = this.props
    const flatOpts = flattenOptions(options, allowSelectAll, allOption)
    return values.length === flatOpts.length - 1
  }

  render() {
    const { options } = this.props
    const { inputValue, value } = this.state
    const controlProps = _.omit(this.props, 'onInputChange', 'options')
    const opts = filterOptions(options, inputValue, this.props)

    return (
      <MultiSelect
        {...controlProps}
        inputValue={inputValue}
        options={opts}
        onChange={this.onChange}
        onInputChange={this.onInputChange}
        getSelectValue={this.getSelectValue}
        isAllSelected={this.isAllSelected}
        value={value}
        showInput
        ignoreCase
      />
    )
  }
}
