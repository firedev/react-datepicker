import moment from 'moment'
import React from 'react'
import { isSameDay, isDayDisabled } from './date_utils'

var DateInput = React.createClass({
  displayName: 'DateInput',

  propTypes: {
    date: React.PropTypes.object,
    dateFormat: React.PropTypes.string,
    disabled: React.PropTypes.bool,
    excludeDates: React.PropTypes.array,
    filterDate: React.PropTypes.func,
    includeDates: React.PropTypes.array,
    locale: React.PropTypes.string,
    maxDate: React.PropTypes.object,
    minDate: React.PropTypes.object,
    onBlur: React.PropTypes.func,
    onChange: React.PropTypes.func,
    onChangeDate: React.PropTypes.func,
    onKeyDown: React.PropTypes.func
  },

  getDefaultProps () {
    return {
      dateFormat: 'L'
    }
  },

  getInitialState () {
    return {
      maybeDate: this.safeDateFormat(this.props)
    }
  },

  componentWillReceiveProps (newProps) {
    if (!isSameDay(newProps.date, this.props.date) ||
        newProps.locale !== this.props.locale ||
          newProps.dateFormat !== this.props.dateFormat) {
      this.setState({
        maybeDate: this.safeDateFormat(newProps)
      })
    }
  },

  handleChange (event) {
    if (this.props.onChange) {
      this.props.onChange(event)
    }
    if (!event.isDefaultPrevented()) {
      this.handleChangeDate(event.target.value)
    }
  },

  handleKeyDown (event) {
    if (event.key === 'Enter' || event.key === 'Tab') {
      var value = this.state.maybeDate
      var date = moment(value, false)
      if (date.isValid() && !isDayDisabled(date, this.props)) {
        this.props.onChangeDate(date)
        this.props.onKeyDown(event)
      } else if (value === '') {
        this.props.onChangeDate(null)
        this.props.onKeyDown(event)
      }
    }
    if (event.key !== 'Enter') {
      this.props.onKeyDown(event)
    }
  },

  handleChangeDate (value) {
    this.setState({
      maybeDate: value
    })
  },

  safeDateFormat (props) {
    return props.date && props.date.clone()
      .locale(props.locale || moment.locale())
      .format(props.dateFormat)
  },

  handleBlur (event) {
    this.setState({
      maybeDate: this.safeDateFormat(this.props)
    })
    if (this.props.onBlur) {
      this.props.onBlur(event)
    }
  },

  focus () {
    this.refs.input.focus()
  },

  render () {
    const {
      date,
      dateFormat,
      excludeDates,
      filterDate,
      includeDates,
      locale,
      maxDate,
      minDate,
      onChangeDate,
      ...inputProps
    } = this.props

    return <input
        ref='input'
        type='text'
        {...inputProps}
        value={this.state.maybeDate}
        onBlur={this.handleBlur}
        onKeyDown={this.handleKeyDown}
        onChange={this.handleChange} />
  }
})

module.exports = DateInput
