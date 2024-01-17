import styled from 'styled-components';
import { Tabs } from '../components';

const Container = styled.div`
  .tab-name {
    color: #000;
  }
  .indicator {
    &[data-highlight='true'] {
      width: calc(100% + 20px);
    }
  }
`;

const tabs = [
  { label: '材料科学' },
  { label: '生物医药' },
  { label: '经济金融' },
  { label: '群体智能' },
  { label: '社会科学' },
];

const onTabChange = (item: { label: string; id?: string }) => {
  console.log('item', item);
};

export const TabsExample = () => {
  return (
    <Container>
      <Tabs tabs={tabs} onTabChange={onTabChange} defaultSelectedIndex={1} />
    </Container>
  );
};
