import message from './message'
import useMessage from './use-message'

export * from './types'
export { useMessage }

type MessageType = typeof message & {
  useMessage: typeof useMessage
}

const messageWithHook = message as MessageType
messageWithHook.useMessage = useMessage

export default messageWithHook
