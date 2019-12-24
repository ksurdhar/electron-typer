import React, { useState } from 'react'
import ReactQuill from 'react-quill'
// import Quill from 'quill'

import 'react-quill/dist/quill.snow.css'

const ROW_HEIGHT = 18 // hardcoded. would be better if dynamic

// const editorHeight = wrapperRef.current.clientHeight - 26 // removes padding
// const totalRows = editorHeight / ROW_HEIGHT

class Editor extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      text: '',
      word: '',
      row: 1
    }
    this.quillRef = React.createRef()
    this.quilly = null
    this.modules = {
      toolbar: '#hidden-toolbar',
      keyboard: {
        bindings: {
          tab: {
            key: 9,
            handler: (range) => {
              // console.log('hello', range)
              console.log('test state', this.state)
            }
          }
        }
      }
    }
  }

  determineWord(range) {
    const [blot, offset] = this.quilly.getLeaf(range.index)

    const secondHalf = blot.text ? blot.text.substring(offset - 1) : ''
    const firstHalf = blot.text ? blot.text.substring(0, offset - 1) : ''

    const firstSubstr = firstHalf.split(' ').pop()
    const secondSubstr = secondHalf.split(' ')[0]

    return `${firstSubstr}${secondSubstr}`
  }

  colorRows(range) {
    const [line, offset] = this.quilly.getLine(range.index)
    const charactersInRow = line.cache.length
    const endOfLinePosition = range.index + charactersInRow - offset

    // up to current row
    this.quilly.formatText(0, endOfLinePosition, {
      'color': 'black'
    })
    // beneath current row
    this.quilly.formatText(endOfLinePosition, this.quilly.getLength(), {
      'color': 'blue'
    })
  }

  render() {
    const changeHandler = (content, delta, source, editor) => {
      this.setState({
        text: content
      })
    }

    const keyPressHandler = (event) => {
      // console.log('key press', event.key)
      // get the current index
      // parse the whole document :(
      // regex for the word where we are
      // if the world
    }

    return (
      <div>
        <ReactQuill
          ref={this.quillRef}
          value={this.state.text}
          onKeyPress={keyPressHandler}
          onChange={changeHandler}
          onChangeSelection={(range, source, editor) => {
            const { top } = editor.getBounds(range.index)
            const rowNumber = (top - 14 + ROW_HEIGHT) / ROW_HEIGHT
            // console.log(rowNumber)
            if (this.state.row !== rowNumber) {
              setTimeout(() => {
                window.scrollTo({ top: top - 14, behavior: 'smooth' })
              }, 200)
            }

            if (!this.quilly) {
              this.quilly = this.quillRef.current.getEditor()
            }
        
            this.colorRows(range)

            this.setState({
              row: rowNumber,
              word: this.determineWord(range)
            })
          }}
          modules={this.modules}
        />
      </div>
    )
  }
}

export default Editor