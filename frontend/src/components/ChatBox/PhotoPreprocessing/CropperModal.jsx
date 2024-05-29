import React, { useRef, useEffect, useState } from "react";
import styled from "styled-components";
import Cropper from "cropperjs";
import "cropperjs/dist/cropper.css";
import CropperContainer from "./CropperContainer";
import Controls from "./Controls";
import PreviewModal from "./PreviewModal";

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

const CropperModal = ({ src, onClose, onCrop }) => {
  const cropperRef = useRef(null);
  const [cropper, setCropper] = useState(null);
  const [croppedImage, setCroppedImage] = useState(null);
  const [nextClicked, setNextClicked] = useState(false);

  useEffect(() => {
    const image = cropperRef.current;
    const cropperInstance = new Cropper(image, {});
    setCropper(cropperInstance);

    return () => {
      cropperInstance.destroy();
    };
  }, [src]);

  const handleCrop = () => {
    if (cropper) {
      const canvas = cropper.getCroppedCanvas();
      const croppedDataUrl = canvas.toDataURL("image/jpeg");
      setCroppedImage(croppedDataUrl);
    }
  };

  const handleNext = () => {
    setNextClicked(true);
  };

  const handleRotate = (degree) => {
    if (cropper) {
      cropper.rotate(degree);
    }
  };

  const handleZoom = (ratio) => {
    if (cropper) {
      cropper.zoom(ratio);
    }
  };

  const handleScaleX = () => {
    if (cropper) {
      const scaleX = cropper.getData().scaleX === 1 ? -1 : 1;
      cropper.scaleX(scaleX);
    }
  };

  const handleScaleY = () => {
    if (cropper) {
      const scaleY = cropper.getData().scaleY === 1 ? -1 : 1;
      cropper.scaleY(scaleY);
    }
  };

  const handleReset = () => {
    if (cropper) {
      cropper.reset();
    }
  };

  if (nextClicked) {
    return (
      <PreviewModal
        croppedImage={src} // Pass the original image for preview
        onClose={onClose}
        onCrop={onCrop}
      />
    );
  }

  if (croppedImage) {
    return (
      <PreviewModal
        croppedImage={croppedImage}
        onClose={onClose}
        onCrop={onCrop}
      />
    );
  }

  return (
    <ModalWrapper>
      <ModalContent>
        <CropperContainer cropperRef={cropperRef} src={src} />
        <Controls
          handleRotate={handleRotate}
          handleZoom={handleZoom}
          handleScaleX={handleScaleX}
          handleScaleY={handleScaleY}
          handleReset={handleReset}
        />
        <ButtonGroup>
          <Button onClick={handleNext}>Next</Button>
          <Button onClick={handleCrop}>Crop</Button>
          <Button onClick={onClose}>Cancel</Button>
        </ButtonGroup>
      </ModalContent>
    </ModalWrapper>
  );
};

export default CropperModal;
