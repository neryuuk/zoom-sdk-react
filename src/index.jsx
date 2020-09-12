import 'react-app-polyfill/ie9'
import 'react-app-polyfill/stable'
import 'proxy-polyfill'
import 'core-js/stable'
import 'regenerator-runtime/runtime'
import React from 'react'
import ReactDOM from 'react-dom'
import Zoom from './components/Zoom'

if (typeof NodeList !== 'undefined' && NodeList.prototype && !NodeList.prototype.forEach) {
  NodeList.prototype.forEach = Array.prototype.forEach
}

ReactDOM.render(
  <Zoom />,
  document.getElementById('root')
)
