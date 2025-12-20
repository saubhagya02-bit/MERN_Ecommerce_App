import { createContext, useContext, useState } from "react";

const SearchContext = createContext({
  search: { keyword: "", results: [] },
  setSearch: () => {},
});

const SearchProvider = ({ children }) => {
  const [search, setSearch] = useState({
    keyword: "",
    results: [],
  });

  return (
    <SearchContext.Provider value={{ search, setSearch }}>
      {children}
    </SearchContext.Provider>
  );
};

const useSearch = () => useContext(SearchContext);

export { useSearch, SearchProvider };
