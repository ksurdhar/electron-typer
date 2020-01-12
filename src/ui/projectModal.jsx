/** @jsx jsx */
import React, { useState } from 'react'
import { css, jsx } from '@emotion/core'
import Modal from 'react-modal'
import Creatable from 'react-select/creatable'
import { RENDERER_SETTING_PROJECT, RENDERER_CREATING_PROJECT } from '../actions/types'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'

Modal.setAppElement('#root')

const modalStyles = {
  content: {
    width: '50%',
    maxHeight: '300px',
    left: '25%',
    top: '10%'
  }
}

const containerCss = css`
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
`

const ModalPage = (props) => {
  const { children, value, index, ...other } = props

  return (
    <>
      { value === index ? <div> {children} </div> : null}
    </>
  )
}

const ProjectModal = (props) => {
  const [value, setValue] = useState(0)
  const { modalOpen, closeModal, projects, updateProjects, id, setActiveProject, activeProject } = props
  const options = projects.map((proj) => { return { value: proj, label: proj } })

  const setOption = (option) => {
    console.log('option selected', option)
    const project = option && option.value || null
    if (option) {
      ipcRenderer.send(RENDERER_SETTING_PROJECT, project, id)
    }
    setActiveProject(project)
  }

  const addProject = (project) => {
    console.log('option added')
    ipcRenderer.send(RENDERER_CREATING_PROJECT, project, id)

    updateProjects(project)
  }

  const tabClick = (event, newValue) => {
    setValue(newValue)
  }

  const placeholder = projects.length > 0 ? 'Select' : 'Type Project Name'
  // probably needs an explanation - question icon 
  return (
    <Modal isOpen={modalOpen} onRequestClose={closeModal} style={modalStyles} >
      <div>Set Project</div>
      <Tabs value={value} onChange={tabClick}>
        <Tab label="Set Projects" id={0}/>
        <Tab label="Delete Projects" id={1}/>
      </Tabs>
      <ModalPage value={value} index={0}>
        <Creatable
          styles={{ container: (provided) => { return { ...provided } } }}
          isClearable
          placeholder={placeholder}
          formatCreateLabel={(val) => `Create New Project`}
          noOptionsMessage={() => 'no projects exist yet'}
          value={activeProject ? { label: activeProject, value: activeProject } : ''}
          onChange={setOption}
          onCreateOption={addProject}
          options={options}
        />
      </ModalPage>
      <ModalPage value={value} index={1}>
        <span>hello world</span>
      </ModalPage>
    </Modal>
  )
}

export default ProjectModal