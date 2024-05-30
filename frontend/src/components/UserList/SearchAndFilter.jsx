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

const SearchAndFilter = ({
  searchTerm,
  setSearchTerm,
  filterOptions,
  onFilterChange,
}) => {
  return (
    <SearchContainer>
      <SearchBar
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
          <Checkmark>
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
          <Checkmark>
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
