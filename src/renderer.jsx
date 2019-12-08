/** @jsx jsx */
import React from 'react'
import ReactDOM from 'react-dom'
import { css, jsx } from '@emotion/core' 
import { Editor } from './ui/editor'
import './index.css'

const toolbarStyles = css`
  display: none
`

const App = () => {
  return (
    <>
      <div id='hidden-toolbar' css={toolbarStyles} />
      <Editor/>
    </>
  )
}

ReactDOM.render(<App/>, document.querySelector('#root'))