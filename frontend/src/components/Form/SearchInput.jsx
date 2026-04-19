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
  const keyword  = useSelector(selectKeyword);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!keyword.trim()) return;
    try {
      const { data } = await productService.search(keyword.trim());
      dispatch(setResults(data.products || []));
      navigate("/search");
    } catch (error) {
      console.error("Search error:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-1">
      <input
        type="search"
        value={keyword}
        onChange={(e) => dispatch(setKeyword(e.target.value))}
        placeholder="Search products..."
        className="input-field w-44 md:w-56 text-sm"
      />
      <button type="submit" className="btn-primary p-2">
        <HiSearch className="text-lg" />
      </button>
    </form>
  );
};

export default SearchInput;