require('@testing-library/jest-dom')

const { TextEncoder, TextDecoder } = require('util')
const { ReadableStream } = require('stream/web')

global.TextEncoder = TextEncoder
global.TextDecoder = TextDecoder
global.ReadableStream = global.ReadableStream ?? ReadableStream

if (!global.URL.createObjectURL) {
  global.URL.createObjectURL = () => 'blob:mock'
}

if (!global.URL.revokeObjectURL) {
  global.URL.revokeObjectURL = () => {}
}

if (!global.HTMLElement.prototype.scrollIntoView) {
  global.HTMLElement.prototype.scrollIntoView = () => {}
}
