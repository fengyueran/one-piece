import React from 'react'
import { StepsProps, StepProps, StepStatus } from './types'
import {
  StyledSteps,
  StyledStepItem,
  StyledStepIcon,
  StyledStepContent,
  StyledStepTitle,
  StyledStepSubTitle,
  StyledStepDescription,
  StyledStepTail,
} from './steps.styles'
import { CheckIcon, CloseIcon } from '../icons'

const Step: React.FC<StepProps> = () => null

const Steps: React.FC<StepsProps> & { Step: typeof Step } = ({
  current = 0,
  status = 'process',
  direction = 'horizontal',
  labelPlacement = 'horizontal',
  variant = 'default',
  items,
  children,
  onChange,
  className,
  style,
  styles,
  classNames,
}) => {
  const getStepStatus = (
    stepIndex: number,
    currentStep: number,
    currentStatus: StepStatus,
  ): StepStatus => {
    if (stepIndex < currentStep) {
      return 'finish'
    }
    if (stepIndex === currentStep) {
      return currentStatus
    }
    return 'wait'
  }

  const renderIcon = (index: number, status: StepStatus, icon?: React.ReactNode) => {
    if (icon) {
      return icon
    }
    if (status === 'finish') {
      return <CheckIcon />
    }
    if (status === 'error') {
      return <CloseIcon />
    }
    return index + 1
  }

  const onStepClick = (index: number, disabled?: boolean) => {
    if (onChange && !disabled && index !== current) {
      onChange(index)
    }
  }

  let stepItems: StepProps[] = []
  if (items) {
    stepItems = items
  } else if (children) {
    React.Children.forEach(children, (child) => {
      if (React.isValidElement(child) && child.type === Step) {
        stepItems.push(child.props as StepProps)
      }
    })
  }

  return (
    <StyledSteps
      direction={direction}
      labelPlacement={labelPlacement}
      className={`compass-steps compass-steps--${direction} compass-steps--label-${labelPlacement} compass-steps--${variant} ${className || ''} ${classNames?.root || ''}`}
      style={{ ...style, ...styles?.root }}
      role="list"
    >
      {stepItems.map((item, index) => {
        const stepStatus = item.status || getStepStatus(index, current, status)
        const isClickable = !!onChange && !item.disabled

        return (
          <StyledStepItem
            key={index}
            status={stepStatus}
            active={index === current}
            disabled={item.disabled}
            direction={direction}
            labelPlacement={labelPlacement}
            variant={variant}
            clickable={isClickable}
            onClick={() => onStepClick(index, item.disabled)}
            className={`compass-steps-item compass-steps-item--${stepStatus} ${index === current ? 'compass-steps-item--active' : ''} ${item.disabled ? 'compass-steps-item--disabled' : ''} ${classNames?.item || ''} ${item.className || ''}`}
            style={{ ...styles?.item, ...item.style }}
            role="listitem"
          >
            <StyledStepTail
              direction={direction}
              isLast={index === stepItems.length - 1}
              variant={variant}
              className={classNames?.tail}
              style={styles?.tail}
            />
            <StyledStepIcon
              status={stepStatus}
              active={index === current}
              variant={variant}
              className={`compass-steps-icon ${variant === 'dot' ? 'compass-steps-icon--dot' : ''} ${classNames?.icon || ''}`}
              style={styles?.icon}
            >
              {variant !== 'dot' && renderIcon(index, stepStatus, item.icon)}
            </StyledStepIcon>
            <StyledStepContent
              className={`compass-steps-content ${classNames?.content || ''}`}
              style={styles?.content}
            >
              <StyledStepTitle
                status={stepStatus}
                className={`compass-steps-title ${classNames?.title || ''}`}
                style={styles?.title}
                isLast={index === stepItems.length - 1}
                direction={direction}
              >
                {item.title}
                {item.subTitle && (
                  <StyledStepSubTitle
                    className={`compass-steps-subtitle ${classNames?.subtitle || ''}`}
                    style={styles?.subtitle}
                  >
                    {item.subTitle}
                  </StyledStepSubTitle>
                )}
              </StyledStepTitle>
              {item.description && (
                <StyledStepDescription
                  status={stepStatus}
                  className={`compass-steps-description ${classNames?.description || ''}`}
                  style={styles?.description}
                >
                  {item.description}
                </StyledStepDescription>
              )}
            </StyledStepContent>
          </StyledStepItem>
        )
      })}
    </StyledSteps>
  )
}

Steps.Step = Step

export default Steps
