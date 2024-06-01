// components/FileComponent.js
import React, { useState } from "react";
import styled, { keyframes } from "styled-components";
import { FaFileAlt } from "react-icons/fa";
import { useIsDarkMode } from "../../../services/store";
import Modal from "./Modal";
import TextFileContent from "./TextFileContent";

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
    background-color: ${({ $isDarkMode }) =>
      $isDarkMode ? "#444" : "#f1f1f1"};
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
  const fileName = src.split("/").pop();
  const isDarkMode = useIsDarkMode();
  const [showModal, setShowModal] = useState(false);

  const handleModalOpen = () => {
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
  };

  const isTextFile = src.endsWith(".txt") || src.endsWith(".md");
  const isPdfFile = src.endsWith(".pdf");

  return (
    <>
      <FileWrapper
        $isDarkMode={isDarkMode}
        onClick={isTextFile || isPdfFile ? handleModalOpen : null}
      >
        <FileIcon />
        <FileName $isDarkMode={isDarkMode}>{fileName}</FileName>
        <p>
          {isTextFile || isPdfFile ? (
            "View File"
          ) : (
            <a href={src} download>
              Download File
            </a>
          )}
        </p>
      </FileWrapper>
      {showModal && (isTextFile || isPdfFile) && (
        <Modal onClose={handleModalClose}>
          {isPdfFile ? (
            <object
              data={src}
              type="application/pdf"
              style={{ width: "100%", height: "100%" }}
            >
              <p>
                PDF cannot be displayed.{" "}
                <a href={src} download>
                  Download it
                </a>{" "}
                instead.
              </p>
            </object>
          ) : (
            <TextFileContent src={src} />
          )}
        </Modal>
      )}
    </>
  );
};

export default FileComponent;
