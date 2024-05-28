import React from 'react';
import styled from 'styled-components';

const ControlWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 10px;
  width: 100%;
  align-items: center;
`;

const RangeInput = styled.input`
  width: 100%;
`;

const TextInput = styled.input`
  width: 100%;
  padding: 5px;
  border: 1px solid #ccc;
  border-radius: 5px;
`;

const ColorInput = styled.input`
  width: 100%;
  padding: 5px;
  border: 1px solid #ccc;
  border-radius: 5px;
`;

const PreviewControls = ({
  brightness,
  setBrightness,
  blur,
  setBlur,
  sepia,
  setSepia,
  grayscale,
  setGrayscale,
  text,
  setText,
  textSize,
  setTextSize,
  textColor,
  setTextColor,
  textPosition,
  setTextPosition,
}) => (
  <ControlWrapper>
      <div>
      <label>Text: </label>
      <TextInput
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
    </div>
    <div>
      <label>Text Size: </label>
      <RangeInput
        type="range"
        min="10"
        max="100"
        value={textSize}
        onChange={(e) => setTextSize(e.target.value)}
      />
    </div>
    <div>
      <label>Text Color: </label>
      <ColorInput
        type="color"
        value={textColor}
        onChange={(e) => setTextColor(e.target.value)}
      />
    </div>
    <div>
      <label>Text Position X: </label>
      <RangeInput
        type="range"
        min="-200"
        max="200"
        value={textPosition.x}
        onChange={(e) => setTextPosition({ ...textPosition, x: e.target.value })}
      />
    </div>
    <div>
      <label>Text Position Y: </label>
      <RangeInput
        type="range"
        min="-200"
        max="200"
        value={textPosition.y}
        onChange={(e) => setTextPosition({ ...textPosition, y: e.target.value })}
      />
    </div>
    <div>
      <label>Brightness: </label>
      <RangeInput
        type="range"
        min="0"
        max="200"
        value={brightness}
        onChange={(e) => setBrightness(e.target.value)}
      />
    </div>
    <div>
      <label>Blur: </label>
      <RangeInput
        type="range"
        min="0"
        max="20"
        value={blur}
        onChange={(e) => setBlur(e.target.value)}
      />
    </div>
    <div>
      <label>Sepia: </label>
      <RangeInput
        type="range"
        min="0"
        max="100"
        value={sepia}
        onChange={(e) => setSepia(e.target.value)}
      />
    </div>
    <div>
      <label>Grayscale: </label>
      <RangeInput
        type="range"
        min="0"
        max="100"
        value={grayscale}
        onChange={(e) => setGrayscale(e.target.value)}
      />
    </div>
  
  </ControlWrapper>
);

export default PreviewControls;
