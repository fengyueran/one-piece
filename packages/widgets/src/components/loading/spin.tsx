import styled from 'styled-components';

const RootContainer = styled.div`
  @keyframes load {
    0%,
    100% {
      height: 40px;
      background: #98beff;
    }
    50% {
      height: 60px;
      margin-top: -20px;
      background: #3e7fee;
    }
  }
  span {
    display: inline-block;
    width: 8px;
    height: 100%;
    margin-right: 5px;
    border-radius: 4px;
    -webkit-animation: load 1.04s ease infinite;
    animation: load 1.04s ease infinite;
    &:nth-child(2) {
      animation-delay: 0.13s;
    }
    &:nth-child(3) {
      animation-delay: 0.26s;
    }
    &:nth-child(4) {
      animation-delay: 0.39s;
    }
    &:nth-child(5) {
      animation-delay: 0.52s;
    }
  }
`;

export enum Size {
  Small,
  Default,
  Large,
}

interface Props {
  size?: Size;
}

export const Spin = (props: Props) => {
  const { size = Size.Default } = props;

  const scaleBySize = {
    [Size.Small]: 0.5,
    [Size.Default]: 1,
    [Size.Large]: 1.5,
  };
  const scale = scaleBySize[size];

  return (
    <RootContainer style={{ transform: `scale(${scale})` }}>
      {Array.from({ length: 5 }).map((_, index) => (
        <span key={index} />
      ))}
    </RootContainer>
  );
};
