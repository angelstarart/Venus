import React from 'react';
import type {FC} from "react";
import styled from '@emotion/styled';

const imgUrl = new URL("../../images/angelstar_ep1.jpg", import.meta.url).href;

const Full = styled.div`
  background: url(${imgUrl}) center/cover no-repeat;
  position: fixed;
  top: 50%;
  left: 50%;
  min-width: 100%;
  min-height: 100%;
  z-index: -100;
  transform: translate(-50%, -50%);
`;

const Home: FC = () => {
  return (
    <>
      <Full/>
    </>
  )
};

export default Home;
