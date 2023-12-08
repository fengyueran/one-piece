import { useState } from 'react';
import styled from 'styled-components';
import { Dropdown, Trigger, ItemProps } from '../components';

const Container = styled.div``;

const Menu = styled.div`
  border: 1px solid;
  width: 100px;
  text-align: center;
`;

export const DropdownExample = () => {
  const [selected, setSelected] = useState<string>();
  const products = [
    { label: '算法自创，代码自研', value: '1' },
    { label: '硬件加速，国产适配', value: '2' },
    { label: '代码开源，平台开放', value: '3' },
    { label: 'SaaS化平台，交互友好', value: '4' },
  ];

  const onSelect = (item: ItemProps) => {
    console.log('Selected item', item);

    setSelected(item.value as string);
  };
  return (
    <Container>
      <div>select:{selected}</div>
      <Dropdown
        triggers={[Trigger.Hover]}
        options={products}
        onSelect={onSelect}
      >
        <Menu>
          <h3>Dropdown</h3>
        </Menu>
      </Dropdown>
    </Container>
  );
};
