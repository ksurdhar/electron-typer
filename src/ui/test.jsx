import React, { useState } from 'react'
import ReactQuill from 'react-quill'

import 'react-quill/dist/quill.snow.css'

// remove / play around with styling
// try to port over repositioning logic.
// add linting
// consider typescript, with easy compilation rules 

export const Quill = () => { 
  const [text, setText] = useState('')

  return (
    <ReactQuill 
      value={text}
      onChange={setText} 
    />
  )
}