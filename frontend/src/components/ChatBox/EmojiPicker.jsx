import React, { useState, useEffect } from "react";
import {
  EmojiPickerWrapper,
  EmojiButton,
  CategoryWrapper,
  CategoryButton,
  EmojisWrapper,
} from "./Style";
import { FaSmile, FaPaw, FaUtensils, FaFutbol, FaPlane, FaLightbulb, FaHeart } from "react-icons/fa";

const emojis = {
  smileys: ["😊", "😂", "😍", "😎", "👍", "❤️", "🎉", "😢", "😡", "😱", "😜", "🤪", "🤩", "🤔", "😇"],
  animals: ["🐶", "🐱", "🐭", "🐹", "🐰", "🦊", "🐻", "🐼", "🐨", "🐯", "🦁", "🐮", "🐷", "🐸", "🐵"],
  food: ["🍏", "🍎", "🍐", "🍊", "🍋", "🍌", "🍉", "🍇", "🍓", "🍈", "🍒", "🍑", "🍍", "🥭", "🥝"],
  activity: ["⚽️", "🏀", "🏈", "⚾️", "🎾", "🏐", "🏉", "🎱", "🏓", "🏸", "🏒", "🏑", "🏏", "🪀", "🎣"],
  travel: ["✈️", "🚗", "🚕", "🚙", "🚌", "🚎", "🏎️", "🚓", "🚑", "🚒", "🚃", "🚝", "🚄", "🚅", "🚀"],
  objects: ["💡", "🔦", "🏮", "📺", "📻", "📱", "💻", "⌨️", "🖥️", "🖨️", "⏰", "⏳", "📅", "📚", "🔖"],
  symbols: ["❤️", "💔", "❣️", "💕", "💞", "💓", "💗", "💖", "💘", "💝", "🔷", "🔶", "🔺", "🔲", "🔳"],
};

const categories = [
  { name: "smileys", icon: <FaSmile /> },
  { name: "animals", icon: <FaPaw /> },
  { name: "food", icon: <FaUtensils /> },
  { name: "activity", icon: <FaFutbol /> },
  { name: "travel", icon: <FaPlane /> },
  { name: "objects", icon: <FaLightbulb /> },
  { name: "symbols", icon: <FaHeart /> },
];

const EmojiPicker = ({ onSelect }) => {
  const [selectedCategory, setSelectedCategory] = useState("smileys");
  const [multiSelect, setMultiSelect] = useState(false);
  const [selectedEmojis, setSelectedEmojis] = useState([]);

  useEffect(() => {
    const handleDocumentKeyDown = (e) => {
      if (e.key === "Shift") {
        setMultiSelect(true);
      }
    };

    const handleDocumentKeyUp = (e) => {
      if (e.key === "Shift") {
        setMultiSelect(false);
        if (selectedEmojis.length > 0) {
          onSelect(selectedEmojis.join(" "));
          setSelectedEmojis([]);
        }
      }
    };

    document.addEventListener("keydown", handleDocumentKeyDown);
    document.addEventListener("keyup", handleDocumentKeyUp);

    return () => {
      document.removeEventListener("keydown", handleDocumentKeyDown);
      document.removeEventListener("keyup", handleDocumentKeyUp);
    };
  }, [selectedEmojis, onSelect]);

  const handleEmojiClick = (emoji) => {
    if (multiSelect) {
      setSelectedEmojis((prev) => [...prev, emoji]);
    } else {
      onSelect(emoji);
    }
  };

  return (
    <EmojiPickerWrapper>
      <CategoryWrapper>
        {categories.map((category) => (
          <CategoryButton
            key={category.name}
            $active={selectedCategory === category.name}
            onClick={() => setSelectedCategory(category.name)}
          >
            {category.icon}
          </CategoryButton>
        ))}
      </CategoryWrapper>
      <EmojisWrapper>
        {emojis[selectedCategory].map((emoji, index) => (
          <EmojiButton key={index} onClick={() => handleEmojiClick(emoji)}>
            {emoji}
          </EmojiButton>
        ))}
      </EmojisWrapper>
    </EmojiPickerWrapper>
  );
};

export default EmojiPicker;
