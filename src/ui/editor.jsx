/** @jsx jsx */
import React from 'react'
import ReactQuill from 'react-quill'
// const Delta = Quill.import('delta')
import { css, jsx } from '@emotion/core'
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
      wordPositions: {}, // { start: x, end: y}
      row: 1,
      listIdx: 0,
      activeList: null,
      name: null,
      project: null,
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
                  listIdx: idx,
                  activeList: activeList ? activeList : currentWord
                })
                this.props.setText(newDelta)

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
  }

  componentDidMount() {
    this.quilly = this.quillRef.current.getEditor()
  }

  componentDidUpdate(prevProps) {
    if (this.props.openingFile && !prevProps.openingFile ) {
      console.log('file was opened')
      this.quilly.setContents(this.props.text)
      this.quilly.setSelection(this.quilly.getLength())
      this.props.finishedOpening()
    }
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
    console.log('change!', editor.getContents())
    this.props.setText(editor.getContents())
  }

  render() {
    const keyPressHandler = (event) => {
      // placeholder
    }
    // console.log(this.state.text)
    return (
      <div css={containerCss} onFocus={() => this.props.closeAll() }>
        <ReactQuill
          ref={this.quillRef}
          defaultValue={this.props.text || ''}
          onKeyPress={keyPressHandler}
          onChange={this.changeHandler}
          onChangeSelection={(range, source, editor) => {
            if (this.quilly.hasFocus()) {
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
            }
          }}
          modules={this.modules}
        />
      </div>
    )
  }
}

export default Editor