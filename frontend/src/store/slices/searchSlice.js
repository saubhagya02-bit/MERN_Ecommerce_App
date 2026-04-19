import { createSlice } from "@reduxjs/toolkit";

const searchSlice = createSlice({
  name: "search",
  initialState: {
    keyword: "",
    results: [],
  },
  reducers: {
    setKeyword: (state, action) => {
      state.keyword = action.payload;
    },
    setResults: (state, action) => {
      state.results = action.payload;
    },
    clearSearch: (state) => {
      state.keyword = "";
      state.results = [];
    },
  },
});

export const { setKeyword, setResults, clearSearch } = searchSlice.actions;

export const selectKeyword = (state) => state.search.keyword;
export const selectResults = (state) => state.search.results;

export default searchSlice.reducer;
