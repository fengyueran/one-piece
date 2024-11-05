import React from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  width: 100%;
  min-width: 20px;
  display: flex;
  align-items: center;
`;

const LineContainer = styled.div<{ $height: number; $trailColor: string }>`
  width: 100%;
  height: ${({ $height }) => $height}px;
  background-color: ${({ $trailColor }) => $trailColor};
  border-radius: ${({ $height }) => $height / 2}px;
  overflow: hidden;
`;

const LineProgress = styled.div<{ progress: number; $strokeColor: string }>`
  height: 100%;
  width: ${({ progress }) => progress}%;
  background-color: ${({ $strokeColor }) => $strokeColor};
  transition: width 0.3s ease;
`;

const ProgressText = styled.div`
  margin-left: 8px;
  font-size: 1rem;
  color: #333;
  font-weight: bold;
`;

export interface LineProgressBarProps {
  progress: number;
  height?: number;
  strokeColor?: string;
  trailColor?: string;
  className?: string;
  style?: React.CSSProperties;
}

export const LineProgressBar: React.FC<LineProgressBarProps> = ({
  progress,
  height = 10,
  strokeColor = '#4caf50',
  trailColor = '#e0e0e0',
  ...res
}) => {
  return (
    <Wrapper {...res}>
      <LineContainer
        className="line-container"
        $height={height}
        $trailColor={trailColor}
      >
        <LineProgress
          className="line-progress"
          progress={progress}
          $strokeColor={strokeColor}
        />
      </LineContainer>
      <ProgressText className="progress-text">{`${Math.round(
        progress
      )}%`}</ProgressText>
    </Wrapper>
  );
};
