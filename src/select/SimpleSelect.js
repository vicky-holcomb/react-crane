import _ from 'lodash'
import React, { Component } from 'react'
import PropType from 'prop-types'
import classNames from 'classnames'

import Arrow from './Arrow'
import FocusPlaceholder from './FocusPlaceholder'
import Input from './Input'
import Menu from './Menu'
import Option from './Option'
import Value from './Value'
import ValueGroup from './ValueGroup'

import './select.scss'

// credit to https://github.com/JedWatson/react-select for many patterns and techniques used here
class SimpleSelect extends Component {
  static propTypes = {
    focusPlaceholderComponent: PropType.func,
    inputComponent: PropType.func,
    inputValue: PropType.string,
    isOpen: PropType.bool,
    labelKey: PropType.string,
    menuComponent: PropType.func,
    onBlur: PropType.func,
    onChange: PropType.func,
    onFocus: PropType.func,
    onInputChange: PropType.func,
    optionComponent: PropType.func,
    options: PropType.array,
    placeholder: PropType.string,
    showInput: PropType.bool,
    value: PropType.object,
    valueComponent: PropType.func,
    valueGroupComponent: PropType.func,
    valueKey: PropType.string
  }

  static defaultProps = {
    focusPlaceholderComponent: FocusPlaceholder,
    inputComponent: Input,
    inputValue: '',
    isOpen: false,
    labelKey: 'label',
    menuComponent: Menu,
    onBlur: null,
    onChange: null,
    onFocus: null,
    onInputChange: null,
    optionComponent: Option,
    options: [],
    placeholder: 'Select value...',
    showInput: false,
    value: null,
    valueComponent: Value,
    valueGroupComponent: ValueGroup,
    valueKey: 'value'
  }

  constructor(props) {
    super(props)

    this.state = {
      isOpen: false,
      isFocused: false
    }
  }

  componentDidMount() {
    document.addEventListener('touchstart', this.onDocumentClick, false)
  }

  componentWillUnmount() {
    document.removeEventListener('touchstart', this.onDocumentClick, false)
  }

  onDocumentClick = (event) => {
    if (this.container && !this.container.contains(event.target)) {
      this.setState({ isOpen: false })
    }
  }

  onValueMouseDown = (event) => {
    if (this.isSecondayClick(event)) {
      return
    }

    if (event.target.tagName === 'INPUT') {
      // allow user to select input text
      return
    }

    const isOpen = this.props.isOpen || this.props.showInput ? true : !this.state.isOpen

    event.stopPropagation()
    event.preventDefault()

    this.focus()
    this.setState({ isOpen })
  }

  onInputBlur = (event) => {
    if (this.props.onBlur) {
      this.props.onBlur(event)
    }

    this.setState({
      isOpen: false,
      isFocused: false
    })
  }

  onInputFocus = (event) => {
    if (this.props.onFocus) {
      this.props.onFocus(event)
    }

    this.setState({ isFocused: true })
  }

  onInputChange = (event) => {
    const inputValue = event.target.value

    if (this.props.inputValue === inputValue) {
      return
    }

    if (this.props.onInputChange) {
      this.props.onInputChange(inputValue, event)
    }
  }

  onOptionClick = (event, option) => {
    if (this.isSecondayClick(event)) {
      return
    }

    this.setState({ isOpen: false })

    if (this.props.onChange) {
      this.props.onChange(option)
    }

    this.clearInputValue()
  }

  // check for right-clicks, etc
  isSecondayClick = event => (event.type === 'mousedown' && event.button !== 0)

  focus = () => { this.input.focus() }

  blur = () => { this.input.blur() }

  clearInputValue = (event) => {
    if (this.props.onInputChange) {
      this.props.onInputChange('', event)
    }
  }

  renderMenu() {
    const { labelKey, valueKey, options, optionComponent } = this.props
    const MenuComponent = this.props.menuComponent
    return (
      <div className="crane-select-menu-container">
        <MenuComponent
          labelKey={labelKey}
          onOptionClick={this.onOptionClick}
          optionComponent={optionComponent}
          options={options}
          valueKey={valueKey}
        />
      </div>
    )
  }

  renderInput(isOpen) {
    const inputProps = {
      // TODO implement static list of select ids
      ariaControls: '',
      ariaExpanded: isOpen ? 'true' : 'false',
      getRef: (ref) => { this.input = ref },
      inputValue: this.props.inputValue,
      onBlur: this.onInputBlur,
      onChange: this.onInputChange,
      onFocus: this.onInputFocus
    }
    const InputComponent = this.props.inputComponent

    return this.props.showInput
      ? <InputComponent {...inputProps} />
      : this.renderFocusPlaceholder(inputProps)
  }

  renderFocusPlaceholder(inputProps) {
    const FocusPlaceholderComponent = this.props.focusPlaceholderComponent
    const props = _.omit(inputProps, 'onChange', 'inputValue')
    return <FocusPlaceholderComponent {...props} />
  }

  render() {
    const isFocused = this.state.isFocused
    const isOpen = this.props.isOpen || this.state.isOpen
    const {
      inputValue,
      labelKey,
      placeholder,
      showInput,
      value,
      valueComponent
    } = this.props
    const ValueGroupComponent = this.props.valueGroupComponent
    const selectClassName = classNames('crane-select', { open: isOpen, focus: isFocused })

    return (
      <div className={selectClassName} ref={(container) => { this.container = container }}>
        <div
          className="crane-select-input-group"
          onMouseDown={this.onValueMouseDown}
          role="presentation"
        >
          <ValueGroupComponent
            inputValue={inputValue}
            labelKey={labelKey}
            placeholder={placeholder}
            showInput={showInput}
            value={value}
            valueComponent={valueComponent}
          />
          {this.renderInput(isOpen)}
          <Arrow />
        </div>

        {isOpen && this.renderMenu()}
      </div>
    )
  }
}

export default SimpleSelect