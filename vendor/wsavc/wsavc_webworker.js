/* global self */

const WSAvcPlayer = require('./index')

const player = {}

self.onmessage = function (e) {
  const msg = e.data
  const err = new Error('unknown cmd ' + msg.cmd)

  switch (msg.cmd) {
    case 'init':
      player.offscreenCanvas = msg.canvas
      player.player = new WSAvcPlayer(player.offscreenCanvas, 'webgl')
      break
    case 'play':
      player.player.playStream()
      break
    case 'stop':
      player.player.stopStream()
      break
    case 'connect':
      player.player.connect(msg.url)
      player.player.on('canvasReady', () => {
        self.postMessage({
          cmd: 'canvasReady'
        })
      })
      player.player.on('busy', () => {
        self.postMessage({
          cmd: 'busy'
        })
      })
      player.player.on('close', () => {
        self.postMessage({
          cmd: 'close'
        })
      })
      break
    case 'disconnect':
      player.player.disconnect()
      break
    default:
      throw err
  }
}
