import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Row, Col } from '../flex-box';

const RootContainer = styled(Row)``;

const Padding = 10;
const Tab = styled(Col)<{ $highlight: boolean }>`
  box-sizing: border-box;
  padding: 0px ${Padding}px;
  cursor: pointer;
  color: ${(props) => (props['$highlight'] ? '#1677ff' : '#ffffff')};
  align-items: center;
`;

const Indicator = styled.div<{ $highlight: boolean }>`
  height: 4px;
  margin-top: 14px;
  width: ${(props) =>
    props['$highlight'] ? `calc(100% + ${Padding * 2}px)` : 0};
  background: ${(props) => (props['$highlight'] ? '#1677ff' : 'transparent')};
  transition: all 0.4s ease;
`;

const TabName = styled.span`
  font-size: 20px;
  font-weight: 500;
  line-height: 20px;
`;

export interface TabItem {
  label: string;
  [key: string]: unknown;
}

interface Props {
  tabs: TabItem[];
  selectedIndex?: number;
  defaultSelectedIndex?: number;
  onTabClick?: (index: number, item: TabItem) => void;
  onTabChange?: (item: TabItem) => void;
}

export const Tabs = (props: Props) => {
  const {
    tabs,
    selectedIndex,
    onTabClick,
    onTabChange,
    defaultSelectedIndex = 0,
  } = props;
  const [selected, setSelected] = useState(defaultSelectedIndex);
  const onClick = (index: number, item: TabItem) => {
    if (onTabClick) {
      onTabClick(index, item);
    } else {
      setSelected(index);
    }
    if (onTabChange) {
      onTabChange(item);
    }
  };

  useEffect(() => {
    if (selectedIndex !== undefined) {
      setSelected(selectedIndex);
    }
  }, [selectedIndex]);

  return (
    <RootContainer>
      {tabs.map((tab, index) => {
        const { label } = tab;
        const isHighlight = index === selected;
        return (
          <Tab
            className="tab"
            key={label}
            $highlight={isHighlight}
            onClick={() => {
              onClick(index, tab);
            }}
          >
            <TabName className="tab-name">{label}</TabName>
            <Indicator className="indicator" $highlight={isHighlight} />
          </Tab>
        );
      })}
    </RootContainer>
  );
};
