// MediaComponents.jsx
import React from "react";
import styled, { css, keyframes } from "styled-components";
import { FaFileAlt } from "react-icons/fa";
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
  return (
    <FileWrapper $isDarkMode={isDarkMode}>
      <a href={src} download>
        <FileIcon />
        <FileName $isDarkMode={isDarkMode}>{fileName}</FileName>
        <p>Download File</p>
      </a>
    </FileWrapper>
  );
};
