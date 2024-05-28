import React from "react";
import styled from "styled-components";

const CropperWrapper = styled.div`
  width: 400px;
  height: 400px;
  margin-bottom: 20px;
  position: relative;
`;

const CropperImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
`;

const CropperContainer = ({ cropperRef, src }) => (
  <CropperWrapper>
    <CropperImage ref={cropperRef} src={src} alt="Source" />
  </CropperWrapper>
);

export default CropperContainer;
