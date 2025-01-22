// Components/Search/SearchBar.tsx
import React from "react";

interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({
  searchQuery,
  onSearchChange,
}) => {
  return (
    <div className="mb-4">
      <input
        type="text"
        className="w-full p-2 border rounded bg-gray-700 text-white placeholder-gray-400"
        placeholder="Etsi paikkaa..."
        value={searchQuery}
        onChange={onSearchChange}
      />
    </div>
  );
};

export default SearchBar;
