import { useState } from "react";
import { createPortal } from "react-dom";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import { LogOut } from "lucide-react";
import { API_BASE_URL } from "../../apiConfig";
import "./login.css";

const API = `${API_BASE_URL}/auth`;

export default function AuthModal() {
    const { user, login, logout, loginModalOpen, closeLogin, openLogin } = useAuth();
    const [view, setView] = useState("login");

    // form fields
    const [name, setName]           = useState("");
    const [email, setEmail]         = useState("");
    const [password, setPassword]   = useState("");
    const [otp, setOtp]             = useState("");
    const [newPass, setNewPass]     = useState("");
    const [pendingEmail, setPendingEmail] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError]     = useState("");
    const [success, setSuccess] = useState("");

    const reset = () => { setError(""); setSuccess(""); };

    const closeModal = () => {
        closeLogin();
        setView("login");
        reset();
        setName(""); setEmail(""); setPassword(""); setOtp(""); setNewPass("");
    };

    // ── Login ──
    const handleLogin = async (e) => {
        e.preventDefault();
        reset(); setLoading(true);
        try {
            const res = await axios.post(`${API}/login`, { email, password });
            login(res.data.user, res.data.token);
            closeModal();
        } catch (err) {
            if (err.response?.data?.unverified) {
                setPendingEmail(err.response.data.email || email);
                setSuccess(err.response.data.error || "Please verify your email with the OTP sent.");
                setView("verify-otp");
            } else {
                setError(err.response?.data?.error || "Login failed");
            }
        } finally { setLoading(false); }
    };

    // ── Resend OTP ──
    const handleResendOtp = async () => {
        reset(); setLoading(true);
        try {
            const res = await axios.post(`${API}/resend-otp`, { email: pendingEmail });
            setSuccess(res.data.message || "New OTP sent to your email.");
        } catch (err) {
            setError(err.response?.data?.error || "Failed to resend OTP");
        } finally { setLoading(false); }
    };

    // ── Register ──
    const handleRegister = async (e) => {
        e.preventDefault();
        reset(); setLoading(true);
        try {
            await axios.post(`${API}/register`, { name, email, password });
            setPendingEmail(email);
            setSuccess("OTP sent to your email. Please verify.");
            setView("verify-otp");
        } catch (err) {
            setError(err.response?.data?.error || "Registration failed");
        } finally { setLoading(false); }
    };

    // ── Verify OTP (after register) ──
    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        reset(); setLoading(true);
        try {
            const res = await axios.post(`${API}/verify-otp`, { email: pendingEmail, otp });
            login(res.data.user, res.data.token);
            closeModal();
        } catch (err) {
            setError(err.response?.data?.error || "OTP verification failed");
        } finally { setLoading(false); }
    };

    // ── Forgot password ──
    const handleForgot = async (e) => {
        e.preventDefault();
        reset(); setLoading(true);
        try {
            await axios.post(`${API}/forgot-password`, { email });
            setPendingEmail(email);
            setSuccess("OTP sent to your email.");
            setView("reset-otp");
        } catch (err) {
            setError(err.response?.data?.error || "Failed to send OTP");
        } finally { setLoading(false); }
    };

    // ── Reset password ──
    const handleReset = async (e) => {
        e.preventDefault();
        reset(); setLoading(true);
        try {
            await axios.post(`${API}/reset-password`, { email: pendingEmail, otp, newPassword: newPass });
            setSuccess("Password reset! Please login.");
            setView("login");
        } catch (err) {
            setError(err.response?.data?.error || "Reset failed");
        } finally { setLoading(false); }
    };

    // ── If logged in show user avatar + logout ──
    if (user) {
        return (
            <div className="auth-user">
                <div className="auth-avatar">{user.name.charAt(0).toUpperCase()}</div>
                <button className="login-btn logout-btn" onClick={logout}>
                    <LogOut size={15} /> Logout
                </button>
            </div>
        );
    }

    const modal = (
        <div className="modal" onClick={(e) => { if (e.target.className === "modal") closeModal(); }}>
            <div className="modal-content">
                <span className="close" onClick={closeModal}>&times;</span>

                {error   && <div className="auth-error">{error}</div>}
                {success && <div className="auth-success">{success}</div>}

                {/* LOGIN */}
                {view === "login" && (
                    <>
                        <h2>Trader's Street</h2>
                        <p className="subtitle">Sign in to your account</p>
                        <form onSubmit={handleLogin}>
                            <div className="input-group">
                                <input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
                                <label>Email</label>
                            </div>
                            <div className="input-group">
                                <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
                                <label>Password</label>
                            </div>
                            <p className="link-text" onClick={() => { reset(); setView("forgot"); }}>Forgot Password?</p>
                            <button className="submit-btn" disabled={loading}>{loading ? "Signing in..." : "Login"}</button>
                        </form>
                        <p className="switch-text">Don't have an account?{" "}
                            <span onClick={() => { reset(); setView("signup"); }}>Sign Up</span>
                        </p>
                    </>
                )}

                {/* SIGNUP */}
                {view === "signup" && (
                    <>
                        <h2>Create Account</h2>
                        <p className="subtitle">Join Trader's Street</p>
                        <form onSubmit={handleRegister}>
                            <div className="input-group">
                                <input type="text" value={name} onChange={e => setName(e.target.value)} required />
                                <label>Name</label>
                            </div>
                            <div className="input-group">
                                <input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
                                <label>Email</label>
                            </div>
                            <div className="input-group">
                                <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
                                <label>Password</label>
                            </div>
                            <button className="submit-btn" disabled={loading}>{loading ? "Registering..." : "Sign Up"}</button>
                        </form>
                        <p className="switch-text">Already have an account?{" "}
                            <span onClick={() => { reset(); setView("login"); }}>Login</span>
                        </p>
                    </>
                )}

                {/* VERIFY OTP (after register or unverified login) */}
                {view === "verify-otp" && (
                    <>
                        <h2>Verify Email</h2>
                        <p className="subtitle">Enter the OTP sent to {pendingEmail}</p>
                        <form onSubmit={handleVerifyOtp}>
                            <div className="input-group">
                                <input type="text" maxLength={6} value={otp} onChange={e => setOtp(e.target.value)} required />
                                <label>OTP</label>
                            </div>
                            <button className="submit-btn" disabled={loading}>{loading ? "Verifying..." : "Verify"}</button>
                        </form>
                        <p className="switch-text">
                            Didn't get the code?{" "}
                            <span onClick={handleResendOtp}>Resend OTP</span>
                        </p>
                        <p className="switch-text">
                            <span onClick={() => { reset(); setView("login"); }}>Back to Login</span>
                        </p>
                    </>
                )}

                {/* FORGOT PASSWORD */}
                {view === "forgot" && (
                    <>
                        <h2>Reset Password</h2>
                        <p className="subtitle">Enter your registered email</p>
                        <form onSubmit={handleForgot}>
                            <div className="input-group">
                                <input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
                                <label>Email</label>
                            </div>
                            <button className="submit-btn" disabled={loading}>{loading ? "Sending..." : "Send OTP"}</button>
                        </form>
                        <p className="switch-text"><span onClick={() => { reset(); setView("login"); }}>Back to Login</span></p>
                    </>
                )}

                {/* RESET PASSWORD with OTP */}
                {view === "reset-otp" && (
                    <>
                        <h2>New Password</h2>
                        <p className="subtitle">Enter OTP and your new password</p>
                        <form onSubmit={handleReset}>
                            <div className="input-group">
                                <input type="text" maxLength={6} value={otp} onChange={e => setOtp(e.target.value)} required />
                                <label>OTP</label>
                            </div>
                            <div className="input-group">
                                <input type="password" value={newPass} onChange={e => setNewPass(e.target.value)} required />
                                <label>New Password</label>
                            </div>
                            <button className="submit-btn" disabled={loading}>{loading ? "Resetting..." : "Reset Password"}</button>
                        </form>
                    </>
                )}
            </div>
        </div>
    );

    return (
        <div>
            <button className="login-btn" onClick={openLogin}>Login</button>
            {loginModalOpen && createPortal(modal, document.body)}
        </div>
    );
}
