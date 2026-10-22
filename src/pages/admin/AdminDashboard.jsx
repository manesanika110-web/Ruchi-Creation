import React from "react";
import { Link } from "react-router-dom";
import { 
  ShoppingBag, 
  Package, 
  Users, 
  IndianRupee,
  Clock,
  CheckCircle2,
  TrendingUp,
  MessageSquare,
  ArrowRight,
  Plus,
  Compass,
  Layers,
  Sparkles,
  AlertCircle
} from "lucide-react";
import { useApp } from "../../context/AppContext";

export const AdminDashboard = () => {
  const { orders, products, registeredUsers, enquiries, settings } = useApp();

  // Dynamic real calculations
  const totalOrdersCount = orders.length;
  const pendingOrdersCount = orders.filter((o) => o.orderStatus === "Pending" || o.orderStatus === "Processing").length;
  const completedOrdersCount = orders.filter((o) => o.orderStatus === "Delivered").length;
  const totalSales = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
  const totalProductsCount = products.length;
  const totalUsersCount = registeredUsers.length;
  const newEnquiriesCount = enquiries.filter((e) => e.status === "New").length;

  const getStatusBadge = (status) => {
    switch (status) {
      case "Pending":
      case "Processing":
        return "bg-amber-950/60 text-amber-300 border border-amber-800/60";
      case "Confirmed":
      case "Shipped":
        return "bg-sky-950/60 text-sky-300 border border-sky-800/60";
      case "Delivered":
        return "bg-emerald-950/60 text-emerald-300 border border-emerald-800/60";
      case "Cancelled":
        return "bg-rose-950/60 text-rose-300 border border-rose-800/60";
      default:
        return "bg-[#32111D] text-[#D4B8C1] border border-[#521D2C]";
    }
  };

  return (
    <div className="space-y-6 text-left max-w-7xl mx-auto">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 pb-2 border-b border-[#3E1421]">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-widest text-[#CD97A5] block">
            Store Performance Overview
          </span>
          <h1 className="font-serif italic font-bold text-2xl sm:text-3xl text-[#FAF5EB] mt-0.5">
            Admin Dashboard
          </h1>
          <p className="text-xs text-[#D4B8C1] mt-1">
            Real-time analytics and management for {settings.storeName}
          </p>
        </div>

        {/* Quick Action Shortcuts */}
        <div className="flex flex-wrap items-center gap-2">
          <Link
            to="/admin/products"
            className="px-3.5 py-2 bg-[#4D1B28] hover:bg-[#632736] text-[#FAF5EB] rounded-xl text-xs font-semibold border border-[#7D2C42] shadow-sm flex items-center gap-1.5 transition-all"
          >
            <Plus className="w-3.5 h-3.5 text-[#E5DAC8]" />
            <span>Add Product</span>
          </Link>
          <Link
            to="/admin/orders"
            className="px-3.5 py-2 bg-[#2D0F19] hover:bg-[#3E1421] text-[#FAF5EB] rounded-xl text-xs font-semibold border border-[#521D2C] shadow-sm flex items-center gap-1.5 transition-all"
          >
            <ShoppingBag className="w-3.5 h-3.5 text-[#CD97A5]" />
            <span>Manage Orders</span>
          </Link>
          <Link
            to="/admin/home-sections"
            className="px-3.5 py-2 bg-[#2D0F19] hover:bg-[#3E1421] text-[#FAF5EB] rounded-xl text-xs font-semibold border border-[#521D2C] shadow-sm flex items-center gap-1.5 transition-all"
          >
            <Layers className="w-3.5 h-3.5 text-[#CD97A5]" />
            <span>Home Sections</span>
          </Link>
        </div>
      </div>

      {/* 6 Key Stat Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3.5">
        
        {/* Stat 1: Total Sales */}
        <div className="bg-[#240B13] p-4 rounded-2xl border border-[#4D1B28] shadow-sm space-y-2 relative overflow-hidden">
          <div className="flex items-center justify-between text-xs text-[#CD97A5]">
            <span className="font-semibold">Total Revenue</span>
            <div className="w-7 h-7 rounded-lg bg-[#3A101C] text-[#E5DAC8] flex items-center justify-center border border-[#632736]/40">
              <IndianRupee className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-xl font-bold text-white tracking-tight">
            ₹{totalSales.toLocaleString("en-IN")}
          </div>
          <span className="text-[10px] text-emerald-400 block font-medium">
            From {totalOrdersCount} orders
          </span>
        </div>

        {/* Stat 2: Total Orders */}
        <div className="bg-[#240B13] p-4 rounded-2xl border border-[#4D1B28] shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs text-[#CD97A5]">
            <span className="font-semibold">Total Orders</span>
            <div className="w-7 h-7 rounded-lg bg-[#3A101C] text-[#E5DAC8] flex items-center justify-center border border-[#632736]/40">
              <ShoppingBag className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-xl font-bold text-white tracking-tight">
            {totalOrdersCount}
          </div>
          <span className="text-[10px] text-[#D4B8C1] block">
            All customer bookings
          </span>
        </div>

        {/* Stat 3: Pending Orders */}
        <div className="bg-[#240B13] p-4 rounded-2xl border border-[#4D1B28] shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs text-[#CD97A5]">
            <span className="font-semibold">Pending Orders</span>
            <div className="w-7 h-7 rounded-lg bg-[#3A101C] text-amber-400 flex items-center justify-center border border-[#632736]/40">
              <Clock className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-xl font-bold text-amber-300 tracking-tight">
            {pendingOrdersCount}
          </div>
          <span className="text-[10px] text-amber-400/80 block">
            Needs processing
          </span>
        </div>

        {/* Stat 4: Completed Orders */}
        <div className="bg-[#240B13] p-4 rounded-2xl border border-[#4D1B28] shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs text-[#CD97A5]">
            <span className="font-semibold">Delivered</span>
            <div className="w-7 h-7 rounded-lg bg-[#3A101C] text-emerald-400 flex items-center justify-center border border-[#632736]/40">
              <CheckCircle2 className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-xl font-bold text-emerald-300 tracking-tight">
            {completedOrdersCount}
          </div>
          <span className="text-[10px] text-emerald-400/80 block">
            Successfully delivered
          </span>
        </div>

        {/* Stat 5: Registered Customers */}
        <div className="bg-[#240B13] p-4 rounded-2xl border border-[#4D1B28] shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs text-[#CD97A5]">
            <span className="font-semibold">Registered Users</span>
            <div className="w-7 h-7 rounded-lg bg-[#3A101C] text-[#E5DAC8] flex items-center justify-center border border-[#632736]/40">
              <Users className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-xl font-bold text-white tracking-tight">
            {totalUsersCount}
          </div>
          <span className="text-[10px] text-[#D4B8C1] block">
            Customer profiles
          </span>
        </div>

        {/* Stat 6: Active Products */}
        <div className="bg-[#240B13] p-4 rounded-2xl border border-[#4D1B28] shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs text-[#CD97A5]">
            <span className="font-semibold">Total Products</span>
            <div className="w-7 h-7 rounded-lg bg-[#3A101C] text-[#E5DAC8] flex items-center justify-center border border-[#632736]/40">
              <Package className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-xl font-bold text-white tracking-tight">
            {totalProductsCount}
          </div>
          <span className="text-[10px] text-[#D4B8C1] block">
            Active gift listings
          </span>
        </div>

      </div>

      {/* Main Grid: Orders & Status Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Recent Orders (8 cols) */}
        <div className="lg:col-span-8 bg-[#240B13] rounded-3xl p-5 sm:p-6 border border-[#4D1B28] shadow-md space-y-4">
          <div className="flex justify-between items-center pb-3 border-b border-[#3E1421]">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-[#CD97A5]" />
              <h2 className="font-serif font-bold text-base text-[#FAF5EB]">
                Recent Orders
              </h2>
            </div>
            <Link
              to="/admin/orders"
              className="text-xs text-[#CD97A5] hover:text-white font-medium flex items-center gap-1 transition-colors"
            >
              <span>View All Orders</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="divide-y divide-[#3A111E] text-xs">
            {orders.slice(0, 5).map((order) => (
              <div key={order.id} className="py-3 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-[#2C0E18]/60 p-2 rounded-xl transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#1A070E] border border-[#4D1B28] overflow-hidden shrink-0 flex items-center justify-center">
                    {order.items?.[0]?.image ? (
                      <img src={order.items[0].image} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <Package className="w-4 h-4 text-[#CD97A5]" />
                    )}
                  </div>
                  <div>
                    <span className="font-mono font-bold text-[#E5DAC8] block">
                      #{order.id}
                    </span>
                    <span className="text-[11px] text-[#D4B8C1]">
                      {order.customer?.name} • {order.formattedDate}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-6">
                  <div className="text-left sm:text-right">
                    <span className="font-bold text-white text-sm block">
                      ₹{order.totalAmount?.toLocaleString("en-IN")}
                    </span>
                    <span className="text-[10px] text-gray-400">
                      {order.items?.length || 1} item{order.items?.length > 1 ? "s" : ""}
                    </span>
                  </div>

                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${getStatusBadge(order.orderStatus)}`}>
                    {order.orderStatus}
                  </span>

                  <Link
                    to="/admin/orders"
                    className="p-1.5 rounded-lg bg-[#3A101C] hover:bg-[#521D2C] text-[#E5DAC8] transition-colors"
                    title="Inspect order details"
                  >
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Order Status Summary & Quick Inquiries (4 cols) */}
        <div className="lg:col-span-4 space-y-5">
          
          {/* Order Status Breakdown */}
          <div className="bg-[#240B13] rounded-3xl p-5 border border-[#4D1B28] shadow-md space-y-3.5">
            <h3 className="font-serif font-bold text-sm text-[#FAF5EB] pb-2 border-b border-[#3E1421] flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[#CD97A5]" />
              <span>Order Status Distribution</span>
            </h3>

            <div className="space-y-2 text-xs">
              {[
                { status: "Processing", count: orders.filter((o) => o.orderStatus === "Processing").length, color: "text-amber-300" },
                { status: "Pending", count: orders.filter((o) => o.orderStatus === "Pending").length, color: "text-amber-400" },
                { status: "Shipped", count: orders.filter((o) => o.orderStatus === "Shipped").length, color: "text-sky-300" },
                { status: "Delivered", count: orders.filter((o) => o.orderStatus === "Delivered").length, color: "text-emerald-300" },
                { status: "Cancelled", count: orders.filter((o) => o.orderStatus === "Cancelled").length, color: "text-rose-400" }
              ].map((item) => (
                <div key={item.status} className="flex items-center justify-between py-1.5 px-3 rounded-xl bg-[#1A070E] border border-[#3E1421]">
                  <span className="text-[#D4B8C1] font-medium">{item.status}</span>
                  <span className={`font-bold ${item.color}`}>{item.count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* New Customer Enquiries Card */}
          <div className="bg-[#240B13] rounded-3xl p-5 border border-[#4D1B28] shadow-md space-y-3">
            <div className="flex justify-between items-center pb-2 border-b border-[#3E1421]">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-[#CD97A5]" />
                <h3 className="font-serif font-bold text-sm text-[#FAF5EB]">
                  Customer Inquiries
                </h3>
              </div>
              <Link to="/admin/enquiries" className="text-[11px] text-[#CD97A5] hover:text-white">
                View ({enquiries.length})
              </Link>
            </div>

            <div className="space-y-2 text-xs">
              {enquiries.slice(0, 3).map((enq) => (
                <div key={enq.id} className="p-3 rounded-xl bg-[#1A070E] border border-[#3E1421] space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-[#E5DAC8]">{enq.name}</span>
                    <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                      enq.status === "New" ? "bg-purple-950 text-purple-300" : "bg-emerald-950 text-emerald-300"
                    }`}>
                      {enq.status}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#D4B8C1] line-clamp-1 italic">
                    "{enq.message}"
                  </p>
                  <div className="text-[10px] text-gray-500 pt-0.5">{enq.date} • {enq.occasion || "General"}</div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* Website Management Quick Access */}
      <div className="bg-[#240B13] rounded-3xl p-5 sm:p-6 border border-[#4D1B28] shadow-md space-y-4">
        <h2 className="font-serif font-bold text-base text-[#FAF5EB] flex items-center gap-2">
          <Compass className="w-4 h-4 text-[#CD97A5]" />
          <span>Website Controls & Section Management</span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <Link
            to="/admin/pages"
            className="p-4 rounded-2xl bg-[#1A070E] hover:bg-[#32111D] border border-[#3E1421] hover:border-[#632736] transition-all space-y-1.5 block group"
          >
            <div className="flex items-center justify-between text-[#CD97A5] group-hover:text-[#FAF5EB]">
              <span className="font-bold text-sm">Website Menu Pages</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
            <p className="text-[#D4B8C1] text-[11px] leading-relaxed">
              Edit Home, About Us, Customize Gifts, Product Gallery, Shop & Contact pages.
            </p>
          </Link>

          <Link
            to="/admin/home-sections"
            className="p-4 rounded-2xl bg-[#1A070E] hover:bg-[#32111D] border border-[#3E1421] hover:border-[#632736] transition-all space-y-1.5 block group"
          >
            <div className="flex items-center justify-between text-[#CD97A5] group-hover:text-[#FAF5EB]">
              <span className="font-bold text-sm">Home Page Sections</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
            <p className="text-[#D4B8C1] text-[11px] leading-relaxed">
              Control Hero banner, Why Choose Us, Category carousel, and Featured showcases.
            </p>
          </Link>

          <Link
            to="/admin/media"
            className="p-4 rounded-2xl bg-[#1A070E] hover:bg-[#32111D] border border-[#3E1421] hover:border-[#632736] transition-all space-y-1.5 block group"
          >
            <div className="flex items-center justify-between text-[#CD97A5] group-hover:text-[#FAF5EB]">
              <span className="font-bold text-sm">Image & Media Library</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
            <p className="text-[#D4B8C1] text-[11px] leading-relaxed">
              Upload, preview, replace, and delete banners, product photos, and category art.
            </p>
          </Link>
        </div>
      </div>

    </div>
  );
};
