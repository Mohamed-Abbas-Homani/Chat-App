import React from 'react';
import styled from 'styled-components';
import { FiRotateCw, FiRotateCcw, FiZoomIn, FiZoomOut, FiRefreshCw } from 'react-icons/fi';
import { GiHorizontalFlip, GiVerticalFlip } from "react-icons/gi";

const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 10px;
  flex-wrap: wrap;
`;

const Button = styled.button`
  padding: 10px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background-color: #45a049;
  }

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

const Controls = ({
  handleRotate,
  handleZoom,
  handleScaleX,
  handleScaleY,
  handleReset,
}) => (
  <ButtonGroup>
    <Button onClick={() => handleRotate(-45)}><FiRotateCcw /></Button>
    <Button onClick={() => handleRotate(45)}><FiRotateCw /></Button>
    <Button onClick={() => handleZoom(0.1)}><FiZoomIn /></Button>
    <Button onClick={() => handleZoom(-0.1)}><FiZoomOut /></Button>
    <Button onClick={handleScaleX}><GiHorizontalFlip /></Button>
    <Button onClick={handleScaleY}><GiVerticalFlip /></Button>
    <Button onClick={handleReset}><FiRefreshCw /></Button>
  </ButtonGroup>
);

export default Controls;
