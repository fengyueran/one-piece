import { useState } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { Transition } from 'react-transition-group';

const rippleEnter = keyframes`
  0% {
    transform: scale(0);
    opacity: 0.1;
  }
  100% {
    transform: scale(1);
    opacity: 0.3;
  }
`;

const rippleExit = keyframes`
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
`;

const createRippleVisibleStyle = (duration: number) => {
  return css`
    opacity: 0.3;
    transform: scale(1);
    animation: ${rippleEnter} ${duration}ms cubic-bezier(0.4, 0, 0.2, 1);
  `;
};

const createChildLeavingStyle = (duration: number) => {
  return css`
    opacity: 0;
    animation: ${rippleExit} ${duration}ms cubic-bezier(0.4, 0, 0.2, 1);
  `;
};

const StyledRipple = styled.span<{ visible: boolean; duration: number }>`
  width: 50;
  height: 50;
  left: 0;
  top: 0;
  opacity: 0;
  position: absolute;
  ${(props) => props.visible && createRippleVisibleStyle(props.duration)};
`;

const RippleChild = styled.span<{ leaving: boolean; duration: number }>`
  opacity: 1;
  display: block;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background-color: currentColor;
  ${(props) => props.leaving && createChildLeavingStyle(props.duration)};
`;

export type RippleType = {
  rippleSize: number;
  rippleX: number;
  rippleY: number;
  timeout: {
    enter: number;
    exit: number;
  };
};

interface Props {
  rippleSize: number;
  rippleX: number;
  rippleY: number;
  timeout: {
    enter: number;
    exit: number;
  };
  //inject by TransitionGroup
  enter?: boolean;
  exit?: boolean;
  in?: boolean;
}

export const Ripple = (props: Props) => {
  const { rippleX, rippleY, rippleSize, ...res } = props;
  const [visible, setVisible] = useState(false);
  const [leaving, setLeaving] = useState(false);

  const handleEnter = () => {
    setVisible(true);
  };

  const handleExit = () => {
    setLeaving(true);
  };

  const rippleStyles = {
    width: rippleSize,
    height: rippleSize,
    top: -(rippleSize / 2) + rippleY,
    left: -(rippleSize / 2) + rippleX,
  };

  return (
    <Transition {...res} onEnter={handleEnter} onExit={handleExit}>
      <StyledRipple
        visible={visible}
        style={rippleStyles}
        duration={res.timeout.enter}
      >
        <RippleChild leaving={leaving} duration={res.timeout.exit} />
      </StyledRipple>
    </Transition>
  );
};
