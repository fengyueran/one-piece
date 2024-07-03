import styled from 'styled-components';

const BaseSize = 80;

const clacSize = (spinSize: number, size: number) =>
  `${((size * spinSize) / BaseSize).toFixed(0)}px`;

const RootContainer = styled.div<{ $size: number }>`
  display: inline-block;
  position: relative;
  width: ${({ $size }) => clacSize($size, 80)};
  height: ${({ $size }) => clacSize($size, 80)};

  div {
    position: absolute;
    width: ${({ $size }) => clacSize($size, 6)};
    height: ${({ $size }) => clacSize($size, 6)};
    background: #478bff;
    border-radius: 50%;
    animation: lds-default 1.2s linear infinite;
  }
  div:nth-child(1) {
    animation-delay: 0s;
    top: ${({ $size }) => clacSize($size, 37)};
    left: ${({ $size }) => clacSize($size, 66)};
  }
  div:nth-child(2) {
    animation-delay: -0.1s;
    top: ${({ $size }) => clacSize($size, 22)};
    left: ${({ $size }) => clacSize($size, 62)};
  }
  div:nth-child(3) {
    animation-delay: -0.2s;
    top: ${({ $size }) => clacSize($size, 11)};
    left: ${({ $size }) => clacSize($size, 52)};
  }
  div:nth-child(4) {
    animation-delay: -0.3s;
    top: ${({ $size }) => clacSize($size, 7)};
    left: ${({ $size }) => clacSize($size, 37)};
  }
  div:nth-child(5) {
    animation-delay: -0.4s;
    top: ${({ $size }) => clacSize($size, 11)};
    left: ${({ $size }) => clacSize($size, 22)};
  }
  div:nth-child(6) {
    animation-delay: -0.5s;
    top: ${({ $size }) => clacSize($size, 22)};
    left: ${({ $size }) => clacSize($size, 11)};
  }
  div:nth-child(7) {
    animation-delay: -0.6s;
    top: ${({ $size }) => clacSize($size, 37)};
    left: ${({ $size }) => clacSize($size, 7)};
  }
  div:nth-child(8) {
    animation-delay: -0.7s;
    top: ${({ $size }) => clacSize($size, 52)};
    left: ${({ $size }) => clacSize($size, 11)};
  }
  div:nth-child(9) {
    animation-delay: -0.8s;
    top: ${({ $size }) => clacSize($size, 62)};
    left: ${({ $size }) => clacSize($size, 22)};
  }
  div:nth-child(10) {
    animation-delay: -0.9s;
    top: ${({ $size }) => clacSize($size, 66)};
    left: ${({ $size }) => clacSize($size, 37)};
  }
  div:nth-child(11) {
    animation-delay: -1s;
    top: ${({ $size }) => clacSize($size, 62)};
    left: ${({ $size }) => clacSize($size, 52)};
  }
  div:nth-child(12) {
    animation-delay: -1.1s;
    top: ${({ $size }) => clacSize($size, 52)};
    left: ${({ $size }) => clacSize($size, 62)};
  }
  @keyframes lds-default {
    0%,
    20%,
    80%,
    100% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.5);
    }
  }
`;

export interface CircularSpinProps {
  size?: number;
}

export const CircularSpin = (props: CircularSpinProps) => {
  const { size = BaseSize } = props;
  return (
    <RootContainer $size={size}>
      {new Array(12).fill(1).map((_, index) => (
        <div key={index}></div>
      ))}
    </RootContainer>
  );
};
