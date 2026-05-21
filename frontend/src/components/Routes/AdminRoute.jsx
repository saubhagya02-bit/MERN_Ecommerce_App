import { useState, useEffect } from "react";
import { Outlet, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  selectToken,
  selectAdminVerified,
  setAdminVerified,
} from "../../store/slices/authSlice";
import authService from "../../api/authService";
import Spinner from "../common/Spinner";

const AdminRoute = () => {
  const dispatch = useDispatch();
  const token = useSelector(selectToken);
  const verified = useSelector(selectAdminVerified);
  const [loading, setLoading] = useState(verified === null);

  useEffect(() => {
    if (!token) {
      dispatch(setAdminVerified(false));
      setLoading(false);
      return;
    }
    if (verified !== null) {
      setLoading(false);
      return;
    }

    authService
      .checkAdminAuth()
      .then(({ data }) => dispatch(setAdminVerified(!!data?.ok)))
      .catch(() => dispatch(setAdminVerified(false)))
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

export default AdminRoute;
