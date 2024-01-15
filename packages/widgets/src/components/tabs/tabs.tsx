import { useState } from 'react';
import styled from 'styled-components';
import { Row, Col } from '../flex-box';

const RootContainer = styled(Row)``;

const Tab = styled(Col)<{ 'data-highlight': boolean }>`
  box-sizing: border-box;
  padding: 0px 20px 14px 20px;
  cursor: pointer;
  color: ${(props) => (props['data-highlight'] ? '#1677ff' : '#ffffff')};
  align-items: center;
`;

const Indicator = styled.div<{ 'data-highlight': boolean }>`
  height: 4px;
  margin-top: 14px;
  width: ${(props) => (props['data-highlight'] ? '100%' : 0)};
  background: ${(props) =>
    props['data-highlight'] ? '#1677ff' : 'transparent'};
  transition: all 0.4s ease;
`;

const TabName = styled.span`
  font-size: 20px;
  font-weight: 500;
  line-height: 20px;
`;

interface Item {
  label: string;
  [key: string]: unknown;
}

interface Props {
  tabs: Item[];
  onTabChange: (item: Item) => void;
}

export const Tabs = (props: Props) => {
  const { tabs, onTabChange } = props;
  const [selectedIndex, setSelectedIndex] = useState(0);
  const onClick = (index: number, item: Item) => {
    setSelectedIndex(index);
    onTabChange(item);
  };

  return (
    <RootContainer>
      {tabs.map((tab, index) => {
        const { label } = tab;
        const selected = index === selectedIndex;
        return (
          <Tab
            key={label}
            data-highlight={selected}
            onClick={() => {
              onClick(index, tab);
            }}
          >
            <TabName className="tab-name">{label}</TabName>
            <Indicator className="indicator" data-highlight={selected} />
          </Tab>
        );
      })}
    </RootContainer>
  );
};
