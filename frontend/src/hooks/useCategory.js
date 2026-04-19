import { useState, useEffect } from "react";
import categoryService from "../api/categoryService";

const useCategory = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await categoryService.getAll();
        if (data?.success) {
          setCategories(data.category || []);
        }
      } catch (error) {
        console.error("useCategory error:", error);
        setCategories([]);
      }
    };
    fetchCategories();
  }, []);

  return categories;
};

export default useCategory;