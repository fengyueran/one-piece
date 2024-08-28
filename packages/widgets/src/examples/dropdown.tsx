import { useState } from 'react';
import styled from 'styled-components';
import {
  Dropdown,
  //  Trigger,
  DropdownProps,
} from '../components';

const Container = styled.div`
  .trigger-wrapper {
    &:hover {
      background-color: blue;
    }
  }
  .menus-container {
    background: #000000;
    border-radius: 6px;
    padding: 12px;
  }
  .menu-item {
    font-size: 16px;
    font-weight: 400;
    color: #ffffff;
    line-height: 16px;
    border-radius: 4px;
    padding: 10px 16px;
    &:hover {
      background-color: rgba(255, 255, 255, 0.1) !important;
    }
  }
`;

const Menu = styled.div`
  border: 1px solid;
  width: 100px;
  text-align: center;
  border-radius: 4px;
  padding: 0 16px;
`;

const MenuTitle = styled.div`
  font-weight: 500;
  line-height: 80px;
`;

const RouteMap = {
  WEMD: '/wemd',
  Repository: 'repository',
  About: '/about',
  Guide: '/guide/',
  Team: '/team',
  ProductHighlight: 'product-highlight',
  Partner: '/partner',
  Product: '/product',
  Contact: 'contact',
  Join: 'join',
};
const navItems = [
  {
    label: '产品',
    icon: <div>123</div>,
    children: [{ label: 'WEMD平台', route: RouteMap.WEMD }],
  },
  {
    label: '开源社区',
    children: [
      { label: '代码仓库', route: RouteMap.Repository },
      { label: '开发者指南', route: RouteMap.Guide },
    ],
  },
  {
    label: '关于我们',
    children: [
      { label: '产品特色', route: RouteMap.ProductHighlight },
      { label: '团队介绍', route: RouteMap.Team },
      { label: '合作伙伴', route: RouteMap.Partner },
    ],
  },
  {
    label: '联系我们',
    children: [
      { label: '联系我们', route: RouteMap.Contact },
      { label: '加入我们', route: RouteMap.Join },
    ],
  },
];

export const DropdownExample = () => {
  const [selected, setSelected] = useState<string>();

  const onSelect: DropdownProps['onSelect'] = (item) => {
    console.log('Selected item', item);

    setSelected(item.value as string);
  };

  return (
    <Container>
      <div>select:{selected}</div>
      {navItems.map(({ label, children }) => {
        return (
          <Dropdown key={label} options={children} onSelect={onSelect}>
            <Menu>
              <MenuTitle>{label}</MenuTitle>
            </Menu>
          </Dropdown>
        );
      })}

      {navItems.map(({ label, children }) => {
        return (
          <Dropdown
            key={label}
            options={children}
            onSelect={onSelect}
            dropdownItemRender={({ label }) => {
              return <div style={{ background: 'red' }}>{label}</div>;
            }}
          >
            <Menu>
              <MenuTitle>{label}</MenuTitle>
            </Menu>
          </Dropdown>
        );
      })}
    </Container>
  );
};
