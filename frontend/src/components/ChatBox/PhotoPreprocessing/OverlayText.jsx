import React from 'react';
import styled from 'styled-components';

const TextOverlay = styled.div`
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  white-space: nowrap;
  pointer-events: none;
`;

const OverlayText = ({ text, textPosition, textSize, textColor }) => (
  <TextOverlay
    style={{
      transform: `translate(${textPosition.x}px, ${textPosition.y}px)`,
      fontSize: `${textSize}px`,
      color: textColor,
    }}
  >
    {text}
  </TextOverlay>
);

export default OverlayText;
