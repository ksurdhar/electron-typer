/** @jsx jsx */
import React from 'react'
import ReactDOM from 'react-dom'
import { css, jsx } from '@emotion/core' 
import Editor from './ui/editor'
import './index.css'

const toolbarStyles = css`
  display: none;
`

const containerCss = css`
  height: 100%;
`

const topSpacerCss = css`
  height: calc(40% - 22px);
  background-color: #fffaf4;
;
`

const bottomSpacerCss = css`
  height: calc(60% - 22px);
  background-color: #fffaf4;
`

const App = () => {
  let containerRef = React.createRef()
  const getContainer = () => {
    return containerRef
  }
  return (
    <div css={containerCss} ref={containerRef}>
      <div id='top-spacer' css={topSpacerCss}/>
      <div id='hidden-toolbar' css={toolbarStyles} />
      <Editor getContainer={getContainer} />
      <div id='bottom-spacer' css={bottomSpacerCss}/>
    </div>
  )
}

ReactDOM.render(<App/>, document.querySelector('#root'))