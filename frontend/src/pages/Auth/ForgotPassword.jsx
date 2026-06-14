import { useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import Layout from "../../components/Layout/Layout";
import axiosInstance from "../../api/axiosInstance";
import { HiMail, HiArrowLeft, HiCheckCircle } from "react-icons/hi";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) return toast.error("Please enter your email");

    setLoading(true);
    try {
      const { data } = await axiosInstance.post("/auth/forgot-password", {
        email,
      });
      if (data?.success) {
        setSent(true);
      } else {
        toast.error(data?.message || "Something went wrong");
      }
    } catch (err) {
      toast.error(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout title="Forgot Password — EliteMart">
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
          <Link
            to="/login"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              fontSize: 13,
              color: "var(--ink-soft)",
              textDecoration: "none",
              marginBottom: "1.5rem",
              transition: "color .15s",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.color = "var(--accent)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.color = "var(--ink-soft)")
            }
          >
            <HiArrowLeft style={{ fontSize: 14 }} /> Back to Sign In
          </Link>

          {!sent ? (
            /* Request form */
            <div className="panel">
              {/* Icon */}
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
                <HiMail style={{ fontSize: 24, color: "var(--accent)" }} />
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
                Forgot password?
              </h1>
              <p
                style={{
                  fontSize: 14,
                  color: "var(--ink-soft)",
                  lineHeight: 1.6,
                  marginBottom: "1.5rem",
                }}
              >
                Enter your email address and we'll send you a link to reset your
                password.
              </p>

              <form
                onSubmit={handleSubmit}
                style={{ display: "flex", flexDirection: "column", gap: 14 }}
              >
                <div>
                  <label className="form-label">Email address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="input-field"
                    required
                    autoFocus
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary"
                  style={{ padding: "12px 0", fontSize: 14, width: "100%" }}
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
                      Sending…
                    </span>
                  ) : (
                    "Send Reset Link"
                  )}
                </button>
              </form>

              <p
                style={{
                  textAlign: "center",
                  fontSize: 13,
                  color: "var(--ink-soft)",
                  marginTop: "1.25rem",
                }}
              >
                Remember your password?{" "}
                <Link
                  to="/login"
                  style={{
                    color: "var(--accent)",
                    fontWeight: 600,
                    textDecoration: "none",
                  }}
                >
                  Sign in
                </Link>
              </p>
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
                Check your inbox
              </h2>
              <p
                style={{
                  fontSize: 14,
                  color: "var(--ink-soft)",
                  lineHeight: 1.7,
                  marginBottom: "0.5rem",
                }}
              >
                We sent a password reset link to
              </p>
              <p
                style={{
                  fontSize: 14,
                  fontWeight: 600,
                  color: "var(--ink)",
                  marginBottom: "1.5rem",
                }}
              >
                {email}
              </p>
              <p
                style={{
                  fontSize: 12,
                  color: "var(--ink-faint)",
                  lineHeight: 1.6,
                  marginBottom: "1.75rem",
                }}
              >
                The link expires in 1 hour. Check your spam folder if you don't
                see it.
              </p>

              <button
                onClick={() => setSent(false)}
                className="btn-secondary"
                style={{ width: "100%", padding: "11px 0", fontSize: 13 }}
              >
                Resend email
              </button>

              <Link
                to="/login"
                style={{
                  display: "block",
                  textAlign: "center",
                  marginTop: 12,
                  fontSize: 13,
                  color: "var(--accent)",
                  fontWeight: 600,
                  textDecoration: "none",
                }}
              >
                Back to Sign In
              </Link>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default ForgotPassword;
