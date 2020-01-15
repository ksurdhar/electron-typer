/** @jsx jsx */
import React from 'react'
import { css, jsx } from '@emotion/core'

const listButtonCss = css`
  background-color: #505050;
  color: white;
  border-radius: 20px;
  height: 30px;
  width: 30px;
  border: none;
`

class Toolbar extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <>
        <button onClick={this.props.openList} css={listButtonCss}>
          <span>+</span>
        </button>
        <button onClick={this.props.openModal} css={listButtonCss}>
          <span>p</span>
        </button>
        <button onClick={this.props.openGoal} css={listButtonCss}>
          <span>g</span>
        </button>
      </>
    )
  }
}

export default Toolbar