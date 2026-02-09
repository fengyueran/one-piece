import React, { useState, useMemo, useCallback } from 'react'
import {
  useFloating,
  autoUpdate,
  offset,
  flip,
  shift,
  useDismiss,
  useRole,
  useInteractions,
  FloatingPortal,
  size as floatingSize,
} from '@floating-ui/react'
import InputField from '../input-field'
import { AutoCompleteProps, AutoCompleteOption } from './types'
import {
  AutoCompleteContainer,
  Dropdown,
  OptionItem,
  NotFoundContent,
  Highlight,
} from './auto-complete.styles'

function escapeRegExp(string: string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

const HighlightedText: React.FC<{ text: string; searchValue: string }> = ({
  text,
  searchValue,
}) => {
  if (!searchValue) return <>{text}</>

  const parts = text.split(new RegExp(`(${escapeRegExp(searchValue)})`, 'gi'))
  return (
    <>
      {parts.map((part, i) =>
        part.toLowerCase() === searchValue.toLowerCase() ? (
          <Highlight key={i}>{part}</Highlight>
        ) : (
          part
        ),
      )}
    </>
  )
}

function useControlledValue(value?: string, defaultValue?: string) {
  const [internalValue, setInternalValue] = useState(defaultValue || '')
  const isControlled = value !== undefined
  const currentValue = isControlled ? value : internalValue

  return { currentValue, setInternalValue, isControlled }
}

function useFilteredOptions(
  options: AutoCompleteOption[],
  filterOption: AutoCompleteProps['filterOption'],
  searchValue: string,
) {
  return useMemo(() => {
    if (!filterOption) return options

    if (typeof filterOption === 'function') {
      return options.filter((opt) => filterOption(searchValue || '', opt))
    }

    if (!searchValue) return options
    const lowerValue = searchValue.toLowerCase()
    return options.filter((opt) => {
      const label = opt.label ? String(opt.label) : ''
      const val = String(opt.value)
      return label.toLowerCase().includes(lowerValue) || val.toLowerCase().includes(lowerValue)
    })
  }, [options, filterOption, searchValue])
}

const AutoComplete: React.FC<AutoCompleteProps> = (props) => {
  const {
    value,
    defaultValue,
    options = [],
    onSearch,
    onSelect,
    onChange,
    filterOption = true,
    dropdownMatchSelectWidth = true,
    notFoundContent,
    fullWidth,
    style,
    className,
    classNames,
    styles,
    ...rest
  } = props

  const { currentValue, setInternalValue, isControlled } = useControlledValue(value, defaultValue)
  const [open, setOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState<number>(-1)

  const filteredOptions = useFilteredOptions(options, filterOption, currentValue)

  const { refs, strategy, context, floatingStyles } = useFloating({
    open,
    onOpenChange: setOpen,
    placement: 'bottom-start',
    middleware: [
      offset(4),
      flip(),
      shift(),
      floatingSize({
        apply({ rects, elements, availableHeight }) {
          const width =
            dropdownMatchSelectWidth === true
              ? `${rects.reference.width}px`
              : typeof dropdownMatchSelectWidth === 'number'
                ? `${dropdownMatchSelectWidth}px`
                : ''
          Object.assign(elements.floating.style, {
            width,
            maxHeight: `${Math.min(availableHeight, 256)}px`,
          })
        },
      }),
    ],
    whileElementsMounted: autoUpdate,
  })

  const dismiss = useDismiss(context)
  const role = useRole(context, { role: 'listbox' })
  const { getReferenceProps, getFloatingProps } = useInteractions([dismiss, role])

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value
      if (!isControlled) {
        setInternalValue(val)
      }
      onChange?.(val)
      onSearch?.(val)
      setOpen(true)
      setActiveIndex(-1)
    },
    [isControlled, setInternalValue, onChange, onSearch, setOpen, setActiveIndex],
  )

  const handleSelect = useCallback(
    (option: AutoCompleteOption) => {
      if (!isControlled) {
        setInternalValue(option.value)
      }
      onChange?.(option.value)
      onSelect?.(option.value, option)
      setOpen(false)
    },
    [isControlled, setInternalValue, onChange, onSelect, setOpen],
  )

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (filteredOptions.length === 0) return
      const optionsLen = filteredOptions.length

      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setActiveIndex((prev) => (prev < optionsLen - 1 ? prev + 1 : 0))
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setActiveIndex((prev) => (prev > 0 ? prev - 1 : optionsLen - 1))
      } else if (e.key === 'Enter') {
        if (open && activeIndex >= 0 && filteredOptions[activeIndex]) {
          e.preventDefault()
          handleSelect(filteredOptions[activeIndex])
        } else {
          setOpen(false)
        }
      } else if (e.key === 'Escape') {
        setOpen(false)
      }

      rest.onKeyDown?.(e)
    },
    [filteredOptions, open, activeIndex, handleSelect, setActiveIndex, setOpen, rest],
  )

  const handleFocus = useCallback(
    (e: React.FocusEvent<HTMLInputElement>) => {
      if (currentValue && filteredOptions.length > 0) {
        setOpen(true)
      }
      rest.onFocus?.(e)
    },
    [currentValue, filteredOptions.length, setOpen, rest],
  )

  const handleBlur = useCallback(
    (e: React.FocusEvent<HTMLInputElement>) => {
      rest.onBlur?.(e)
    },
    [rest],
  )

  const renderOptionContent = (option: AutoCompleteOption) => {
    const text = option.label || option.value
    if (typeof text !== 'string') return text
    return <HighlightedText text={text} searchValue={currentValue} />
  }

  return (
    <AutoCompleteContainer
      ref={(node) => refs.setReference(node)}
      fullWidth={fullWidth}
      style={{ ...styles?.root, ...style }}
      className={`compass-auto-complete ${classNames?.root || ''} ${className || ''}`}
      {...getReferenceProps()}
    >
      <InputField
        {...rest}
        style={styles?.input}
        className={classNames?.input}
        value={currentValue}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onFocus={handleFocus}
        onBlur={handleBlur}
        fullWidth
        autoComplete="off"
      />
      {open && (filteredOptions.length > 0 || notFoundContent) && (
        <FloatingPortal>
          <Dropdown
            ref={(node) => refs.setFloating(node)}
            className={`compass-auto-complete-dropdown ${classNames?.dropdown || ''}`}
            style={{
              ...styles?.dropdown,
              position: strategy,
              ...floatingStyles,
            }}
            {...getFloatingProps()}
          >
            {filteredOptions.length > 0
              ? filteredOptions.map((option, index) => (
                  <OptionItem
                    key={option.value}
                    active={index === activeIndex}
                    style={styles?.option}
                    className={`compass-auto-complete-option ${
                      index === activeIndex ? 'compass-auto-complete-option--active' : ''
                    } ${classNames?.option || ''}`}
                    onClick={() => handleSelect(option)}
                    onMouseEnter={() => setActiveIndex(index)}
                  >
                    {renderOptionContent(option)}
                  </OptionItem>
                ))
              : notFoundContent && <NotFoundContent>{notFoundContent}</NotFoundContent>}
          </Dropdown>
        </FloatingPortal>
      )}
    </AutoCompleteContainer>
  )
}

export default AutoComplete
