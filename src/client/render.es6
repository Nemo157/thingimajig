import h from 'virtual-dom/h'

function blah () {
  console.log('blah')
}

export default function render (state) {
  return h('div', {
    style: {
      textAlign: 'center',
      lineHeight: (100 + state.count) + 'px',
      border: '1px solid red',
      width: (100 + state.count) + 'px',
      height: (100 + state.count) + 'px'
    },
    onclick: blah
  }, [String(state.count)])
}
