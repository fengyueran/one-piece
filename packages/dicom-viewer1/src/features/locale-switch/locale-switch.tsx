import React, { useContext } from 'react';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';

import { LocalContext, Locale } from 'src/components';

const Container = styled.button`
  width: 200px;
  height: 200px;
  margin-top: 200px;
`;

export const LocaleSwitch = () => {
  const { changeLocale } = useContext(LocalContext);
  return (
    <Container
      onClick={() => {
        changeLocale(Locale.EN);
      }}
    >
      <FormattedMessage defaultMessage="你好" />
    </Container>
  );
};
