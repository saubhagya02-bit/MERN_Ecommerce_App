import { useState, useEffect } from "react";
import { Outlet, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  selectToken,
  selectAuthVerified,
  setAuthVerified,
} from "../../store/slices/authSlice";
import authService from "../../api/authService";
import Spinner from "../common/Spinner";

const PrivateRoute = () => {
  const dispatch = useDispatch();
  const token = useSelector(selectToken);

  const verified = useSelector(selectAuthVerified);
  const [loading, setLoading] = useState(verified === null);

  useEffect(() => {
    if (!token) {
      dispatch(setAuthVerified(false));
      setLoading(false);
      return;
    }
    if (verified !== null) {
      setLoading(false);
      return;
    }

    authService
      .checkUserAuth()
      .then(({ data }) => dispatch(setAuthVerified(!!data?.ok)))
      .catch(() => dispatch(setAuthVerified(false)))
      .finally(() => setLoading(false));
  }, [token]);

  if (loading)
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "60vh",
        }}
      >
        <div className="spinner" />
      </div>
    );
  return verified ? <Outlet /> : <Navigate replace to="/login" />;
};

export default PrivateRoute;
