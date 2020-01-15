/** @jsx jsx */
import React from 'react'
import ReactDOM from 'react-dom'
import { css, jsx } from '@emotion/core' 
import Editor from './ui/editor'
import Toolbar from './ui/toolbar'
import Sublists from './ui/sublists'
import ProjectModal from './ui/projectModal'
import GoalView from './ui/goalView'
import {
  OPEN_DOCUMENT,
  RENDERER_SENDING_SAVE_DATA,
  INITIATE_SAVE,
  INITIATE_NEW_FILE,
  APP_LOADED,
  SENDING_SETTINGS,
  LISTS_UPDATED,
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

class App extends React.Component {
  constructor(){
    super()
    this.state = {
      id: generateId(), // generates a unique id by default
      text: null,
      modalOpen: false,
      listOpen: false,
      goalOpen: false,
      goal: null,
      lists: LISTS,
      projects: [],
      settings: {},
      activeProject: null,
      openingFile: false,
      newDocument: true
    }

    ipcRenderer.on(SENDING_SETTINGS, (event, settings) => {
      console.log('settings', settings)
      // set projects
      if (settings) {
        this.setState({ projects: Object.keys(settings), settings })
      }
    })

    ipcRenderer.on(OPEN_DOCUMENT, (event, data) => { // when saved show notification on screen
      console.log('opening document', data)
      const { text, id, activeProject } = data

      const lists = activeProject ? this.state.settings[activeProject].sublists : []
      console.log('lists from opening', lists)
      this.setState({
        id,
        text,
        openingFile: true,
        lists,
        activeProject,
        newDocument: false
      })
    })

    ipcRenderer.on(INITIATE_SAVE, (event, data) => {
      this.saveDocument(data.saveAs)
      this.setState({ newDocument: false })
    })

    ipcRenderer.on(INITIATE_NEW_FILE, (event, data) => {
      console.log('initiate new file', data)
      // clear out information
      // textArea.value = ''
    })

    ipcRenderer.send(APP_LOADED)

    this.openList = this.openList.bind(this)
    this.closeList = this.closeList.bind(this)
    this.openModal = this.openModal.bind(this)
    this.closeModal = this.closeModal.bind(this)
    this.updateText = this.updateText.bind(this)
    this.updateProjects = this.updateProjects.bind(this)
    this.modifyLists = this.modifyLists.bind(this)
    this.projectSet = this.projectSet.bind(this)
    this.saveDocument = this.saveDocument.bind(this)
    this.openGoal = this.openGoal.bind(this)
    this.closeGoal = this.closeGoal.bind(this)
    this.updateGoal = this.updateGoal.bind(this)
    this.closeAll = this.closeAll.bind(this)
  }

  saveDocument(saveAs = false) {
    const { id, text, activeProject } = this.state
    const payload = {
      text,
      id,
      activeProject
    }
    console.log('initiating save', payload)
    ipcRenderer.send(RENDERER_SENDING_SAVE_DATA, payload, saveAs)
  }

  openGoal() {
    this.setState({ goalOpen: true })
  }
  closeGoal() {
    this.setState({ goalOpen: false })
  }
  updateGoal(event) {
    this.setState({ goal: event.target.value })
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

    if (!this.state.newDocument) {
      console.log('saving projects')
      this.saveDocument()
    }
  }
  closeAll() {
    this.setState({
      modalOpen: false,
      listOpen: false,
      goalOpen: false
    })
  }
  updateText(val) {
    console.log('updating text in renderer', val)
    this.setState({ text: val })
  }
  updateProjects(project, remove = false) {
    const projects = remove 
      ? this.state.projects.filter((proj) => proj !== project) 
      : this.state.projects.concat([project])

    this.setState({ 
      projects,
      activeProject: remove ? null : project
    })
  }
  projectSet(proj) { // assumes project already exist
    const existingProjSettings = this.state.settings[proj]
    if (existingProjSettings) {
      console.log('found existing proj', existingProjSettings)
    }

    this.setState({
      activeProject: proj,
      lists: existingProjSettings ? existingProjSettings.sublists : []
    })
  }
  modifyLists(activeList, delta) {
    const { lists, activeProject } = this.state
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
    ipcRenderer.send(LISTS_UPDATED, newLists, activeProject)
  }

  render() {
    const { lists, text, id, projects, listOpen, modalOpen, openingFile, activeProject, goal, goalOpen } = this.state
    const neitherOpen = !listOpen && !goalOpen
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
            closeAll={this.closeAll}
          />
          { neitherOpen && <Toolbar openList={this.openList} openModal={this.openModal} openGoal={this.openGoal} closeGoal={this.closeGoal} />}
          { listOpen && <Sublists closeList={this.closeList} modifyLists={this.modifyLists} lists={lists} />}
          { goalOpen && <GoalView closeGoal={this.closeGoal} goal={goal} updateGoal={this.updateGoal}/>}

        </div>
        <div id='bottom-spacer' css={bottomSpacerCss} />
        <ProjectModal
          id={id}
          modalOpen={modalOpen}
          projects={projects}
          activeProject={activeProject}
          closeModal={this.closeModal}
          updateProjects={this.updateProjects}
          setActiveProject={this.projectSet}
        />
      </div>
    )
  }
}

ReactDOM.render(<App/>, document.querySelector('#root'))