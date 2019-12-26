import React from 'react'
import ReactQuill from 'react-quill'
import Quill from 'quill'
const Delta = Quill.import('delta')

import 'react-quill/dist/quill.snow.css'

const ROW_HEIGHT = 18 // hardcoded. would be better if dynamic

const LISTS = {
  '#characters': ['Ezra', 'Lautreque', 'Kyhia'],
  '#locations': ['Orach', 'Gomyr', 'Glitterrun']
}

const listKeys = Object.keys(LISTS)

// const editorHeight = wrapperRef.current.clientHeight - 26 // removes padding
// const totalRows = editorHeight / ROW_HEIGHT

class Editor extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      text: null, // DELTA
      word: {}, // { start: x, end: y}
      row: 1,
      listIdx: 0,
      activeList: null
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
              const { activeList, listIdx } = this.state
              const wordLength = this.state.word.end - this.state.word.start + 1
              const currentWord = this.quilly.getText(this.state.word.start, wordLength)

              const idx = activeList && listIdx + 1 <= LISTS[activeList].length - 1 ? listIdx + 1 : 0
              const matchedList = activeList ? LISTS[activeList] : LISTS[currentWord] 

              if (matchedList) {
                console.log('MATCH!')
                this.quilly.deleteText(this.state.word.start, wordLength)
                const newDelta = this.quilly.insertText(this.state.word.start, matchedList[idx])
                this.quilly.setSelection(this.state.word.start, 0, 'silent') // WARNING

                this.setState({ 
                  text: newDelta,
                  listIdx: idx,
                  activeList: activeList ? activeList : currentWord
                })

              } else {
                console.log('NO MATCH')
              }
            }
          }
        }
      }
    }

    this.changeHandler = this.changeHandler.bind(this)
  }

  getWord(range) {
    const [blot, offset] = this.quilly.getLeaf(range.index)
    const firstHalf = blot.text ? blot.text.substring(0, offset) : ''
    const secondHalf = blot.text ? blot.text.substring(offset) : ''
    const firstSubstr = firstHalf.split(' ').pop()
    const secondSubstr = secondHalf.split(' ')[0]
    return `${firstSubstr}${secondSubstr}`
  }

  determineWordRange(range) {
    const [blot, offset] = this.quilly.getLeaf(range.index)
    const firstHalf = blot.text ? blot.text.substring(0, offset) : ''
    const secondHalf = blot.text ? blot.text.substring(offset) : ''
    
    const firstHalfRev = firstHalf.split('').reverse().join('')
    const firstOffset = firstHalfRev.indexOf(' ')
    const firstSpacePos = firstOffset === -1 ? 0 : offset - firstOffset

    const secondOffset = secondHalf.indexOf(' ') > -1 ? secondHalf.indexOf(' ') : secondHalf.length
    const secondSpacePos = offset + secondOffset - 1
  
    // console.log(firstSpacePos, secondSpacePos)
    const indexOffset = range.index - offset
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
            const { row, activeList, listIdx } = this.state
            const { top } = editor.getBounds(range.index)
            const rowNumber = (top - 14 + ROW_HEIGHT) / ROW_HEIGHT
            if (row !== rowNumber) {
              setTimeout(() => {
                window.scrollTo({ top: top - 14, behavior: 'smooth' })
              }, 200)
            }

            if (!this.quilly) {
              this.quilly = this.quillRef.current.getEditor()
            }
        
            this.colorRows(range)

            const word = this.determineWordRange(range)
            const currentWordInActiveList = LISTS[activeList] && this.getWord(range) === LISTS[activeList][listIdx]
            const newListIdx = currentWordInActiveList ? listIdx : 0
            const newActiveList = currentWordInActiveList ? activeList : null

            this.setState({
              row: rowNumber,
              word,
              activeList: newActiveList,
              listIdx: newListIdx
            })
          }}
          modules={this.modules}
        />
      </div>
    )
  }
}

export default Editor