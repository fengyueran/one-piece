import styled from '@emotion/styled'

export const OverlayContainer = styled.div`
  z-index: ${({ theme }) => theme?.components?.dropdown?.zIndex ?? 1050};
  background-color: ${({ theme }) => theme?.components?.dropdown?.backgroundColor || '#ffffff'};
  box-shadow: ${({ theme }) =>
    theme?.components?.dropdown?.boxShadow ||
    '0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 6px 16px 0 rgba(0, 0, 0, 0.08), 0 9px 28px 8px rgba(0, 0, 0, 0.05)'};
  border-radius: ${({ theme }) => theme?.components?.dropdown?.borderRadius || '4px'};
  padding: ${({ theme }) => theme?.components?.dropdown?.padding || '4px 0'};
  outline: 0;
`
