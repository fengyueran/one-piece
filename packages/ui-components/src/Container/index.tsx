import React from 'react'

export interface ContainerProps {
  children: React.ReactNode
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl'
  className?: string
}

export const Container: React.FC<ContainerProps> = ({
  children,
  maxWidth = 'lg',
  className = ''
}) => {
  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md', 
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl'
  }
  
  const containerClass = [
    'mx-auto px-4',
    maxWidthClasses[maxWidth],
    className
  ].filter(Boolean).join(' ')
  
  return (
    <div className={containerClass}>
      {children}
    </div>
  )
} 