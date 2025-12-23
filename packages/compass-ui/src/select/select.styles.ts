import styled from '@emotion/styled'
import { keyframes } from '@emotion/react'

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

export const SelectContainer = styled.div<{
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

export const SelectTrigger = styled.div<{
  size?: 'small' | 'medium' | 'large'
  active?: boolean
  status?: 'error' | 'warning'
}>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: ${({ size, theme }) => {
    const paddings = theme.components?.select?.padding
    switch (size) {
      case 'small':
        return paddings?.sm || '1px 8px'
      case 'large':
        return paddings?.lg || '6px 16px'
      default:
        // medium
        return paddings?.md || '3px 12px'
    }
  }};
  font-size: ${({ size, theme }) => {
    const fontSizes = theme.components?.select?.fontSize
    return size === 'small' ? fontSizes?.sm || '12px' : fontSizes?.md || '14px'
  }};
  line-height: 1.5;
  background-color: ${({ theme }) =>
    theme.components?.select?.backgroundColor || theme.colors?.background || '#fff'};
  border: 1px solid
    ${({ theme, active, status }) => {
      if (status === 'error') return theme.colors?.error || '#f5222d'
      if (status === 'warning') return theme.colors?.warning || '#faad14'
      if (active)
        return theme.components?.select?.activeBorderColor || theme.colors?.primary || '#1890ff'
      return theme.components?.select?.borderColor || theme.colors?.border || '#d9d9d9'
    }};
  border-radius: ${({ theme }) =>
    theme.components?.select?.borderRadius ||
    (theme.borderRadius?.md ? `${theme.borderRadius.md}px` : '4px')};
  transition: all 0.3s;
  box-shadow: ${({ active, theme }) =>
    active ? `0 0 0 2px ${theme.colors?.primary || '#1890ff'}20` : 'none'};

  &:hover {
    border-color: ${({ theme, status }) => {
      if (status) return undefined
      return theme.components?.select?.hoverBorderColor || theme.colors?.primary || '#1890ff'
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
  color: ${({ theme }) =>
    theme.components?.select?.placeholderColor || theme.colors?.textSecondary || '#bfbfbf'};
`

export const SelectDropdown = styled.div`
  padding: 4px 0;
  background-color: ${({ theme }) => theme.colors?.background || '#fff'};
  border-radius: ${({ theme }) => (theme.borderRadius?.md ? `${theme.borderRadius.md}px` : '4px')};
  box-shadow:
    0 3px 6px -4px rgba(0, 0, 0, 0.12),
    0 6px 16px 0 rgba(0, 0, 0, 0.08),
    0 9px 28px 8px rgba(0, 0, 0, 0.05);
  z-index: 1050;
  max-height: 256px;
  overflow-y: auto;
`

export const StyledOption = styled.div<{
  selected?: boolean
  active?: boolean
  disabled?: boolean
}>`
  padding: 0 12px;
  min-height: 32px;
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  transition: all 0.3s;
  background-color: ${({ selected, active, theme }) => {
    if (selected) return theme.components?.select?.optionSelectedBg || '#e6f7ff'
    if (active) return theme.components?.select?.optionHoverBg || '#e6e6e6'
    return 'transparent'
  }};
  color: ${({ selected, disabled, theme }) => {
    if (disabled) return theme.colors?.textDisabled || '#00000040'
    if (selected)
      return (
        theme.components?.select?.optionSelectedColor || theme.colors?.text || 'rgba(0, 0, 0, 0.88)'
      )
    return theme.components?.select?.optionColor || theme.colors?.text || 'rgba(0, 0, 0, 0.88)'
  }};

  .compass-icon-check {
    color: ${({ theme, selected }) => (selected ? theme.colors?.primary || '#1890ff' : 'inherit')};
  }

  font-weight: 400;
  display: flex;
  align-items: center;
  justify-content: space-between;

  &:hover {
    background-color: ${({ disabled, selected, theme }) => {
      if (disabled) return 'transparent'
      if (selected) return theme.components?.select?.optionSelectedBg || '#e6f7ff'
      return theme.components?.select?.optionHoverBg || '#e6e6e6'
    }};
  }
`

export const Tag = styled.span`
  display: inline-flex;
  align-items: center;
  height: 24px;
  padding: 0 8px;
  font-size: 12px;
  line-height: normal;
  background: ${({ theme }) =>
    theme.components?.select?.tagBg || theme.colors?.backgroundSecondary || '#f5f5f5'};
  color: ${({ theme }) => theme.components?.select?.tagColor || 'inherit'};
  border: ${({ theme }) =>
    theme.components?.select?.tagBorderColor
      ? `1px solid ${theme.components.select.tagBorderColor}`
      : 'none'};
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
  color: ${({ theme }) => theme.colors?.textSecondary || 'rgba(0, 0, 0, 0.45)'};
  line-height: 0;
  transform: scale(0.8);

  &:hover {
    color: ${({ theme }) => theme.colors?.text || 'rgba(0, 0, 0, 0.88)'};
  }
`

export const SuffixIcon = styled.span`
  display: flex;
  align-items: center;
  color: ${({ theme }) => theme.colors?.textSecondary || 'rgba(0, 0, 0, 0.25)'};
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
