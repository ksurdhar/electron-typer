/** @jsx jsx */
import React, {useState} from 'react'
import ReactDOM from 'react-dom'
import { css, jsx } from '@emotion/core' 
import Editor from './ui/editor'
import Toolbar from './ui/toolbar'
import Sublists from './ui/sublists'

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
`

const bottomSpacerCss = css`
  height: calc(60% - 22px);
  background-color: #fffaf4;
`

const mainCss = css`
  display: flex;
  justify-content: space-around;
`

const App = () => {
  const [ listOpen, setListOpen ] = useState(false)
  let containerRef = React.createRef()
  const getContainer = () => {
    return containerRef
  }

  const openList = () => {
    setListOpen(true)
  }
  const closeList = () => {
    setListOpen(false)
  }

  console.log('list open', listOpen)
  return (
    <div css={containerCss} ref={containerRef}>
      <div id='top-spacer' css={topSpacerCss}/>
      <div id='hidden-toolbar' css={toolbarStyles} />
      <div css={mainCss}>
        <Editor getContainer={getContainer} />
        {!listOpen && <Toolbar openList={openList}/> }
        { listOpen && <Sublists closeList={closeList}/> }
      </div>
      <div id='bottom-spacer' css={bottomSpacerCss}/>
    </div>
  )
}

ReactDOM.render(<App/>, document.querySelector('#root'))