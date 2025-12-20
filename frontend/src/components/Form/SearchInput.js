import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSearch } from "../../context/search";
import axios from "axios";

const SearchInput = () => {
    const [values, setValues] = useState();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { data } = await axios.get(
                `/api/v1/product/search/${values.keyword}`
            );
            setValues({...values, results: data});
            navigate("/search");
        } catch (error) {
            console.log(error);
        }
    };

    return (
      <div>
        <form className="d-flex" role="search">
          <input
            className="form-control me-2"
            type="search"
            placeholder="Search"
            aria-label="Search"
          />
          <button className="btn btn-outline-success" type="submit">
            Search
          </button>
        </form>
      </div>
    );
}

export default SearchInput;