import styled from '@emotion/styled'
import { StepStatus } from './types'
import { token } from '../theme/token-utils'

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

  ${(props) => {
    const iconSize = token('components.steps.iconSize', '32px')
    const dotSize = token('components.steps.dotSize', '8px')

    return (
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
      width: calc(100% - ${props.variant === 'dot' ? dotSize : iconSize} - 16px);
      height: 1px;
      background: ${token('colors.border', '#d9d9d9')};
      content: '';
      margin-left: calc(${props.variant === 'dot' ? dotSize : iconSize} / 2 + 8px);
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
  `
    )
  }}
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
  justify-content: center;
  width: ${(props) => {
    const iconSize = token('components.steps.iconSize', '32px')
    const dotSize = token('components.steps.dotSize', '8px')
    return props.variant === 'dot' ? dotSize : iconSize
  }};
  height: ${(props) => {
    const iconSize = token('components.steps.iconSize', '32px')
    const dotSize = token('components.steps.dotSize', '8px')
    return props.variant === 'dot' ? dotSize : iconSize
  }};
  margin-right: 8px;
  margin-top: ${(props) => {
    const iconSize = token('components.steps.iconSize', '32px')
    const dotSize = token('components.steps.dotSize', '8px')
    return `calc((32px - ${props.variant === 'dot' ? dotSize : iconSize}) / 2)`
  }};
  font-size: ${token('components.steps.titleFontSize', '16px')};
  line-height: 1;
  text-align: center;
  border: 1px solid;
  border-radius: ${(props) => {
    const iconSize = token('components.steps.iconSize', '32px')
    const dotSize = token('components.steps.dotSize', '8px')
    return props.variant === 'dot' ? dotSize : iconSize
  }};
  transition:
    background-color 0.3s,
    border-color 0.3s;

  & > span {
    display: flex;
  }

  ${(props) => {
    const processIconColor = token('components.steps.processIconColor', '#1890ff')
    const waitIconColor = token('components.steps.waitIconColor', 'rgba(0, 0, 0, 0.25)')
    const finishIconColor = token('components.steps.finishIconColor', '#1890ff')
    const errorIconColor = token('components.steps.errorIconColor', '#ff4d4f')
    const background = token('colors.background', '#ffffff')

    switch (props.status) {
      case 'process':
        return `
          background-color: ${processIconColor};
          border-color: ${processIconColor};
          color: #fff;
        `
      case 'wait':
        return `
          background-color: ${background};
          border-color: ${waitIconColor};
          color: ${waitIconColor};
        `
      case 'finish':
        return `
          background-color: ${background};
          border-color: ${finishIconColor};
          color: ${finishIconColor};
        `
      case 'error':
        return `
          background-color: ${background};
          border-color: ${errorIconColor};
          color: ${errorIconColor};
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
    switch (props.status) {
      case 'process':
        return token('components.steps.processTitleColor', 'rgba(0, 0, 0, 0.88)')
      case 'wait':
        return token('components.steps.waitTitleColor', 'rgba(0, 0, 0, 0.45)')
      case 'finish':
        return token('components.steps.finishTitleColor', 'rgba(0, 0, 0, 0.88)')
      case 'error':
        return token('components.steps.errorTitleColor', '#ff4d4f')
      default:
        return token('components.steps.titleColor', 'rgba(0, 0, 0, 0.88)')
    }
  }};
  font-size: ${token('components.steps.titleFontSize', '16px')};
  line-height: 32px;

  &::after {
    position: absolute;
    top: 16px;
    left: 100%;
    display: ${(props) => (props.isLast || props.direction === 'vertical' ? 'none' : 'block')};
    width: 9999px;
    height: 1px;
    background: ${token('colors.borderSecondary', '#f0f0f0')};
    content: '';
  }
`

export const StyledStepSubTitle = styled.div`
  display: inline;
  margin-left: 8px;
  color: ${token('components.steps.subTitleColor', 'rgba(0, 0, 0, 0.45)')};
  font-weight: normal;
  font-size: 14px;
`

export const StyledStepDescription = styled.div<{ status?: StepStatus }>`
  color: ${(props) => {
    switch (props.status) {
      case 'process':
        return token('components.steps.processDescriptionColor', 'rgba(0, 0, 0, 0.88)')
      case 'wait':
        return token('components.steps.waitDescriptionColor', 'rgba(0, 0, 0, 0.45)')
      case 'finish':
        return token('components.steps.finishDescriptionColor', 'rgba(0, 0, 0, 0.45)')
      case 'error':
        return token('components.steps.errorDescriptionColor', '#ff4d4f')
      default:
        return token('components.steps.descriptionColor', 'rgba(0, 0, 0, 0.45)')
    }
  }};
  font-size: ${token('components.steps.descriptionFontSize', '14px')};
`

export const StyledStepTail = styled.div<{
  direction?: 'horizontal' | 'vertical'
  isLast?: boolean
  variant?: 'default' | 'dot'
}>`
  display: ${(props) => (props.direction === 'vertical' && !props.isLast ? 'block' : 'none')};
  position: absolute;
  top: ${(props) => {
    const iconSize = token('components.steps.iconSize', '32px')
    const dotSize = token('components.steps.dotSize', '8px')
    return `calc((32px + ${props.variant === 'dot' ? dotSize : iconSize}) / 2 + 6px)`
  }};
  bottom: 6px;
  left: ${(props) => {
    const iconSize = token('components.steps.iconSize', '32px')
    const dotSize = token('components.steps.dotSize', '8px')
    return `calc(${props.variant === 'dot' ? dotSize : iconSize} / 2)`
  }};
  width: 1px;
  padding: 0;
  margin-left: 0;
  transform: translateX(-50%);

  &::after {
    display: inline-block;
    width: 1px;
    height: 100%;
    background: ${token('colors.borderSecondary', '#f0f0f0')};
    border-radius: 1px;
    transition: background 0.3s;
    content: '';
  }
`
