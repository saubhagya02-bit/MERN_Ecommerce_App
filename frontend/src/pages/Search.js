import React from "react";
import Layout from "../components/Layout/Layout";
import { useSearch } from "../context/search";
import { useNavigate } from "react-router-dom";

const Search = () => {
  const {search} = useSearch();
  const navigate = useNavigate();
  const results = search?.results || [];

  return (
    <Layout title={"Search Results"}>
      <div className="container">
        <h1 className="text-center">Search Results</h1>
        <h6 className="text-center mb-4">
          {search?.results?.length === 0
            ? "No products found"
            : `Found ${results.length} products`}
        </h6>

        <div className="d-flex flex-wrap justify-content-center">
          {results.map((p) => (
            <div
              className="card m-2"
              style={{ width: "18rem" }}
              key={p._id}
            >
              <img
                src={`/api/v1/product/product-photo/${p._id}`}
                className="card-img-top product-img"
                alt={p.name}
              />

              <div className="card-body">
                <h5 className="card-title">{p.name}</h5>
                <p className="card-text">
                  {p.description?.substring(0, 50)}...
                </p>
                <p className="card-text fw-bold">$ {p.price}</p>

                <button
                  className="btn btn-primary ms-1"
                  onClick={() => navigate(`/product/${p.slug}`)}
                >
                  More Details
                </button>

                <button className="btn btn-secondary ms-1">
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Search;
