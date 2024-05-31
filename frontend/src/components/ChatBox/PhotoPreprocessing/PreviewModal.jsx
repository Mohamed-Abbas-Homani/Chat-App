import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import PreviewControls from "./PreviewControls";
import OverlayText from "./OverlayText";

const ModalWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  max-height: 80%;
  max-width: 90%;
  overflow: hidden;
`;

const PreviewImageWrapper = styled.div`
  position: relative;
  width: 300px;
  height: 300px;
  margin-bottom: 20px;
`;

const PreviewImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
  filter: ${({ brightness, blur, sepia, grayscale }) =>
    `brightness(${brightness}%) blur(${blur}px) sepia(${sepia}%) grayscale(${grayscale}%)`};
`;

const Canvas = styled.canvas`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  cursor: pointer;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 10px;
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
`;

const PreviewModal = ({ croppedImage, onClose, onCrop }) => {
  const [brightness, setBrightness] = useState(100);
  const [blur, setBlur] = useState(0);
  const [sepia, setSepia] = useState(0);
  const [grayscale, setGrayscale] = useState(0);
  const [text, setText] = useState("");
  const [textSize, setTextSize] = useState(30);
  const [textColor, setTextColor] = useState("white");
  const [textPosition, setTextPosition] = useState({ x: 0, y: 0 });

  const handleSave = () => {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    const image = new Image();
    image.src = croppedImage;

    image.onload = () => {
      canvas.width = image.width;
      canvas.height = image.height;
      context.filter = `brightness(${brightness}%) blur(${blur}px) sepia(${sepia}%) grayscale(${grayscale}%)`;
      context.drawImage(image, 0, 0);
      context.font = `${textSize * (canvas.width / 300)}px Arial`;
      context.fillStyle = textColor;
      context.textAlign = "center";

      const xPos =
        canvas.width / 2 + parseInt(textPosition.x) * (canvas.width / 300);
      const yPos =
        canvas.height / 2 + parseInt(textPosition.y) * (canvas.height / 300);

      context.fillText(text, xPos, yPos);

      const dataUrl = canvas.toDataURL("image/jpeg");
      onCrop(dataUrl);
      onClose();
    };
  };

  return (
    <ModalWrapper>
      <ModalContent>
        <PreviewImageWrapper>
          <PreviewImage
            src={croppedImage}
            brightness={brightness}
            blur={blur}
            sepia={sepia}
            grayscale={grayscale}
          />
          <Canvas />
          <OverlayText
            text={text}
            textPosition={textPosition}
            textSize={textSize}
            textColor={textColor}
          />
        </PreviewImageWrapper>
        <PreviewControls
          brightness={brightness}
          setBrightness={setBrightness}
          blur={blur}
          setBlur={setBlur}
          sepia={sepia}
          setSepia={setSepia}
          grayscale={grayscale}
          setGrayscale={setGrayscale}
          text={text}
          setText={setText}
          textSize={textSize}
          setTextSize={setTextSize}
          textColor={textColor}
          setTextColor={setTextColor}
          textPosition={textPosition}
          setTextPosition={setTextPosition}
        />
        <ButtonGroup>
          <Button onClick={handleSave}>Save</Button>
          <Button onClick={onClose}>Cancel</Button>
        </ButtonGroup>
      </ModalContent>
    </ModalWrapper>
  );
};

export default PreviewModal;
