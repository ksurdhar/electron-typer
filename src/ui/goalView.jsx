/** @jsx jsx */
import React from 'react'
import { css, jsx } from '@emotion/core'
import TextField from '@material-ui/core/TextField'

class Toolbar extends React.Component {
  constructor(props) {
    super(props)
  }

  // input
  render() {
    return (
      <>
        <TextField type="number" defaultValue={this.props.goal || 0} onChange={this.props.updateGoal}/>
      </>
    )
  }
}

export default Toolbar