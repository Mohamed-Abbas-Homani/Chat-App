// components/MediaComponents/VideoComponent.js
import React from "react";
import { useIsDarkMode } from "../../../services/store";
import MediaWrapper from "./MediaWrapper";

const VideoComponent = ({ src }) => {
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

export default VideoComponent;
