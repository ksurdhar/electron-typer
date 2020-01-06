/** @jsx jsx */
import React, {useState, useEffect} from 'react'
import ReactDOM from 'react-dom'
import { css, jsx } from '@emotion/core' 
import Editor from './ui/editor'
import Toolbar from './ui/toolbar'
import Sublists from './ui/sublists'
import ProjectModal from './ui/projectModal'
import {
  OPEN_DOCUMENT,
  RENDERER_SENDING_SAVE_DATA,
  INITIATE_SAVE,
  INITIATE_NEW_FILE,
} from './actions/types'
import { generateId } from './ui/generateId'

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

class App extends React.Component {
  constructor(){
    super()
    this.state = {
      id: null,
      text: null,
      modalOpen: false,
      listOpen: false,
      lists: LISTS,
      projects: [],
      activeProject: null,
      openingFile: false
    }

    ipcRenderer.on(OPEN_DOCUMENT, (event, data) => { // when saved show notification on screen
      console.log('opening document', data)
      const { text, id } = data
      this.setState({
        id,
        text,
        openingFile: true
      })
    })

    ipcRenderer.on(INITIATE_SAVE, (event, data) => {
      const { id, text } = this.state
      const payload = {
        text,
        id: id ? id : generateId(),
      }
      console.log('initiate save', payload)
      ipcRenderer.send(RENDERER_SENDING_SAVE_DATA, payload, data.saveAs)
    })

    ipcRenderer.on(INITIATE_NEW_FILE, (event, data) => {
      console.log('initiate new file', data)
      // clear out information
      // textArea.value = ''
    })

    this.openList = this.openList.bind(this)
    this.closeList = this.closeList.bind(this)
    this.openModal = this.openModal.bind(this)
    this.closeModal = this.closeModal.bind(this)
    this.updateText = this.updateText.bind(this)
    this.updateProjects = this.updateProjects.bind(this)
    this.modifyLists = this.modifyLists.bind(this)
  }

  openList() {
    this.setState({ listOpen: true })
  }
  closeList() {
    this.setState({ listOpen: false })
  }
  openModal() {
    this.setState({ modalOpen: true })
  }
  closeModal() {
    this.setState({ modalOpen: false })
  }
  updateText(val) {
    console.log('updating text in renderer', val)
    this.setState({ text: val })
  }
  updateProjects(projects) {
    this.setState({ projects })
  }
  modifyLists(activeList, delta) {
    const listEntries = delta.reduce((acc, op) => {
      return acc.concat(op.insert.split('\n').filter((val) => val.length > 0).map((val) => val.trim().replace(/\s+/g, '-')))
    }, [])

    const firstEntry = listEntries[0].startsWith('#') ? listEntries[0] : `#${listEntries[0]}`

    const key = !!lists[`${activeList}`] ? `${activeList}` : firstEntry
    const newLists = Object.assign({}, lists)
    newLists[key] = listEntries.slice(1)

    this.setState({
      lists: newLists
    })
  }

  render() {
    const { lists, text, id, projects, listOpen, modalOpen, openingFile } = this.state
    return (
      <div css={containerCss}>
        <div id='top-spacer' css={topSpacerCss} />
        <div id='hidden-toolbar' css={toolbarStyles} />
        <div css={mainCss}>
          <Editor 
            lists={lists} 
            text={text} 
            id={id} 
            setText={this.updateText} 
            openingFile={openingFile} 
            finishedOpening={() => this.setState({ openingFile: false })}
          />
          {!listOpen && <Toolbar openList={this.openList} openModal={this.openModal} />}
          {listOpen && <Sublists closeList={this.closeList} modifyLists={this.modifyLists} lists={lists} />}
        </div>
        <div id='bottom-spacer' css={bottomSpacerCss} />
        <ProjectModal
          id={id}
          modalOpen={modalOpen}
          projects={projects}
          closeModal={this.closeModal}
          updateProjects={this.updateProjects}
        />
      </div>
    )
  }
}

ReactDOM.render(<App/>, document.querySelector('#root'))