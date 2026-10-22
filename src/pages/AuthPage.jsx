import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { User, Mail, Phone, Lock, Eye, EyeOff, UserPlus, LogIn, CheckCircle2, AlertCircle } from "lucide-react";
import { useApp } from "../context/AppContext";

// ── Gift Box Line Art Icon for Logo (exact match to reference image) ───────────
const LogoGiftIcon = () => (
  <svg
    viewBox="0 0 44 44"
    className="w-10 h-10 text-[#632736]"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {/* Main gift box */}
    <rect x="9" y="18" width="26" height="18" rx="2" fill="#FAF6EE" stroke="#632736" strokeWidth="1.6" />
    {/* Gift box lid */}
    <rect x="7" y="14" width="30" height="4.5" rx="1.2" fill="#FAF6EE" stroke="#632736" strokeWidth="1.6" />
    {/* Vertical ribbon */}
    <line x1="22" y1="14" x2="22" y2="36" stroke="#632736" strokeWidth="1.8" />
    {/* Horizontal ribbon on lid */}
    <line x1="7" y1="16.2" x2="37" y2="16.2" stroke="#632736" strokeWidth="1.6" />
    {/* Left ribbon loop */}
    <path
      d="M22 14 C19.5 7, 11.5 7.5, 14 12.5 C15.8 13.8, 19 14, 22 14 Z"
      fill="#632736"
      fillOpacity="0.18"
      stroke="#632736"
      strokeWidth="1.5"
    />
    {/* Right ribbon loop */}
    <path
      d="M22 14 C24.5 7, 32.5 7.5, 30 12.5 C28.2 13.8, 25 14, 22 14 Z"
      fill="#632736"
      fillOpacity="0.18"
      stroke="#632736"
      strokeWidth="1.5"
    />
    {/* Center knot */}
    <circle cx="22" cy="14" r="1.5" fill="#632736" />
  </svg>
);

const FormInputBox = ({
  icon: Icon,
  label,
  name,
  type = "text",
  placeholder,
  value,
  onChange,
  showToggle = false,
  showPass = false,
  onTogglePass,
  required = false,
  maxLength,
  inputMode,
  pattern
}) => (
  <div className="bg-[#FAF5EC] border border-[#DDD0C2] hover:border-[#CD97A5] focus-within:border-[#632736] focus-within:ring-1 focus-within:ring-[#632736]/20 rounded-xl px-3 py-1.5 sm:py-2 flex items-center gap-3 transition-colors">
    <div className="text-[#5A382A] shrink-0">
      <Icon size={16} strokeWidth={2} />
    </div>
    <div className="flex-1 min-w-0">
      <label className="block text-[10.5px] sm:text-[11px] font-bold text-[#3B1822] tracking-wide leading-tight select-none antialiased">
        {label}
      </label>
      <input
        type={showToggle ? (showPass ? "text" : "password") : type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        maxLength={maxLength}
        inputMode={inputMode}
        pattern={pattern}
        autoComplete={type === "password" ? "new-password" : "off"}
        className="w-full bg-transparent text-[13px] sm:text-[13px] text-[#3B1822] placeholder:text-[#857468] font-medium border-0 outline-none p-0 mt-0.5 leading-tight antialiased"
      />
    </div>
    {showToggle && (
      <button
        type="button"
        onClick={onTogglePass}
        tabIndex={-1}
        className="text-[#8E7E73] hover:text-[#632736] p-1 transition-colors shrink-0 cursor-pointer"
        title={showPass ? "Hide password" : "Show password"}
      >
        {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
      </button>
    )}
  </div>
);

export const AuthPage = ({ initialMode = "register" }) => {
  const { registerUser, loginUser, currentUser } = useApp();
  const navigate = useNavigate();
  const location = useLocation();

  // Mode: "register" | "login"
  const [mode, setMode] = useState(() => {
    if (location.pathname === "/login") return "login";
    return initialMode || "register";
  });

  // 3D Flip animation state
  const [flipping, setFlipping] = useState(false);

  // Success state: null | "registered" | "loggedIn"
  const [successState, setSuccessState] = useState(null);

  // Error message
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Password visibility
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [showLoginPass, setShowLoginPass] = useState(false);

  // Remember me checkbox
  const [rememberMe, setRememberMe] = useState(false);

  // Form states
  const [registerForm, setRegisterForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: ""
  });

  const [loginForm, setLoginForm] = useState({
    email: "",
    password: ""
  });

  // Sync mode with route changes and clear form inputs after logout
  useEffect(() => {
    if (location.pathname === "/login") {
      setMode("login");
    } else if (location.pathname === "/register") {
      setMode("register");
    }

    if (!currentUser) {
      setRegisterForm({
        name: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: ""
      });
      setLoginForm({
        email: "",
        password: ""
      });
      setError("");
      setSuccessState(null);
      setShowPass(false);
      setShowConfirmPass(false);
      setShowLoginPass(false);
    }
  }, [location.pathname, currentUser]);

  // Flip smoothly between Register and Login
  const flipTo = (targetMode) => {
    if (flipping || mode === targetMode) return;
    setError("");
    setFlipping(true);

    setTimeout(() => {
      setMode(targetMode);
      setFlipping(false);
      window.history.replaceState(null, "", targetMode === "login" ? "/login" : "/register");
    }, 300);
  };

  // ── Handle Registration ──────────────────────────────────────────────────
  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    const { name, email, phone, password, confirmPassword } = registerForm;

    // Field validation
    if (!name.trim()) {
      return setError("Please enter your full name.");
    }
    if (name.trim().length < 2) {
      return setError("Please enter a valid full name (at least 2 letters).");
    }
    if (!email.trim()) {
      return setError("Please enter your email address.");
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return setError("Please enter a valid email address.");
    }
    if (!phone.trim()) {
      return setError("Please enter your 10-digit mobile number.");
    }
    const cleanPhone = phone.replace(/\D/g, "");
    if (cleanPhone.length !== 10) {
      return setError("Mobile number must be exactly 10 digits (no letters or special characters).");
    }
    if (!password) {
      return setError("Please enter a password.");
    }
    if (password.length < 6) {
      return setError("Password must be at least 6 characters.");
    }
    if (password !== confirmPassword) {
      return setError("Passwords do not match. Please verify both passwords.");
    }

    setLoading(true);

    try {
      const result = await registerUser({
        name: name.trim(),
        email: email.trim(),
        password,
        phone: phone.trim()
      });

      setLoading(false);

      if (result.success) {
        // Step 2: Show "Successfully Registered!" message for EXACTLY 2 seconds
        setSuccessState("registered");

        setTimeout(() => {
          setSuccessState(null);
          // Step 2 cont.: After 2 seconds, smoothly flip/rotate the form page and automatically display Login form
          setFlipping(true);

          setTimeout(() => {
            setMode("login");
            setLoginForm({ email: email.trim(), password: "" });
            setRegisterForm({ name: "", email: "", phone: "", password: "", confirmPassword: "" });
            window.history.replaceState(window.history.state, "", "/login");
            setFlipping(false);
          }, 300);
        }, 2000);
      } else {
        setError(result.message || "Registration failed. Please try again.");
      }
    } catch {
      setLoading(false);
      setError("An unexpected error occurred during registration. Please try again.");
    }
  };

  // ── Handle Login ─────────────────────────────────────────────────────────
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    const { email, password } = loginForm;

    if (!email.trim()) {
      return setError("Please enter your email address.");
    }
    if (!password) {
      return setError("Please enter your password.");
    }

    setLoading(true);

    try {
      const result = await loginUser(email.trim(), password);
      setLoading(false);

      if (result.success) {
        // Step 3: Show "Successfully Logged In!" message for EXACTLY 1 second
        setSuccessState("loggedIn");

        setTimeout(() => {
          setSuccessState(null);
          // Step 3 cont.: After 1 second, automatically redirect user to User Panel / User Dashboard or attempted checkout
          if (result.isAdmin) {
            navigate("/admin");
          } else {
            const destination = location.state?.from?.pathname || location.state?.from || "/my-account";
            navigate(destination, { replace: true });
          }
        }, 1000);
      } else {
        setError(result.message || "Invalid credentials. Please check your email and password.");
      }
    } catch {
      setLoading(false);
      setError("An error occurred during login. Please try again.");
    }
  };

  const handleForgotPassword = () => {
    alert("For password reset assistance, please contact our support at ruchicreation@gmail.com or via WhatsApp at +91 9511112616.");
  };

  return (
    <div
      className="relative min-h-[calc(100vh-80px)] flex items-center justify-center overflow-hidden py-8 px-4 sm:px-6 lg:px-8"
      style={{
        background: "radial-gradient(ellipse at 48% 45%, #EFE4D5 0%, #E7D7C4 55%, #DDCABA 100%)"
      }}
    >
      {/* ── Background Corner Decorative Elements (Pure Clean Images) ───────── */}
      {/* Top Left Botanical Branch */}
      <img
        src="/auth/foliage_tl_feathered.png"
        alt=""
        className="absolute top-0 left-0 w-24 sm:w-32 md:w-44 pointer-events-none select-none z-0 mix-blend-multiply opacity-80"
      />

      {/* Top Right Botanical Branch */}
      <img
        src="/auth/foliage_tr_feathered.png"
        alt=""
        className="absolute top-0 right-0 w-24 sm:w-32 md:w-44 pointer-events-none select-none z-0 mix-blend-multiply opacity-80"
      />

      {/* Bottom Left Wrapped Kraft Gift Box with Burgundy Ribbon & Ruchi Creation Tag */}
      <img
        src="/auth/giftbox_feathered.png"
        alt="Ruchi Creation Gift"
        className="absolute bottom-0 left-0 w-36 sm:w-48 md:w-60 lg:w-[270px] pointer-events-none select-none z-0"
      />

      {/* Bottom Right Flowers and Rosebuds */}
      <img
        src="/auth/flowers_feathered.png"
        alt="Floral Decor"
        className="absolute bottom-0 right-0 w-24 sm:w-32 md:w-44 lg:w-[195px] pointer-events-none select-none z-0"
      />

      {/* ── Main Layout: Side Calligraphy + Card ──────────────────────── */}
      <div className="relative z-10 w-full max-w-4xl mx-auto flex flex-col lg:flex-row items-center justify-center lg:justify-between gap-6 lg:gap-10">
        
        {/* Left Side Decorative Calligraphy & Message (Desktop) */}
        <div className="hidden lg:flex flex-col justify-start min-w-[270px] max-w-[300px] select-none text-left pl-2 pt-6 self-start mt-6">
          {mode === "register" ? (
            <div className="transition-all duration-300 animate-fadeIn">
              <h2
                className="text-[48px] xl:text-[54px] text-[#4A1521] leading-[1.04] tracking-wide"
                style={{ fontFamily: '"Alex Brush", "Great Vibes", cursive' }}
              >
                Create<br />
                Beautiful<br />
                Moments <span className="text-2xl text-[#632736]">♥</span>
              </h2>
              {/* Delicate curved underline */}
              <svg className="w-28 h-2.5 text-[#632736]/70 mt-1 mb-3.5" viewBox="0 0 120 10" fill="none">
                <path d="M2 7 C 35 11, 85 2, 118 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
              <p className="text-[13px] xl:text-sm text-[#5A4237] leading-relaxed font-normal">
                Join Ruchi Creation<br />
                and be a part of our<br />
                special journey.
              </p>
            </div>
          ) : (
            <div className="transition-all duration-300 animate-fadeIn">
              <h2
                className="text-[44px] xl:text-[50px] text-[#4A1521] leading-tight tracking-wide whitespace-nowrap"
                style={{ fontFamily: '"Alex Brush", "Great Vibes", cursive' }}
              >
                Welcome Back
              </h2>
              {/* Delicate curved underline with heart at end (matching reference image) */}
              <div className="flex items-center gap-2 mt-1 mb-3.5">
                <svg className="w-24 h-2.5 text-[#632736]/70" viewBox="0 0 100 10" fill="none">
                  <path d="M2 7 C 30 11, 70 2, 98 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
                <span className="text-sm text-[#632736]">♥</span>
              </div>
              <p className="text-[13px] xl:text-sm text-[#5A4237] leading-relaxed font-normal">
                Login to your account<br />
                and continue your<br />
                special journey with<br />
                Ruchi Creation.
              </p>
            </div>
          )}
        </div>

        {/* ── Center-Right Card Container (Tack-Sharp & Clear on All Devices) ────────────────────────────── */}
        <div
          className="w-full max-w-[390px] sm:max-w-[410px]"
          style={flipping ? { perspective: "1500px" } : undefined}
        >
          {/* Card Element */}
          <div
            className="w-full transition-transform duration-300 ease-in-out"
            style={{
              transform: flipping ? "rotateY(90deg)" : "none",
              transformStyle: flipping ? "preserve-3d" : "flat",
              transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              WebkitFontSmoothing: "antialiased",
              MozOsxFontSmoothing: "grayscale",
              textRendering: "optimizeLegibility"
            }}
          >
            <div className={`relative bg-[#FAF6EE] rounded-[28px] p-6 sm:p-7 shadow-[0_20px_50px_rgba(70,25,35,0.08)] border border-[#E5DACD]/80 overflow-hidden select-text antialiased ${mode === 'login' ? 'min-h-[440px] flex flex-col justify-between' : ''}`}>
              
              {/* Success Overlay: Exactly 2s for Register, 1s for Login */}
              {successState && (
                <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-[#FAF6EE] rounded-[28px] animate-auth-success-pop p-6 text-center">
                  <div className="w-16 h-16 rounded-full bg-emerald-50 border-2 border-emerald-200 flex items-center justify-center animate-auth-check-pop shadow-md mb-3">
                    <CheckCircle2 size={38} className="text-emerald-600" />
                  </div>
                  <h3 className="font-serif font-bold text-xl sm:text-2xl text-[#3B1822]">
                    {successState === "registered" ? "Successfully Registered!" : "Successfully Logged In!"}
                  </h3>
                  <p className="text-xs text-[#7D6B60] mt-1.5 font-medium">
                    {successState === "registered"
                      ? "Opening login form…"
                      : "Redirecting to your dashboard…"}
                  </p>
                </div>
              )}

              {/* ── Card Header (Logo + Brand + Tagline) ───────────────── */}
              <div className="flex flex-col items-center text-center">
                <LogoGiftIcon />
                <h1 className="font-serif font-bold text-xl sm:text-[22px] text-[#3B1822] tracking-normal mt-1 leading-tight">
                  Ruchi Creation
                </h1>
                <p className="text-[10px] text-[#5A4237] tracking-wider -mt-0.5 font-medium">
                  Handmade with love ♥
                </p>
              </div>

              {/* ── Title & Subtitle ───────────────────────────────────── */}
              <div className="text-center mt-3 mb-3.5">
                <h2 className="font-serif font-bold text-xl sm:text-[22px] text-[#3B1822] leading-tight">
                  {mode === "register" ? "Create Your Account" : "Login to Your Account"}
                </h2>
                <p className="text-[11px] text-[#7A675B] mt-0.5">
                  {mode === "register"
                    ? "Fill in your details to register"
                    : "Enter your details to continue"}
                </p>
              </div>

              {/* ── Error Alert ────────────────────────────────────────── */}
              {error && (
                <div className="mb-2.5 px-3 py-1.5 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600 text-left flex items-start gap-2 animate-fadeIn">
                  <AlertCircle size={14} className="shrink-0 mt-0.5 text-red-500" />
                  <span className="flex-1 leading-tight text-[11px]">{error}</span>
                </div>
              )}

              {/* ── REGISTER FORM ──────────────────────────────────────── */}
              {mode === "register" && (
                <form onSubmit={handleRegister} className="space-y-2 text-left" noValidate>
                  {/* Full Name */}
                  <FormInputBox
                    icon={User}
                    label="Full Name"
                    name="name"
                    placeholder="Enter your full name"
                    value={registerForm.name}
                    onChange={(e) => setRegisterForm({ ...registerForm, name: e.target.value })}
                    required
                  />

                  {/* Email Address */}
                  <FormInputBox
                    icon={Mail}
                    label="Email Address"
                    name="email"
                    type="email"
                    placeholder="Enter your email address"
                    value={registerForm.email}
                    onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
                    required
                  />

                  {/* Mobile Number */}
                  <FormInputBox
                    icon={Phone}
                    label="Mobile Number"
                    name="phone"
                    type="tel"
                    placeholder="Enter 10-digit mobile number"
                    value={registerForm.phone}
                    onChange={(e) => {
                      const digitsOnly = e.target.value.replace(/\D/g, "").slice(0, 10);
                      setRegisterForm({ ...registerForm, phone: digitsOnly });
                    }}
                    maxLength={10}
                    inputMode="numeric"
                    pattern="[0-9]*"
                    required
                  />

                  {/* Password */}
                  <FormInputBox
                    icon={Lock}
                    label="Password"
                    name="password"
                    type="password"
                    placeholder="Enter your password"
                    value={registerForm.password}
                    onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
                    showToggle
                    showPass={showPass}
                    onTogglePass={() => setShowPass(!showPass)}
                    required
                  />

                  {/* Confirm Password */}
                  <FormInputBox
                    icon={Lock}
                    label="Confirm Password"
                    name="confirmPassword"
                    type="password"
                    placeholder="Confirm your password"
                    value={registerForm.confirmPassword}
                    onChange={(e) => setRegisterForm({ ...registerForm, confirmPassword: e.target.value })}
                    showToggle
                    showPass={showConfirmPass}
                    onTogglePass={() => setShowConfirmPass(!showConfirmPass)}
                    required
                  />

                  {/* Register Submit Button */}
                  <button
                    type="submit"
                    disabled={loading || !!successState}
                    className="w-full mt-2.5 py-2.5 sm:py-3 bg-[#632736] hover:bg-[#4D1B28] text-white text-xs sm:text-sm font-semibold rounded-xl shadow-md shadow-[#632736]/20 flex items-center justify-center gap-2 transition-all duration-200 active:scale-[0.99] disabled:opacity-75 cursor-pointer"
                  >
                    <UserPlus size={15} />
                    <span>{loading ? "Registering…" : "Register"}</span>
                  </button>
                </form>
              )}

              {/* ── LOGIN FORM ─────────────────────────────────────────── */}
              {mode === "login" && (
                <form onSubmit={handleLogin} className="space-y-2.5 text-left" noValidate>
                  {/* Email Address */}
                  <FormInputBox
                    icon={Mail}
                    label="Email Address"
                    name="email"
                    type="email"
                    placeholder="Enter your email address"
                    value={loginForm.email}
                    onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                    required
                  />

                  {/* Password */}
                  <FormInputBox
                    icon={Lock}
                    label="Password"
                    name="password"
                    type="password"
                    placeholder="Enter your password"
                    value={loginForm.password}
                    onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                    showToggle
                    showPass={showLoginPass}
                    onTogglePass={() => setShowLoginPass(!showLoginPass)}
                    required
                  />

                  {/* Remember Me & Forgot Password */}
                  <div className="flex items-center justify-between text-xs text-[#5A382A] pt-0.5 px-0.5">
                    <label className="flex items-center gap-1.5 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="w-3.5 h-3.5 rounded border-[#DDD0C2] accent-[#632736] cursor-pointer"
                      />
                      <span className="text-[11.5px] text-[#3B1822]">Remember Me</span>
                    </label>
                    <button
                      type="button"
                      onClick={handleForgotPassword}
                      className="text-[11.5px] font-semibold text-[#5A382A] hover:text-[#632736] transition-colors cursor-pointer"
                    >
                      Forgot Password?
                    </button>
                  </div>

                  {/* Login Submit Button */}
                  <button
                    type="submit"
                    disabled={loading || !!successState}
                    className="w-full mt-2 py-2.5 sm:py-3 bg-[#632736] hover:bg-[#4D1B28] text-white text-xs sm:text-sm font-semibold rounded-xl shadow-md shadow-[#632736]/20 flex items-center justify-center gap-2 transition-all duration-200 active:scale-[0.99] disabled:opacity-75 cursor-pointer"
                  >
                    <LogIn size={15} />
                    <span>{loading ? "Logging In…" : "Login"}</span>
                  </button>
                </form>
              )}

              {/* ── Bottom Switch Link (matching reference divider line) ─ */}
              <div className="relative flex items-center justify-center mt-4 mb-0.5">
                <div className="w-full border-t border-[#DDD0C2]/80"></div>
                <span className="absolute px-3 bg-[#FAF6EE] text-[11px] text-[#7D6B60] whitespace-nowrap">
                  {mode === "register" ? (
                    <>
                      Already have an account?{" "}
                      <button
                        type="button"
                        onClick={() => flipTo("login")}
                        className="font-bold text-[#632736] hover:underline transition-colors ml-0.5 cursor-pointer"
                      >
                        Login
                      </button>
                    </>
                  ) : (
                    <>
                      Don't have an account?{" "}
                      <button
                        type="button"
                        onClick={() => flipTo("register")}
                        className="font-bold text-[#632736] hover:underline transition-colors ml-0.5 cursor-pointer"
                      >
                        Register
                      </button>
                    </>
                  )}
                </span>
              </div>

            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
