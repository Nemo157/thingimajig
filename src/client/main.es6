import p, { addWireTap } from './p.es6'
import f from './f.es6'
import w from './w.es6'

import patch from 'virtual-dom/patch'
import createElement from 'virtual-dom/create-element'
import VPatch from 'virtual-dom/vnode/vpatch'

addWireTap(envelope => console.log(envelope))

f.init('main')

;(() => {
  var rootNode

  p.subscribe({
    topic: 'view.render',
    callback: tree => {
      rootNode = createElement(tree)
      document.body.appendChild(rootNode)
    }
  })

  p.subscribe({
    topic: 'view.patch',
    callback: patches => {
      rootNode = patch(rootNode, patches)
    }
  })
})()

let state = new Promise((resolve) => {
  let state = new Worker('state.js')
  state.onerror = (err) => console.log('state error:', err)
  w.connect(state, () => resolve(state))
})

let renderer = new Promise((resolve) => {
  let renderer = new Worker('renderer.js')
  renderer.onerror = (err) => console.log('renderer error:', err)
  w.connect(renderer, () => resolve(renderer))
})

Promise.all([state, renderer]).then(() =>
  p.publish({
    topic: 'state.init',
    data: { count: 0 }
  }))
