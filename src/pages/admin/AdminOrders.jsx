import React, { useState } from "react";
import { 
  Search, 
  ShoppingBag, 
  Eye, 
  X, 
  MessageCircle, 
  Printer, 
  Trash2, 
  CreditCard,
  Image as ImageIcon,
  CheckCircle,
  Clock,
  Truck,
  ArrowUpDown
} from "lucide-react";
import { useApp } from "../../context/AppContext";

export const AdminOrders = () => {
  const { orders, updateOrderStatus, updateOrderPaymentStatus, deleteOrder, settings } = useApp();

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortBy, setSortBy] = useState("newest");
  const [selectedOrder, setSelectedOrder] = useState(null);

  const statuses = ["Pending", "Confirmed", "Processing", "Shipped", "Delivered", "Cancelled"];

  const filteredOrders = orders
    .filter((order) => {
      const matchesStatus = statusFilter === "All" || order.orderStatus === statusFilter;
      const term = searchTerm.toLowerCase().trim();
      const matchesSearch =
        !term ||
        order.id.toLowerCase().includes(term) ||
        order.customer?.name?.toLowerCase().includes(term) ||
        order.customer?.phone?.includes(term) ||
        order.customer?.city?.toLowerCase().includes(term);

      return matchesStatus && matchesSearch;
    })
    .sort((a, b) => {
      if (sortBy === "newest") return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
      if (sortBy === "oldest") return new Date(a.createdAt || 0) - new Date(b.createdAt || 0);
      if (sortBy === "highest") return (b.totalAmount || 0) - (a.totalAmount || 0);
      if (sortBy === "lowest") return (a.totalAmount || 0) - (b.totalAmount || 0);
      return 0;
    });

  const handlePrintSlip = () => {
    window.print();
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "Pending":
      case "Processing":
        return "bg-amber-950/80 text-amber-300 border border-amber-800/80";
      case "Confirmed":
      case "Shipped":
        return "bg-sky-950/80 text-sky-300 border border-sky-800/80";
      case "Delivered":
        return "bg-emerald-950/80 text-emerald-300 border border-emerald-800/80";
      case "Cancelled":
        return "bg-rose-950/80 text-rose-300 border border-rose-800/80";
      default:
        return "bg-[#32111D] text-[#D4B8C1] border border-[#521D2C]";
    }
  };

  return (
    <div className="space-y-6 text-left max-w-7xl mx-auto">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 pb-2 border-b border-[#3E1421]">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-widest text-[#CD97A5] block">
            Fulfillment & Logistics
          </span>
          <h1 className="font-serif italic font-bold text-2xl sm:text-3xl text-[#FAF5EB] mt-0.5">
            Customer Orders Management
          </h1>
          <p className="text-xs text-[#D4B8C1] mt-1">
            Track orders, inspect custom photo prints & recipient specs, update statuses, and generate packing slips.
          </p>
        </div>

        <div className="text-xs text-[#CD97A5] font-semibold bg-[#240B13] px-3.5 py-2 rounded-xl border border-[#4D1B28]">
          Total Bookings: <span className="text-white font-bold">{orders.length}</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-[#240B13] p-4 rounded-3xl border border-[#4D1B28] shadow-md flex flex-col lg:flex-row gap-3 items-center justify-between">
        <div className="w-full lg:w-80 relative">
          <input
            type="text"
            placeholder="Search Order ID, customer, phone, city..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-[#1A070E] border border-[#4D1B28] text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-[#8E3E53]"
          />
          <Search className="w-3.5 h-3.5 text-[#CD97A5] absolute left-3 top-1/2 -translate-y-1/2" />
        </div>

        {/* Status Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full lg:w-auto pb-1 scrollbar-none">
          <button
            onClick={() => setStatusFilter("All")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer border ${
              statusFilter === "All"
                ? "bg-[#632736] text-white border-[#8E3E53]"
                : "bg-[#1A070E] text-[#D4B8C1] border-[#3E1421] hover:bg-[#32111D] hover:text-white"
            }`}
          >
            All ({orders.length})
          </button>
          {statuses.map((st) => {
            const count = orders.filter((o) => o.orderStatus === st).length;
            return (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer border ${
                  statusFilter === st
                    ? "bg-[#632736] text-white border-[#8E3E53]"
                    : "bg-[#1A070E] text-[#D4B8C1] border-[#3E1421] hover:bg-[#32111D] hover:text-white"
                }`}
              >
                {st} {count > 0 && `(${count})`}
              </button>
            );
          })}
        </div>

        {/* Sorting Dropdown */}
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-[11px] text-[#CD97A5]">Sort:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-1.5 rounded-lg text-xs bg-[#1A070E] border border-[#4D1B28] text-white focus:outline-none focus:ring-1 focus:ring-[#8E3E53]"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="highest">Highest Amount</option>
            <option value="lowest">Lowest Amount</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-[#240B13] rounded-3xl border border-[#4D1B28] shadow-md overflow-hidden">
        {filteredOrders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="bg-[#1C070F] border-b border-[#3E1421] text-[#E5DAC8] font-bold">
                  <th className="py-4 px-4">Order ID & Date</th>
                  <th className="py-4 px-4">Customer Details</th>
                  <th className="py-4 px-4">Items & Custom Specs</th>
                  <th className="py-4 px-4">Total Amount</th>
                  <th className="py-4 px-4">Payment</th>
                  <th className="py-4 px-4">Order Status</th>
                  <th className="py-4 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#320F1B] font-medium text-[#FAF5EB]">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-[#2F0E1A]/60 transition-colors">
                    {/* ID & Date */}
                    <td className="py-3.5 px-4 font-mono font-bold text-[#E5DAC8]">
                      #{order.id}
                      <span className="text-[10px] text-gray-400 block font-sans font-normal mt-0.5">
                        {order.formattedDate}
                      </span>
                    </td>

                    {/* Customer */}
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-white text-xs">{order.customer?.name}</div>
                      <div className="text-[11px] text-[#CD97A5] font-mono">{order.customer?.phone}</div>
                      <div className="text-[10px] text-gray-400 truncate max-w-[140px]">{order.customer?.city}, {order.customer?.state}</div>
                    </td>

                    {/* Items */}
                    <td className="py-3.5 px-4">
                      <div className="space-y-1 max-w-[200px]">
                        {order.items?.map((it, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-[11px]">
                            {it.image ? (
                              <img src={it.image} alt="" className="w-5 h-5 rounded object-cover shrink-0" onError={(e) => { e.target.src = "/logo.png"; }} />
                            ) : (
                              <span className="w-2 h-2 rounded-full bg-[#CD97A5]"></span>
                            )}
                            <span className="truncate text-[#FAF5EB] font-medium">
                              {it.name} (×{it.quantity})
                            </span>
                            {it.customization?.recipientName && (
                              <span className="text-[9px] text-[#CD97A5] bg-[#1A070E] px-1 py-0.2 rounded border border-[#4D1B28]">
                                {it.customization.recipientName}
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </td>

                    {/* Total Amount */}
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-white text-sm">
                        ₹{order.totalAmount?.toLocaleString("en-IN")}
                      </span>
                      <span className="text-[10px] text-gray-400 block">
                        Method: {order.paymentMethod}
                      </span>
                    </td>

                    {/* Payment Status Toggle */}
                    <td className="py-3.5 px-4">
                      <button
                        onClick={() =>
                          updateOrderPaymentStatus(
                            order.id,
                            order.paymentStatus === "Paid" ? "Pending" : "Paid"
                          )
                        }
                        title="Click to toggle payment status"
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-bold cursor-pointer transition-colors border ${
                          order.paymentStatus === "Paid"
                            ? "bg-emerald-950/80 text-emerald-300 border-emerald-800"
                            : "bg-amber-950/80 text-amber-300 border-amber-800"
                        }`}
                      >
                        {order.paymentStatus}
                      </button>
                    </td>

                    {/* Order Status Select */}
                    <td className="py-3.5 px-4">
                      <select
                        value={order.orderStatus}
                        onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                        className={`text-xs font-semibold py-1 px-2.5 rounded-lg border focus:outline-none cursor-pointer ${getStatusBadgeClass(order.orderStatus)}`}
                      >
                        {statuses.map((st) => (
                          <option key={st} value={st} className="bg-[#240B13] text-white">
                            {st}
                          </option>
                        ))}
                      </select>
                    </td>

                    {/* Details Inspect Button */}
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="px-3 py-1.5 bg-[#4D1B28] hover:bg-[#632736] text-[#FAF5EB] rounded-lg text-xs font-semibold border border-[#7D2C42] transition-all flex items-center gap-1.5 ml-auto cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5 text-[#E5DAC8]" />
                        <span>Inspect</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-16 text-center text-xs text-[#D4B8C1] space-y-2">
            <ShoppingBag className="w-10 h-10 mx-auto text-[#CD97A5]/40" />
            <p>No customer orders match the selected filter criteria.</p>
          </div>
        )}
      </div>

      {/* Detailed Order Inspection Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 overflow-y-auto backdrop-blur-sm animate-fade-in">
          <div className="bg-[#240B13] rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto border border-[#4D1B28] shadow-2xl relative text-left">
            
            {/* Modal Header */}
            <div className="flex justify-between items-start pb-4 border-b border-[#3E1421]">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#CD97A5] bg-[#3A101C] px-3 py-1 rounded-full border border-[#632736]">
                  Order Details Dossier
                </span>
                <h2 className="font-serif italic font-bold text-2xl text-white mt-1.5">
                  Order #{selectedOrder.id}
                </h2>
                <span className="text-xs text-[#D4B8C1]">{selectedOrder.formattedDate}</span>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-1.5 rounded-full hover:bg-white/10 text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Customer Details Box */}
            <div className="bg-[#1A070E] p-5 rounded-2xl border border-[#3E1421] grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-[#FAF5EB]">
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold text-[#CD97A5] uppercase tracking-wider block">Customer Information</span>
                <div className="font-bold text-sm text-white">{selectedOrder.customer?.name}</div>
                <div>Phone: <strong className="text-[#E5DAC8] font-mono">{selectedOrder.customer?.phone}</strong></div>
                {selectedOrder.customer?.altPhone && <div>Alt Phone: {selectedOrder.customer.altPhone}</div>}
                {selectedOrder.customer?.email && <div>Email: {selectedOrder.customer.email}</div>}
              </div>

              <div className="space-y-1.5">
                <span className="text-[10px] font-bold text-[#CD97A5] uppercase tracking-wider block">Delivery Destination</span>
                <div>{selectedOrder.customer?.address}</div>
                {selectedOrder.customer?.landmark && <div>Landmark: {selectedOrder.customer.landmark}</div>}
                <div>{selectedOrder.customer?.city}, {selectedOrder.customer?.state} - {selectedOrder.customer?.pincode}</div>
                {selectedOrder.customer?.preferredDate && (
                  <div className="text-[#E5DAC8] font-semibold pt-1">Preferred Delivery: {selectedOrder.customer.preferredDate}</div>
                )}
              </div>
            </div>

            {/* Special Instructions Note */}
            {selectedOrder.notes && (
              <div className="bg-amber-950/40 border border-amber-800/60 p-3 rounded-xl text-xs text-amber-200">
                <strong>Customer Instructions:</strong> "{selectedOrder.notes}"
              </div>
            )}

            {/* Customized Items with Photo Previews */}
            <div className="space-y-3">
              <h3 className="font-serif font-bold text-base text-white">
                Ordered Items & Custom Gift Specifications
              </h3>
              <div className="space-y-3">
                {selectedOrder.items?.map((item, idx) => (
                  <div key={idx} className="p-4 rounded-2xl border border-[#3E1421] bg-[#1A070E] flex flex-col sm:flex-row gap-4 justify-between items-start">
                    <div className="flex gap-4 items-start">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 rounded-xl object-cover border border-[#4D1B28] shrink-0"
                        onError={(e) => { e.target.src = "/logo.png"; }}
                      />
                      <div className="text-xs space-y-1">
                        <span className="font-bold text-sm text-white block">{item.name}</span>
                        <span className="text-gray-400">Qty: {item.quantity} × ₹{item.unitPrice}</span>

                        {/* Custom fields inspection */}
                        <div className="pt-2 text-xs space-y-1 bg-[#240B13] p-3 rounded-xl border border-[#3E1421]">
                          {item.customization?.recipientName && (
                            <div>
                              <strong className="text-[#CD97A5]">Name to Print / Engrave:</strong>{" "}
                              <span className="font-bold text-white">{item.customization.recipientName}</span>
                            </div>
                          )}
                          {item.customization?.selectedColor && (
                            <div>
                              <strong className="text-[#CD97A5]">Color / Theme:</strong> {item.customization.selectedColor}
                            </div>
                          )}
                          {item.customization?.occasion && (
                            <div>
                              <strong className="text-[#CD97A5]">Occasion:</strong> {item.customization.occasion}
                            </div>
                          )}
                          {item.customization?.customMessage && (
                            <div>
                              <strong className="text-[#CD97A5]">Personalized Card Message:</strong>{" "}
                              <span className="italic text-[#FAF5EB]">"{item.customization.customMessage}"</span>
                            </div>
                          )}

                          {/* Uploaded photo inspection */}
                          {item.customization?.photoPreview && (
                            <div className="pt-2">
                              <span className="font-bold text-[#CD97A5] flex items-center gap-1 mb-1">
                                <ImageIcon className="w-3.5 h-3.5" /> Customer's Uploaded Photo:
                              </span>
                              <div className="relative group w-24 h-24 rounded-xl overflow-hidden border-2 border-[#CD97A5] shadow-md">
                                <img
                                  src={item.customization.photoPreview}
                                  alt="Custom upload"
                                  className="w-full h-full object-cover"
                                />
                                <a
                                  href={item.customization.photoPreview}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="absolute inset-0 bg-black/60 text-white flex items-center justify-center text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                  Open Full
                                </a>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="text-right sm:self-center font-bold text-sm text-[#E5DAC8]">
                      ₹{(item.unitPrice * item.quantity).toLocaleString("en-IN")}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions Footer */}
            <div className="pt-4 border-t border-[#3E1421] flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <a
                  href={`https://wa.me/91${selectedOrder.customer?.phone?.replace(/\D/g, "").slice(-10)}?text=${encodeURIComponent(
                    `Hello ${selectedOrder.customer?.name}! This is Ruchi Creation regarding your Order #${selectedOrder.id}. We are working on your customized gift.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-[#25D366] text-white text-xs font-semibold rounded-xl hover:bg-[#20ba59] transition-all flex items-center gap-1.5"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>WhatsApp Customer</span>
                </a>

                <button
                  onClick={handlePrintSlip}
                  className="px-4 py-2 bg-[#1A070E] hover:bg-[#32111D] text-[#E5DAC8] border border-[#4D1B28] text-xs font-semibold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print Slip</span>
                </button>
              </div>

              <button
                onClick={() => {
                  if (confirm("Are you sure you want to delete this order record?")) {
                    deleteOrder(selectedOrder.id);
                    setSelectedOrder(null);
                  }
                }}
                className="px-3 py-2 text-rose-400 hover:bg-rose-950/40 text-xs font-semibold rounded-xl transition-colors flex items-center gap-1 cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete Record</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
