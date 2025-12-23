import { useState, useEffect } from "react";
import axios from "axios";

export default function useCategory() {
  const [categories, setCategories] = useState([]);

  const getCategories = async () => {
    try {
      const { data } = await axios.get("/api/v1/category/get-category");
      
      if (data?.success) {
        setCategories(data?.category || data?.getCategory || []);
      }
    } catch (error) {
      console.log(error);
      setCategories([]); 
    }
  };

  useEffect(() => {
    getCategories();
  }, []);

  return categories;
}
