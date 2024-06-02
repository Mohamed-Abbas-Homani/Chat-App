// components/MediaComponents/AudioComponent.js
import React, { useRef, useState, useEffect } from "react";
import styled from "styled-components";
import { useIsDarkMode } from "../../../services/store";
import { FaPlay, FaPause } from "react-icons/fa";
import MediaWrapper from "./MediaWrapper";

const AudioContainer = styled.div`
  display: flex;
  align-items: center;
  padding: 10px;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const PlayButton = styled.button`
  background: none;
  border: none;
  color: ${(props) => (props.$isDarkMode ? "#fff" : "#333")};
  cursor: pointer;
  margin-right: 10px;
  margin-top: 5px;
`;

const SeekBar = styled.input`
  flex-grow: 1;
  margin: 0 10px;
`;

const Timestamp = styled.span`
  color: ${(props) => (props.$isDarkMode ? "#ccc" : "#333")};
  font-size: 0.9rem;
  margin-right: 10px;
`;

const SpeedControl = styled.select`
  margin-left: 10px;
  background: ${(props) => (props.$isDarkMode ? "#555" : "#fff")};
  color: ${(props) => (props.$isDarkMode ? "#fff" : "#333")};
  border: 1px solid ${(props) => (props.$isDarkMode ? "#444" : "#ccc")};
  border-radius: 5px;
  padding: 2px 5px;
`;

const AudioComponent = ({ src }) => {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);
  const isDarkMode = useIsDarkMode();

  const togglePlayPause = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    setCurrentTime(audioRef.current.currentTime);
  };

  const handleDurationChange = () => {
    setDuration(audioRef.current.duration);
  };

  const handleSeek = (e) => {
    audioRef.current.currentTime = e.target.value;
  };

  const handleSpeedChange = (e) => {
    const rate = parseFloat(e.target.value);
    setPlaybackRate(rate);
    audioRef.current.playbackRate = rate;
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? `0${secs}` : secs}`;
  };

  useEffect(() => {
    const audio = audioRef.current;
    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("loadedmetadata", handleDurationChange);
    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("loadedmetadata", handleDurationChange);
    };
  }, []);

  return (
    <MediaWrapper>
      <AudioContainer $isDarkMode={isDarkMode}>
        <PlayButton onClick={togglePlayPause} $isDarkMode={isDarkMode}>
          {isPlaying ? <FaPause /> : <FaPlay />}
        </PlayButton>
        <SeekBar
          type="range"
          min="0"
          max={duration}
          value={currentTime}
          onChange={handleSeek}
        />
        <Timestamp $isDarkMode={isDarkMode}>
          {formatTime(currentTime)} / {formatTime(duration)}
        </Timestamp>
        <SpeedControl
          value={playbackRate}
          onChange={handleSpeedChange}
          $isDarkMode={isDarkMode}
        >
          <option value="0.5">0.5x</option>
          <option value="1">1x</option>
          <option value="1.5">1.5x</option>
          <option value="2">2x</option>
        </SpeedControl>
      </AudioContainer>
      <audio
        ref={audioRef}
        src={src}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleDurationChange}
        style={{ display: "none" }}
      />
    </MediaWrapper>
  );
};

export default AudioComponent;
