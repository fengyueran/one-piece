import { useState, useRef } from 'react';
import styled from 'styled-components';

import { Col } from '../flex-box';
import { useClickAway } from '../../hooks';

const RootContainer = styled.div`
  position: relative;
  display: inline-block;
`;

const TriggerWrapper = styled.div``;

const MenusContainer = styled(Col)`
  position: absolute;
  left: 0;
  z-index: 1;
  top: 100%;
  padding: 0.5rem 0;
  background-color: #fff;
  background-clip: padding-box;
  border-radius: 8px;
  box-shadow: 0 6px 16px 0 rgba(0, 0, 0, 0.08),
    0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 9px 28px 8px rgba(0, 0, 0, 0.05);
  min-width: max-content;
`;

const MenuItem = styled.div`
  padding: 10px 12px;
  font-size: 14px;
  line-height: 1;
  cursor: pointer;
  display: block;
  border-radius: 4px;
  &:hover {
    background-color: rgba(0, 0, 0, 0.1);
  }
`;

export enum Trigger {
  Click,
  Hover,
}

export interface ItemProps {
  label: string;
  [key: string]: unknown;
}

interface DropdownProps {
  children: React.ReactNode;
  options: ItemProps[];
  triggers?: Array<Trigger>;
  onSelect: (item: ItemProps) => void;
}

export const Dropdown = (props: DropdownProps) => {
  const { children, triggers, options, onSelect } = props;

  const isTriggerByHover = !triggers || triggers.includes(Trigger.Hover);

  const menuTriggerRef = useRef<HTMLDivElement>(null);

  const [visible, setVisible] = useState(false);

  const toggleMenusVisible = () => {
    setVisible(!visible);
  };

  useClickAway(menuTriggerRef, () => {
    if (isTriggerByHover) return;
    setVisible(false);
  });

  const hoverEventMap = {
    onMouseEnter: isTriggerByHover
      ? () => {
          setVisible(true);
        }
      : undefined,
    onMouseLeave: isTriggerByHover
      ? () => {
          setVisible(false);
        }
      : undefined,
  };

  const handleMenuClick = (item: ItemProps) => {
    onSelect(item);
    setVisible(false);
  };

  const renderMenuList = () => {
    return (
      visible && (
        <MenusContainer className="menus-container">
          {options.map((item) => {
            const { label } = item;
            return (
              <MenuItem
                className="menu-item"
                onClick={() => {
                  handleMenuClick(item);
                }}
                key={label}
              >
                <span>{label}</span>
              </MenuItem>
            );
          })}
        </MenusContainer>
      )
    );
  };

  return (
    <RootContainer>
      <TriggerWrapper
        className="trigger-wrapper"
        ref={menuTriggerRef}
        {...hoverEventMap}
        onClick={isTriggerByHover ? undefined : toggleMenusVisible}
      >
        {children}
        {renderMenuList()}
      </TriggerWrapper>
    </RootContainer>
  );
};
