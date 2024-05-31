import {
  CheckboxInput,
  CheckboxLabel,
  Checkmark,
  FilterContainer,
  SearchBar,
  SearchContainer,
} from "./Style";
import { MdOnlinePrediction } from "react-icons/md";
import { FaEyeLowVision } from "react-icons/fa6";
import { useIsDarkMode } from "../../services/store";

const SearchAndFilter = ({
  searchTerm,
  setSearchTerm,
  filterOptions,
  onFilterChange,
}) => {
  const isDarkMode= useIsDarkMode()
  return (
    <SearchContainer>
      <SearchBar
        $isDarkMode={isDarkMode} 
        type="text"
        placeholder="Search users"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <FilterContainer>
        <CheckboxLabel title="Show just online">
          <CheckboxInput
            type="checkbox"
            checked={filterOptions.showOffline}
            onChange={(e) => onFilterChange("showOffline", e.target.checked)}
          />
          <Checkmark $isDarkMode={isDarkMode} >
            <MdOnlinePrediction
              fill={filterOptions.showOffline ? "#888" : "#4caf50"}
              size={"2em"}
            />
          </Checkmark>
        </CheckboxLabel>
      </FilterContainer>
      <FilterContainer>
        <CheckboxLabel title="Show just unseen">
          <CheckboxInput
            type="checkbox"
            checked={filterOptions.showUnseen}
            onChange={(e) => onFilterChange("showUnseen", e.target.checked)}
          />
          <Checkmark $isDarkMode={isDarkMode}>
            <FaEyeLowVision
              fill={!filterOptions.showUnseen ? "#888" : "#4caf50"}
              size={"2em"}
            />
          </Checkmark>
        </CheckboxLabel>
      </FilterContainer>
    </SearchContainer>
  );
};

export default SearchAndFilter;
