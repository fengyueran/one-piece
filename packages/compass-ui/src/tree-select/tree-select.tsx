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
} from '@floating-ui/react'
import Tree, { DataNode } from '../tree'
import { convertTreeToEntities } from '../tree/utils/tree-data'
import { DownIcon, CloseIcon, CloseCircleIcon, LoadingIcon } from '../icons'
import { TreeSelectProps, SelectValue } from './types'
import {
  TreeSelectContainer,
  TreeSelectTrigger,
  TreeSelectDropdown,
  SelectedContent,
  Placeholder,
  Tag,
  TagCloseIcon,
  SuffixIcon,
  LoadingWrapper,
  SearchInput,
  InputWrapper,
  SingleValue,
} from './tree-select.styles'

const TreeSelect: React.FC<TreeSelectProps> = (props) => {
  const {
    treeData = [],
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
    treeCheckable = false,
    treeDefaultExpandedKeys = [],
    size = 'medium',
    status,
    dropdownStyle,
    dropdownClassName,
    showSearch = false,
    // treeLine,
    // treeIcon,
  } = props

  const [internalValue, setInternalValue] = useState<SelectValue>(
    defaultValue || (multiple || treeCheckable ? [] : ''),
  )
  const isControlled = value !== undefined
  const currentValue = isControlled ? value : internalValue

  const [open, setOpen] = useState(false)
  const [searchValue, setSearchValue] = useState('')
  const [inputValue, setInputValue] = useState('')
  const isComposing = useRef(false)
  const inputRef = useRef<HTMLInputElement>(null)

  // Manage expanded keys internally to support both search-based auto-expansion and manual toggling
  const [internalExpandedKeys, setInternalExpandedKeys] = useState<(string | number)[]>(
    treeDefaultExpandedKeys || [],
  )

  // Memoize entities map for getting labels / cascade check info
  const { keyEntities } = useMemo(() => {
    return convertTreeToEntities(treeData)
  }, [treeData])

  const { x, y, refs, floatingStyles, context } = useFloating({
    open,
    onOpenChange: (nextOpen) => {
      if (disabled) return

      // Prevent closing when user is actively typing/searching
      if (!nextOpen && (inputValue || searchValue)) {
        return
      }

      setOpen(nextOpen)
      if (!nextOpen) {
        setSearchValue('')
        setInputValue('')
      } else {
        // Focus input when opening if showSearch is true
        setTimeout(() => {
          if (showSearch) {
            inputRef.current?.focus()
          }
        }, 0)
      }
    },
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

  const click = useClick(context, { enabled: true, keyboardHandlers: false })
  const dismiss = useDismiss(context, {
    escapeKey: true,
    outsidePress: true,
  })
  const role = useRole(context, { role: 'listbox' }) // or tree?

  const { getReferenceProps, getFloatingProps } = useInteractions([click, dismiss, role])

  // Helpers
  const getLabel = (val: string | number) => {
    const entity = keyEntities[val]
    return entity ? entity.node.title : val
  }

  const triggerChange = (
    newValue: SelectValue,
    label?: React.ReactNode | React.ReactNode[],
    extra?: unknown,
  ) => {
    if (!isControlled) {
      setInternalValue(newValue)
    }
    if (onChange) {
      onChange(newValue, label, extra)
    }
  }

  // Tree Event Handlers
  const onTreeSelect = (
    _selectedKeys: (string | number)[],
    info: { node: DataNode; selected: boolean; event: React.MouseEvent },
  ) => {
    const { node, selected } = info
    const key = node.key

    if (treeCheckable) return // Should use onCheck

    if (multiple) {
      // Multiple selection mode (without checkboxes)
      const currentArray = (Array.isArray(currentValue) ? currentValue : []) as (string | number)[]
      const newArray = selected ? [...currentArray, key] : currentArray.filter((k) => k !== key) // Toggle

      const newLabels = newArray.map((k) => getLabel(k))
      triggerChange(newArray, newLabels, { triggerNode: node, ...info })

      setSearchValue('')
      setInputValue('')
      if (showSearch) {
        inputRef.current?.focus()
      }
    } else {
      // Single selection mode
      triggerChange(key, node.title, { triggerNode: node, ...info })
      setOpen(false)
      setOpen(false)
      setSearchValue('')
      setInputValue('')
    }
  }

  const onTreeCheck = (
    checkedKeys: (string | number)[],
    info: { node: DataNode; checked: boolean; event: React.MouseEvent },
  ) => {
    if (!treeCheckable) return
    const newLabels = checkedKeys.map((k) => getLabel(k))
    triggerChange(checkedKeys, newLabels, info)
    // Don't close dropdown on check
  }

  // Remove tag (multiple/checkable)
  const handleTagRemove = (val: string | number, e: React.MouseEvent) => {
    e.stopPropagation()
    const currentArray = (Array.isArray(currentValue) ? currentValue : []) as (string | number)[]
    const newArray = currentArray.filter((k) => k !== val)
    const newLabels = newArray.map((k) => getLabel(k))
    triggerChange(newArray, newLabels)
  }

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation()
    const emptyValue = multiple || treeCheckable ? [] : undefined
    triggerChange(emptyValue as SelectValue, multiple || treeCheckable ? [] : undefined)
  }

  const handleCompositionStart = () => {
    isComposing.current = true
  }

  const handleCompositionEnd = (e: React.CompositionEvent<HTMLInputElement>) => {
    const value = e.currentTarget.value
    setInputValue(value)
    setSearchValue(value)
    isComposing.current = false
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setInputValue(value)
    if (!isComposing.current) {
      setSearchValue(value)
    }

    if (!open) {
      setOpen(true)
    }
  }

  // Render Trigger Content
  const renderTriggerContent = () => {
    if (multiple || treeCheckable) {
      const currentArray = (Array.isArray(currentValue) ? currentValue : []) as (string | number)[]

      return (
        <>
          {currentArray.map((val) => (
            <Tag key={val}>
              <span>{getLabel(val)}</span>
              <TagCloseIcon onClick={(e) => handleTagRemove(val, e)}>
                <CloseIcon />
              </TagCloseIcon>
            </Tag>
          ))}
          {showSearch && (
            <InputWrapper style={{ width: inputValue ? 'auto' : '4px', minWidth: '50px', flex: 1 }}>
              <SearchInput
                ref={inputRef}
                value={inputValue}
                onChange={handleInputChange}
                onCompositionStart={handleCompositionStart}
                onCompositionEnd={handleCompositionEnd}
                disabled={disabled}
              />
            </InputWrapper>
          )}
          {currentArray.length === 0 && !inputValue && <Placeholder>{placeholder}</Placeholder>}
          {currentArray.length === 0 && !inputValue && showSearch && (
            <Placeholder style={{ position: 'absolute', left: 0, pointerEvents: 'none' }}>
              {placeholder}
            </Placeholder>
          )}
        </>
      )
    }

    // Single Logic
    if (showSearch) {
      return (
        <>
          {currentValue !== undefined && currentValue !== '' && currentValue !== null ? (
            <SingleValue
              $isOpen={open}
              style={{
                opacity: inputValue ? 0 : 1,
                visibility: inputValue ? 'hidden' : 'visible',
              }}
            >
              {getLabel(currentValue as string | number)}
            </SingleValue>
          ) : (
            <Placeholder
              style={{
                position: 'absolute',
                left: 0,
                top: '50%',
                transform: 'translateY(-50%)',
                pointerEvents: 'none',
                opacity: inputValue ? 0 : 1,
                visibility: inputValue ? 'hidden' : 'visible',
              }}
            >
              {placeholder}
            </Placeholder>
          )}
          <SearchInput
            ref={inputRef}
            value={inputValue}
            onChange={handleInputChange}
            onCompositionStart={handleCompositionStart}
            onCompositionEnd={handleCompositionEnd}
            disabled={disabled}
            style={{ opacity: open || inputValue ? 1 : 0 }}
          />
        </>
      )
    }

    if (currentValue !== undefined && currentValue !== '' && currentValue !== null) {
      return getLabel(currentValue as string | number)
    }
    return <Placeholder>{placeholder}</Placeholder>
  }

  const showClear =
    allowClear &&
    !disabled &&
    (Array.isArray(currentValue)
      ? currentValue.length > 0
      : currentValue !== undefined && currentValue !== '' && currentValue !== null)

  // Calculate tree props
  const treeProps = {
    treeData,
    selectable: !treeCheckable && props.treeSelectable !== false,
    checkable: treeCheckable,
    onSelect: onTreeSelect,
    onCheck: onTreeCheck,
    defaultExpandedKeys: treeDefaultExpandedKeys,
    checkedKeys: treeCheckable
      ? ((Array.isArray(currentValue) ? currentValue : []) as (string | number)[])
      : undefined,
    selectedKeys: !treeCheckable
      ? ((Array.isArray(currentValue) ? currentValue : currentValue ? [currentValue] : []) as (
          | string
          | number
        )[])
      : [],
    titleRender: (nodeData: DataNode) => {
      const { treeSelectedIcon } = props
      const strTitle = nodeData.title as string
      let titleNode: React.ReactNode = strTitle

      if (
        searchValue &&
        strTitle &&
        String(strTitle).toLowerCase().includes(searchValue.toLowerCase())
      ) {
        const index = strTitle.toLowerCase().indexOf(searchValue.toLowerCase())
        const beforeStr = strTitle.substring(0, index)
        const matchStr = strTitle.substring(index, index + searchValue.length)
        const afterStr = strTitle.substring(index + searchValue.length)

        titleNode = (
          <span>
            {beforeStr}
            <span style={{ color: '#1677ff' }}>{matchStr}</span>
            {afterStr}
          </span>
        )
      }

      const isSelected = Array.isArray(currentValue)
        ? (currentValue as (string | number)[]).includes(nodeData.key)
        : currentValue === nodeData.key

      if (isSelected && treeSelectedIcon) {
        return (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>{titleNode}</span>
            <span style={{ display: 'flex', alignItems: 'center' }}>{treeSelectedIcon}</span>
          </div>
        )
      }

      return titleNode
    },
  }

  const { filteredTreeData, expandedKeysForSearch } = useMemo(() => {
    if (!searchValue) {
      return { filteredTreeData: treeData, expandedKeysForSearch: [] }
    }

    const keysToExpand: (string | number)[] = []

    const loop = (data: DataNode[], parentKeys: (string | number)[] = []): DataNode[] => {
      const result: DataNode[] = []
      data.forEach((item) => {
        const strTitle = item.title as string
        const match = strTitle && String(strTitle).toLowerCase().includes(searchValue.toLowerCase())

        if (match) {
          keysToExpand.push(...parentKeys)
          result.push(item)
        } else if (item.children) {
          const filteredChildren = loop(item.children, [...parentKeys, item.key])
          if (filteredChildren.length) {
            keysToExpand.push(item.key)
            result.push({ ...item, children: filteredChildren })
          }
        }
      })
      return result
    }

    const filtered = loop(treeData)
    // Remove duplicates
    const uniqueKeys = Array.from(new Set(keysToExpand))

    return { filteredTreeData: filtered, expandedKeysForSearch: uniqueKeys }
  }, [treeData, searchValue])

  React.useEffect(() => {
    if (searchValue) {
      setInternalExpandedKeys((prev) => {
        const newKeys = new Set([...prev, ...expandedKeysForSearch])
        return Array.from(newKeys)
      })
    }
  }, [searchValue, expandedKeysForSearch])

  return (
    <TreeSelectContainer
      ref={refs.setReference}
      fullWidth
      disabled={disabled}
      className={`compass-tree-select ${className || ''} ${
        open ? 'compass-tree-select-open' : ''
      } ${disabled ? 'compass-tree-select-disabled' : ''}`}
      style={style}
      {...getReferenceProps({
        onClick: () => {
          if (showSearch) inputRef.current?.focus()
        },
      })}
    >
      <TreeSelectTrigger size={size} active={open} status={status}>
        <SelectedContent size={size}>{renderTriggerContent()}</SelectedContent>
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
      </TreeSelectTrigger>

      {open && (
        <FloatingPortal>
          {/* eslint-disable-next-line react-hooks/rules-of-hooks */}
          <TreeSelectDropdown
            ref={refs.setFloating}
            style={{
              ...dropdownStyle,
              ...floatingStyles,
              opacity: x === null || y === null ? 0 : 1,
              visibility: x === null || y === null ? 'hidden' : 'visible',
            }}
            className={`compass-tree-select-dropdown ${dropdownClassName || ''}`}
            {...getFloatingProps()}
          >
            {filteredTreeData.length > 0 ? (
              <Tree
                {...treeProps}
                treeData={filteredTreeData}
                expandedKeys={internalExpandedKeys}
                onExpand={(keys) => {
                  setInternalExpandedKeys(keys)
                }}
              />
            ) : (
              <div style={{ padding: '8px 12px', color: '#999', textAlign: 'center' }}>No Data</div>
            )}
          </TreeSelectDropdown>
        </FloatingPortal>
      )}
    </TreeSelectContainer>
  )
}

export default TreeSelect
