import React, { useEffect, useId, useMemo, useRef, useState } from 'react'
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

import { OptionProps, SelectOption, SelectProps, SelectValue } from './types'
import { SelectContext } from './context'
import Option from './option'
import {
  InputWrapper,
  LoadingWrapper,
  Placeholder,
  SearchInput,
  SelectContainer,
  SelectDropdown,
  SelectMenu,
  SelectTrigger,
  SelectedContent,
  SuffixIcon,
  Tag,
  TagCloseIcon,
} from './select.styles'
import { CloseCircleIcon, CloseIcon, DownIcon, LoadingIcon } from '../icons'

const Select: React.FC<SelectProps> & { Option: typeof Option } = (props) => {
  const {
    children,
    options,
    value,
    defaultValue,
    onChange,
    open: controlledOpen,
    onOpenChange,
    disabled,
    loading,
    allowClear,
    placeholder,
    multiple = false,
    mode,
    size = 'medium',
    status,
    dropdownStyle,
    dropdownClassName,
    trigger = 'click',
    showSearch,
    className,
    style,
    styles,
    classNames,
    optionRender,
    labelRender,
    menuItemSelectedIcon,
    popupRender,
  } = props

  const isMultiple = multiple || mode === 'multiple' || mode === 'tags'
  const isTags = mode === 'tags'
  const searchable = showSearch || isTags

  const [internalValue, setInternalValue] = useState<SelectValue>(
    defaultValue || (isMultiple ? [] : ''),
  )
  const isControlled = value !== undefined
  const currentValue = isControlled ? value : internalValue

  const [internalOpen, setInternalOpen] = useState(false)
  const isOpenControlled = controlledOpen !== undefined
  const open = isOpenControlled ? controlledOpen : internalOpen
  const [searchValue, setSearchValue] = useState('')
  const [activeValue, setActiveValue] = useState<string | number | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const selectId = useId().replace(/:/g, '')
  const listboxId = `compass-select-listbox-${selectId}`

  const parsedOptions = useMemo(() => {
    const nextOptions: SelectOption[] = []

    if (options) {
      return options
    }

    React.Children.forEach(children, (child) => {
      if (
        React.isValidElement<OptionProps>(child) &&
        (child.type === Option ||
          (typeof child.type === 'function' && child.type.name === 'Option'))
      ) {
        const { value, children: label, disabled, ...rest } = child.props
        nextOptions.push({ value, label, disabled, ...rest })
      }
    })

    return nextOptions
  }, [children, options])

  const filteredOptions = useMemo(() => {
    if (!searchValue) {
      return parsedOptions
    }

    return parsedOptions.filter((option) => {
      const labelText = String(option.label)
      return labelText.toLowerCase().includes(searchValue.toLowerCase())
    })
  }, [parsedOptions, searchValue])

  const enabledOptions = useMemo(
    () => filteredOptions.filter((option) => !option.disabled),
    [filteredOptions],
  )

  const getOptionId = (optionValue: string | number) =>
    `compass-select-option-${selectId}-${String(optionValue).replace(/[^a-zA-Z0-9-_]/g, '-')}`

  const focusSearchInput = () => {
    setTimeout(() => {
      inputRef.current?.focus()
    }, 0)
  }

  const getInitialActiveValue = (direction: 'start' | 'end' = 'start') => {
    if (enabledOptions.length === 0) {
      return null
    }

    if (!isMultiple && currentValue !== '' && currentValue !== undefined && currentValue !== null) {
      const selectedOption = enabledOptions.find((option) => option.value === currentValue)
      if (selectedOption) {
        return selectedOption.value
      }
    }

    return direction === 'end'
      ? (enabledOptions[enabledOptions.length - 1]?.value ?? null)
      : (enabledOptions[0]?.value ?? null)
  }

  const getNextActiveValue = (direction: 1 | -1) => {
    if (enabledOptions.length === 0) {
      return null
    }

    const currentIndex = enabledOptions.findIndex((option) => option.value === activeValue)
    if (currentIndex === -1) {
      return direction === -1
        ? (enabledOptions[enabledOptions.length - 1]?.value ?? null)
        : (enabledOptions[0]?.value ?? null)
    }

    const nextIndex = Math.max(0, Math.min(enabledOptions.length - 1, currentIndex + direction))
    return enabledOptions[nextIndex]?.value ?? null
  }

  const handleOpenChange = (nextOpen: boolean) => {
    if (disabled) {
      return
    }

    if (!isOpenControlled) {
      setInternalOpen(nextOpen)
    }

    onOpenChange?.(nextOpen)

    if (!nextOpen) {
      setSearchValue('')
      setActiveValue(null)
      return
    }

    if (searchable) {
      focusSearchInput()
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

  const click = useClick(context, { enabled: trigger === 'click' })
  const hover = useHover(context, {
    enabled: trigger === 'hover',
    handleClose: safePolygon(),
  })
  const dismiss = useDismiss(context)
  const role = useRole(context, { role: 'listbox' })

  const { getReferenceProps, getFloatingProps } = useInteractions([click, hover, dismiss, role])

  const getOptionLabel = (optionValue: string | number) => {
    const option = parsedOptions.find((item) => item.value === optionValue)
    if (!option) {
      return optionValue
    }

    return labelRender ? labelRender(option) : option.label
  }

  const triggerSelect = (newValue: SelectValue, option?: SelectOption | SelectOption[]) => {
    if (!isControlled) {
      setInternalValue(newValue)
    }

    onChange?.(newValue, option)
  }

  const handleSelect = (optionValue: string | number, option: SelectOption) => {
    if (isMultiple) {
      const currentArray = (Array.isArray(currentValue) ? currentValue : []) as (string | number)[]
      const existingIndex = currentArray.indexOf(optionValue)
      const nextValue =
        existingIndex === -1
          ? [...currentArray, optionValue]
          : currentArray.filter((item) => item !== optionValue)
      const nextOptions = nextValue.map(
        (item) => parsedOptions.find((parsedOption) => parsedOption.value === item) || item,
      ) as SelectOption[]

      triggerSelect(nextValue, nextOptions)
      setSearchValue('')
      setActiveValue(optionValue)
      if (searchable) {
        focusSearchInput()
      }
      return
    }

    triggerSelect(optionValue, option)
    handleOpenChange(false)
  }

  const handleClear = (event: React.MouseEvent) => {
    event.stopPropagation()
    const emptyValue = isMultiple ? [] : ''
    triggerSelect(emptyValue, isMultiple ? [] : undefined)
  }

  const handleTagRemove = (optionValue: string | number, event: React.MouseEvent) => {
    event.stopPropagation()
    const currentArray = (Array.isArray(currentValue) ? currentValue : []) as (string | number)[]
    const nextValue = currentArray.filter((item) => item !== optionValue)
    const nextOptions = nextValue.map(
      (item) => parsedOptions.find((parsedOption) => parsedOption.value === item) || item,
    ) as SelectOption[]

    triggerSelect(nextValue, nextOptions)
  }

  const selectActiveOption = () => {
    const nextValue = activeValue ?? getInitialActiveValue()
    if (nextValue === null) {
      return
    }

    const option = filteredOptions.find((item) => item.value === nextValue && !item.disabled)
    if (!option) {
      return
    }

    handleSelect(option.value, option)
    setActiveValue(option.value)
  }

  const handleKeyboardAction = (
    event: React.KeyboardEvent<HTMLElement | HTMLInputElement>,
    source: 'trigger' | 'input',
  ) => {
    if (disabled) {
      return
    }

    if (event.key === 'ArrowDown') {
      event.preventDefault()
      if (!open) {
        handleOpenChange(true)
        setActiveValue(getInitialActiveValue('start'))
        return
      }

      setActiveValue(getNextActiveValue(1))
      return
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault()
      if (!open) {
        handleOpenChange(true)
        setActiveValue(getInitialActiveValue('end'))
        return
      }

      setActiveValue(getNextActiveValue(-1))
      return
    }

    if (event.key === 'Escape') {
      if (open) {
        event.preventDefault()
        handleOpenChange(false)
      }
      return
    }

    const allowSpaceSelection = source === 'trigger' || searchValue.length === 0
    if (event.key === 'Enter' || (event.key === ' ' && allowSpaceSelection)) {
      event.preventDefault()
      if (!open) {
        handleOpenChange(true)
        setActiveValue(getInitialActiveValue('start'))
        return
      }

      selectActiveOption()
    }
  }

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.target.value)
    setActiveValue(null)
    if (!open) {
      handleOpenChange(true)
    }
  }

  const handleInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && isTags && searchValue) {
      const existingOption = parsedOptions.find((option) => option.value === searchValue)
      if (existingOption) {
        handleSelect(existingOption.value, existingOption)
      } else {
        const nextTag = { value: searchValue, label: searchValue }
        handleSelect(nextTag.value, nextTag)
      }
      event.preventDefault()
      return
    }

    handleKeyboardAction(event, 'input')
  }

  useEffect(() => {
    if (!open) {
      return
    }

    if (enabledOptions.length === 0) {
      if (activeValue !== null) {
        setActiveValue(null)
      }
      return
    }

    if (searchable && searchValue) {
      if (activeValue !== null && !enabledOptions.some((option) => option.value === activeValue)) {
        setActiveValue(null)
      }
      return
    }

    if (activeValue !== null && enabledOptions.some((option) => option.value === activeValue)) {
      return
    }

    setActiveValue(getInitialActiveValue())
  }, [activeValue, currentValue, enabledOptions, open])

  const renderContent = () => {
    if (isMultiple) {
      const currentArray = (Array.isArray(currentValue) ? currentValue : []) as (string | number)[]

      return (
        <>
          {currentArray.map((optionValue) => (
            <Tag key={optionValue} style={styles?.tag} className={classNames?.tag}>
              <span>{getOptionLabel(optionValue)}</span>
              <TagCloseIcon onClick={(event) => handleTagRemove(optionValue, event)}>
                <CloseIcon />
              </TagCloseIcon>
            </Tag>
          ))}
          {searchable && (
            <InputWrapper
              style={{ width: searchValue ? 'auto' : '4px', minWidth: '50px', flex: 1 }}
            >
              <SearchInput
                ref={inputRef}
                value={searchValue}
                onChange={handleInputChange}
                onKeyDown={handleInputKeyDown}
                disabled={disabled}
                role="combobox"
                aria-expanded={open}
                aria-haspopup="listbox"
                aria-controls={listboxId}
                aria-activedescendant={
                  open && activeValue !== null ? getOptionId(activeValue) : undefined
                }
                aria-disabled={disabled || undefined}
                style={{ width: '100%' }}
              />
            </InputWrapper>
          )}
          {!searchValue && currentArray.length === 0 && !searchable && (
            <Placeholder>{placeholder}</Placeholder>
          )}
          {currentArray.length === 0 && !searchValue && searchable && (
            <Placeholder style={{ position: 'absolute', left: 0, pointerEvents: 'none' }}>
              {placeholder}
            </Placeholder>
          )}
        </>
      )
    }

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
            role="combobox"
            aria-expanded={open}
            aria-haspopup="listbox"
            aria-controls={listboxId}
            aria-activedescendant={
              open && activeValue !== null ? getOptionId(activeValue) : undefined
            }
            aria-disabled={disabled || undefined}
            style={{ opacity: open || searchValue ? 1 : 0 }}
          />
        </>
      )
    }

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
    activeValue,
    setActiveValue,
    menuItemSelectedIcon,
  }

  const triggerRef = refs.setReference as (node: HTMLElement | null) => void

  const menuNode = (
    <SelectMenu className="compass-select-menu" id={listboxId} role="listbox">
      {filteredOptions.length > 0 ? (
        filteredOptions.map((option, index) => {
          const isSelected = isMultiple
            ? Array.isArray(currentValue) && currentValue.includes(option.value)
            : currentValue === option.value

          return (
            <Option
              key={option.value}
              id={getOptionId(option.value)}
              value={option.value}
              disabled={option.disabled}
              label={option.label}
              style={styles?.option}
              className={classNames?.option || ''}
              menuItemSelectedIcon={optionRender ? <></> : undefined}
            >
              {optionRender ? optionRender(option, { index, selected: isSelected }) : option.label}
            </Option>
          )
        })
      ) : (
        <div style={{ padding: '8px 12px', color: '#999', textAlign: 'center' }}>No Data</div>
      )}
    </SelectMenu>
  )

  const popupContent = popupRender ? popupRender(menuNode) : menuNode

  return (
    <SelectContext.Provider value={contextValue}>
      <SelectContainer
        ref={triggerRef}
        className={`compass-select ${className || ''} ${classNames?.root || ''} ${open ? 'compass-select-open' : ''} ${
          disabled ? 'compass-select-disabled' : ''
        }`}
        style={{ ...style, ...styles?.root }}
        disabled={disabled}
        fullWidth
        {...getReferenceProps({
          ...(searchable
            ? {}
            : {
                role: 'combobox' as const,
                tabIndex: disabled ? -1 : 0,
                'aria-expanded': open,
                'aria-haspopup': 'listbox' as const,
                'aria-controls': listboxId,
                'aria-activedescendant':
                  open && activeValue !== null ? getOptionId(activeValue) : undefined,
                'aria-disabled': disabled || undefined,
                onKeyDown: (event: React.KeyboardEvent<HTMLDivElement>) =>
                  handleKeyboardAction(event, 'trigger'),
              }),
          onClick: () => {
            if (searchable) {
              inputRef.current?.focus()
            }
          },
        })}
      >
        <SelectTrigger
          size={size}
          active={open}
          status={status}
          style={styles?.trigger}
          className={`compass-select-selector ${classNames?.trigger || ''}`}
        >
          <SelectedContent size={size}>{renderContent()}</SelectedContent>
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
            {/* eslint-disable-next-line react-hooks/rules-of-hooks */}
            <SelectDropdown
              ref={refs.setFloating}
              style={{
                ...dropdownStyle,
                ...floatingStyles,
                opacity: x === null || y === null ? 0 : 1,
                visibility: x === null || y === null ? 'hidden' : 'visible',
                ...styles?.dropdown,
              }}
              className={`compass-select-dropdown ${dropdownClassName || ''} ${classNames?.dropdown || ''}`}
              {...getFloatingProps({
                onClick: (event) => event.stopPropagation(),
                onMouseDown: (event) => event.stopPropagation(),
                onPointerDown: (event) => event.stopPropagation(),
              })}
            >
              {popupContent}
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
