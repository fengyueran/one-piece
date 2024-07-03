import React from 'react';
import styled from 'styled-components';

import { ButtonBase } from '../button-base';
import { Spin } from './spin';

const ButtonContainer = styled(ButtonBase)<{
  $hasHover: boolean;
  $disabled: boolean;
}>`
  min-width: 64px;
  min-height: 32px;
  padding: 8px 16px;
  border-radius: 2px;
  margin: 8px;
  font-size: 0.875rem;
  transition: background-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,
    box-shadow 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,
    border 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
  font-weight: 500;
  line-height: 1.5;
  border-radius: 4px;
  letter-spacing: 0.02857em;
  background-color: ${(props) => (props.$disabled ? `#F2F2F2` : '#186bcc')};
  color: ${(props) => (props.$disabled ? `#B9B9B9` : '#ffffff')};

  cursor: ${(props) => (props.$disabled ? `not-allowed` : 'pointer')};
  box-shadow: 0px 1px 5px 0px rgba(0, 0, 0, 0.2),
    0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 3px 1px -2px rgba(0, 0, 0, 0.12);
  &:hover {
    ${(props) =>
      props.$hasHover &&
      !props.$disabled &&
      `background-color: rgba(24, 107, 204,0.8)`}
  }
`;

const SpinWrapper = styled.span`
  padding-right: 12px;
`;

export interface ButtonProps {
  hasRipple?: boolean;
  style?: React.CSSProperties;
  hasHover?: boolean;
  className?: string;
  loading?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
}

export const Button = (props: ButtonProps) => {
  const {
    hasRipple = true,
    hasHover = true,
    loading = false,
    children,
    className,
    ...res
  } = props;
  return (
    <ButtonContainer
      className={className}
      hasRipple={hasRipple}
      $hasHover={hasHover}
      $disabled={!!res.disabled}
      {...res}
    >
      {loading && (
        <SpinWrapper>
          <Spin className="button-spin" />
        </SpinWrapper>
      )}
      {children}
    </ButtonContainer>
  );
};
