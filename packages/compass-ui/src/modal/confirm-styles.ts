import styled from '@emotion/styled'
import { ModalType } from './types'

export const ConfirmContent = styled.div`
  display: flex;
  align-items: flex-start;
`

export const IconWrapper = styled.div<{
  $type: ModalType
}>`
  margin-right: 12px;
  font-size: 22px;
  line-height: 1;
  color: ${(props) => {
    switch (props.$type) {
      case 'info':
      case 'confirm':
        return '#1677ff'
      case 'success':
        return '#52c41a'
      case 'error':
        return '#ff4d4f'
      case 'warning':
        return '#faad14'
      default:
        return '#1677ff'
    }
  }};
`

export const ContentWrapper = styled.div`
  flex: 1;
`

export const Title = styled.div`
  color: rgba(0, 0, 0, 0.88);
  font-weight: 600;
  font-size: 16px;
  line-height: 1.5;
  margin-bottom: 8px;
`

export const Content = styled.div`
  color: rgba(0, 0, 0, 0.88);
  font-size: 14px;
  line-height: 1.5;
`

export const ConfirmFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 24px;
`
