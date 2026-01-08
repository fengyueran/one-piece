import React, { useState, useMemo } from 'react'
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
    ...rest
  } = props

  // Controlled/Uncontrolled state for value
  const [internalValue, setInternalValue] = useState(defaultValue || '')
  const isControlled = value !== undefined
  const currentValue = isControlled ? value : internalValue

  const [open, setOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState<number>(-1)

  const { x, y, refs, strategy, context, floatingStyles } = useFloating({
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

  const filteredOptions = useMemo(() => {
    if (!filterOption) return options

    if (typeof filterOption === 'function') {
      return options.filter((opt) => filterOption(currentValue || '', opt))
    }

    if (!currentValue) return options
    const lowerValue = String(currentValue).toLowerCase()
    return options.filter((opt) => {
      const label = opt.label ? String(opt.label) : ''
      const val = String(opt.value)
      return label.toLowerCase().includes(lowerValue) || val.toLowerCase().includes(lowerValue)
    })
  }, [options, filterOption, currentValue])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    if (!isControlled) {
      setInternalValue(val)
    }
    onChange?.(val)
    onSearch?.(val)
    setOpen(true)
    setActiveIndex(-1)
  }

  const handleSelect = (option: AutoCompleteOption) => {
    if (!isControlled) {
      setInternalValue(option.value)
    }
    onChange?.(option.value)
    onSelect?.(option.value, option)
    setOpen(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
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
  }

  // Open on focus if there is value
  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    if (currentValue && filteredOptions.length > 0) {
      setOpen(true)
    }
    rest.onFocus?.(e)
  }

  return (
    <AutoCompleteContainer
      ref={(node) => refs.setReference(node)}
      fullWidth={fullWidth}
      style={style}
      className={`compass-auto-complete ${className || ''}`}
      {...getReferenceProps()}
    >
      <InputField
        {...rest}
        value={currentValue}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onFocus={handleFocus}
        fullWidth
        autoComplete="off"
      />
      {open && (filteredOptions.length > 0 || notFoundContent) && (
        <FloatingPortal>
          <Dropdown
            ref={(node) => refs.setFloating(node)}
            className={`compass-auto-complete-dropdown`}
            style={{
              position: strategy,
              top: y ?? 0,
              left: x ?? 0,
              ...floatingStyles,
            }}
            {...getFloatingProps()}
          >
            {filteredOptions.length > 0
              ? filteredOptions.map((option, index) => (
                  <OptionItem
                    key={option.value}
                    active={index === activeIndex}
                    className={`compass-auto-complete-option ${
                      index === activeIndex ? 'compass-auto-complete-option--active' : ''
                    }`}
                    onClick={() => handleSelect(option)}
                    onMouseEnter={() => setActiveIndex(index)}
                  >
                    {(() => {
                      const text = option.label || option.value
                      if (!currentValue || typeof text !== 'string') {
                        return text
                      }

                      const parts = text.split(
                        new RegExp(`(${escapeRegExp(String(currentValue))})`, 'gi'),
                      )
                      return parts.map((part, i) =>
                        part.toLowerCase() === String(currentValue).toLowerCase() ? (
                          <Highlight key={i}>{part}</Highlight>
                        ) : (
                          part
                        ),
                      )
                    })()}
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
