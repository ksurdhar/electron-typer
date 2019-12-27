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
      text: null, // DELTA
    }
    this.quillRef = React.createRef()
    this.quilly = null
    this.modules = {
      toolbar: '#hidden-toolbar'
    }

    this.changeHandler = this.changeHandler.bind(this)
  }

  changeHandler(content, delta, source, editor) {
    this.setState({
      text: editor.getContents()
    })
  }

  // need to handle blur to "go back" or close 
  // needs to render list of lists + create button first
  render() {
    if (!this.quilly && this.quillRef.current) {
      this.quilly = this.quillRef.current.getEditor()
    }

    return (
      <div css={containerCss}>
        <ReactQuill
          ref={this.quillRef}
          defaultValue={this.state.text || ''}
          onChange={this.changeHandler}
          onChangeSelection={(range, source, editor) => {
            console.log('sublist selection changed!')
          }}
          modules={this.modules}
        />
      </div>
    )
  }
}

export default Sublists