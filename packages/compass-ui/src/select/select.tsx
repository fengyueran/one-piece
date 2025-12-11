import React, { useState, useRef, useMemo } from 'react'
import {
  useFloating,
  autoUpdate,
  offset,
  flip,
  shift,
  useDismiss,
  useRole,
  useClick,
  useInteractions,
  FloatingPortal,
  size as floatingSize,
  useHover,
  safePolygon,
} from '@floating-ui/react'

import { SelectProps, SelectOption, SelectValue } from './types'
import { SelectContext } from './context'
import Option from './option'
import {
  SelectContainer,
  SelectTrigger,
  SelectDropdown,
  SelectedContent,
  Placeholder,
  Tag,
  TagCloseIcon,
  SuffixIcon,
  SearchInput,
  InputWrapper,
  LoadingWrapper,
} from './select.styles'
import { DownIcon, CloseIcon, CloseCircleIcon, LoadingIcon } from '../icons'

const Select: React.FC<SelectProps> & { Option: typeof Option } = (props) => {
  const {
    children,
    options,
    value,
    defaultValue,
    onChange,
    disabled,
    loading,
    allowClear,
    placeholder,
    className,
    style,
    multiple = false,
    mode,
    size = 'medium',
    status,
    dropdownStyle,
    dropdownClassName,
    trigger = 'click',
    showSearch,
  } = props

  const isMultiple = multiple || mode === 'multiple' || mode === 'tags'
  const isTags = mode === 'tags'

  const [internalValue, setInternalValue] = useState<SelectValue>(
    defaultValue || (isMultiple ? [] : ''),
  )
  const isControlled = value !== undefined
  const currentValue = isControlled ? value : internalValue

  const [open, setOpen] = useState(false)
  const [searchValue, setSearchValue] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  // Parse options from children or use props
  const parsedOptions = useMemo(() => {
    let opts: SelectOption[] = []
    if (options) {
      opts = options
    } else {
      React.Children.forEach(children, (child) => {
        if (
          React.isValidElement(child) &&
          (child.type === Option || (child.type as any).displayName === 'Option')
        ) {
          const { value, children: label, disabled, ...rest } = child.props as any
          opts.push({ value, label, disabled, ...rest })
        }
      })
    }
    return opts
  }, [children, options])

  // Filter options based on search value
  const filteredOptions = useMemo(() => {
    if (!searchValue) return parsedOptions
    return parsedOptions.filter((opt) => {
      const labelStr = String(opt.label)
      return labelStr.toLowerCase().includes(searchValue.toLowerCase())
    })
  }, [parsedOptions, searchValue])

  const handleOpenChange = (nextOpen: boolean) => {
    if (disabled) return
    setOpen(nextOpen)
    if (!nextOpen) {
      setSearchValue('') // Clear search on close
    } else {
      // Focus input when opening if showSearch is true
      setTimeout(() => {
        if (showSearch) {
          inputRef.current?.focus()
        }
      }, 0)
    }
  }

  const { x, y, refs, floatingStyles, context } = useFloating({
    open,
    onOpenChange: handleOpenChange,
    placement: 'bottom-start',
    middleware: [
      offset(4),
      flip(),
      shift(),
      floatingSize({
        apply({ rects, elements }) {
          Object.assign(elements.floating.style, {
            minWidth: `${rects.reference.width}px`,
          })
        },
      }),
    ],
    whileElementsMounted: autoUpdate,
  })

  // Only enable click trigger if NOT searching or if searching but clicking non-input areas
  const click = useClick(context, { enabled: trigger === 'click' })
  const hover = useHover(context, {
    enabled: trigger === 'hover',
    handleClose: safePolygon(),
  })
  const dismiss = useDismiss(context)
  const role = useRole(context, { role: 'listbox' })

  const { getReferenceProps, getFloatingProps } = useInteractions([click, hover, dismiss, role])

  const getOptionLabel = (val: string | number) => {
    const opt = parsedOptions.find((o) => o.value === val)
    return opt ? opt.label : val
  }

  const triggerSelect = (newValue: SelectValue, newOption: SelectOption | SelectOption[]) => {
    if (!isControlled) {
      setInternalValue(newValue)
    }
    onChange?.(newValue, newOption)
  }

  const handleSelect = (val: string | number, option: SelectOption) => {
    if (isMultiple) {
      const currentArray = (Array.isArray(currentValue) ? currentValue : []) as (string | number)[]
      const index = currentArray.indexOf(val)
      let newArray: (string | number)[]
      let newOptions: SelectOption[] = []

      if (index === -1) {
        newArray = [...currentArray, val]
      } else {
        newArray = currentArray.filter((v) => v !== val)
      }

      // Reconstruct options array for callback
      newOptions = newArray.map(
        (v) => parsedOptions.find((o) => o.value === v) || { value: v, label: v },
      )

      triggerSelect(newArray, newOptions)
      setSearchValue('') // Clear search after selection
      if (showSearch) {
        inputRef.current?.focus()
      }
    } else {
      triggerSelect(val, option)
      setOpen(false)
      setSearchValue('')
    }
  }

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation()
    const emptyValue = isMultiple ? [] : ''
    triggerSelect(emptyValue, isMultiple ? [] : ({} as SelectOption))
  }

  const handleTagRemove = (val: string | number, e: React.MouseEvent) => {
    e.stopPropagation()
    const currentArray = (Array.isArray(currentValue) ? currentValue : []) as (string | number)[]
    const newArray = currentArray.filter((v) => v !== val)
    const newOptions = newArray.map(
      (v) => parsedOptions.find((o) => o.value === v) || { value: v, label: v },
    )
    triggerSelect(newArray, newOptions)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value)
    if (!open) setOpen(true)
  }

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && isTags && searchValue) {
      // Tags mode: add new value
      const existing = parsedOptions.find((o) => o.value === searchValue)
      if (existing) {
        handleSelect(existing.value, existing)
      } else {
        // Create new tag
        const newTagValue = searchValue
        const newOption = { value: newTagValue, label: newTagValue }
        handleSelect(newTagValue, newOption)
      }
      e.preventDefault()
    }
    // TODO: Add keyboard navigation (ArrowUp, ArrowDown) here later
  }

  // Display content logic
  const renderContent = () => {
    // Multiple/Tags Mode
    if (isMultiple) {
      const currentArray = (Array.isArray(currentValue) ? currentValue : []) as (string | number)[]
      return (
        <>
          {currentArray.map((val) => (
            <Tag key={val}>
              <span>{getOptionLabel(val)}</span>
              <TagCloseIcon onClick={(e) => handleTagRemove(val, e)}>
                <CloseIcon />
              </TagCloseIcon>
            </Tag>
          ))}
          {/* Input for search/tags in multiple mode */}
          {(showSearch || isTags) && (
            <InputWrapper
              style={{ width: searchValue ? 'auto' : '4px', minWidth: '50px', flex: 1 }}
            >
              <SearchInput
                ref={inputRef}
                value={searchValue}
                onChange={handleInputChange}
                onKeyDown={handleInputKeyDown}
                disabled={disabled}
                style={{ width: '100%' }}
              />
            </InputWrapper>
          )}
          {!searchValue && currentArray.length === 0 && !showSearch && !isTags && (
            <Placeholder>{placeholder}</Placeholder>
          )}
          {currentArray.length === 0 && !searchValue && (showSearch || isTags) && (
            <Placeholder style={{ position: 'absolute', left: 0, pointerEvents: 'none' }}>
              {placeholder}
            </Placeholder>
          )}
        </>
      )
    }

    // Single Mode
    if (showSearch) {
      return (
        <>
          {!searchValue &&
            (currentValue !== undefined && currentValue !== '' ? (
              <span
                style={{
                  position: 'absolute',
                  left: 0,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  pointerEvents: 'none',
                  width: '100%',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {getOptionLabel(currentValue as string | number)}
              </span>
            ) : (
              <Placeholder
                style={{
                  position: 'absolute',
                  left: 0,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  pointerEvents: 'none',
                  width: '100%',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {placeholder}
              </Placeholder>
            ))}
          <SearchInput
            ref={inputRef}
            value={searchValue}
            onChange={handleInputChange}
            onKeyDown={handleInputKeyDown}
            disabled={disabled}
            style={{ opacity: open || searchValue ? 1 : 0 }} // Hide input when closed in single mode usually? Or simpler: always show if searching
          />
        </>
      )
    }

    // Standard Single Mode
    if (!currentValue && currentValue !== 0) {
      return <Placeholder>{placeholder}</Placeholder>
    }
    return getOptionLabel(currentValue as string | number)
  }

  const showClear =
    allowClear &&
    !disabled &&
    (isMultiple
      ? Array.isArray(currentValue) && currentValue.length > 0
      : currentValue !== '' && currentValue !== undefined && currentValue !== null)

  const contextValue = {
    value: currentValue,
    onSelect: handleSelect,
    multiple: isMultiple,
    searchValue,
    activeValue: null,
    setActiveValue: () => {},
  }

  const triggerRef = refs.setReference as any

  return (
    <SelectContext.Provider value={contextValue}>
      <SelectContainer
        ref={triggerRef}
        className={`compass-select ${className || ''} ${open ? 'compass-select-open' : ''} ${
          disabled ? 'compass-select-disabled' : ''
        }`}
        style={style}
        disabled={disabled}
        fullWidth
        {...getReferenceProps({
          // Ensure clicking anywhere focuses input if searchable
          onClick: () => {
            if (showSearch || isTags) {
              inputRef.current?.focus()
            }
          },
        })}
      >
        <SelectTrigger
          size={size}
          active={open}
          status={status}
          className="compass-select-selector"
        >
          <SelectedContent>{renderContent()}</SelectedContent>
          <SuffixIcon>
            {loading ? (
              <LoadingWrapper>
                <LoadingIcon />
              </LoadingWrapper>
            ) : showClear ? (
              <span onClick={handleClear} style={{ cursor: 'pointer' }}>
                <CloseCircleIcon />
              </span>
            ) : (
              <DownIcon />
            )}
          </SuffixIcon>
        </SelectTrigger>

        {open && (
          <FloatingPortal>
            <SelectDropdown
              ref={refs.setFloating}
              style={{
                ...dropdownStyle,
                ...floatingStyles,
                opacity: x === null || y === null ? 0 : 1,
                visibility: x === null || y === null ? 'hidden' : 'visible',
              }}
              className={`compass-select-dropdown ${dropdownClassName || ''}`}
              {...getFloatingProps()}
            >
              {filteredOptions.length > 0 ? (
                filteredOptions.map((opt) => (
                  <Option key={opt.value} {...opt}>
                    {opt.label}
                  </Option>
                ))
              ) : (
                <div style={{ padding: '8px 12px', color: '#999', textAlign: 'center' }}>
                  No Data
                </div>
              )}
            </SelectDropdown>
          </FloatingPortal>
        )}
      </SelectContainer>
    </SelectContext.Provider>
  )
}

Select.Option = Option
Select.displayName = 'Select'

export default Select
