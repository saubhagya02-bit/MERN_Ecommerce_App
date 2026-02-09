import React, { useState, useEffect } from "react";
import Layout from "./../components/Layout/Layout";
import axios from "axios";
import { Checkbox, Radio } from "antd";
import { Prices } from "../components/Prices";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/cart";
import toast from "react-hot-toast";
import useCategory from "../hooks/useCategory";
import "./HomePage.css";
import accessories from "../assets/images/Accessories-banner.png";
import cosmetics from "../assets/images/Cosmatics-banner.png";
import cloth from "../assets/images/Cloth-banner.png";
import electronics from "../assets/images/Electronics-banner.png";

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const { categories, setCategories } = useCategory();
  const { cart, setCart } = useCart();
  const [checked, setChecked] = useState([]);
  const [radioValue, setRadioValue] = useState(null);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const getAllCategory = async () => {
    try {
      const { data } = await axios.get("/api/v1/category/get-category");
      if (data?.success) {
        setCategories(data.category);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getAllProducts = async (pageNumber = 1) => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `/api/v1/product/product-list/${pageNumber}`
      );
      if (pageNumber == 1) {
        setProducts(data?.products || []);
      } else {
        setProducts((prev) => [...prev, ...data.products]);
      }

      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  const getTotal = async () => {
    try {
      const { data } = await axios.get("/api/v1/product/product-count");
      setTotal(data?.total || 0);
    } catch (error) {
      console.log(error);
    }
  };

  const loadMore = async () => {
    const nextPage = page + 1;
    setPage(nextPage);

    if (checked.length || radioValue) {
      filterProduct(nextPage);
    } else {
      const { data } = await axios.get(
        `/api/v1/product/product-list/${nextPage}`
      );
      setProducts((prev) => [...prev, ...data.products]);
    }
  };

  const handleFilter = (value, id) => {
    let updatedChecked = [...checked];
    if (value) {
      updatedChecked.push(id);
    } else {
      updatedChecked = updatedChecked.filter((c) => c !== id);
    }
    setChecked(updatedChecked);
  };

  const filterProduct = async (pageNumber = 1) => {
    try {
      const { data } = await axios.post("/api/v1/product/product-filters", {
        checked,
        radio: radioValue,
        page: pageNumber,
      });
      if (pageNumber === 1) {
        setProducts(data?.products || []);
      } else {
        setProducts((prev) => [...prev, ...data.products]);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const resetFilters = () => {
    setChecked([]);
    setRadioValue(null);
    setPage(1);
    getAllProducts();
  };

  useEffect(() => {
    getAllCategory();
    getAllProducts();
    getTotal();
  }, []);

  useEffect(() => {
    setPage(1);

    if (checked.length || radioValue) {
      filterProduct(1);
    } else {
      getAllProducts(1);
    }
  }, [checked, radioValue]);

  return (
    <Layout title="All Products">
      <div className="container-fluid p-0">
  <div className="img-container">
    <img src={accessories} alt="Accessories" />
    <img src={cosmetics} alt="Cosmatics" />
    <img src={cloth} alt="Cloth" />
    <img src={electronics} alt="Electronics" />
  </div>
</div>

      <div className="content-hero" id="home">
        <h1>Welcome to our store...!</h1>

        <p className="text-lg mb-6">
          Whether you need tech, fashion, home items or more...we help you shop
          faster.
        </p>
      </div>

      <div className="row mt-3">
        <div className="col-md-3">
          <h4 className="text-center mt-4">Filter by Price</h4>
          <div className="d-flex flex-column">
            <Radio.Group
              value={radioValue}
              onChange={(e) => setRadioValue(e.target.value)}
            >
              {Prices.map((p) => (
                <Radio key={p.id} value={p.array}>
                  {p.name}
                </Radio>
              ))}
            </Radio.Group>
          </div>

          <div className="d-flex flex-column mt-3">
            <button className="btn btn-danger" onClick={resetFilters}>
              Reset Filters
            </button>
          </div>
        </div>

        <div className="col-md-9">
          <h1 className="text-center">All Products</h1>
          <div className="d-flex flex-wrap">
            {products.map((p) => (
              <div className="card m-2" style={{ width: "18rem" }} key={p._id}>
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
                  <p className="card-text">$ {p.price}</p>
                  <button
                    className="btn btn-primary ms-1"
                    onClick={() => navigate(`/product/${p.slug}`)}
                  >
                    More Details
                  </button>
                  <button
                    className="btn btn-secondary ms-1"
                    onClick={() => {
                      setCart((prevCart) => [...prevCart, p]);
                      toast.success("Item added to cart");
                    }}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="m-2 p-3">
            {products.length < total && (
              <button
                className="btn btn-warning mt-3"
                onClick={loadMore}
                disabled={loading}
              >
                {loading ? "Loading..." : "Load More"}
              </button>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default HomePage;
