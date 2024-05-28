import React, { useRef, useEffect, useState } from 'react';
import Cropper from 'cropperjs';
import 'cropperjs/dist/cropper.css';
import styled from 'styled-components';

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
`;

const CropperContainer = styled.div`
  width: 400px;
  height: 400px;
  margin-bottom: 20px;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
`;

const Button = styled.button`
  padding: 10px 20px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: #45a049;
  }

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

const CropperModal = ({ src, onClose, onCrop }) => {
  const cropperRef = useRef(null);
  const [cropper, setCropper] = useState(null);

  useEffect(() => {
    const image = cropperRef.current;
    const cropperInstance = new Cropper(image, {
      aspectRatio: 1,
      viewMode: 1,
    });
    setCropper(cropperInstance);

    return () => {
      cropperInstance.destroy();
    };
  }, [src]);

  const handleCrop = () => {
    if (cropper) {
      const canvas = cropper.getCroppedCanvas();
      onCrop(canvas.toDataURL('image/jpeg'));
      onClose();
    }
  };

  return (
    <ModalWrapper>
      <ModalContent>
        <CropperContainer>
          <img ref={cropperRef} src={src} alt="Source" />
        </CropperContainer>
        <ButtonGroup>
          <Button onClick={handleCrop}>Crop</Button>
          <Button onClick={onClose}>Cancel</Button>
        </ButtonGroup>
      </ModalContent>
    </ModalWrapper>
  );
};

export default CropperModal;
