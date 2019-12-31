/** @jsx jsx */
import React from 'react'
import { css, jsx } from '@emotion/core'
import Modal from 'react-modal'
import Select from 'react-select'

Modal.setAppElement('#root')

const modalStyles = {
  content: {
    width: '50%',
    height: '200px',
    left: '25%',
    top: '25%'
  }
}

class ProjectModal extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      selectedOpt: null
    }

    
  }

  render() {
    const { modalOpen, closeModal, projects } = this.props

    const selectOpts = projects.map((proj) => { return { value: proj, label: proj } })
    // array of 
    return (
      <Modal isOpen={modalOpen} onRequestClose={closeModal} styles={modalStyles}>
        <Select></Select>
      </Modal>
    )
  }
}

export default ProjectModal