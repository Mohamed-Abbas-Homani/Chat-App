import React from "react";
import styled from "styled-components";
import { FaTimes } from "react-icons/fa";
import { useIsDarkMode } from "../../../services/store";

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: ${({ $isDarkMode }) => ($isDarkMode ? "#333" : "white")};
  border-radius: 5px;
  padding: 30px;
  width: 90%;
  height: 987px;
  max-width: 800px;
  max-height: 90vh;
  min-height: 60vh; // Set a minimum height
  overflow-y: auto;
  position: relative;

  iframe {
    width: 100%;
    height: 100%;
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 8px;
  right: 10px;
  background: none;
  border: none;
  font-size: 1.3em;
  cursor: pointer;
  color: ${({ $isDarkMode }) => ($isDarkMode ? "#ccc" : "#333")};
`;

const Modal = ({ onClose, children }) => {
  const isDarkMode = useIsDarkMode();

  return (
    <ModalOverlay>
      <ModalContent $isDarkMode={isDarkMode}>
        <CloseButton $isDarkMode={isDarkMode} onClick={onClose}>
          <FaTimes />
        </CloseButton>
        {children}
      </ModalContent>
    </ModalOverlay>
  );
};

export default Modal;
