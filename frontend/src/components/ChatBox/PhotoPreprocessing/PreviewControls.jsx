import React from "react";
import styled from "styled-components";
import { FaFont, FaTextHeight, FaPalette, FaAdjust, FaTint } from "react-icons/fa";

const ControlWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
`;

const ControlRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const Label = styled.label`
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 14px;
`;

const RangeInput = styled.input`
  flex-grow: 1;
  margin-left: 10px;
`;

const TextInput = styled.input`
  flex-grow: 1;
  padding: 5px;
  border: 1px solid #ccc;
  border-radius: 5px;
`;

const ColorInput = styled.input`
  flex-grow: 1;
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
    <ControlRow>
      <Label>
        <FaFont /> Text:
      </Label>
      <TextInput
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
    </ControlRow>
    <ControlRow>
      <Label>
        <FaTextHeight /> Text Size:
      </Label>
      <RangeInput
        type="range"
        min="10"
        max="100"
        value={textSize}
        onChange={(e) => setTextSize(e.target.value)}
      />
    </ControlRow>
    <ControlRow>
      <Label>
        <FaPalette /> Text Color:
      </Label>
      <ColorInput
        type="color"
        value={textColor}
        onChange={(e) => setTextColor(e.target.value)}
      />
    </ControlRow>
    <ControlRow>
      <Label>
        <FaAdjust /> Text Position X:
      </Label>
      <RangeInput
        type="range"
        min="-150"
        max="150"
        value={textPosition.x}
        onChange={(e) => setTextPosition({ ...textPosition, x: e.target.value })}
      />
    </ControlRow>
    <ControlRow>
      <Label>
        <FaAdjust /> Text Position Y:
      </Label>
      <RangeInput
        type="range"
        min="-150"
        max="150"
        value={textPosition.y}
        onChange={(e) => setTextPosition({ ...textPosition, y: e.target.value })}
      />
    </ControlRow>
    <ControlRow>
      <Label>
        <FaAdjust /> Brightness:
      </Label>
      <RangeInput
        type="range"
        min="0"
        max="200"
        value={brightness}
        onChange={(e) => setBrightness(e.target.value)}
      />
    </ControlRow>
    <ControlRow>
      <Label>
        <FaTint /> Blur:
      </Label>
      <RangeInput
        type="range"
        min="0"
        max="20"
        value={blur}
        onChange={(e) => setBlur(e.target.value)}
      />
    </ControlRow>
    <ControlRow>
      <Label>
        <FaTint /> Sepia:
      </Label>
      <RangeInput
        type="range"
        min="0"
        max="100"
        value={sepia}
        onChange={(e) => setSepia(e.target.value)}
      />
    </ControlRow>
    <ControlRow>
      <Label>
        <FaTint /> Grayscale:
      </Label>
      <RangeInput
        type="range"
        min="0"
        max="100"
        value={grayscale}
        onChange={(e) => setGrayscale(e.target.value)}
      />
    </ControlRow>
  </ControlWrapper>
);

export default PreviewControls;
