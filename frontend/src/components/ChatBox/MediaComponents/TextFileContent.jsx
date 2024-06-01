import React, { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { Light as SyntaxHighlighter } from "react-syntax-highlighter";
import * as hljsStyles from "react-syntax-highlighter/dist/esm/styles/hljs";
import styled from "styled-components";
import { useIsDarkMode } from "../../../services/store";
import { FaCopy } from "react-icons/fa";

// Styled container for text content
const TextContainer = styled.div`
  padding-top: 70px;
  position: relative;
  font-family: Arial, sans-serif;
  line-height: 1.5;
  color: ${({ $isDarkMode }) => ($isDarkMode ? "#ddd" : "#333")};
  background-color: ${({ $isDarkMode }) => ($isDarkMode ? "#222" : "#fff")};
  padding: 20px;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  overflow-y: auto;
`;

const StyleSelector = styled.select`
  position: absolute;
  top: 10px;
  left: 10px;
  padding: 2px 5px;
  font-size: 12px;
  color: ${({ $isDarkMode }) => ($isDarkMode ? "#ddd" : "#333")};
  background-color: ${({ $isDarkMode }) => ($isDarkMode ? "#444" : "#f9f9f9")};
  border: 1px solid ${({ $isDarkMode }) => ($isDarkMode ? "#555" : "#ddd")};
  border-radius: 3px;
`;

const CopyButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  padding: 2px 5px;
  display: flex;
  align-items: center;
  padding: 5px;
  font-size: 14px;
  color: ${({ $isDarkMode }) => ($isDarkMode ? "#ddd" : "#333")};
  background-color: ${({ $isDarkMode }) => ($isDarkMode ? "#444" : "#f9f9f9")};
  border: 1px solid ${({ $isDarkMode }) => ($isDarkMode ? "#555" : "#ddd")};
  border-radius: 3px;
  cursor: pointer;

  &:hover {
    background-color: ${({ $isDarkMode }) =>
      $isDarkMode ? "#555" : "#e1e1e1"};
  }

  svg {
    margin-right: 5px;
  }
`;

const LanguageTag = styled.div`
  position: absolute;
  top: 10px;
  left: 130px;
  padding: 2px 5px;
  font-size: 12px;
  color: ${({ $isDarkMode }) => ($isDarkMode ? "#ddd" : "#333")};
`;

const TextFileContent = ({ src }) => {
  const [text, setText] = useState("");
  const [selectedStyle, setSelectedStyle] = useState("vs2015");
  const [language, setLanguage] = useState("");
  const isDarkMode = useIsDarkMode();

  useEffect(() => {
    const fetchText = async () => {
      const response = await fetch(src);
      const data = await response.text();
      setText(data);
    };
    fetchText();
  }, [src]);

  const handleStyleChange = (event) => {
    setSelectedStyle(event.target.value);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(text).then(() => {
      alert("Content copied to clipboard!");
    });
  };

  const components = {
    code({ node, inline, className, children, ...props }) {
      const match = /language-(\w+)/.exec(className || "");
      const lang = match ? match[1] : "plaintext";
      if (lang !== language) setLanguage(lang);
      return !inline && match ? (
        <SyntaxHighlighter
          style={hljsStyles[selectedStyle]}
          language={lang}
          PreTag="div"
          {...props}
        >
          {String(children).replace(/\n$/, "")}
        </SyntaxHighlighter>
      ) : (
        <code className={className} {...props}>
          {children}
        </code>
      );
    },
  };

  return (
    <TextContainer $isDarkMode={isDarkMode}>
      {language && (
        <>
          <StyleSelector
            value={selectedStyle}
            onChange={handleStyleChange}
            $isDarkMode={isDarkMode}
          >
            <option value="vs2015">VS</option>
            <option value="atomOneDark">Atom One Dark</option>
            <option value="atomOneLight">Atom One Light</option>
            <option value="dracula">Dracula</option>
            <option value="monokai">Monokai</option>
            <option value="solarizedDark">Solarized Dark</option>
            <option value="solarizedLight">Solarized Light</option>
            <option value="github">GitHub</option>
            <option value="ocean">Ocean</option>
          </StyleSelector>

          <LanguageTag $isDarkMode={isDarkMode}>{language}</LanguageTag>
        </>
      )}
      <CopyButton onClick={handleCopy} $isDarkMode={isDarkMode}>
        <FaCopy />
        Copy
      </CopyButton>
      <div style={{ marginTop: "40px" }}>
        <ReactMarkdown components={components}>{text}</ReactMarkdown>
      </div>
    </TextContainer>
  );
};

export default TextFileContent;
