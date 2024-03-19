import React from 'react';
import styled from 'styled-components';

import { ButtonBase } from '../button-base';

const ButtonContainer = styled(ButtonBase)<{ $hasHover: boolean }>`
  min-width: 64px;
  min-height: 36px;
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
  background-color: #e0e0e0;
  color: rgba(0, 0, 0, 0.87);
  box-shadow: 0px 1px 5px 0px rgba(0, 0, 0, 0.2),
    0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 3px 1px -2px rgba(0, 0, 0, 0.12);
  &:hover {
    ${(props) => props['$hasHover'] && `background-color: rgba(0, 0, 0, 0.2)`}
  }
`;

const Container = styled.span`
  width: 100%;
`;

interface Props {
  hasRipple?: boolean;
  hasHover?: boolean;
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
}

export const Button = (props: Props) => {
  const {
    hasRipple = true,
    hasHover = true,
    children,
    className,
    ...res
  } = props;
  return (
    <ButtonContainer
      className={className}
      hasRipple={hasRipple}
      $hasHover={hasHover}
      {...res}
    >
      <Container>{children}</Container>
    </ButtonContainer>
  );
};
