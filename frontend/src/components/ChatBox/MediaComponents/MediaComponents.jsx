// components/MediaComponents.js
import React from "react";
import styled, { keyframes } from "styled-components";
import { useIsDarkMode } from "../../../services/store";

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

  img,
  video,
  audio {
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
      <img
        src={src}
        alt="Image"
        style={{ filter: isDarkMode ? "brightness(0.8)" : "none" }}
      />
    </MediaWrapper>
  );
};

export const VideoComponent = ({ src }) => {
  const isDarkMode = useIsDarkMode();
  return (
    <MediaWrapper>
      <video
        controls
        style={{ filter: isDarkMode ? "brightness(0.8)" : "none" }}
      >
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
