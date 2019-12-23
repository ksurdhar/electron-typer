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

// with a proper react component as a class, shouldComponentUpdate could be used to prevent rerenders

export const Editor = (props) => { 
  const [text, setText] = useState('')
  const [row, setRow] = useState(1)
  const [quilly, setQuilly] = useState()
  let wrapperRef = React.createRef()
  let quillRef = React.createRef()
  console.log('RENDERING')
  
  const changeHandler = (content, delta, source, editor) => {
    setText(content)
  }

  return (
    <div ref={wrapperRef}>
      <ReactQuill
        ref={quillRef}
        value={text}
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
          
          //before
          quilly.formatText(0, range.index, {
            'color': 'black'
          })
          //current
          quilly.formatText(range.index, quilly.getLength(), {
            'color': 'blue'
          })
        }}
        modules={
          { toolbar: '#hidden-toolbar' }
        }
      />
    </div>

  )
}