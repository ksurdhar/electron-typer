import React, { useState } from 'react'
import ReactQuill from 'react-quill'

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

export const Editor = (props) => { 
  const [text, setText] = useState('')
  const [row, setRow] = useState(1)
  let wrapperRef = React.createRef()
  
  const changeHandler = (content, delta, source, editor) => {
    setText(content)
  }

  return (
    <div ref={wrapperRef}>
      <ReactQuill
        value={text}
        onChange={changeHandler}
        onChangeSelection={(range, source, editor) => {
          const { top } = editor.getBounds(range.index)
          const rowNumber = (top - 14 + ROW_HEIGHT) / ROW_HEIGHT 
          console.log(rowNumber)
          if (row !== rowNumber) {
            // adjust scroll position
            console.log(props.getContainer().current)
          }
          setRow(rowNumber)
        }}
        modules={
          { toolbar: '#hidden-toolbar' }
        }
      />
    </div>

  )
}