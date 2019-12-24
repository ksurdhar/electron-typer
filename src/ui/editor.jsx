import React, { useState } from 'react'
import ReactQuill from 'react-quill'
// import Quill from 'quill'

import 'react-quill/dist/quill.snow.css'

const ROW_HEIGHT = 18 // hardcoded. would be better if dynamic

// const editorHeight = wrapperRef.current.clientHeight - 26 // removes padding
// const totalRows = editorHeight / ROW_HEIGHT

// set position of editor where you want it
// when row changes, animate upwards.
// did it by adjusting scrollheight with spacers to make it 100% height immediately 

class Editor extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      text: '',
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

  render() {
    const changeHandler = (content, delta, source, editor) => {
      this.setState({
        text: content
      })
    }

    const colorRows = (range) => {
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

            this.setState({
              row: rowNumber
            })
            colorRows(range)

            // console.log('leaf', quilly.getLeaf(range.index))
            const [blot, offset] = this.quilly.getLeaf(range.index)
            const secondHalf = blot.text.substring(offset - 1)
            const firstHalf = blot.text.substring(0, offset - 1)

            const firstSubstr = firstHalf.split(' ').pop()
            const secondSubstr = secondHalf.split(' ')[0]

            const word = `${firstSubstr}${secondSubstr}`
            console.log('word', word)

            // const revIndex = blot.text.length - offset
            // console.log('rev index', revIndex)
          }}
          modules={this.modules}
        />
      </div>
    )
  }
}

export default Editor