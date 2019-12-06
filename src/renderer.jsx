import './index.css'
import { Quill } from './ui/test'

console.log('👋 This message is being logged by "renderer.js", included via webpack')

import React from 'react'
import ReactDOM from 'react-dom'

const App = () => {
  return <Quill/>
}

ReactDOM.render(<App/>, document.querySelector('#root'))