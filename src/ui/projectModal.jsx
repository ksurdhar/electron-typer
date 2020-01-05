/** @jsx jsx */
import { useState } from 'react'
import { css, jsx } from '@emotion/core'
import Modal from 'react-modal'
import Creatable from 'react-select/creatable'
import { RENDERER_SETTING_PROJECT } from '../actions/types'

Modal.setAppElement('#root')

const modalStyles = {
  content: {
    width: '50%',
    height: '200px',
    left: '25%',
    top: '25%'
  }
}

const containerCss = css`
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
`

const ProjectModal = (props) => {
  const [ selectedOpt, setSelectedOpt ] = useState()
  const { modalOpen, closeModal, projects, updateProjects } = props
  const options = projects.map((proj) => { return { value: proj, label: proj } })

  const setOption = (option) => {
    console.log('option selected', option)
    setSelectedOpt(option)
  }

  const addProject = (project) => {
    updateProjects(projects.concat([project]))
    setSelectedOpt({ value: project, label: project })
  }

  const okHandler = () => {
    console.log('ok clicked, sending', selectedOpt.value)
    ipcRenderer.send(RENDERER_SETTING_PROJECT, selectedOpt.value)
    this.props.closeModal()
  }

  const placeholder = projects.length > 0 ? 'Select' : 'Type Project Name'
  // probably needs an explanation - question icon 
  return (
    <Modal isOpen={modalOpen} onRequestClose={closeModal} style={modalStyles}>
      <div>Set Project</div>
      <div css={containerCss}>
        <Creatable
          styles={{container: (provided) => { return { ...provided } } }} 
          isClearable 
          placeholder={placeholder}
          formatCreateLabel={(val) => `Create New Project`}
          noOptionsMessage={() => 'no projects exist yet'}
          value={selectedOpt} 
          onChange={setOption} 
          onCreateOption={addProject} 
          options={options}
        />
        <button onClick={okHandler}>Ok</button>
        <button onClick={this.props.closeModal}>Cancel</button>
      </div>
    </Modal>
  )
}

export default ProjectModal