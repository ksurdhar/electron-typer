/** @jsx jsx */
import React from 'react'
import ReactDOM from 'react-dom'
import { css, jsx } from '@emotion/core' 
import { Editor } from './ui/editor'
import './index.css'

const toolbarStyles = css`
  display: none;
`

const containerCss = css`
  height: 100%;
`

const topSpacerCss = css`
  height: calc(40% - 22px);
  background-color: red;
`

const bottomSpacerCss = css`
  height: calc(60% - 22px);
  background-color: blue;
`

const App = () => {
  return (
    <div css={containerCss}>
      <div id='top-spacer' css={topSpacerCss}/>
      <div id='hidden-toolbar' css={toolbarStyles} />
      <Editor/>
      <div id='bottom-spacer' css={bottomSpacerCss}/>
    </div>
  )
}

ReactDOM.render(<App/>, document.querySelector('#root'))