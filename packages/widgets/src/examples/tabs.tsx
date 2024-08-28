import styled from 'styled-components';
import { Tabs, TabsProps } from '../components';
import { useState } from 'react';

const Container = styled.div`
  .tab-name {
    color: #000;
  }
`;

const tabs = [
  { label: '材料科学' },
  { label: '生物医药' },
  { label: '经济金融' },
  { label: '群体智能' },
  { label: '社会科学' },
];

const onTabChange: TabsProps['onTabChange'] = (item) => {
  const value = item as { label: string; id: string };
  console.log('value', value);
};

export const TabsExample = () => {
  const [selectedIndex, setSelectedIndex] = useState<number>();

  return (
    <Container>
      <button
        onClick={() => {
          setSelectedIndex(1);
        }}
      >
        切换到tab2
      </button>
      <button
        onClick={() => {
          setSelectedIndex(2);
        }}
      >
        切换到tab3
      </button>
      <Tabs
        tabs={tabs}
        onTabClick={(index) => {
          setSelectedIndex(index);
        }}
        selectedIndex={selectedIndex}
        onTabChange={onTabChange}
        defaultSelectedIndex={1}
      />
    </Container>
  );
};
