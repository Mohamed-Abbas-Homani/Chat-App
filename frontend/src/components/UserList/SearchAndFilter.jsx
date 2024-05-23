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
  showOffline,
  setShowOffline,
  showUnseen,
  setShowUnseen,
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
            checked={showOffline}
            onChange={(e) => setShowOffline(e.target.checked)}
          />
          <Checkmark>
            <MdOnlinePrediction fill={showOffline ? "#888" : "#4caf50"} size={"2em"}/>
          </Checkmark>
        </CheckboxLabel>
      </FilterContainer>
      <FilterContainer>
        <CheckboxLabel title="show just unseen">
          <CheckboxInput
            type="checkbox"
            checked={showUnseen}
            onChange={(e) => setShowUnseen(e.target.checked)}
          />
          <Checkmark>
            <FaEyeLowVision fill={!showUnseen ? "#888" : "#4caf50"} size={"2em"} />
          </Checkmark>
        </CheckboxLabel>
      </FilterContainer>
    </SearchContainer>
  );
};

export default SearchAndFilter;
