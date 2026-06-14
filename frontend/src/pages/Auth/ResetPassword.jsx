import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import Layout from "../../components/Layout/Layout";
import axiosInstance from "../../api/axiosInstance";
import { HiLockClosed, HiCheckCircle, HiEye, HiEyeOff } from "react-icons/hi";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ newPassword: "", confirm: "" });
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const [showCf, setShowCf] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.newPassword.length < 6)
      return toast.error("Password must be at least 6 characters");
    if (form.newPassword !== form.confirm)
      return toast.error("Passwords do not match");

    setLoading(true);
    try {
      const { data } = await axiosInstance.post(
        `/auth/reset-password/${token}`,
        { newPassword: form.newPassword },
      );
      if (data?.success) {
        setDone(true);
        setTimeout(() => navigate("/login"), 3000);
      } else {
        toast.error(data?.message || "Reset failed");
      }
    } catch (err) {
      toast.error(err.message || "Reset link is invalid or has expired");
    } finally {
      setLoading(false);
    }
  };

  const inputBox = (name, placeholder, show, toggleShow) => (
    <div style={{ position: "relative" }}>
      <input
        type={show ? "text" : "password"}
        value={form[name]}
        onChange={(e) => setForm((p) => ({ ...p, [name]: e.target.value }))}
        placeholder={placeholder}
        className="input-field"
        required
        minLength={6}
        style={{ paddingRight: 40 }}
      />
      <button
        type="button"
        onClick={toggleShow}
        style={{
          position: "absolute",
          right: 12,
          top: "50%",
          transform: "translateY(-50%)",
          background: "none",
          border: "none",
          cursor: "pointer",
          color: "var(--ink-faint)",
          fontSize: 16,
          display: "flex",
        }}
      >
        {show ? <HiEyeOff /> : <HiEye />}
      </button>
    </div>
  );

  return (
    <Layout title="Reset Password — EliteMart">
      <div
        style={{
          minHeight: "80vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "2rem 1rem",
        }}
      >
        <div style={{ width: "100%", maxWidth: 420 }}>
          {!done ? (
            <div className="panel">
              <div
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: "50%",
                  background: "var(--accent-lt)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "1.25rem",
                }}
              >
                <HiLockClosed
                  style={{ fontSize: 22, color: "var(--accent)" }}
                />
              </div>

              <h1
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "1.5rem",
                  fontWeight: 700,
                  color: "var(--ink)",
                  letterSpacing: "-.02em",
                  marginBottom: 8,
                }}
              >
                Create new password
              </h1>
              <p
                style={{
                  fontSize: 14,
                  color: "var(--ink-soft)",
                  lineHeight: 1.6,
                  marginBottom: "1.5rem",
                }}
              >
                Your new password must be at least 6 characters.
              </p>

              <form
                onSubmit={handleSubmit}
                style={{ display: "flex", flexDirection: "column", gap: 14 }}
              >
                <div>
                  <label className="form-label">New password</label>
                  {inputBox("newPassword", "Min. 6 characters", showPw, () =>
                    setShowPw((s) => !s),
                  )}
                </div>
                <div>
                  <label className="form-label">Confirm new password</label>
                  {inputBox("confirm", "Repeat your password", showCf, () =>
                    setShowCf((s) => !s),
                  )}
                </div>

                {form.newPassword && (
                  <div style={{ display: "flex", gap: 4 }}>
                    {[1, 2, 3, 4].map((n) => (
                      <div
                        key={n}
                        style={{
                          flex: 1,
                          height: 3,
                          borderRadius: 2,
                          background:
                            form.newPassword.length >= n * 2
                              ? n <= 1
                                ? "var(--danger)"
                                : n <= 2
                                  ? "#F59E0B"
                                  : n <= 3
                                    ? "#3B82F6"
                                    : "var(--success)"
                              : "var(--stone)",
                        }}
                      />
                    ))}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary"
                  style={{
                    padding: "12px 0",
                    fontSize: 14,
                    width: "100%",
                    marginTop: 4,
                  }}
                >
                  {loading ? (
                    <span
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 8,
                      }}
                    >
                      <span
                        style={{
                          width: 14,
                          height: 14,
                          border: "2px solid rgba(255,255,255,.4)",
                          borderTopColor: "#fff",
                          borderRadius: "50%",
                          animation: "spin .7s linear infinite",
                          display: "inline-block",
                        }}
                      />
                      Resetting…
                    </span>
                  ) : (
                    "Reset Password"
                  )}
                </button>
              </form>
            </div>
          ) : (
            /* Success state */
            <div className="panel" style={{ textAlign: "center" }}>
              <div
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: "50%",
                  background: "#DCFCE7",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 1.25rem",
                }}
              >
                <HiCheckCircle
                  style={{ fontSize: 32, color: "var(--success)" }}
                />
              </div>

              <h2
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "1.35rem",
                  fontWeight: 700,
                  color: "var(--ink)",
                  marginBottom: 10,
                }}
              >
                Password reset!
              </h2>
              <p
                style={{
                  fontSize: 14,
                  color: "var(--ink-soft)",
                  lineHeight: 1.7,
                  marginBottom: "1.5rem",
                }}
              >
                Your password has been updated successfully. Redirecting you to
                sign in…
              </p>

              <Link
                to="/login"
                className="btn-primary"
                style={{
                  display: "block",
                  padding: "12px 0",
                  fontSize: 14,
                  textAlign: "center",
                  textDecoration: "none",
                }}
              >
                Sign In Now
              </Link>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default ResetPassword;
