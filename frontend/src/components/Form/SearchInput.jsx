import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  setKeyword,
  setResults,
  selectKeyword,
} from "../../store/slices/searchSlice";
import productService from "../../api/productService";
import { HiSearch } from "react-icons/hi";

const SearchInput = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const keyword = useSelector(selectKeyword);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!keyword.trim()) return;
    try {
      const { data } = await productService.search(keyword.trim());
      dispatch(setResults(data.products || []));
      navigate("/search");
    } catch (err) {
      console.error("Search error:", err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-1.5">
      <input
        type="search"
        value={keyword}
        onChange={(e) => dispatch(setKeyword(e.target.value))}
        placeholder="Search products…"
        className="input-field w-44 md:w-52 text-xs py-2"
      />
      <button
        type="submit"
        className="btn-primary p-2 rounded-lg"
        aria-label="Search"
        style={{ minWidth: "2.25rem" }}
      >
        <HiSearch className="text-base" />
      </button>
    </form>
  );
};

export default SearchInput;
