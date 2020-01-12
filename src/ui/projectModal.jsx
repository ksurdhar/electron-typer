/** @jsx jsx */
import React from 'react'
import { css, jsx } from '@emotion/core'
import Modal from 'react-modal'
import { RENDERER_SETTING_PROJECT, RENDERER_CREATING_PROJECT } from '../actions/types'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import TextField from '@material-ui/core/TextField'
import CheckIcon from '@material-ui/icons/Check'

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

// const ModalPage = (props) => {
//   const { children, value, index, ...other } = props

//   return (
//     <>
//       { value === index ? <div> {children} </div> : null}
//     </>
//   )
// }

class ProjectModal extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      filterString: ''
    }

    this.renderListItems = this.renderListItems.bind(this)
    this.setActiveProj = this.setActiveProj.bind(this)
    this.addProject = this.addProject.bind(this)
  }

  setActiveProj(proj) { 
    const { id, setActiveProject } = this.props
    
    ipcRenderer.send(RENDERER_SETTING_PROJECT, proj, id)
    setActiveProject(proj)
    this.setState({
      filterString: ''
    })
  }

  addProject() {
    const project = this.state.filterString
    ipcRenderer.send(RENDERER_CREATING_PROJECT, project, this.props.id)

    this.setState({ 
      filterString: ''
    })
    this.props.updateProjects(project)
  }

  // highlight / diff style active one
  // button to delete
  renderListItems() {
    const filteredProjs = this.props.projects.filter((proj) => proj.indexOf(this.state.filterString) > -1)
    console.log('filtered projects', filteredProjs)

    if (filteredProjs.length > 0) {
      return filteredProjs.map((proj) => {
        const isActive = proj === this.props.activeProject
        return (
          <ListItem button selected={isActive} onClick={() => this.setActiveProj(proj)} key={proj}>
            <ListItemText primary={proj} />
            { isActive && 
              <ListItemIcon>
                <CheckIcon />
              </ListItemIcon> 
            }
          </ListItem>
        )
      })
    }
    else {
      return (
        <ListItem button onClick={this.addProject}>
          <ListItemText primary="No Match - Create New Project?" />
        </ListItem>
      )
    }
  }

  render() {
    const { modalOpen, closeModal } = this.props

    return (
      <Modal isOpen={modalOpen} onRequestClose={closeModal} style={modalStyles} >
        <div>Projects</div>
        <TextField value={this.state.filterString} onChange={(event) => this.setState({ filterString: event.target.value }) }/>
        <List>
          { this.renderListItems() }
        </List>
      </Modal>
    )
  }
}
  
export default ProjectModal