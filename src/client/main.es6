import ko from 'knockout'

import patch from 'virtual-dom/patch'
import createElement from 'virtual-dom/create-element'
import VPatch from 'virtual-dom/vnode/vpatch'

import messages from './messages.es6'
import render from './render.es6'

var state = {
  count: 0
}

var tree = render(state)
var rootNode = createElement(tree)
document.body.appendChild(rootNode)

var renderer = new Worker('renderer.js')

renderer.onerror = (err) => {
  console.log('renderer error:', err)
}

function _loadFns (ob) {
  for (var key in ob) {
    if (ob[key].hasOwnProperty('fn')) {
      ob[key] = () => renderer.postMessage(new messages.FnCall(ob[key].fn, null))
    } else if (typeof ob[key] === 'object') {
      _loadFns(ob[key])
    }
  }
}

function loadFns (patches) {
  for (var key in patches) {
    if (key !== 'a') {
      var patch = patches[key]
      switch (patch.type) {
        case VPatch.PROPS: {
          _loadFns(patch.patch)
        }
        case VPatch.VNODE: {
          _loadFns(patch.patch.properties)
        }
      }
    }
  }
}

renderer.onmessage = (ev) => {
  console.log('onmessage:', ev.data)
  var message = messages.load(ev.data)
  if (message instanceof messages.Patch) {
    loadFns(message.patches)
    rootNode = patch(rootNode, message.patches)
  }
}
renderer.postMessage(new messages.Init(state))
