import React, { useState } from 'react'
import ReactQuill from 'react-quill'
// import Quill from 'quill'

import 'react-quill/dist/quill.snow.css'

const ROW_HEIGHT = 18 // hardcoded. would be better if dynamic

// redo repositioning logic
// add linting
// consider typescript, with easy compilation rule

// const editorHeight = wrapperRef.current.clientHeight - 26 // removes padding
// const totalRows = editorHeight / ROW_HEIGHT

// set position of editor where you want it
// when row changes, animate upwards.
// did it by adjusting scrollheight with spacers to make it 100% height immediately

function reverseString(str) {
  return (str === '') ? '' : reverseString(str.substr(1)) + str.charAt(0);
}


const tabHandler = () => {
  console.log('hello')
}

export const Editor = (props) => { 
  const [text, setText] = useState('')
  const [row, setRow] = useState(1)
  const [quilly, setQuilly] = useState()
  let wrapperRef = React.createRef()
  let quillRef = React.createRef()
  // console.log('RENDERING')
  
  const changeHandler = (content, delta, source, editor) => {
    setText(content)
  }

  const colorRows = (range) => {
    const [line, offset] = quilly.getLine(range.index)
    const charactersInRow = line.cache.length
    const endOfLinePosition = range.index + charactersInRow - offset

    // up to current row
    quilly.formatText(0, endOfLinePosition, {
      'color': 'black'
    })
    // beneath current row
    quilly.formatText(endOfLinePosition, quilly.getLength(), {
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
    <div ref={wrapperRef}>
      <ReactQuill
        ref={quillRef}
        value={text}
        onKeyPress={keyPressHandler}
        onChange={changeHandler}
        onChangeSelection={(range, source, editor) => {
          const { top } = editor.getBounds(range.index)
          const rowNumber = (top - 14 + ROW_HEIGHT) / ROW_HEIGHT 
          // console.log(rowNumber)
          if (row !== rowNumber) {
            // const container = props.getContainer().current
            // const difference = container.scrollHeight - container.clientHeight
            setTimeout(() => {
              window.scrollTo({ top: top - 14, behavior: 'smooth' })
            }, 200)
          }
          
          if (!quilly) {
            setQuilly(quillRef.current.getEditor())
          }
        
          setRow(rowNumber)
          colorRows(range)

          // console.log('leaf', quilly.getLeaf(range.index))
          const [blot, offset] = quilly.getLeaf(range.index)
          const secondHalf = blot.text.substring(offset - 1)
          const firstHalf = blot.text.substring(0, offset - 1)

          const firstSubstr = firstHalf.split(' ').pop()
          const secondSubstr = secondHalf.split(' ')[0]
          
          const word = `${firstSubstr}${secondSubstr}`
          console.log('word', word)

          // const revIndex = blot.text.length - offset
          // console.log('rev index', revIndex)
        }}
        modules={
          { 
            toolbar: '#hidden-toolbar',
            keyboard: {
              bindings: {
                tab: {
                  key: 9,
                  handler: tabHandler
                }
              }
            }
          }
        }
      />
    </div>

  )
}