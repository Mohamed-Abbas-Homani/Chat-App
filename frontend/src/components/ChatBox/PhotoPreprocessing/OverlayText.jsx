import React from 'react';
import styled from 'styled-components';

const TextOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  pointer-events: none;
  color: ${({ textColor }) => textColor};
  font-size: ${({ textSize }) => textSize}px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.7);
`;

const OverlayText = ({ text, textPosition, textSize, textColor }) => (
  <TextOverlay style={{ transform: `translate(${textPosition.x}px, ${textPosition.y}px)` }} textSize={textSize} textColor={textColor}>
    {text}
  </TextOverlay>
);

export default OverlayText;
