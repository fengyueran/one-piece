require('@testing-library/jest-dom')

const { TextEncoder, TextDecoder, ReadableStream } = require('util')
global.TextEncoder = TextEncoder
global.TextDecoder = TextDecoder

if (typeof global.ReadableStream === 'undefined') {
  const { ReadableStream: NodeReadableStream } = require('stream/web')
  global.ReadableStream = NodeReadableStream
}
