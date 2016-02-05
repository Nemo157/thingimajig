import p, { addWireTap } from './p.es6'
import f from './f.es6'
import w from './w.es6'

import diff from 'virtual-dom/diff'

import render from './render.es6'

addWireTap(envelope => console.log(envelope))

;(() => {
  var tree

  function fixup (vnode) {
    if (vnode.type) {
      vnode.type = vnode.type
      vnode.version = vnode.version
    }
    if (vnode.children) {
      vnode.children.forEach(fixup)
    }
    return vnode
  }

  p.subscribe({
    topic: 'state.init',
    callback: (state) => {
      tree = fixup(render(state))
      p.publish({ topic: 'view.render', data: tree })
    }
  })

  p.subscribe({
    topic: 'state.update',
    callback: (state) => {
      let newTree = render(state)
      let patches = diff(tree, newTree)
      if (patches[0]) {
        console.log(patches)
        p.publish({ type: 'view.patch', data: patches })
      }
      tree = newTree
    }
  })
})()

f.init('renderer[' + new Date().toString() + ']')
w.connect(global)
