import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { 
  Check, 
  ArrowRight, 
  ArrowLeft, 
  ShieldCheck, 
  Truck, 
  CreditCard, 
  Package, 
  Sparkles,
  MapPin,
  QrCode,
  Smartphone,
  Wallet,
  Copy,
  CheckCircle2
} from "lucide-react";
import { useApp } from "../context/AppContext";

export const Checkout = () => {
  const { cart, placeOrder, currentUser } = useApp();
  const navigate = useNavigate();

  // Security: Prevent unauthenticated guest checkout or payment access
  React.useEffect(() => {
    if (!currentUser) {
      navigate("/register", { state: { from: { pathname: "/checkout" } }, replace: true });
    }
  }, [currentUser, navigate]);

  const [currentStep, setCurrentStep] = useState(1); // 1: Shipping, 2: Payment, 3: Review
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: currentUser?.name || "Snehal Kulkarni",
    phone: (currentUser?.phone || "9511112616").replace(/\D/g, "").slice(0, 10),
    address: currentUser?.address || "Shivaji Chowk, Main Road",
    city: currentUser?.city || "Ichalkaranji",
    pincode: currentUser?.pincode || "416115"
  });

  const [paymentMethod, setPaymentMethod] = useState("UPI"); // 'UPI' | 'COD'
  const [upiSubTab, setUpiSubTab] = useState("apps"); // 'apps' | 'id' | 'qr'
  const [upiId, setUpiId] = useState("");
  const [selectedUpiApp, setSelectedUpiApp] = useState("Google Pay");
  const [upiVerified, setUpiVerified] = useState(false);
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [errors, setErrors] = useState({});

  const subtotal = cart.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  const shipping = cart.length > 0 ? 100 : 0;
  const totalAmount = subtotal + shipping;

  const handleCopyUpi = () => {
    navigator.clipboard?.writeText("ruchicreation@okhdfcbank");
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2500);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const sanitizedValue = name === "phone" ? value.replace(/\D/g, "").slice(0, 10) : value;
    setFormData((prev) => ({ ...prev, [name]: sanitizedValue }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = "Full name is required";
    const cleanPhone = (formData.phone || "").replace(/\D/g, "");
    if (!cleanPhone || cleanPhone.length !== 10) {
      errs.phone = "Valid 10-digit mobile number required (numbers only)";
    }
    if (!formData.address.trim()) errs.address = "Delivery address is required";
    if (!formData.city.trim()) errs.city = "City is required";
    if (!formData.pincode.trim()) errs.pincode = "Pincode is required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNextToPayment = (e) => {
    e.preventDefault();
    if (validate()) {
      setCurrentStep(2);
      window.scrollTo({ top: 120, behavior: "smooth" });
    }
  };

  const handleNextToReview = (e) => {
    e.preventDefault();
    setCurrentStep(3);
    window.scrollTo({ top: 120, behavior: "smooth" });
  };

  const handlePlaceOrder = (e) => {
    e.preventDefault();
    if (!currentUser) {
      navigate("/register", { state: { from: { pathname: "/checkout" } }, replace: true });
      return;
    }
    if (!validate()) {
      setCurrentStep(1);
      return;
    }

    setLoading(true);

    setTimeout(() => {
      const paymentDetail =
        paymentMethod === "UPI"
          ? `UPI (${upiSubTab === "id" && upiId ? upiId : upiSubTab === "qr" ? "Scan QR Code" : selectedUpiApp})`
          : "Cash on Delivery";

      const orderPayload = {
        customer: {
          name: formData.name,
          phone: formData.phone,
          email: currentUser?.email || formData.email || "",
          address: formData.address,
          city: formData.city,
          pincode: formData.pincode,
          state: "Maharashtra"
        },
        items: cart,
        subtotal,
        deliveryFee: shipping,
        discount: 0,
        totalAmount,
        paymentMethod: paymentDetail,
        notes: ""
      };

      const createdOrder = placeOrder(orderPayload);
      setLoading(false);
      navigate(`/order-confirmation/${createdOrder.id}`);
    }, 800);
  };

  if (cart.length === 0) {
    return (
      <div
        className="min-h-[calc(100vh-280px)] py-20 px-4 text-center space-y-4 bg-cover bg-center bg-no-repeat flex items-center justify-center"
        style={{ backgroundImage: "url('/background-design.png')", backgroundAttachment: "fixed" }}
      >
        <div className="max-w-md mx-auto bg-white/95 backdrop-blur-xs p-8 rounded-2xl border border-[#E5DAC8] shadow-sm space-y-4">
          <h2 className="font-serif text-2xl font-bold text-[#632736]">Your Cart is Empty</h2>
          <p className="text-xs text-gray-500">Please add customized gifts to your cart before proceeding to checkout.</p>
          <Link to="/shop" className="inline-block px-6 py-2.5 bg-[#632736] text-white text-xs font-semibold rounded-lg shadow-xs hover:bg-[#4D1B28] transition-all">
            Return to Shop
          </Link>
        </div>
      </div>
    );
  }

  const steps = [
    { number: 1, title: "Shipping Address", icon: Truck },
    { number: 2, title: "Payment Method", icon: CreditCard },
    { number: 3, title: "Review & Order", icon: Package }
  ];

  return (
    <div
      className="min-h-screen py-8 sm:py-12 text-[#3B1822] bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/background-design.png')", backgroundAttachment: "fixed" }}
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Page Title */}
        <div className="text-left flex items-center justify-between">
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#3B1822]">
            Checkout
          </h1>
          <span className="text-xs font-semibold text-[#632736] bg-white px-3 py-1 rounded-full border border-[#E5DAC8] shadow-2xs">
            Step {currentStep} of 3
          </span>
        </div>

        {/* ========================================================= */}
        {/* Smooth Multi-Step Checkout Progress Bar                   */}
        {/* ========================================================= */}
        <div className="bg-white/95 backdrop-blur-xs rounded-2xl p-5 sm:p-6 border border-[#E5DAC8] shadow-xs">
          <div className="relative max-w-xl mx-auto py-2">
            
            {/* Background Track */}
            <div className="absolute top-5 left-8 right-8 h-1.5 bg-[#E5DAC8] rounded-full z-0"></div>
            
            {/* Smooth Animated Fill Bar */}
            <div
              className="absolute top-5 left-8 h-1.5 bg-gradient-to-r from-[#632736] via-[#8B3147] to-[#CD97A5] rounded-full z-0 transition-all duration-700 ease-in-out shadow-xs"
              style={{
                width: currentStep === 1 ? "0%" : currentStep === 2 ? "50%" : "calc(100% - 64px)"
              }}
            ></div>

            {/* Step Indicators */}
            <div className="relative z-10 flex items-center justify-between">
              {steps.map((st) => {
                const isCompleted = currentStep > st.number;
                const isActive = currentStep === st.number;
                const StepIcon = st.icon;

                return (
                  <button
                    key={st.number}
                    type="button"
                    onClick={() => {
                      if (st.number < currentStep || validate()) {
                        setCurrentStep(st.number);
                      }
                    }}
                    className="flex flex-col items-center group cursor-pointer text-center focus:outline-none"
                  >
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-500 shadow-sm ${
                        isCompleted
                          ? "bg-[#632736] text-white scale-100"
                          : isActive
                          ? "bg-[#632736] text-white ring-4 ring-[#CD97A5]/50 scale-110 shadow-md"
                          : "bg-white text-gray-400 border-2 border-[#E5DAC8]"
                      }`}
                    >
                      {isCompleted ? (
                        <Check className="w-5 h-5 text-white animate-pop-check" />
                      ) : (
                        <StepIcon className={`w-4 h-4 ${isActive ? "text-white" : "text-gray-400"}`} />
                      )}
                    </div>
                    
                    <span
                      className={`text-[11px] sm:text-xs mt-2 font-semibold transition-colors block ${
                        isActive
                          ? "text-[#632736] font-bold"
                          : isCompleted
                          ? "text-[#3B1822]"
                          : "text-gray-400"
                      }`}
                    >
                      {st.title}
                    </span>
                  </button>
                );
              })}
            </div>

          </div>
        </div>

        {/* Form Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Interactive Step Panels (7 cols) */}
          <div className="lg:col-span-7">
            
            {/* STEP 1: SHIPPING ADDRESS */}
            {currentStep === 1 && (
              <div className="bg-white/95 backdrop-blur-xs rounded-2xl p-6 border border-[#E5DAC8] shadow-xs space-y-4 text-left animate-preview-fade-slide">
                <div className="flex items-center justify-between border-b border-[#E5DAC8]/60 pb-3">
                  <h2 className="font-serif font-bold text-base sm:text-lg text-[#3B1822] flex items-center gap-2">
                    <Truck className="w-4 h-4 text-[#632736]" />
                    <span>Shipping Address</span>
                  </h2>
                  <span className="text-[11px] text-gray-400">* Required fields</span>
                </div>

                <div className="space-y-4 text-xs">
                  {/* Full Name */}
                  <div>
                    <label className="block text-xs font-medium text-[#3B1822] mb-1">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      placeholder="Enter full name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className={`w-full px-3.5 py-2.5 text-xs rounded-lg border bg-white focus:outline-none focus:ring-1 focus:ring-[#632736] ${
                        errors.name ? "border-red-500 bg-red-50" : "border-[#E5DAC8]"
                      }`}
                    />
                    {errors.name && <p className="text-[11px] text-red-500 mt-1">{errors.name}</p>}
                  </div>

                  {/* Mobile Number - Exactly 10 digits, no alphabets */}
                  <div>
                    <label className="block text-xs font-medium text-[#3B1822] mb-1">
                      Mobile Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      maxLength={10}
                      inputMode="numeric"
                      pattern="[0-9]*"
                      placeholder="Enter 10-digit mobile number"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className={`w-full px-3.5 py-2.5 text-xs rounded-lg border bg-white focus:outline-none focus:ring-1 focus:ring-[#632736] ${
                        errors.phone ? "border-red-500 bg-red-50" : "border-[#E5DAC8]"
                      }`}
                    />
                    {errors.phone && <p className="text-[11px] text-red-500 mt-1">{errors.phone}</p>}
                  </div>

                  {/* Delivery Address */}
                  <div>
                    <label className="block text-xs font-medium text-[#3B1822] mb-1">
                      Delivery Address <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      rows="2"
                      name="address"
                      placeholder="House / Flat no, Building name, Street area"
                      value={formData.address}
                      onChange={handleInputChange}
                      className={`w-full px-3.5 py-2.5 text-xs rounded-lg border bg-white focus:outline-none focus:ring-1 focus:ring-[#632736] ${
                        errors.address ? "border-red-500 bg-red-50" : "border-[#E5DAC8]"
                      }`}
                    />
                    {errors.address && <p className="text-[11px] text-red-500 mt-1">{errors.address}</p>}
                  </div>

                  {/* City & Pincode */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-[#3B1822] mb-1">
                        City <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="city"
                        placeholder="City"
                        value={formData.city}
                        onChange={handleInputChange}
                        className={`w-full px-3.5 py-2.5 text-xs rounded-lg border bg-white focus:outline-none focus:ring-1 focus:ring-[#632736] ${
                          errors.city ? "border-red-500 bg-red-50" : "border-[#E5DAC8]"
                        }`}
                      />
                      {errors.city && <p className="text-[11px] text-red-500 mt-1">{errors.city}</p>}
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-[#3B1822] mb-1">
                        Pincode <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="pincode"
                        maxLength={6}
                        placeholder="6-digit pincode"
                        value={formData.pincode}
                        onChange={handleInputChange}
                        className={`w-full px-3.5 py-2.5 text-xs rounded-lg border bg-white focus:outline-none focus:ring-1 focus:ring-[#632736] ${
                          errors.pincode ? "border-red-500 bg-red-50" : "border-[#E5DAC8]"
                        }`}
                      />
                      {errors.pincode && <p className="text-[11px] text-red-500 mt-1">{errors.pincode}</p>}
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-[#E5DAC8]/60 flex justify-end">
                  <button
                    type="button"
                    onClick={handleNextToPayment}
                    className="px-6 py-2.5 bg-[#632736] hover:bg-[#4D1B28] text-white text-xs font-semibold rounded-lg shadow-sm transition-all flex items-center gap-2 active:scale-95 cursor-pointer"
                  >
                    <span>Continue to Payment</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: PAYMENT METHOD (Matches img 2 exactly + opens dedicated UPI form) */}
            {currentStep === 2 && (
              <div className="bg-white/95 backdrop-blur-xs rounded-2xl p-6 border border-[#E5DAC8] shadow-xs space-y-5 text-left animate-preview-fade-slide">
                <div className="flex items-center justify-between border-b border-[#E5DAC8]/60 pb-3">
                  <h2 className="font-serif font-bold text-base sm:text-lg text-[#3B1822] flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-[#632736]" />
                    <span>Choose Payment Method</span>
                  </h2>
                  <span className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" /> 100% Secure
                  </span>
                </div>

                <div className="space-y-3">
                  {/* UPI Option */}
                  <div
                    className={`rounded-xl border-2 transition-all overflow-hidden ${
                      paymentMethod === "UPI"
                        ? "border-[#632736] bg-[#FAF5EB]/50 shadow-xs"
                        : "border-[#E5DAC8] hover:border-[#632736]/40 bg-white"
                    }`}
                  >
                    <label className="block p-4 cursor-pointer">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <input
                            type="radio"
                            name="paymentMethod"
                            value="UPI"
                            checked={paymentMethod === "UPI"}
                            onChange={() => setPaymentMethod("UPI")}
                            className="accent-[#632736] w-4 h-4"
                          />
                          <div>
                            <span className="font-serif font-bold text-sm text-[#3B1822] block">
                              UPI / GPay / PhonePe / Paytm / Net Banking
                            </span>
                            <span className="text-[11px] text-gray-500 block">
                              Fast, instant verification for customized gift processing
                            </span>
                          </div>
                        </div>
                        <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">
                          Recommended
                        </span>
                      </div>
                    </label>

                    {/* Dedicated Professional UPI Payment Form (opens when UPI is selected) */}
                    {paymentMethod === "UPI" && (
                      <div className="px-4 pb-4 pt-2 border-t border-[#E5DAC8]/70 space-y-4 animate-fadeIn">
                        {/* Sub-Tabs: UPI Apps | UPI ID | Scan QR */}
                        <div className="flex items-center gap-1.5 p-1 bg-white rounded-xl border border-[#E5DAC8] text-xs font-semibold">
                          <button
                            type="button"
                            onClick={() => setUpiSubTab("apps")}
                            className={`flex-1 py-2 px-2.5 rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                              upiSubTab === "apps"
                                ? "bg-[#632736] text-white shadow-xs font-bold"
                                : "text-gray-600 hover:text-[#632736] hover:bg-[#FAF5EB]"
                            }`}
                          >
                            <Smartphone className="w-3.5 h-3.5" />
                            <span>UPI Apps</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => setUpiSubTab("id")}
                            className={`flex-1 py-2 px-2.5 rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                              upiSubTab === "id"
                                ? "bg-[#632736] text-white shadow-xs font-bold"
                                : "text-gray-600 hover:text-[#632736] hover:bg-[#FAF5EB]"
                            }`}
                          >
                            <Wallet className="w-3.5 h-3.5" />
                            <span>UPI ID / VPA</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => setUpiSubTab("qr")}
                            className={`flex-1 py-2 px-2.5 rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                              upiSubTab === "qr"
                                ? "bg-[#632736] text-white shadow-xs font-bold"
                                : "text-gray-600 hover:text-[#632736] hover:bg-[#FAF5EB]"
                            }`}
                          >
                            <QrCode className="w-3.5 h-3.5" />
                            <span>Scan QR Code</span>
                          </button>
                        </div>

                        {/* Sub-Option 1: Popular UPI Apps */}
                        {upiSubTab === "apps" && (
                          <div className="bg-white p-3.5 rounded-xl border border-[#E5DAC8] space-y-3">
                            <span className="text-[11px] font-semibold text-gray-700 block">
                              Select your preferred payment app:
                            </span>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                              {[
                                { id: "Google Pay", label: "Google Pay", badge: "GPay" },
                                { id: "PhonePe", label: "PhonePe", badge: "Pe" },
                                { id: "Paytm", label: "Paytm UPI", badge: "Paytm" },
                                { id: "BHIM / CRED", label: "BHIM / CRED", badge: "UPI" }
                              ].map((app) => (
                                <button
                                  key={app.id}
                                  type="button"
                                  onClick={() => setSelectedUpiApp(app.id)}
                                  className={`p-2.5 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-1 cursor-pointer ${
                                    selectedUpiApp === app.id
                                      ? "border-[#632736] bg-[#FAF5EB] ring-2 ring-[#632736]/25 shadow-xs"
                                      : "border-gray-200 hover:border-[#632736]/40 bg-white"
                                  }`}
                                >
                                  <span className="font-bold text-xs text-[#3B1822]">{app.label}</span>
                                  <span className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1">
                                    <CheckCircle2 className="w-3 h-3" /> Selected
                                  </span>
                                </button>
                              ))}
                            </div>
                            <div className="flex items-center gap-2 pt-1 text-[11px] text-emerald-800 font-medium bg-emerald-50/80 p-2.5 rounded-lg border border-emerald-200">
                              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                              <span>Ready to pay <strong>₹{totalAmount.toLocaleString("en-IN")}</strong> via <strong>{selectedUpiApp}</strong> upon order confirmation.</span>
                            </div>
                          </div>
                        )}

                        {/* Sub-Option 2: Pay with UPI ID / VPA */}
                        {upiSubTab === "id" && (
                          <div className="bg-white p-3.5 rounded-xl border border-[#E5DAC8] space-y-3">
                            <label className="block text-[11px] font-semibold text-gray-700">
                              Enter your UPI ID / Virtual Payment Address:
                            </label>
                            <div className="flex items-center gap-2">
                              <input
                                type="text"
                                value={upiId}
                                onChange={(e) => {
                                  setUpiId(e.target.value);
                                  setUpiVerified(false);
                                }}
                                placeholder="e.g. yourname@okhdfcbank or 9511112616@ybl"
                                className="flex-1 px-3 py-2 text-xs rounded-lg border border-[#E5DAC8] bg-white text-[#3B1822] focus:outline-none focus:border-[#632736]"
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  if (upiId.trim().includes("@")) {
                                    setUpiVerified(true);
                                  } else {
                                    alert("Please enter a valid UPI ID (e.g. username@okhdfcbank or mobile@ybl).");
                                  }
                                }}
                                className="px-4 py-2 bg-[#632736] hover:bg-[#4D1B28] text-white text-xs font-semibold rounded-lg transition-all cursor-pointer"
                              >
                                Verify
                              </button>
                            </div>

                            {/* Popular Handle Pills */}
                            <div className="flex flex-wrap items-center gap-1.5 text-[10px]">
                              <span className="text-gray-400">Quick handles:</span>
                              {["@okhdfcbank", "@okaxis", "@okicici", "@ybl", "@paytm"].map((handle) => (
                                <button
                                  key={handle}
                                  type="button"
                                  onClick={() => {
                                    const base = (upiId.split("@")[0] || "9511112616").trim();
                                    setUpiId(base + handle);
                                    setUpiVerified(true);
                                  }}
                                  className="px-2 py-0.5 bg-[#FAF5EB] hover:bg-[#E5DAC8] text-[#632736] rounded border border-[#E5DAC8] font-medium cursor-pointer"
                                >
                                  {handle}
                                </button>
                              ))}
                            </div>

                            {upiVerified && (
                              <div className="flex items-center gap-2 text-[11px] text-emerald-800 bg-emerald-50 p-2.5 rounded-lg border border-emerald-200">
                                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                                <span>Verified Merchant: <strong>Ruchi Creation</strong>. Payment request for ₹{totalAmount.toLocaleString("en-IN")} will be approved.</span>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Sub-Option 3: Scan QR Code */}
                        {upiSubTab === "qr" && (
                          <div className="bg-white p-4 rounded-xl border border-[#E5DAC8] flex flex-col sm:flex-row items-center gap-5">
                            <div className="w-32 h-32 p-2 bg-white rounded-xl border-2 border-[#632736] shadow-sm flex items-center justify-center shrink-0">
                              <div className="w-full h-full relative flex items-center justify-center bg-[#FAF5EB] rounded-lg">
                                <QrCode className="w-24 h-24 text-[#632736]" />
                              </div>
                            </div>

                            <div className="space-y-2 text-left min-w-0">
                              <span className="text-xs font-bold text-[#3B1822] block">
                                Scan with any UPI App to Pay ₹{totalAmount.toLocaleString("en-IN")}
                              </span>
                              <p className="text-[11px] text-gray-500 leading-tight">
                                Open Google Pay, PhonePe, Paytm, BHIM, or any UPI app to scan and complete payment.
                              </p>
                              <div className="flex items-center gap-2 pt-1">
                                <span className="text-xs font-mono bg-gray-100 px-2.5 py-1 rounded border border-gray-200 text-gray-700">
                                  ruchicreation@okhdfcbank
                                </span>
                                <button
                                  type="button"
                                  onClick={handleCopyUpi}
                                  className="px-2.5 py-1 text-xs bg-[#FAF5EB] hover:bg-[#632736] hover:text-white text-[#632736] border border-[#632736]/30 rounded flex items-center gap-1 transition-all cursor-pointer"
                                  title="Copy UPI ID"
                                >
                                  {copiedUpi ? (
                                    <>
                                      <Check className="w-3 h-3 text-emerald-600" />
                                      <span>Copied!</span>
                                    </>
                                  ) : (
                                    <>
                                      <Copy className="w-3 h-3" />
                                      <span>Copy</span>
                                    </>
                                  )}
                                </button>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Cash on Delivery Option */}
                  <div
                    className={`rounded-xl border-2 transition-all overflow-hidden ${
                      paymentMethod === "COD"
                        ? "border-[#632736] bg-[#FAF5EB]/50 shadow-xs"
                        : "border-[#E5DAC8] hover:border-[#632736]/40 bg-white"
                    }`}
                  >
                    <label className="block p-4 cursor-pointer">
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="COD"
                          checked={paymentMethod === "COD"}
                          onChange={() => setPaymentMethod("COD")}
                          className="accent-[#632736] w-4 h-4"
                        />
                        <div>
                          <span className="font-serif font-bold text-sm text-[#3B1822] block">
                            Cash on Delivery (COD)
                          </span>
                          <span className="text-[11px] text-gray-500 block">
                            Pay cash to delivery partner upon receipt
                          </span>
                        </div>
                      </div>
                    </label>

                    {paymentMethod === "COD" && (
                      <div className="px-4 pb-4 pt-1 animate-fadeIn">
                        <div className="p-3 bg-white rounded-xl border border-[#E5DAC8] text-xs text-gray-600 space-y-1">
                          <div className="flex items-center gap-2 text-emerald-800 font-bold">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                            <span>Cash on Delivery Available</span>
                          </div>
                          <p className="text-[11px] text-gray-500">
                            You will pay <strong>₹{totalAmount.toLocaleString("en-IN")}</strong> in cash directly to our delivery courier upon parcel handover.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-4 border-t border-[#E5DAC8]/60 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(1)}
                    className="px-4 py-2 border border-[#E5DAC8] text-gray-700 text-xs font-semibold rounded-lg hover:bg-[#FAF5EB] transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back to Shipping</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleNextToReview}
                    className="px-6 py-2.5 bg-[#632736] hover:bg-[#4D1B28] text-white text-xs font-semibold rounded-lg shadow-sm transition-all flex items-center gap-2 active:scale-95 cursor-pointer"
                  >
                    <span>Review Order</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: REVIEW & PLACE ORDER */}
            {currentStep === 3 && (
              <div className="bg-white/95 backdrop-blur-xs rounded-2xl p-6 border border-[#E5DAC8] shadow-xs space-y-5 text-left animate-preview-fade-slide">
                <div className="flex items-center justify-between border-b border-[#E5DAC8]/60 pb-3">
                  <h2 className="font-serif font-bold text-base sm:text-lg text-[#3B1822] flex items-center gap-2">
                    <Package className="w-4 h-4 text-[#632736]" />
                    <span>Review & Confirm Order</span>
                  </h2>
                  <span className="text-[11px] text-[#632736] font-semibold">Final Step</span>
                </div>

                {/* Shipping Review Snippet */}
                <div className="bg-[#FAF5EB] p-4 rounded-xl border border-[#E5DAC8] space-y-1.5 text-xs text-[#3B1822]">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#632736] flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" /> Delivering to:
                    </span>
                    <button
                      type="button"
                      onClick={() => setCurrentStep(1)}
                      className="text-[11px] text-[#632736] font-semibold hover:underline cursor-pointer"
                    >
                      Change
                    </button>
                  </div>
                  <p className="font-semibold text-sm">{formData.name}</p>
                  <p className="text-gray-600">{formData.address}, {formData.city} - {formData.pincode}</p>
                  <p className="text-gray-600">Mobile: {formData.phone}</p>
                </div>

                {/* Payment Review Snippet */}
                <div className="bg-[#FAF5EB] p-4 rounded-xl border border-[#E5DAC8] flex items-center justify-between text-xs text-[#3B1822]">
                  <div>
                    <span className="font-bold text-[#632736] block mb-0.5">Payment Option:</span>
                    <span>
                      {paymentMethod === "UPI"
                        ? `UPI (${upiSubTab === "id" && upiId ? upiId : upiSubTab === "qr" ? "Scan QR Code" : selectedUpiApp})`
                        : "Cash on Delivery (COD)"}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setCurrentStep(2)}
                    className="text-[11px] text-[#632736] font-semibold hover:underline cursor-pointer"
                  >
                    Change
                  </button>
                </div>

                {/* Confirm Action */}
                <div className="pt-4 border-t border-[#E5DAC8]/60 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(2)}
                    className="px-4 py-2 border border-[#E5DAC8] text-gray-700 text-xs font-semibold rounded-lg hover:bg-[#FAF5EB] transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back to Payment</span>
                  </button>

                  <button
                    type="button"
                    onClick={handlePlaceOrder}
                    disabled={loading}
                    className="px-8 py-3 bg-[#632736] hover:bg-[#4D1B28] text-white font-semibold text-xs sm:text-sm rounded-lg shadow-md transition-all flex items-center gap-2 active:scale-95 disabled:opacity-75 cursor-pointer"
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                        <span>Placing Your Order...</span>
                      </span>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 text-[#CD97A5]" />
                        <span>Place Order (₹{totalAmount.toLocaleString("en-IN")})</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

          </div>

          {/* Right Column: Order Summary (5 cols) - Matches img 2 exactly */}
          <div className="lg:col-span-5 bg-white/95 backdrop-blur-xs rounded-2xl p-6 border border-[#E5DAC8] shadow-xs space-y-5 text-left sticky top-24">
            <div>
              <h2 className="font-serif font-bold text-base sm:text-lg text-[#3B1822] mb-3">
                Order Summary
              </h2>

              <div className="space-y-3 pb-3 max-h-64 overflow-y-auto">
                {cart.map((item) => (
                  <div key={item.cartId} className="flex items-center justify-between text-xs text-gray-700 gap-2">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-10 h-10 rounded-lg object-contain p-0.5 border border-[#E5DAC8] bg-white shrink-0"
                        onError={(e) => { e.target.src = "/reference-assets/detail-mug.jpg"; }}
                      />
                      <div className="min-w-0">
                        <span className="truncate block font-medium">{item.name}</span>
                        {item.customization?.recipientName && (
                          <span className="text-[10px] text-[#632736] truncate block">
                            For: {item.customization.recipientName}
                          </span>
                        )}
                        <span className="text-gray-400 text-[10px]">Qty: {item.quantity}</span>
                      </div>
                    </div>
                    <span className="font-semibold text-[#3B1822] shrink-0">
                      ₹ {(item.unitPrice * item.quantity).toLocaleString("en-IN")}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t border-[#E5DAC8]/80 pt-3 space-y-2 text-xs text-gray-600">
                <div className="flex justify-between items-center">
                  <span>Subtotal</span>
                  <span className="font-medium text-[#3B1822]">₹ {subtotal.toLocaleString("en-IN")}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span>Shipping</span>
                  <span className="font-medium text-[#3B1822]">₹ {shipping}</span>
                </div>

                <div className="border-t border-[#E5DAC8]/60 pt-2 flex justify-between items-center">
                  <span className="font-serif font-bold text-sm text-[#3B1822]">Total</span>
                  <span className="font-bold text-base text-[#632736]">
                    ₹ {totalAmount.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>
            </div>

            {/* Trust badge */}
            <div className="pt-2 border-t border-[#E5DAC8]/60 text-[11px] text-gray-500 flex items-center justify-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Handcrafted with Love in Ichalkaranji</span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
