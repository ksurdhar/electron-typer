/** @jsx jsx */
import React from 'react'
import ReactQuill, { Quill } from 'react-quill'
import { css, jsx } from '@emotion/core'
const Delta = Quill.import('delta')

import 'react-quill/dist/quill.snow.css'

const containerCss = css`
  width: 40%;
  padding: 0 10px 0 10px;
`

class Sublists extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      activeList: null,
      text: ''
    }
    this.quillRef = React.createRef()
    this.quilly = null
    this.modules = {
      toolbar: '#hidden-toolbar'
    }

    this.changeHandler = this.changeHandler.bind(this)
    this.renderListUi = this.renderListUi.bind(this)
    this.blurHandler = this.blurHandler.bind(this)
    this.openList = this.openList.bind(this)
  }

  changeHandler(content, delta, source, editor) {
    this.setState({
      text: editor.getContents()
    })
  }

  openList(listName) {
    const lines = this.props.lists[listName] ? this.props.lists[listName].reduce((acc, current) => {
      return acc.concat([
        { insert: current },
        { insert: '\n' },
      ])
    }, []) : [{ insert: '' }]

    const delta = [
      { insert: listName, attributes: { bold: true } },
      { insert: '\n' },
    ].concat(lines)
    console.log('listname', listName)
    this.setState({
      activeList: listName, 
      text: new Delta(delta)
    })
  }

  renderListUi() {
    const { lists } = this.props
    const keys = Object.keys(lists)

    const listButtons = keys.map((listName) => {
      return (
        <button key={listName} onClick={() => this.openList(listName)}>
          { listName }
        </button>
      )
    })
    return (
      <div>
        { listButtons }
        <button onClick={() => this.openList(' ')}>Create List</button>
      </div>
    )
  }

  blurHandler() {
    this.props.modifyLists(this.state.activeList, this.state.text)
    this.setState({
      activeList: null, // closes list
    })
  }

  componentDidUpdate(prevProps, prevState) {
    const wasEditing = prevState.activeList
    const isEditing = this.state.activeList

    if (!wasEditing && isEditing && this.quillRef) {
      this.quillRef.current.focus()
    }
  }

  render() {
    const { activeList, text } = this.state
    return (
      <div css={containerCss} onBlur={this.blurHandler}>
        { activeList && <ReactQuill
          ref={this.quillRef}
          defaultValue={text || ''}
          onChange={this.changeHandler}
          onChangeSelection={(range, source, editor) => {
            if (!this.quilly) {
              this.quilly = this.quillRef && this.quillRef.current && this.quillRef.current.getEditor()
            }
            // console.log('selection change', range)
          }}
          modules={this.modules}
        /> }
        { !activeList && this.renderListUi() }
      </div>
    )
  }
}

export default Sublists