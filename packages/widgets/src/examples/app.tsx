import styled from 'styled-components';
import { Dropdown, Trigger } from '../components';
import { useState } from 'react';

const Container = styled.div`
  width: 100vw;
  height: 100vh;
  margin: 10vw 0 0 10vw;
`;
const Menu = styled.div`
  border: 1px solid;
  width: 100px;
  text-align: center;
`;

export const App = () => {
  const [selected, setSelected] = useState<string>();
  const products = [
    { label: '算法自创，代码自研', value: '1' },
    { label: '硬件加速，国产适配', value: '2' },
    { label: '代码开源，平台开放', value: '3' },
    { label: 'SaaS化平台，交互友好', value: '4' },
  ];

  const onSelect = (item: { label: string }) => {
    console.log('Selected item', item);
    setSelected(item.label);
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
