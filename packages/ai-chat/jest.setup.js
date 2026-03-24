require('@testing-library/jest-dom')

const { TextEncoder, TextDecoder } = require('util')
const { ReadableStream } = require('stream/web')

global.TextEncoder = TextEncoder
global.TextDecoder = TextDecoder
global.ReadableStream = global.ReadableStream ?? ReadableStream
