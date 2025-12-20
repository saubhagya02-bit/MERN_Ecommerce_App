import { createContext, useContext, useState, useEffect } from "react";
import axios from 'axios'

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  
  const [auth, setAuth] = useState({
    user: null,
    token: "",
  });

  axios.defaults.headers.common['Authorization'] = auth?.token;

  useEffect(() => {
    const data = localStorage.getItem("auth");
    if (data) {
      const parseData = JSON.parse(data);
      setAuth({
        user: parseData.user,
        token: parseData.token,
      });
    }
  }, []);


  useEffect(() => {
    localStorage.setItem("auth", JSON.stringify(auth));
  }, [auth]);

  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
