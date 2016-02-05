import ko from 'knockout'
import fs from 'fs'
import url from 'url'
import http from 'http'
import path from 'path'

var root = path.resolve(__dirname, '../../client')

var contentTypes = {
  '.js': 'application/javascript',
  '.html': 'text/html'
}

let port = 9231
var server = http.createServer()

server.on('listening', () => console.log('Server listening on', port))
  .on('close', () => console.log('Shutting down'))
  .on('error', (err) => console.log('Server error:', err))
  .on('clientError', (err) => console.log('Client error:', err))
  .on('request', (req, res) => {
    console.log(req.url)
    var match = url.parse(req.url)
      .pathname
      .match(/\/(.*)/)

    var ret = (status, body, contentType) => {
      res.writeHead(status, {
        'Content-Type': contentType || 'text/plain',
        'Content-Length': body.length
      })
      res.write(body, () => res.end())
    }

    if (match) {
      var filename = path.join(root, match[1] || 'index.html')
      fs.exists(filename, exists => {
        if (exists) {
          fs.readFile(filename, (err, data) => {
            if (err) { throw err }
            ret(200, data, contentTypes[path.extname(filename)])
          })
        } else {
          ret(404, 'Not found')
        }
      })
    } else {
      ret(404, 'Not found')
    }
  })

var count = ko.observable(0)

var io = require('socket.io')(server)

ko.subscribable.fn.subscribeChanged = function (callback) {
  var previousValue
  var a = this.subscribe(_previousValue => previousValue = _previousValue, undefined, 'beforeChange')
  var b = this.subscribe(latestValue => callback(latestValue, previousValue))
  return {
    dispose: () => (a.dispose(), b.dispose)
  }
}

io.on('connection', socket => {
  var sub = count.subscribeChanged((val, oldVal) => {
    console.log('Server updating count from', oldVal, 'to', val)
    socket.emit('count', val)
    console.log('Server updated count')
  })
  console.log('Client connected')
  socket.on('count', val => {
    console.log('Client updating count from', count(), 'to', val)
    count(val)
    console.log('Client updated count')
  })
  socket.on('disconnect', () => {
    sub.dispose()
    console.log('Client disconnected')
  })
})

setInterval(() => {
  console.log('About to increment from', count())
  count(count() + 1)
  console.log('Incremented to', count())
}, 10000)

server.listen(port)
