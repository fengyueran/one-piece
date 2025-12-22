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
      className={`compass-steps compass-steps--${direction} compass-steps--label-${labelPlacement} compass-steps--${variant} ${className || ''}`}
      style={style}
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
            className={`compass-steps-item compass-steps-item--${stepStatus} ${index === current ? 'compass-steps-item--active' : ''} ${item.disabled ? 'compass-steps-item--disabled' : ''} ${item.className || ''}`}
            style={item.style}
            role="listitem"
          >
            <StyledStepTail
              direction={direction}
              isLast={index === stepItems.length - 1}
              variant={variant}
            />
            <StyledStepIcon
              status={stepStatus}
              active={index === current}
              variant={variant}
              className={`compass-steps-icon ${variant === 'dot' ? 'compass-steps-icon--dot' : ''}`}
            >
              {variant !== 'dot' && renderIcon(index, stepStatus, item.icon)}
            </StyledStepIcon>
            <StyledStepContent className="compass-steps-content">
              <StyledStepTitle
                status={stepStatus}
                className="compass-steps-title"
                isLast={index === stepItems.length - 1}
                direction={direction}
              >
                {item.title}
                {item.subTitle && (
                  <StyledStepSubTitle className="compass-steps-subtitle">
                    {item.subTitle}
                  </StyledStepSubTitle>
                )}
              </StyledStepTitle>
              {item.description && (
                <StyledStepDescription status={stepStatus} className="compass-steps-description">
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
