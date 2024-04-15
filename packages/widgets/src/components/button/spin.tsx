import styled from 'styled-components';

export const Spin = styled.div`
  width: 1em;
  height: 1em;
  display: inline-block;
  border: 2px solid;
  border-radius: 1em;
  clip-path: polygon(50% 50%, 0 50%, 0 0, 50% 0);
  animation: rotate 1.2s linear infinite;

  @keyframes rotate {
    100% {
      transform: rotate(360deg);
    }
  }
`;
