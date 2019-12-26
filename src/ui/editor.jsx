import React from 'react'
import ReactQuill from 'react-quill'
import Quill from 'quill'
const Delta = Quill.import('delta')

import 'react-quill/dist/quill.snow.css'

const ROW_HEIGHT = 18 // hardcoded. would be better if dynamic

// const editorHeight = wrapperRef.current.clientHeight - 26 // removes padding
// const totalRows = editorHeight / ROW_HEIGHT

class Editor extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      text: null, // DELTA
      word: {}, // { start: x, end: y}
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
              // console.log('test state', this.state)
              const wordLength = this.state.word.end - this.state.word.start + 1
              console.log('WORD LENGTH', wordLength)
              this.quilly.setSelection(this.state.word.start, wordLength)
              // if (this.state.word === '#characters') {
              //   console.log('MATCH!')
              //   // const newStr = this.state.text.slice().replace(/#characters/, 'Ezra')
              //   // console.log(this.state.text)
              //   const newDelta = this.quilly.insertText(0, 'ezra')
              //   console.log('new delta', newDelta)
              //   this.setState({ text: newDelta })
              //   // this.setState({
              //   //   text: newStr
              //   // })
              // } else {
              //   console.log('NO MATCH')
              // }
            }
          }
        }
      }
    }

    this.changeHandler = this.changeHandler.bind(this)
  }

  determineWord(range) {
    const [blot, offset] = this.quilly.getLeaf(range.index)
    console.log(range, offset)
    const firstHalf = blot.text ? blot.text.substring(0, offset) : ''
    const secondHalf = blot.text ? blot.text.substring(offset) : ''
    
    const firstHalfRev = firstHalf.split('').reverse().join('')
    const firstOffset = firstHalfRev.indexOf(' ')
    const firstSpacePos = firstOffset === -1 ? 0 : offset - firstOffset

    const secondOffset = secondHalf.indexOf(' ') > -1 ? secondHalf.indexOf(' ') : secondHalf.length
    const secondSpacePos = offset + secondOffset - 1
  
    const firstSubstr = firstHalf.split(' ').pop()
    const secondSubstr = secondHalf.split(' ')[0]

    const word = `${firstSubstr}${secondSubstr}`

    // console.log(firstHalf, '|', secondHalf)
    console.log(firstSpacePos, secondSpacePos)

    const indexOffset = range.index - offset
    // console.log('word', word)
    // console.log('word index', blot.text.indexOf(word))

    // return `${firstSubstr}${secondSubstr}`
    return { start: firstSpacePos + indexOffset, end: secondSpacePos + indexOffset }
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

  // colorLists(range) { 
  //   if (this.word === '#characters') {
  //     const [line, offset] = this.quilly.getLine(range.index)
  //     const charactersInRow = line.cache.length
  //     const endOfLinePosition = range.index + charactersInRow - offset

  //     // up to current row
  //     this.quilly.formatText(0, endOfLinePosition, {
  //       'color': 'black'
  //     })
  //   }
  // }

  changeHandler(content, delta, source, editor) {
    // console.log('change', editor.getContents())
    this.setState({
      text: editor.getContents()
    })
  }

  // shouldComponentUpdate(nextProps, nextState) {
  //   console.log('STATE', this.state)
  //   console.log('NEXT STATE', nextState)
  //   if (this.state.text === nextState.text) {
  //     return false
  //   }
  //   return true
  // }

  render() {
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
          defaultValue={this.state.text || ''}
          onKeyPress={keyPressHandler}
          onChange={this.changeHandler}
          onChangeSelection={(range, source, editor) => {
            // console.log('selection change')
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

            // this.colorLists(range)

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