import diff from 'virtual-dom/diff'
import VPatch from 'virtual-dom/vnode/vpatch'

import messages from './messages.es6'
import render from './render.es6'

function update (state) {
  return {
    count: state.count + 1
  }
}

// function _saveFns (left, right: any) {
//   for (var key in right) {
//     if (typeof right[key] === 'function') {
//       var id = fnStore.store(right[key])
//       right[key] = { fn: id }
//       if (left && typeof left[key] === 'function') {
//         fnStore.remove(left[key])
//       }
//     } else if (typeof right[key] === 'object') {
//       _saveFns(left && left[key], right[key])
//     }
//   }
// }
//
// function saveFns(patches: any) {
//   _saveFns(null, patches.a.properties)
//   for (var key in patches) {
//     if (key !== 'a') {
//       var patch = patches[key]
//       switch (patch.type) {
//         case VPatch.PROPS: {
//           _saveFns(patch.vNode.properties, patch.patch)
//         }
//         case VPatch.VNODE: {
//           _saveFns(null, patch.patch.properties)
//         }
//       }
//     }
//   }
// }

onmessage = (ev) => {
  console.log('onmessage:', ev.data)
  var message = messages.load(ev.data)
  if (message instanceof messages.Init) {
    var state = message.state
    var tree = render(state)
    setInterval(() => state = update(state), 1000)
    setInterval(() => {
      var newTree = render(state)
      var patches = diff(tree, newTree)
      if (patches[0]) {
        postMessage(new messages.Patch(patches))
      }
      tree = newTree
    }, 100)
  }
}
