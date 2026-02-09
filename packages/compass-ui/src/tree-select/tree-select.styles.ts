import styled from '@emotion/styled'
import { keyframes } from '@emotion/react'
import { token } from '../theme/token-utils'

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`

export const LoadingWrapper = styled.span`
  display: inline-flex;
  animation: ${rotate} 1s linear infinite;
`

export const TreeSelectContainer = styled.div<{
  fullWidth?: boolean
  disabled?: boolean
}>`
  position: relative;
  display: inline-flex;
  width: ${({ fullWidth }) => (fullWidth ? '100%' : 'auto')};
  min-width: 120px;
  opacity: ${({ disabled }) => (disabled ? 0.5 : 1)};
  pointer-events: ${({ disabled }) => (disabled ? 'none' : 'auto')};
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
`

export const TreeSelectTrigger = styled.div<{
  size?: 'small' | 'medium' | 'large'
  active?: boolean
  status?: 'error' | 'warning'
}>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: ${({ size }) => {
    switch (size) {
      case 'small':
        return token('components.select.padding.sm', '1px 8px')
      case 'large':
        return token('components.select.padding.lg', '6px 16px')
      default:
        // medium
        return token('components.select.padding.md', '3px 12px')
    }
  }};
  font-size: ${({ size }) => {
    return size === 'small'
      ? token('components.select.fontSize.sm', '12px')
      : token('components.select.fontSize.md', '14px')
  }};
  line-height: 1.5;
  background-color: ${token(
    'components.select.backgroundColor',
    token('colors.background', '#fff'),
  )};
  border: 1px solid
    ${({ active, status }) => {
      if (status === 'error') return token('colors.error', '#f5222d')
      if (status === 'warning') return token('colors.warning', '#faad14')
      if (active)
        return token('components.select.activeBorderColor', token('colors.primary', '#1890ff'))
      return token('components.select.borderColor', token('colors.border', '#d9d9d9'))
    }};
  border-radius: ${token('components.select.borderRadius', token('borderRadius.md', '4px'))};
  transition: all 0.3s;
  box-shadow: ${({ active }) =>
    active ? `0 0 0 2px ${token('colors.primary', '#1890ff')}20` : 'none'};

  &:hover {
    border-color: ${({ status }) => {
      if (status) return undefined
      return token('components.select.hoverBorderColor', token('colors.primary', '#1890ff'))
    }};
  }
`

export const SelectedContent = styled.div<{ size?: 'small' | 'medium' | 'large' }>`
  position: relative;
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-right: 8px;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 4px;
  min-height: ${({ size }) => {
    if (size === 'small') return '20px'
    if (size === 'large') return '26px'
    return '24px' // medium
  }};
`

export const Placeholder = styled.span`
  color: ${token('components.select.placeholderColor', token('colors.textSecondary', '#bfbfbf'))};
`

export const TreeSelectDropdown = styled.div`
  padding: 4px 0;
  background-color: ${token('colors.background', '#fff')};
  border-radius: ${token('borderRadius.md', '4px')};
  box-shadow:
    0 3px 6px -4px rgba(0, 0, 0, 0.12),
    0 6px 16px 0 rgba(0, 0, 0, 0.08),
    0 9px 28px 8px rgba(0, 0, 0, 0.05);
  z-index: 1050;
  max-height: 256px;
  overflow-y: auto;
  min-width: 100%;
`

export const Tag = styled.span`
  display: inline-flex;
  align-items: center;
  height: 24px;
  padding: 0 8px;
  font-size: 12px;
  line-height: normal;
  background: ${token('components.select.tagBg', token('colors.backgroundSecondary', '#f5f5f5'))};
  color: ${token('components.select.tagColor', 'inherit')};
  border: 1px solid ${token('components.select.tagBorderColor', 'transparent')};
  border-radius: 4px;
  margin-right: 4px;
  margin-top: 1px;
  margin-bottom: 1px;

  /* Select text span inside */
  & > span {
    display: flex;
    align-items: center;
    height: 100%;
  }
`

export const TagCloseIcon = styled.span`
  margin-left: 4px;
  cursor: pointer;
  font-size: 12px;
  width: 16px;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  color: ${token('colors.textSecondary', 'rgba(0, 0, 0, 0.45)')};
  line-height: 0;
  transform: scale(0.8);

  &:hover {
    color: ${token('colors.text', 'rgba(0, 0, 0, 0.88)')};
  }
`

export const SuffixIcon = styled.span`
  display: flex;
  align-items: center;
  color: ${token('colors.textSecondary', 'rgba(0, 0, 0, 0.25)')};
  font-size: 12px;
  line-height: 0;
`

export const SearchInput = styled.input`
  margin: 0;
  padding: 0;
  background: transparent;
  border: none;
  outline: none;
  appearance: none;
  font-family: inherit;
  font-size: inherit;
  width: 100%;
  height: 24px;
  margin-top: 1px;
  margin-bottom: 1px;
  min-width: 4px;
`

export const InputWrapper = styled.div`
  display: inline-block;
  max-width: 100%;
`

export const SingleValue = styled.span<{ $isOpen?: boolean }>`
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  color: ${({ $isOpen }) =>
    $isOpen
      ? token('components.select.placeholderColor', token('colors.textSecondary', '#bfbfbf'))
      : 'inherit'};
`
