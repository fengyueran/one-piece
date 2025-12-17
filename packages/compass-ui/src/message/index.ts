import message from './message'
import useMessage from './use-message'

export type { MessageProps } from './types'

type MessageType = typeof message & {
  useMessage: typeof useMessage
}

const messageWithHook = message as MessageType
messageWithHook.useMessage = useMessage

export default messageWithHook
