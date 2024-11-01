import React from 'react';
import styled from 'styled-components';

const Wrapper = styled.div<{ size: number }>`
  position: relative;
  width: ${({ size }) => size}px;
  height: ${({ size }) => size}px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ProgressText = styled.div`
  position: absolute;
  font-size: 1rem;
  color: #333;
  font-weight: bold;
`;

export interface CircleProgressBarProps {
  progress: number;
  size?: number;
  strokeColor?: string;
  trailColor?: string;
  strokeWidth?: number;
  className?: string;
  style?: React.CSSProperties;
}

export const CircleProgressBar: React.FC<CircleProgressBarProps> = ({
  progress,
  size = 100,
  strokeColor = '#4caf50',
  trailColor = '#e0e0e0',
  strokeWidth = 10,
  ...res
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <Wrapper {...res} size={size}>
      <svg width={size} height={size}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={trailColor}
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="butt"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </svg>
      <ProgressText className="progress-text">{`${Math.round(
        progress
      )}%`}</ProgressText>
    </Wrapper>
  );
};
