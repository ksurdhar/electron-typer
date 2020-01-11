/** @jsx jsx */
import { useState } from 'react'
import { css, jsx } from '@emotion/core'
import Modal from 'react-modal'
import Creatable from 'react-select/creatable'
import { RENDERER_SETTING_PROJECT, RENDERER_CREATING_PROJECT } from '../actions/types'

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

const ProjectModal = (props) => {
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

  const placeholder = projects.length > 0 ? 'Select' : 'Type Project Name'
  // probably needs an explanation - question icon 
  return (
    <Modal isOpen={modalOpen} onRequestClose={closeModal} style={modalStyles} >
      <div>Set Project</div>
      <div css={containerCss}>
        <Creatable
          styles={{container: (provided) => { return { ...provided } } }} 
          isClearable 
          placeholder={placeholder}
          formatCreateLabel={(val) => `Create New Project`}
          noOptionsMessage={() => 'no projects exist yet'}
          value={activeProject ? { label: activeProject, value: activeProject } : ''} 
          onChange={setOption} 
          onCreateOption={addProject} 
          options={options}
        />
      </div>
    </Modal>
  )
}

export default ProjectModal