import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Sparkles, Calendar, MapPin, Phone, User, MessageCircle, CheckCircle2, ShieldCheck, Truck, X } from "lucide-react";
import { useApp } from "../context/AppContext";

export const RentProducts = () => {
  const { settings, submitEnquiry } = useApp();
  const [selectedDuration, setSelectedDuration] = useState("1 day");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bookingSubmitted, setBookingSubmitted] = useState(false);

  const [bookingForm, setBookingForm] = useState({
    name: "",
    phone: "",
    eventDate: "",
    venue: "Ichalkaranji",
    notes: ""
  });

  const durationDetails = {
    "1 day": { days: 1, rent: 1500, label: "1 day" },
    "3 days": { days: 3, rent: 4000, label: "3 days" },
    "1 week": { days: 7, rent: 8500, label: "1 week" }
  };

  const currentDuration = durationDetails[selectedDuration] || durationDetails["1 day"];
  const securityDeposit = 2000;
  const totalAmount = currentDuration.rent + securityDeposit;

  const handleBookingSubmit = (e) => {
    e.preventDefault();
    if (!bookingForm.name.trim()) {
      alert("Please enter your name.");
      return;
    }
    const cleanPhone = bookingForm.phone.replace(/\D/g, "");
    if (cleanPhone.length !== 10) {
      alert("Please provide a valid 10-digit mobile number.");
      return;
    }

    if (submitEnquiry) {
      submitEnquiry({
        name: bookingForm.name,
        phone: cleanPhone,
        occasion: `Rental Decor - ${selectedDuration}`,
        message: `Rental Booking for "Luxury Balloon & Floral Gift Decor" for ${selectedDuration}. Event Date: ${bookingForm.eventDate || "Not specified"}. Venue: ${bookingForm.venue}. Notes: ${bookingForm.notes || "None"}. Estimated rent: ₹${currentDuration.rent} + Deposit: ₹${securityDeposit}.`
      });
    }

    setBookingSubmitted(true);
  };

  const handleWhatsAppBooking = () => {
    const phoneNum = settings?.whatsapp || "919511112616";
    const cleanTarget = phoneNum.replace(/\D/g, "");
    const msg = `Hello Ruchi Creation! 🎈🌸\n\nI want to book the *Luxury Balloon & Floral Gift Decor* on Rent.\n\n• Duration: ${selectedDuration}\n• Rental Rate: ₹1500/day (Total Rent: ₹${currentDuration.rent})\n• Security Deposit: ₹${securityDeposit} (Refundable)\n• Name: ${bookingForm.name || "Customer"}\n• Mobile: ${bookingForm.phone || "Not provided"}\n• Event Date: ${bookingForm.eventDate || "To be discussed"}\n• Venue/City: ${bookingForm.venue || "Ichalkaranji"}\n\nPlease confirm availability!`;
    const url = `https://wa.me/${cleanTarget}?text=${encodeURIComponent(msg)}`;
    window.open(url, "_blank");
  };

  return (
    <div
      className="min-h-[calc(100vh-140px)] bg-[#FAF5E9] text-[#3B1822] py-8 sm:py-12 md:py-16 px-4 sm:px-6 lg:px-8 flex flex-col justify-center items-center bg-repeat bg-center"
      style={{
        backgroundImage: "url('/background-design.png')",
        backgroundSize: "clamp(340px, 35vw, 520px) auto",
        backgroundRepeat: "repeat"
      }}
    >
      <div className="max-w-3xl w-full mx-auto text-center space-y-6 sm:space-y-8">
        
        {/* Page Header (Matching Image 2 Reference Exactly) */}
        <div className="space-y-1.5 text-center">
          <h1 className="font-serif text-3xl sm:text-5xl font-normal text-[#5A202D] tracking-tight">
            Rent Products
          </h1>
          <p className="font-serif italic text-sm sm:text-base text-[#8C5361]">
            Curated décor rentals for your special occasions
          </p>
        </div>

        {/* Main Product Card (Exact Replica of Image 2 Reference) */}
        <div className="bg-[#FAF5EB]/90 sm:bg-white/90 rounded-2xl sm:rounded-3xl border border-[#CD97A5]/50 p-5 sm:p-9 shadow-sm hover:shadow-md transition-shadow text-center">
          
          {/* 1. Product Image */}
          <div className="rounded-xl sm:rounded-2xl overflow-hidden border border-[#CD97A5]/30 shadow-2xs mx-auto max-w-xl">
            <img
              src="/rent-decor.png"
              alt="Luxury Balloon & Floral Gift Decor"
              className="w-full h-auto object-cover block"
            />
          </div>

          {/* 2. Product Title */}
          <h2 className="font-serif font-bold text-xl sm:text-2xl text-[#3B1822] mt-5 sm:mt-6">
            Luxury Balloon & Floral Gift Decor
          </h2>

          {/* 3. Category Tag Pill */}
          <div className="inline-flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1 rounded-full bg-[#FAF0F3] text-[#7A2E3E] text-[11px] sm:text-xs font-medium mt-2.5 border border-[#EAC9D2]">
            <span>Elegant Decor</span>
            <span className="text-[#CD97A5]">•</span>
            <span>Balloon Backdrop</span>
            <span className="text-[#CD97A5]">•</span>
            <span>Gift Styling</span>
          </div>

          {/* 4. Rental Rate */}
          <div className="mt-4 text-xs sm:text-sm text-[#4A3238]">
            <span>Rental rate: </span>
            <span className="font-serif font-bold text-[#632736] text-lg sm:text-xl">
              ₹1500/day
            </span>
          </div>

          {/* 5. Rental Duration Options */}
          <div className="mt-3.5">
            <p className="text-[11px] sm:text-xs text-gray-500 font-medium mb-2.5">
              Rental duration options:
            </p>
            <div className="grid grid-cols-3 gap-2.5 sm:gap-3 max-w-xs sm:max-w-sm mx-auto">
              {["1 day", "3 days", "1 week"].map((dur) => {
                const isSelected = selectedDuration === dur;
                return (
                  <button
                    key={dur}
                    type="button"
                    onClick={() => setSelectedDuration(dur)}
                    className={`py-2 px-2 sm:px-4 rounded-lg text-xs sm:text-sm font-medium transition-all cursor-pointer ${
                      isSelected
                        ? "bg-[#632736] text-white shadow-xs font-semibold scale-102"
                        : "bg-white/80 border border-[#CD97A5] text-[#632736] hover:bg-[#FAF5EB]"
                    }`}
                  >
                    {dur}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 6. Security Deposit */}
          <div className="mt-3.5 text-xs sm:text-sm text-gray-600">
            <span>Security deposit: </span>
            <span className="font-serif font-bold text-[#3B1822] text-sm sm:text-base">
              ₹2000
            </span>
          </div>

          {/* 7. Rent Now Primary Button */}
          <div className="max-w-md mx-auto mt-5">
            <button
              type="button"
              onClick={() => {
                setIsModalOpen(true);
                setBookingSubmitted(false);
              }}
              className="w-full py-3 sm:py-3.5 bg-[#632736] hover:bg-[#4D1B28] text-white font-medium text-sm sm:text-base rounded-xl shadow-xs hover:shadow-md transition-all active:scale-[0.99] cursor-pointer"
            >
              Rent Now
            </button>
          </div>

        </div>

        {/* 8. Bottom Information Subtext */}
        <p className="text-xs text-gray-500 text-center flex items-center justify-center gap-1.5 flex-wrap">
          <span>Free pickup & delivery available</span>
          <span className="text-[#CD97A5]">•</span>
          <span>Damage protection included</span>
        </p>

      </div>

      {/* Booking Enquiry Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="relative w-full max-w-lg bg-[#FAF5EB] rounded-3xl p-6 sm:p-8 shadow-2xl border border-[#CD97A5]/60 text-left space-y-4 max-h-[90vh] overflow-y-auto">
            
            {/* Close Button */}
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/80 hover:bg-white text-gray-600 hover:text-[#632736] flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-4 h-4" />
            </button>

            {bookingSubmitted ? (
              <div className="py-6 text-center space-y-4">
                <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="font-serif font-bold text-2xl text-[#3B1822]">
                  Booking Request Received!
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 max-w-sm mx-auto">
                  Thank you, <strong>{bookingForm.name}</strong>! We have received your decor rental request for <strong>{selectedDuration}</strong>. Our team will contact you shortly to confirm timings.
                </p>
                <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                  <button
                    onClick={handleWhatsAppBooking}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-[#25D366] hover:bg-[#20ba5a] text-white text-xs font-semibold rounded-xl shadow-xs transition-colors"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Chat on WhatsApp</span>
                  </button>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="w-full sm:w-auto px-6 py-2.5 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 text-xs font-semibold rounded-xl"
                  >
                    Done
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#632736] block">
                    DECOR RENTAL BOOKING
                  </span>
                  <h3 className="font-serif font-bold text-xl sm:text-2xl text-[#3B1822] mt-0.5">
                    Luxury Balloon & Floral Gift Decor
                  </h3>
                  <div className="mt-2 p-3 bg-white rounded-xl border border-[#E5DAC8] text-xs space-y-1">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Selected Duration:</span>
                      <strong className="text-[#632736]">{selectedDuration}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Rental Charge:</span>
                      <strong className="text-[#3B1822]">₹ {currentDuration.rent.toLocaleString("en-IN")}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Security Deposit (Refundable):</span>
                      <strong className="text-[#3B1822]">₹ 2,000</strong>
                    </div>
                    <div className="border-t border-gray-100 pt-1 flex justify-between font-bold text-sm text-[#632736]">
                      <span>Estimated Total Payable:</span>
                      <span>₹ {totalAmount.toLocaleString("en-IN")}</span>
                    </div>
                  </div>
                </div>

                <form onSubmit={handleBookingSubmit} className="space-y-3 pt-1">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Your Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Aditi Kulkarni"
                      value={bookingForm.name}
                      onChange={(e) => setBookingForm({ ...bookingForm, name: e.target.value })}
                      className="w-full px-3.5 py-2 bg-white rounded-xl border border-[#CD97A5]/50 text-xs text-[#3B1822] focus:outline-none focus:ring-2 focus:ring-[#632736]/30"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Mobile Number *
                      </label>
                      <input
                        type="tel"
                        required
                        maxLength={10}
                        placeholder="10-digit number"
                        value={bookingForm.phone}
                        onChange={(e) => setBookingForm({ ...bookingForm, phone: e.target.value.replace(/\D/g, "") })}
                        className="w-full px-3.5 py-2 bg-white rounded-xl border border-[#CD97A5]/50 text-xs text-[#3B1822] focus:outline-none focus:ring-2 focus:ring-[#632736]/30"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Event Date
                      </label>
                      <input
                        type="date"
                        value={bookingForm.eventDate}
                        onChange={(e) => setBookingForm({ ...bookingForm, eventDate: e.target.value })}
                        className="w-full px-3.5 py-2 bg-white rounded-xl border border-[#CD97A5]/50 text-xs text-[#3B1822] focus:outline-none focus:ring-2 focus:ring-[#632736]/30"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Event Venue / Delivery Address
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Station Road, Ichalkaranji"
                      value={bookingForm.venue}
                      onChange={(e) => setBookingForm({ ...bookingForm, venue: e.target.value })}
                      className="w-full px-3.5 py-2 bg-white rounded-xl border border-[#CD97A5]/50 text-xs text-[#3B1822] focus:outline-none focus:ring-2 focus:ring-[#632736]/30"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Special Notes / Custom Requirements
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Any specific setup preferences, timings, or theme colors..."
                      value={bookingForm.notes}
                      onChange={(e) => setBookingForm({ ...bookingForm, notes: e.target.value })}
                      className="w-full px-3.5 py-2 bg-white rounded-xl border border-[#CD97A5]/50 text-xs text-[#3B1822] focus:outline-none focus:ring-2 focus:ring-[#632736]/30 resize-none"
                    />
                  </div>

                  <div className="pt-2 flex flex-col sm:flex-row gap-2.5">
                    <button
                      type="submit"
                      className="flex-1 py-2.5 bg-[#632736] hover:bg-[#4D1B28] text-white font-semibold text-xs rounded-xl shadow-xs transition-colors cursor-pointer text-center"
                    >
                      Confirm Booking Request
                    </button>
                    <button
                      type="button"
                      onClick={handleWhatsAppBooking}
                      className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-[#25D366] hover:bg-[#20ba5a] text-white font-semibold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>Book on WhatsApp</span>
                    </button>
                  </div>
                </form>
              </>
            )}

          </div>
        </div>
      )}
    </div>
  );
};
