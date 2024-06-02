import React, { useState } from "react";
import styled, { keyframes } from "styled-components";
import Modal from "react-modal";
import { useIsDarkMode } from "../../../services/store";
import MediaWrapper from "./MediaWrapper";

const zoomIn = keyframes`
  from {
    transform: scale(1);
  }
  to {
    transform: scale(1.1);
  }
`;

const ImageWrapper = styled.div`
  position: relative;
  overflow: hidden;
  border-radius: 10px;
  &:hover img {
    animation: ${zoomIn} 0.5s forwards;
  }
`;

const StyledImage = styled.img`
  width: 100%;
  height: auto;
  border-radius: 10px;
  transition: transform 0.5s ease;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  filter: ${(props) => (props.$isDarkMode ? "brightness(0.8)" : "none")};
  cursor: pointer;
`;

const Caption = styled.div`
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 10px;
  background: rgba(0, 0, 0, 0.6);
  color: #fff;
  text-align: center;
  font-size: 1rem;
  opacity: 0;
  transition: opacity 0.5s ease;
  ${ImageWrapper}:hover & {
    opacity: 1;
  }
`;

const ModalImage = styled.img`
  width: 90%;
  height: auto;
  max-width: 800px;
  margin: auto;
  display: block;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
`;

const CloseButton = styled.button`
  position: absolute;
  top: 20px;
  right: 20px;
  background: none;
  border: none;
  color: #fff;
  font-size: 1.5rem;
  cursor: pointer;
`;

Modal.setAppElement('#root'); // Make sure this is the ID of your root element

const ImageComponent = ({ src, caption }) => {
  const isDarkMode = useIsDarkMode();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <MediaWrapper>
      <ImageWrapper>
        <StyledImage
          src={src}
          alt="Image"
          $isDarkMode={isDarkMode}
          onClick={openModal}
        />
        {caption && <Caption>{caption}</Caption>}
      </ImageWrapper>
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        style={{
          overlay: {
            backgroundColor: "rgba(0, 0, 0, 0.8)",
          },
          content: {
            background: "none",
            border: "none",
            padding: "0",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          },
        }}
      >
        <CloseButton onClick={closeModal}>&times;</CloseButton>
        <ModalImage src={src} alt="Large view" />
      </Modal>
    </MediaWrapper>
  );
};

export default ImageComponent;
