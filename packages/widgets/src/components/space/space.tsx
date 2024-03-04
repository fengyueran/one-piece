import styled from 'styled-components';

const Space = styled.div``;

interface Props {
  size: number;
}

export const SpaceX = (props: Props) => {
  const { size } = props;

  return <Space style={{ width: size }}></Space>;
};

export const SpaceY = (props: Props) => {
  const { size } = props;

  return <Space style={{ height: size }}></Space>;
};
