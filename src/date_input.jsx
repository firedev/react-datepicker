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
    onFocus: React.PropTypes.func
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

  handleKeyDown: function(e) {
    if (e.key === 'Enter' || e.key === 'Tab') {
      var value = this.state.maybeDate
      var date = moment(value, false)
      if (date.isValid() && !isDayDisabled(date, this.props)) {
        this.props.onChangeDate(date)
        this.props.onKeyDown(e)
      } else if (value === '') {
        this.props.onChangeDate(null)
        this.props.onKeyDown(e)
      }
    }
    if (e.key !== 'Enter') {
      this.props.onKeyDown(e)
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
    return <input
      ref='input'
      type='text'
      {...this.props}
      value={this.state.maybeDate}
      onBlur={this.handleBlur}
      onKeyDown={this.handleKeyDown}
      onChange={this.handleChange}
    />
  }
})

module.exports = DateInput
