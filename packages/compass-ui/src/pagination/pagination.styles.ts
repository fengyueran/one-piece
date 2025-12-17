import styled from '@emotion/styled'

export const PaginationContainer = styled.ul<{ disabled?: boolean; size?: 'default' | 'small' }>`
  display: flex;
  align-items: center;
  list-style: none;
  padding: 0;
  margin: 0;
  font-size: ${({ theme }) => theme.components?.pagination?.fontSize || '14px'};
  color: ${({ theme }) => theme.components?.pagination?.itemColor || 'rgba(0, 0, 0, 0.88)'};
  opacity: ${({ disabled }) => (disabled ? 0.5 : 1)};
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'default')};

  .compass-pagination-simple-input {
    width: ${({ size }) => (size === 'small' ? '40px' : '50px')};
    height: ${({ size }) => (size === 'small' ? '24px' : '32px')};
    margin: 0 8px;

    .compass-input-field {
      height: 100%;
      padding: 0 6px;
    }

    input {
      text-align: center;
      height: 100%;
    }
  }

  /* Hide spin buttons for input type number in Pagination */
  input[type='number']::-webkit-inner-spin-button,
  input[type='number']::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  input[type='number'] {
    -moz-appearance: textfield;
  }
`

export const PaginationItem = styled.li<{
  active?: boolean
  disabled?: boolean
  size?: 'default' | 'small'
}>`
  display: inline-flex;
  justify-content: center;
  align-items: center;
  min-width: ${({ theme, size }) =>
    size === 'small' ? '24px' : theme.components?.pagination?.itemSize || '32px'};
  height: ${({ theme, size }) =>
    size === 'small' ? '24px' : theme.components?.pagination?.itemSize || '32px'};
  margin-right: 8px;
  border-radius: ${({ theme }) => theme.components?.pagination?.itemBorderRadius || '4px'};
  background-color: ${({ theme, active }) =>
    active
      ? theme.components?.pagination?.itemActiveBg || '#ffffff'
      : theme.components?.pagination?.itemBg || '#ffffff'};
  border: 1px solid
    ${({ theme, active }) =>
      active ? theme.colors?.primary || '#1890ff' : theme.colors?.border || '#d9d9d9'};
  color: ${({ theme, active }) =>
    active
      ? theme.components?.pagination?.itemActiveColor || '#1890ff'
      : theme.components?.pagination?.itemColor || 'rgba(0, 0, 0, 0.88)'};
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  user-select: none;
  transition: all 0.2s;
  font-weight: ${({ active }) => (active ? 600 : 400)};

  &:hover {
    border-color: ${({ theme, active, disabled }) =>
      disabled
        ? active
          ? theme.colors?.primary || '#1890ff'
          : theme.colors?.border || '#d9d9d9'
        : active
          ? theme.colors?.primary || '#1890ff'
          : theme.colors?.primaryHover || '#40a9ff'};
    color: ${({ theme, active, disabled }) =>
      disabled
        ? active
          ? theme.components?.pagination?.itemActiveColor || '#1890ff'
          : theme.components?.pagination?.itemColor || 'rgba(0, 0, 0, 0.88)'
        : active
          ? theme.components?.pagination?.itemActiveColor || '#1890ff'
          : theme.components?.pagination?.itemHoverColor || '#40a9ff'};
  }

  a {
    color: inherit;
    text-decoration: none;
  }

  .compass-icon {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  /* Jump Item specific styles */
  &.compass-pagination-jump-placeholder {
    position: relative;
    border: none;
    background: transparent;

    &:hover {
      color: ${({ theme, disabled }) =>
        disabled
          ? theme.components?.pagination?.itemColor || 'rgba(0, 0, 0, 0.88)'
          : theme.colors?.primary || '#1890ff'};

      .compass-pagination-item-ellipsis {
        opacity: ${({ disabled }) => (disabled ? 1 : 0)};
        pointer-events: none;
      }

      .compass-pagination-item-link-icon {
        opacity: ${({ disabled }) => (disabled ? 0 : 1)};
        pointer-events: ${({ disabled }) => (disabled ? 'none' : 'auto')};
      }
    }
  }

  .compass-pagination-item-ellipsis,
  .compass-pagination-item-link-icon {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    transition: all 0.2s;
  }

  .compass-pagination-item-ellipsis {
    opacity: 1;
  }

  .compass-pagination-item-link-icon {
    opacity: 0;
    font-size: 12px;
  }
`

export const PaginationJump = styled.li`
  display: inline-flex;
  justify-content: center;
  align-items: center;
  width: 32px;
  height: 32px;
  margin-right: 8px;
  color: ${({ theme }) => theme.components?.pagination?.itemColor || 'rgba(0, 0, 0, 0.25)'};
  cursor: pointer;
`
