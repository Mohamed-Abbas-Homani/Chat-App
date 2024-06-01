import React, { useState, useEffect } from "react";
import styled, { css, keyframes } from "styled-components";
import { FaFileAlt, FaTimes } from "react-icons/fa";
import { useIsDarkMode } from "../../services/store"; // Import the hook

// Define keyframes for animation
const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
`;

const MediaWrapper = styled.div`
  margin-top: 10px;
  animation: ${fadeIn} 0.3s ease-in-out;

  img, video, audio {
    max-width: 100%;
    max-height: 100%;
    border-radius: 5px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
`;

export const ImageComponent = ({ src }) => {
  const isDarkMode = useIsDarkMode();
  return (
    <MediaWrapper>
      <img src={src} alt="Image" style={{ filter: isDarkMode ? 'brightness(0.8)' : 'none' }} />
    </MediaWrapper>
  );
};

export const VideoComponent = ({ src }) => {
  const isDarkMode = useIsDarkMode();
  return (
    <MediaWrapper>
      <video controls style={{ filter: isDarkMode ? 'brightness(0.8)' : 'none' }}>
        <source src={src} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </MediaWrapper>
  );
};

export const AudioComponent = ({ src }) => (
  <MediaWrapper>
    <audio controls>
      <source src={src} type="audio/mpeg" />
      Your browser does not support the audio element.
    </audio>
  </MediaWrapper>
);

const FileWrapper = styled.div`
  margin-top: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border: 1px solid ${({ $isDarkMode }) => ($isDarkMode ? "#555" : "#ddd")};
  border-radius: 5px;
  padding: 10px;
  background-color: ${({ $isDarkMode }) => ($isDarkMode ? "#333" : "#f9f9f9")};
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  animation: ${fadeIn} 0.3s ease-in-out;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: ${({ $isDarkMode }) => ($isDarkMode ? "#444" : "#f1f1f1")};
  }

  a {
    text-decoration: none;
    color: ${({ $isDarkMode }) => ($isDarkMode ? "#ddd" : "#333")};
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 10px;

    &:hover {
      color: #007bff;
    }

    svg {
      margin-bottom: 5px;
    }
  }
`;

const FileIcon = styled(FaFileAlt)`
  font-size: 40px;
  color: #007bff;
`;

const FileName = styled.p`
  margin: 0;
  font-size: 14px;
  color: ${({ $isDarkMode }) => ($isDarkMode ? "#ccc" : "#555")};
  text-align: center;
`;

export const FileComponent = ({ src }) => {
  const fileName = src.split('/').pop();
  const isDarkMode = useIsDarkMode();
  const [showModal, setShowModal] = useState(false);

  const handleModalOpen = () => {
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
  };

  const isTextFile = src.endsWith(".txt");
  const isPdfFile = src.endsWith(".pdf");

  return (
    <>
      <FileWrapper $isDarkMode={isDarkMode} onClick={isTextFile || isPdfFile ? handleModalOpen : null}>
        <FileIcon />
        <FileName $isDarkMode={isDarkMode}>{fileName}</FileName>
        <p>{isTextFile || isPdfFile ? "View File" : <a href={src} download>Download File</a>}</p>
      </FileWrapper>
      {showModal && (isTextFile || isPdfFile) && (
        <Modal onClose={handleModalClose}>
          {isPdfFile ? (
            <object data={src} type="application/pdf" style={{width:"100%", height:"100%"}}>
              <p>PDF cannot be displayed. <a href={src} download>Download it</a> instead.</p>
            </object>
          ) : (
            <pre style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>
              <TextFileContent src={src} />
            </pre>
          )}
        </Modal>
      )}
      
    </>
  );
};

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
  padding: 20px;
  width: 90%;
  height: 987px;
  max-width: 800px;
  max-height: 90vh;
  min-height: 60vh;  // Set a minimum height
  overflow-y: auto;
  position: relative;

  iframe {
    width: 100%;
    height: 100%;
  }
`;


const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  font-size: 1.5em;
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

const TextFileContent = ({ src }) => {
  const [text, setText] = useState("");

  useEffect(() => {
    const fetchText = async () => {
      const response = await fetch(src);
      const data = await response.text();
      setText(data);
    };
    fetchText();
  }, [src]);

  return <div>{text}</div>;
};
