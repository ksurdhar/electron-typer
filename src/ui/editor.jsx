import React, { useState } from 'react'
import ReactQuill from 'react-quill'

import 'react-quill/dist/quill.snow.css'

// redo repositioning logic
// add linting
// consider typescript, with easy compilation rules 

export const Editor = () => { 
  const [text, setText] = useState('')

  return (
    <ReactQuill 
      value={text}
      onChange={setText} 
      modules={
        { toolbar: '#hidden-toolbar' }
      }
    />
  )
}