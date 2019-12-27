/** @jsx jsx */
import React from 'react'
import ReactQuill from 'react-quill'
import { css, jsx } from '@emotion/core'

import 'react-quill/dist/quill.snow.css'

const containerCss = css`
  width: 30%;
  padding: 0 10px 0 10px;
`

class Sublists extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      activeList: null,
    }
    this.quillRef = React.createRef()
    this.quilly = null
    this.modules = {
      toolbar: '#hidden-toolbar'
    }

    this.changeHandler = this.changeHandler.bind(this)
    this.renderListUi = this.renderListUi.bind(this)
  }

  changeHandler(content, delta, source, editor) {
    // this.setState({
    //   text: editor.getContents()
    // })
    const text = editor.getContents()
    console.log('change! value:', text)
    this.props.modifyList(text)
  }

  renderListUi() {
    const keys = Object.keys(this.props.lists)
    const listButtons = keys.map((listName) => {
      return (
        <button key={listName} onClick={() => this.setState({ activeList: listName })}>
          { listName }
        </button>
      )
    })
    return (
      <div>
        { listButtons }
        <button>Create List</button>
      </div>
    )
  }

  // need to handle blur to "go back" or close 
  // needs to render list of lists + create button first
  render() {
    const { activeList } = this.state
    if (!this.quilly && this.quillRef.current) {
      this.quilly = this.quillRef.current.getEditor()
    }
    const isEditing = activeList.length > 0
    // get the values from a list 
    // editing (typing) should be modifying state on the parent 

    return (
      <div css={containerCss}>
        { isEditing && <ReactQuill
          ref={this.quillRef}
          defaultValue={text || ''}
          onChange={this.changeHandler}
          onChangeSelection={(range, source, editor) => {
            console.log('sublist selection changed!')
          }}
          modules={this.modules}
        /> }
        { !isEditing && this.renderListUi() }
        
      </div>
    )
  }
}

export default Sublists