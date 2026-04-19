import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectToken } from "../../store/slices/authSlice";
import authService from "../../api/authService";
import Spinner from "../common/Spinner";

const PrivateRoute = () => {
  const [ok, setOk]   = useState(false);
  const [loading, setLoading] = useState(true);
  const token = useSelector(selectToken);

  useEffect(() => {
    if (!token) {
      setOk(false);
      setLoading(false);
      return;
    }
    const check = async () => {
      try {
        const { data } = await authService.checkUserAuth();
        setOk(data.ok);
      } catch {
        setOk(false);
      } finally {
        setLoading(false);
      }
    };
    check();
  }, [token]);

  if (loading) return <Spinner path="login" />;
  return ok ? <Outlet /> : <Spinner path="login" />;
};

export default PrivateRoute;