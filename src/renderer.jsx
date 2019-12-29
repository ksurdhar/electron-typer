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

const LISTS = { // want to set in state, eventually redux or something
  '#characters': ['Ezra', 'Lautreque', 'Kyhia'],
  '#locations': ['Orach', 'Gomyr', 'Glitterrun']
}

const App = () => {
  const [ listOpen, setListOpen ] = useState(false)
  const [ lists, setLists ] = useState(LISTS)

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

  const modifyLists = (activeList, delta) => {
    const listEntries = delta.reduce((acc, op) => {
      return acc.concat(op.insert.split('\n').filter((val) => val.length > 0))
    }, [])

    const newLists = Object.assign({}, lists)
    newLists[`${activeList}`] = listEntries.slice(1)

    setLists(newLists)
  }

  console.log('list open', listOpen)
  return (
    <div css={containerCss} ref={containerRef}>
      <div id='top-spacer' css={topSpacerCss}/>
      <div id='hidden-toolbar' css={toolbarStyles} />
      <div css={mainCss}>
        <Editor getContainer={getContainer} lists={lists}/>
        {!listOpen && <Toolbar openList={openList}/> }
        { listOpen && <Sublists closeList={closeList} modifyLists={modifyLists} lists={lists}/> }
      </div>
      <div id='bottom-spacer' css={bottomSpacerCss}/>
    </div>
  )
}

ReactDOM.render(<App/>, document.querySelector('#root'))