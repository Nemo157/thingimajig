export class Init {
  get type () { return 'init' }

  constructor (state) {
    this.state = state
  }

  static load (data) {
    return new Init(data.state)
  }
}

export class Patch {
  get type () { return 'patch' }

  constructor (patches) {
  }

  static load (data) {
    return new Patch(data.patches)
  }
}

export class FnCall {
  get type () { return 'fn' }

  constructor (key, event) {
    this.key = key
    this.event = event
  }

  static load (data) {
    return new FnCall(data.key, data.event)
  }
}

export function load (data) {
  switch (data.type) {
    case 'fn': return FnCall.load(data)
    case 'init': return Init.load(data)
    case 'patch': return Patch.load(data)
  }
}
