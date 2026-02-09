import React from 'react'

export type StepStatus = 'wait' | 'process' | 'finish' | 'error'

export interface StepProps {
  /** Title of the step */
  title?: React.ReactNode
  /** Subtitle of the step */
  subTitle?: React.ReactNode
  /** Description of the step */
  description?: React.ReactNode
  /** Icon of the step */
  icon?: React.ReactNode
  /** Status of the step */
  status?: StepStatus
  /** Disabled state */
  disabled?: boolean
  className?: string
  style?: React.CSSProperties
}

export interface StepsProps {
  /** Current step, 0-indexed */
  current?: number
  /** Status of the current step */
  status?: StepStatus
  /** Direction of the steps */
  direction?: 'horizontal' | 'vertical'
  /** Label placement */
  labelPlacement?: 'horizontal' | 'vertical'
  /** Steps variant */
  variant?: 'default' | 'dot'
  /** Step items */
  items?: StepProps[]
  /** Children steps */
  children?: React.ReactNode
  /** Change handler */
  onChange?: (current: number) => void

  /**
   * Custom class name for root element
   */
  className?: string

  /**
   * Custom style for root element
   */
  style?: React.CSSProperties

  /**
   * Granular styles
   */
  styles?: {
    root?: React.CSSProperties
    item?: React.CSSProperties
    icon?: React.CSSProperties
    content?: React.CSSProperties
    title?: React.CSSProperties
    subtitle?: React.CSSProperties
    description?: React.CSSProperties
    tail?: React.CSSProperties
  }

  /**
   * Granular class names
   */
  classNames?: {
    root?: string
    item?: string
    icon?: string
    content?: string
    title?: string
    subtitle?: string
    description?: string
    tail?: string
  }
}
