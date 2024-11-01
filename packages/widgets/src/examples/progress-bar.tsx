import styled from 'styled-components';

import { LineProgressBar, CircleProgressBar } from '../components';

const RootContainer = styled.div`
  width: 300px;
`;

const CustomLineProgressBar = styled(LineProgressBar)`
  margin-bottom: 20px;

  .progress-text {
    color: red;
  }
`;

const CustomCircleProgressBar = styled(CircleProgressBar)`
  .progress-text {
    color: red;
  }
`;

export const ProgressBarExample = () => {
  return (
    <RootContainer>
      <CustomLineProgressBar
        progress={60}
        height={10}
        trailColor="lightgrey"
        strokeColor="blue"
      />
      <CustomCircleProgressBar
        size={200}
        progress={60}
        trailColor="lightgrey"
        strokeColor="blue"
      />
    </RootContainer>
  );
};
