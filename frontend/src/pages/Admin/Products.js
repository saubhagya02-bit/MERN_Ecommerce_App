import React, { useState, useEffect } from "react";
import Layout from "./../../components/Layout/Layout";
import AdminMenu from "../../components/Layout/AdminMenu";
import axios from "axios";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import "./Products.css";

const Products = () => {
  const [products, setProducts] = useState([]);

  const getAllProducts = async () => {
    try {
      const { data } = await axios.get("/api/v1/product/get-product");
      if (data?.success) {
        setProducts(data.products);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };

  useEffect(() => {
    getAllProducts();
  }, []);

  return (
    <Layout title={"All Products"}>
      <div className="container-fluid">
        <div className="row">

          <div className="col-md-3">
            <AdminMenu />
          </div>

          <div className="col-md-9">
            <h1 className="text-center mb-4">All Products List</h1>

            <div className="row">
              {products.map((p) => (
                <div className="col-md-4 mb-4" key={p._id}>
                  <Link
                    to={`/dashboard/admin/product/${p.slug}`}
                    className="text-decoration-none text-dark  text-center"
                  >
                    <div className="card product-card h-100">
                      <img
                        src={`/api/v1/product/product-photo/${p._id}`}
                        className="card-img-top product-img"
                        alt={p.name}
                      />
                      <div className="card-body">
                        <h5 className="card-title">{p.name}</h5>
                        <p className="card-text text-muted">
                          {p.description.substring(0, 50)}...
                        </p>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>

          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Products;
