/** @jsx jsx */
import React, {useState} from 'react'
import ReactDOM from 'react-dom'
import { css, jsx } from '@emotion/core' 
import Editor from './ui/editor'
import Toolbar from './ui/toolbar'
import Sublists from './ui/sublists'
import ProjectModal from './ui/projectModal'

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

const PROJECTS = ['project1']

const App = () => {
  const [ modalOpen, setModalOpen] = useState(false)
  const [ listOpen, setListOpen ] = useState(false)
  const [ lists, setLists ] = useState(LISTS)
  const [ projects, setProjects ] = useState(PROJECTS)

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

  const openModal = () => {
    setModalOpen(true)
  }
  const closeModal = () => {
    setModalOpen(false)
  }

  const modifyLists = (activeList, delta) => {
    const listEntries = delta.reduce((acc, op) => {
      return acc.concat(op.insert.split('\n').filter((val) => val.length > 0).map((val) => val.trim().replace(/\s+/g, '-')))
    }, [])

    const firstEntry = listEntries[0].startsWith('#') ? listEntries[0] : `#${listEntries[0]}`

    const key = !!lists[`${activeList}`] ? `${activeList}` : firstEntry
    const newLists = Object.assign({}, lists)
    newLists[key] = listEntries.slice(1)

    setLists(newLists)
  }

  return (
    <div css={containerCss} ref={containerRef}>
      <div id='top-spacer' css={topSpacerCss}/>
      <div id='hidden-toolbar' css={toolbarStyles} />
      <div css={mainCss}>
        <Editor getContainer={getContainer} lists={lists}/>
        {!listOpen && <Toolbar openList={openList} openModal={openModal}/> }
        { listOpen && <Sublists closeList={closeList} modifyLists={modifyLists} lists={lists}/> }
      </div>
      <div id='bottom-spacer' css={bottomSpacerCss}/>
      <ProjectModal modalOpen={modalOpen} closeModal={closeModal} projects={projects}/>
    </div>
  )
}

ReactDOM.render(<App/>, document.querySelector('#root'))