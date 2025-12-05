import styled from '@emotion/styled'

import { StepStatus } from './types'

export const StyledSteps = styled.div<{
  direction?: 'horizontal' | 'vertical'
  labelPlacement?: 'horizontal' | 'vertical'
}>`
  display: flex;
  width: 100%;
  height: ${(props) => (props.direction === 'vertical' ? '100%' : 'auto')};
  font-size: 0;
  text-align: initial;
  flex-direction: ${(props) => (props.direction === 'vertical' ? 'column' : 'row')};
`

export const StyledStepItem = styled.div<{
  status?: StepStatus
  active?: boolean
  disabled?: boolean
  direction?: 'horizontal' | 'vertical'
  labelPlacement?: 'horizontal' | 'vertical'
  clickable?: boolean
  variant?: 'default' | 'dot'
}>`
  position: relative;
  display: inline-block;
  flex: 1;
  overflow: hidden;
  vertical-align: top;
  margin-right: 16px;
  white-space: nowrap;
  cursor: ${(props) => (props.clickable && !props.disabled ? 'pointer' : 'default')};
  opacity: ${(props) => (props.disabled ? 0.5 : 1)};

  &:last-child {
    flex: none;
    margin-right: 0;
  }

  ${(props) =>
    props.direction === 'horizontal' &&
    props.labelPlacement === 'vertical' &&
    `
    text-align: center;
    overflow: visible;
    margin-right: 0;

    &:last-child {
      flex: 1;
    }
    
    & .compass-steps-icon {
      margin-left: 0;
      margin-right: 0;
      display: inline-flex;
      position: relative;
      z-index: 1;
    }

    & .compass-steps-content {
      display: block;
      margin-top: 4px;
      text-align: center;
      width: 100%;
    }

    & .compass-steps-title {
      padding-right: 0;
      display: block;
      text-align: center;

      &::after {
        display: none;
      }
    }

    &::after {
      position: absolute;
      top: 16px;
      left: 50%;
      display: block;
      width: calc(100% - ${props.variant === 'dot' ? props.theme.components.steps.dotSize : props.theme.components.steps.iconSize} - 16px);
      height: 1px;
      background: ${props.theme.colors.border};
      content: '';
      margin-left: calc(${props.variant === 'dot' ? props.theme.components.steps.dotSize : props.theme.components.steps.iconSize} / 2 + 8px);
    }

    &:last-child::after {
      display: none;
    }
    
    & .compass-steps-subtitle {
      display: block;
      margin-left: 0;
      margin-top: 2px;
    }

    & .compass-steps-description {
      margin: 2px auto 0;
    }
  `}
  ${(props) =>
    props.direction === 'vertical' &&
    `
    display: block;
    flex: 1;
    overflow: visible;
    margin-right: 0;
    padding-bottom: 0;
  `}
`

export const StyledStepIcon = styled.div<{
  status?: StepStatus
  active?: boolean
  variant?: 'default' | 'dot'
}>`
  position: relative;
  z-index: 1;
  box-sizing: border-box;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: ${(props) =>
    props.variant === 'dot'
      ? props.theme.components.steps.dotSize
      : props.theme.components.steps.iconSize};
  height: ${(props) =>
    props.variant === 'dot'
      ? props.theme.components.steps.dotSize
      : props.theme.components.steps.iconSize};
  margin-right: 8px;
  margin-top: ${(props) =>
    `calc((32px - ${props.variant === 'dot' ? props.theme.components.steps.dotSize : props.theme.components.steps.iconSize}) / 2)`};
  font-size: ${(props) => props.theme.components.steps.titleFontSize};
  line-height: 1;
  text-align: center;
  border: 1px solid;
  border-radius: ${(props) =>
    props.variant === 'dot'
      ? props.theme.components.steps.dotSize
      : props.theme.components.steps.iconSize};
  transition:
    background-color 0.3s,
    border-color 0.3s;

  & > span {
    display: flex;
  }

  ${(props) => {
    const { steps } = props.theme.components
    const { colors } = props.theme
    switch (props.status) {
      case 'process':
        return `
          background-color: ${steps.processIconColor};
          border-color: ${steps.processIconColor};
          color: #fff;
        `
      case 'wait':
        return `
          background-color: ${colors.background};
          border-color: ${steps.waitIconColor};
          color: ${steps.waitIconColor};
        `
      case 'finish':
        return `
          background-color: ${colors.background};
          border-color: ${steps.finishIconColor};
          color: ${steps.finishIconColor};
        `
      case 'error':
        return `
          background-color: ${colors.background};
          border-color: ${steps.errorIconColor};
          color: ${steps.errorIconColor};
        `
      default:
        return ''
    }
  }}
`

export const StyledStepContent = styled.div`
  display: inline-block;
  vertical-align: top;
`

export const StyledStepTitle = styled.div<{
  status?: StepStatus
  isLast?: boolean
  direction?: 'horizontal' | 'vertical'
}>`
  position: relative;
  display: inline-block;
  padding-right: 16px;
  color: ${(props) => {
    const { steps } = props.theme.components
    switch (props.status) {
      case 'process':
        return steps.processTitleColor
      case 'wait':
        return steps.waitTitleColor
      case 'finish':
        return steps.finishTitleColor
      case 'error':
        return steps.errorTitleColor
      default:
        return steps.titleColor
    }
  }};
  font-size: ${(props) => props.theme.components.steps.titleFontSize};
  line-height: 32px;

  &::after {
    position: absolute;
    top: 16px;
    left: 100%;
    display: ${(props) => (props.isLast || props.direction === 'vertical' ? 'none' : 'block')};
    width: 9999px;
    height: 1px;
    background: ${(props) => props.theme.colors.borderSecondary};
    content: '';
  }
`

export const StyledStepSubTitle = styled.div`
  display: inline;
  margin-left: 8px;
  color: ${(props) => props.theme.components.steps.subTitleColor};
  font-weight: normal;
  font-size: 14px;
`

export const StyledStepDescription = styled.div<{ status?: StepStatus }>`
  color: ${(props) => {
    const { steps } = props.theme.components
    switch (props.status) {
      case 'process':
        return steps.processDescriptionColor
      case 'wait':
        return steps.waitDescriptionColor
      case 'finish':
        return steps.finishDescriptionColor
      case 'error':
        return steps.errorDescriptionColor
      default:
        return steps.descriptionColor
    }
  }};
  font-size: ${(props) => props.theme.components.steps.descriptionFontSize};
`

export const StyledStepTail = styled.div<{
  direction?: 'horizontal' | 'vertical'
  isLast?: boolean
  variant?: 'default' | 'dot'
}>`
  display: ${(props) => (props.direction === 'vertical' && !props.isLast ? 'block' : 'none')};
  position: absolute;
  top: ${(props) =>
    `calc((32px + ${props.variant === 'dot' ? props.theme.components.steps.dotSize : props.theme.components.steps.iconSize}) / 2 + 6px)`};
  bottom: 6px;
  left: ${(props) =>
    `calc(${props.variant === 'dot' ? props.theme.components.steps.dotSize : props.theme.components.steps.iconSize} / 2)`};
  width: 1px;
  padding: 0;
  margin-left: 0;
  transform: translateX(-50%);

  &::after {
    display: inline-block;
    width: 1px;
    height: 100%;
    background: ${(props) => props.theme.colors.borderSecondary};
    border-radius: 1px;
    transition: background 0.3s;
    content: '';
  }
`
