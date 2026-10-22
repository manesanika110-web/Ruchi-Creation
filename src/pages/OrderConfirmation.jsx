import React, { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import confetti from "canvas-confetti";
import { 
  CheckCircle, 
  Sparkles, 
  MessageCircle, 
  Printer, 
  ArrowRight, 
  Clock, 
  MapPin, 
  Phone,
  Image as ImageIcon
} from "lucide-react";
import { useApp } from "../context/AppContext";

export const OrderConfirmation = () => {
  const { orderId } = useParams();
  const { orders, settings } = useApp();

  const order = orders.find((o) => o.id === orderId);

  useEffect(() => {
    // 1. Initial luxury burst
    confetti({
      particleCount: 80,
      spread: 75,
      origin: { y: 0.55 },
      colors: ["#632736", "#CD97A5", "#F5EEDC", "#D4AF37", "#3B1822"]
    });

    // 2. Dual celebratory side-cannons
    const timer = setTimeout(() => {
      confetti({
        particleCount: 45,
        angle: 60,
        spread: 60,
        origin: { x: 0.1, y: 0.65 },
        colors: ["#632736", "#CD97A5", "#D4AF37"]
      });
      confetti({
        particleCount: 45,
        angle: 120,
        spread: 60,
        origin: { x: 0.9, y: 0.65 },
        colors: ["#632736", "#CD97A5", "#D4AF37"]
      });
    }, 450);

    return () => clearTimeout(timer);
  }, []);

  if (!order) {
    return (
      <div className="max-w-md mx-auto py-20 px-4 text-center space-y-4">
        <h2 className="font-serif text-2xl font-bold text-[#632736]">Order Not Found</h2>
        <p className="text-xs text-gray-500">We could not retrieve order details for #{orderId}.</p>
        <Link to="/my-orders" className="inline-block px-6 py-2.5 bg-[#632736] text-white text-xs font-semibold rounded-xl">
          Check My Orders
        </Link>
      </div>
    );
  }

  // Generate WhatsApp confirmation message
  const handleSendWhatsAppConfirmation = () => {
    const itemsSummary = order.items
      .map(
        (it) =>
          `• ${it.name} (Qty: ${it.quantity}) - ₹${it.unitPrice * it.quantity}${
            it.customization?.recipientName ? ` [For: ${it.customization.recipientName}]` : ""
          }`
      )
      .join("\n");

    const text = `*Order Placed on Ruchi Creation Website!*\n\n*Order ID:* ${order.id}\n*Customer:* ${order.customer.name}\n*Phone:* ${order.customer.phone}\n*Address:* ${order.customer.address}, ${order.customer.city} - ${order.customer.pincode}\n\n*Ordered Gifts:*\n${itemsSummary}\n\n*Total Amount:* ₹${order.totalAmount}\n*Payment Method:* ${order.paymentMethod}\n*Status:* ${order.orderStatus}\n\nPlease proceed with customizing my gift! Thank you!`;

    window.open(`https://wa.me/${settings.whatsapp}?text=${encodeURIComponent(text)}`, "_blank");
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8 print:p-0">
      
      {/* Top Success Badge with Animated Gift Box & Ribbon */}
      <div className="text-center space-y-4 bg-white p-8 sm:p-10 rounded-3xl border border-[#CD97A5]/30 shadow-md">
        
        {/* Animated Gift Box with Ribbon Untying */}
        <AnimatedGiftBoxSuccess />

        <span className="text-xs uppercase font-bold tracking-widest text-[#632736] bg-[#FAF5EB] px-4 py-1.5 rounded-full inline-flex items-center gap-1.5 border border-[#CD97A5]/40 shadow-2xs">
          <Sparkles className="w-3.5 h-3.5 text-[#CD97A5]" />
          Order Successfully Placed
        </span>

        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#3B1822]">
          Thank You, {order.customer.name}!
        </h1>
        <p className="text-sm text-gray-600 max-w-lg mx-auto leading-relaxed">
          Your order <strong className="text-[#632736]">#{order.id}</strong> has been received by Ruchi Creation. Our artisan team will begin handcrafting your customized gift immediately.
        </p>

        {/* WhatsApp Notification CTA */}
        <div className="pt-3 flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={handleSendWhatsAppConfirmation}
            className="px-6 py-3 bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2 active:scale-95"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Send Order Details to WhatsApp</span>
          </button>
          <button
            onClick={handlePrint}
            className="px-5 py-3 bg-[#FAF5EB] hover:bg-[#CD97A5] text-[#632736] border border-[#CD97A5] font-bold text-xs rounded-xl transition-all flex items-center gap-2 print:hidden"
          >
            <Printer className="w-4 h-4" />
            <span>Print / Save Receipt</span>
          </button>
        </div>
      </div>

      {/* Invoice Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#CD97A5]/30 shadow-sm space-y-6">
        
        {/* Invoice Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-[#CD97A5]/20">
          <div>
            <div className="flex items-center gap-2">
              <img
                src="/logo.png"
                alt={settings.storeName}
                className="w-10 h-10 rounded-full border-2 border-[#632736] object-cover"
                onError={(e) => { e.target.src = "/logo.png"; }}
              />
              <span className="font-serif text-xl font-bold text-[#632736]">{settings.storeName}</span>
            </div>
            <p className="text-[11px] text-gray-500 mt-1">{settings.fullAddress}</p>
          </div>

          <div className="text-left sm:text-right">
            <span className="text-xs text-gray-400 block">Order Number</span>
            <span className="font-mono text-base font-bold text-[#632736]">#{order.id}</span>
            <span className="text-[11px] text-gray-500 block mt-0.5">{order.formattedDate}</span>
          </div>
        </div>

        {/* Customer & Shipping Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs text-[#3B1822] bg-[#FAF5EB] p-5 rounded-2xl border border-[#CD97A5]/30">
          <div>
            <h3 className="font-serif font-bold text-sm text-[#632736] mb-2">Delivery Details</h3>
            <p className="font-bold">{order.customer.name}</p>
            <p className="mt-0.5">{order.customer.address}</p>
            {order.customer.landmark && <p>Landmark: {order.customer.landmark}</p>}
            <p>{order.customer.city}, {order.customer.state} - {order.customer.pincode}</p>
            <p className="mt-1">
              <strong>Phone:</strong> {order.customer.phone}
              {order.customer.altPhone && `, ${order.customer.altPhone}`}
            </p>
          </div>

          <div>
            <h3 className="font-serif font-bold text-sm text-[#632736] mb-2">Order Information</h3>
            <p><strong>Payment Method:</strong> {order.paymentMethod}</p>
            <p>
              <strong>Payment Status:</strong>{" "}
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                order.paymentStatus === "Paid" ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
              }`}>
                {order.paymentStatus}
              </span>
            </p>
            <p className="mt-1">
              <strong>Order Status:</strong>{" "}
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#632736] text-white">
                {order.orderStatus}
              </span>
            </p>
            {order.notes && (
              <p className="mt-1.5 italic text-gray-600">
                <strong>Instructions:</strong> {order.notes}
              </p>
            )}
          </div>
        </div>

        {/* Items Table */}
        <div>
          <h3 className="font-serif font-bold text-base text-[#3B1822] mb-3">
            Customized Gift Items
          </h3>
          <div className="divide-y divide-gray-100 border border-gray-100 rounded-2xl overflow-hidden">
            {order.items.map((item, index) => (
              <div key={index} className="p-4 flex flex-col sm:flex-row gap-4 justify-between items-start">
                <div className="flex gap-3">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-14 h-14 rounded-xl object-cover border border-[#CD97A5]/30 shrink-0"
                    onError={(e) => { e.target.src = "/instagram-catalog.jpg"; }}
                  />
                  <div className="text-xs space-y-1">
                    <span className="font-bold text-sm text-[#3B1822] block">{item.name}</span>
                    <span className="text-gray-500">Qty: {item.quantity} × ₹{item.unitPrice}</span>
                    
                    {/* Custom details */}
                    <div className="text-[11px] text-gray-600 space-y-0.5 pt-1">
                      {item.customization?.recipientName && (
                        <div>• <strong>Name on Gift:</strong> {item.customization.recipientName}</div>
                      )}
                      {item.customization?.selectedColor && (
                        <div>• <strong>Color/Theme:</strong> {item.customization.selectedColor}</div>
                      )}
                      {item.customization?.customMessage && (
                        <div>• <strong>Card Note:</strong> "{item.customization.customMessage}"</div>
                      )}
                      {item.customization?.photoPreview && (
                        <div className="flex items-center gap-1.5 pt-0.5">
                          • <strong>Photo Attached:</strong>
                          <img
                            src={item.customization.photoPreview}
                            alt="preview"
                            className="w-5 h-5 rounded object-cover border border-[#CD97A5]"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="text-right sm:self-center font-bold text-sm text-[#632736]">
                  ₹{(item.unitPrice * item.quantity).toLocaleString("en-IN")}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Totals Summary */}
        <div className="border-t border-[#CD97A5]/20 pt-4 flex flex-col items-end gap-1.5 text-xs text-gray-600">
          <div className="flex justify-between w-64">
            <span>Subtotal:</span>
            <span className="font-bold text-[#3B1822]">₹{order.subtotal.toLocaleString("en-IN")}</span>
          </div>
          <div className="flex justify-between w-64">
            <span>Delivery:</span>
            <span className="font-bold text-[#3B1822]">
              {order.deliveryFee === 0 ? "FREE" : `₹${order.deliveryFee}`}
            </span>
          </div>
          <div className="flex justify-between w-64 pt-2 border-t border-gray-200 text-sm">
            <span className="font-bold text-[#3B1822]">Total Amount:</span>
            <span className="font-extrabold text-[#632736] text-base">
              ₹{order.totalAmount.toLocaleString("en-IN")}
            </span>
          </div>
        </div>

      </div>

      {/* Navigation footer */}
      <div className="flex justify-between items-center pt-2 print:hidden">
        <Link
          to="/my-orders"
          className="text-xs font-semibold text-[#632736] hover:underline flex items-center gap-1"
        >
          <Clock className="w-4 h-4" />
          <span>Track Order Status</span>
        </Link>
        <Link
          to="/shop"
          className="px-6 py-2.5 bg-[#632736] text-white text-xs font-semibold rounded-xl hover:bg-[#532127] transition-all"
        >
          Continue Shopping
        </Link>
      </div>

    </div>
  );
};

// Order Success Gift Box with Ribbon Untying Animation
const AnimatedGiftBoxSuccess = () => {
  return (
    <div className="relative w-44 h-44 mx-auto flex items-center justify-center py-2 animate-gift-glow">
      {/* Sparkles floating out */}
      <Sparkles className="absolute -top-1 -left-2 w-6 h-6 text-[#CD97A5] animate-pulse" />
      <Sparkles className="absolute top-2 -right-3 w-5 h-5 text-[#632736] animate-pulse" />

      {/* SVG Animated Gift Box */}
      <svg viewBox="0 0 160 160" className="w-full h-full overflow-visible">
        <defs>
          <filter id="giftShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="5" stdDeviation="5" floodColor="#632736" floodOpacity="0.25" />
          </filter>
        </defs>

        {/* Box Base */}
        <g filter="url(#giftShadow)">
          {/* Main Box body */}
          <rect x="30" y="72" width="100" height="68" rx="8" fill="#632736" />
          {/* Vertical gold ribbon on box base */}
          <rect x="73" y="72" width="14" height="68" fill="#CD97A5" />
          {/* Horizontal gold ribbon on box base */}
          <rect x="30" y="102" width="100" height="12" fill="#CD97A5" />
        </g>

        {/* Popping Checkmark badge emerging from inside the box */}
        <g className="animate-pop-check" style={{ transformOrigin: "80px 65px" }}>
          <circle cx="80" cy="55" r="21" fill="#22C55E" filter="url(#giftShadow)" />
          <path
            d="M72 55 L78 61 L89 48"
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>

        {/* Box Lid (Lifts and tilts up) */}
        <g className="animate-gift-lid" style={{ transformOrigin: "80px 62px" }}>
          {/* Lid rectangle */}
          <rect x="24" y="52" width="112" height="20" rx="5" fill="#4D1B28" stroke="#3B1822" strokeWidth="1" />
          {/* Vertical ribbon on lid */}
          <rect x="73" y="52" width="14" height="20" fill="#CD97A5" />
          {/* Gold ribbon trim */}
          <line x1="24" y1="71" x2="136" y2="71" stroke="#CD97A5" strokeWidth="2" opacity="0.8" />
        </g>

        {/* Untying Left Ribbon Loop */}
        <g className="animate-ribbon-left" style={{ transformOrigin: "73px 52px" }}>
          <path
            d="M75 52 C55 30, 35 40, 50 54 C60 62, 70 54, 75 52 Z"
            fill="#CD97A5"
            stroke="#632736"
            strokeWidth="1.2"
          />
          {/* Left ribbon tail */}
          <path
            d="M73 53 Q50 65 40 80"
            fill="none"
            stroke="#CD97A5"
            strokeWidth="4"
            strokeLinecap="round"
          />
        </g>

        {/* Untying Right Ribbon Loop */}
        <g className="animate-ribbon-right" style={{ transformOrigin: "87px 52px" }}>
          <path
            d="M85 52 C105 30, 125 40, 110 54 C100 62, 90 54, 85 52 Z"
            fill="#CD97A5"
            stroke="#632736"
            strokeWidth="1.2"
          />
          {/* Right ribbon tail */}
          <path
            d="M87 53 Q110 65 120 80"
            fill="none"
            stroke="#CD97A5"
            strokeWidth="4"
            strokeLinecap="round"
          />
        </g>

        {/* Center Ribbon Knot */}
        <circle cx="80" cy="52" r="6" fill="#F5EEDC" stroke="#632736" strokeWidth="1.5" />
      </svg>
    </div>
  );
};

