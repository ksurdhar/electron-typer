/** @jsx jsx */
import React from 'react'
import ReactQuill from 'react-quill'
// const Delta = Quill.import('delta')
import { css, jsx } from '@emotion/core'
import {
  OPEN_DOCUMENT,
  RENDERER_SENDING_SAVE_DATA,
  INITIATE_SAVE,
  INITIATE_NEW_FILE,
} from '../actions/types'

import 'react-quill/dist/quill.snow.css'

const ROW_HEIGHT = 18 // hardcoded. would be better if dynamic

// const editorHeight = wrapperRef.current.clientHeight - 26 // removes padding
// const totalRows = editorHeight / ROW_HEIGHT

const containerCss = css`
  width: 90%;
`

class Editor extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      text: null, // DELTA
      wordPositions: {}, // { start: x, end: y}
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
              const { activeList, listIdx, wordPositions } = this.state
              const { lists } = this.props
              const wordLength = wordPositions.end - wordPositions.start + 1
              const currentWord = this.quilly.getText(wordPositions.start, wordLength)

              const idx = activeList && listIdx + 1 <= lists[activeList].length - 1 ? listIdx + 1 : 0
              const matchedList = activeList ? lists[activeList] : lists[currentWord] 
              if (matchedList) {
                this.quilly.deleteText(wordPositions.start, wordLength)
                const newDelta = this.quilly.insertText(wordPositions.start, matchedList[idx])
                this.colorListWord(matchedList[idx])
                this.setState({
                  text: newDelta,
                  listIdx: idx,
                  activeList: activeList ? activeList : currentWord
                })

              } else {
                console.log('NO MATCH IN LISTS')
              }
            }
          }
        }
      }
    }

    this.changeHandler = this.changeHandler.bind(this)
    this.colorListWord = this.colorListWord.bind(this)

    ipcRenderer.on(OPEN_DOCUMENT, (event, data) => { // when saved show notification on screen
      console.log('opening document', data)
      this.quilly.setContents(data)
      this.setState({ text: data })
    })

    ipcRenderer.on(INITIATE_SAVE, (event, data) => {
      console.log('initiate save', data)
      ipcRenderer.send(RENDERER_SENDING_SAVE_DATA, this.state.text, data.saveAs)
    })

    ipcRenderer.on(INITIATE_NEW_FILE, (event, data) => {
      console.log('initiate new file', data)
      // textArea.value = ''
    })
  }

  componentDidMount() {
    this.quilly = this.quillRef.current.getEditor()
  }

  getWordString(range) {
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

  colorListWord(wordStr) { 
    // this.quilly.formatText(this.state.wordPositions.start, wordStr.length, {
    //   'background': 'red'
    // })
  }

  changeHandler(content, delta, source, editor) {
    this.setState({
      text: editor.getContents()
    })
  }

  render() {
    const keyPressHandler = (event) => {
      // placeholder
    }
    // console.log(this.state.text)
    return (
      <div css={containerCss}>
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
        
            this.colorRows(range)

            const newWordPos = this.determineWordRange(range)
            const wordString = this.getWordString(range)
            const currentWordInActiveList = this.props.lists[activeList] && wordString === this.props.lists[activeList][listIdx]
            console.log('word string', this.getWordString(range))
            const newListIdx = currentWordInActiveList ? listIdx : 0
            const newActiveList = currentWordInActiveList ? activeList : null

            if (currentWordInActiveList) { // doesnt work while tabbing - only repositioning selection
              this.colorListWord(wordString)
            }

            this.setState({
              row: rowNumber,
              wordPositions: newWordPos,
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