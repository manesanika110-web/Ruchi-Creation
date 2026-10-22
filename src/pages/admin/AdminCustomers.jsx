import React, { useState } from "react";
import { 
  Users, 
  Search, 
  Phone, 
  Mail, 
  MapPin, 
  MessageCircle, 
  ShoppingBag, 
  Calendar, 
  Eye, 
  X,
  Filter,
  ArrowUpDown,
  UserCheck
} from "lucide-react";
import { useApp } from "../../context/AppContext";

export const AdminCustomers = () => {
  const { registeredUsers, orders, settings } = useApp();
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [sortBy, setSortBy] = useState("newest");
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  // Combine registered users and order customers into a unified directory
  const unifiedCustomerMap = {};

  // 1. Process registered users
  registeredUsers.forEach((u) => {
    const key = (u.phone?.trim() || u.email?.trim() || u.id).toLowerCase();
    unifiedCustomerMap[key] = {
      id: u.id,
      name: u.name || "Registered User",
      email: u.email || "—",
      phone: u.phone || "—",
      city: u.city || "Ichalkaranji",
      state: u.state || "Maharashtra",
      createdAt: u.createdAt || new Date().toISOString(),
      formattedDate: u.createdAt ? new Date(u.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : "Registered",
      role: u.role || "Registered User",
      isRegistered: true,
      orders: [],
      totalOrders: 0,
      totalSpent: 0
    };
  });

  // 2. Link orders & process guest customers
  orders.forEach((order) => {
    const phone = order.customer?.phone?.trim() || "";
    const email = order.customer?.email?.trim()?.toLowerCase() || "";
    const key = (phone || email || "guest").toLowerCase();

    if (!unifiedCustomerMap[key]) {
      unifiedCustomerMap[key] = {
        id: "cust-" + order.id,
        name: order.customer?.name || "Customer",
        email: order.customer?.email || "—",
        phone: order.customer?.phone || "—",
        city: order.customer?.city || "Ichalkaranji",
        state: order.customer?.state || "Maharashtra",
        createdAt: order.createdAt || new Date().toISOString(),
        formattedDate: order.formattedDate || "Recent",
        role: "Guest Customer",
        isRegistered: false,
        orders: [],
        totalOrders: 0,
        totalSpent: 0
      };
    }

    unifiedCustomerMap[key].orders.push(order);
    unifiedCustomerMap[key].totalOrders += 1;
    unifiedCustomerMap[key].totalSpent += order.totalAmount || 0;
  });

  const customerList = Object.values(unifiedCustomerMap)
    .filter((c) => {
      const matchesRole =
        roleFilter === "All" ||
        (roleFilter === "Registered" && c.isRegistered) ||
        (roleFilter === "Guest" && !c.isRegistered);

      const term = searchTerm.toLowerCase().trim();
      const matchesSearch =
        !term ||
        c.name?.toLowerCase().includes(term) ||
        c.email?.toLowerCase().includes(term) ||
        c.phone?.includes(term) ||
        c.city?.toLowerCase().includes(term);

      return matchesRole && matchesSearch;
    })
    .sort((a, b) => {
      if (sortBy === "newest") return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
      if (sortBy === "orders") return b.totalOrders - a.totalOrders;
      if (sortBy === "spent") return b.totalSpent - a.totalSpent;
      if (sortBy === "name") return (a.name || "").localeCompare(b.name || "");
      return 0;
    });

  return (
    <div className="space-y-6 text-left max-w-7xl mx-auto">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 pb-2 border-b border-[#3E1421]">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-widest text-[#CD97A5] block">
            Customer Relations
          </span>
          <h1 className="font-serif italic font-bold text-2xl sm:text-3xl text-[#FAF5EB] mt-0.5">
            Registered Users & Customers
          </h1>
          <p className="text-xs text-[#D4B8C1] mt-1">
            Directory of registered account holders, contact records, and complete purchase histories.
          </p>
        </div>

        <div className="text-xs text-[#CD97A5] font-semibold bg-[#240B13] px-3.5 py-2 rounded-xl border border-[#4D1B28]">
          Total Customers: <span className="text-white font-bold">{customerList.length}</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-[#240B13] p-4 rounded-3xl border border-[#4D1B28] shadow-md flex flex-col lg:flex-row gap-3 items-center justify-between">
        <div className="w-full lg:w-80 relative">
          <input
            type="text"
            placeholder="Search by name, email, phone, city..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-[#1A070E] border border-[#4D1B28] text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-[#8E3E53]"
          />
          <Search className="w-3.5 h-3.5 text-[#CD97A5] absolute left-3 top-1/2 -translate-y-1/2" />
        </div>

        <div className="flex items-center gap-2">
          {/* Role Filter */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setRoleFilter("All")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer border ${
                roleFilter === "All"
                  ? "bg-[#632736] text-white border-[#8E3E53]"
                  : "bg-[#1A070E] text-[#D4B8C1] border-[#3E1421] hover:bg-[#32111D] hover:text-white"
              }`}
            >
              All ({Object.keys(unifiedCustomerMap).length})
            </button>
            <button
              onClick={() => setRoleFilter("Registered")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer border ${
                roleFilter === "Registered"
                  ? "bg-[#632736] text-white border-[#8E3E53]"
                  : "bg-[#1A070E] text-[#D4B8C1] border-[#3E1421] hover:bg-[#32111D] hover:text-white"
              }`}
            >
              Registered Users
            </button>
            <button
              onClick={() => setRoleFilter("Guest")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer border ${
                roleFilter === "Guest"
                  ? "bg-[#632736] text-white border-[#8E3E53]"
                  : "bg-[#1A070E] text-[#D4B8C1] border-[#3E1421] hover:bg-[#32111D] hover:text-white"
              }`}
            >
              Guest Order Customers
            </button>
          </div>

          {/* Sort By */}
          <div className="flex items-center gap-1.5 pl-2 border-l border-[#3E1421]">
            <span className="text-[11px] text-[#CD97A5]">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg text-xs bg-[#1A070E] border border-[#4D1B28] text-white focus:outline-none focus:ring-1 focus:ring-[#8E3E53]"
            >
              <option value="newest">Recent First</option>
              <option value="orders">Most Orders</option>
              <option value="spent">Highest Spend</option>
              <option value="name">Customer Name</option>
            </select>
          </div>
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-[#240B13] rounded-3xl border border-[#4D1B28] shadow-md overflow-hidden">
        {customerList.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="bg-[#1C070F] border-b border-[#3E1421] text-[#E5DAC8] font-bold">
                  <th className="py-4 px-4">Customer Name & Role</th>
                  <th className="py-4 px-4">Contact Phone</th>
                  <th className="py-4 px-4">Email Address</th>
                  <th className="py-4 px-4">Location</th>
                  <th className="py-4 px-4">Registered Date</th>
                  <th className="py-4 px-4">Total Orders</th>
                  <th className="py-4 px-4">Total Spent</th>
                  <th className="py-4 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#320F1B] font-medium text-[#FAF5EB]">
                {customerList.map((customer, idx) => (
                  <tr key={idx} className="hover:bg-[#2F0E1A]/60 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-[#3A101C] text-[#E5DAC8] flex items-center justify-center font-bold text-xs border border-[#4D1B28]">
                          {customer.name?.charAt(0) || "U"}
                        </div>
                        <div>
                          <div className="font-bold text-white text-xs">{customer.name}</div>
                          <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded inline-block ${
                            customer.isRegistered
                              ? "bg-emerald-950/80 text-emerald-300 border border-emerald-800"
                              : "bg-[#1A070E] text-[#CD97A5] border border-[#3E1421]"
                          }`}>
                            {customer.role}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 font-mono font-bold text-[#E5DAC8]">
                      {customer.phone}
                    </td>

                    <td className="py-3.5 px-4 text-[#D4B8C1]">
                      {customer.email}
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="bg-[#1A070E] text-[#D4B8C1] px-2 py-0.5 rounded border border-[#3E1421] text-[11px]">
                        {customer.city}, {customer.state}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-gray-400">
                      {customer.formattedDate}
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="font-bold text-white">
                        {customer.totalOrders} {customer.totalOrders === 1 ? "order" : "orders"}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 font-bold text-[#E5DAC8]">
                      ₹{customer.totalSpent.toLocaleString("en-IN")}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedCustomer(customer)}
                          className="p-1.5 rounded-lg bg-[#3A101C] hover:bg-[#521D2C] text-[#E5DAC8] transition-colors border border-[#632736]"
                          title="View customer dossier and orders"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        {customer.phone && customer.phone !== "—" && (
                          <a
                            href={`https://wa.me/91${customer.phone.replace(/\D/g, "").slice(-10)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-lg bg-[#25D366] text-white hover:bg-[#20ba59] transition-colors"
                            title="Chat on WhatsApp"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                          </a>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-16 text-center text-xs text-[#D4B8C1] space-y-2">
            <Users className="w-10 h-10 mx-auto text-[#CD97A5]/40" />
            <p>No customer records match your active search or filter.</p>
          </div>
        )}
      </div>

      {/* Customer Profile & Order History Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 overflow-y-auto backdrop-blur-sm animate-fade-in">
          <div className="bg-[#240B13] rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-5 max-h-[90vh] overflow-y-auto border border-[#4D1B28] shadow-2xl relative text-left">
            
            <div className="flex justify-between items-start pb-4 border-b border-[#3E1421]">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-[#3A101C] text-[#E5DAC8] flex items-center justify-center font-bold text-lg border border-[#4D1B28]">
                  {selectedCustomer.name?.charAt(0) || "U"}
                </div>
                <div>
                  <h3 className="font-serif italic font-bold text-xl text-white">
                    {selectedCustomer.name}
                  </h3>
                  <span className="text-xs text-[#CD97A5]">
                    {selectedCustomer.role} • Registered: {selectedCustomer.formattedDate}
                  </span>
                </div>
              </div>

              <button
                onClick={() => setSelectedCustomer(null)}
                className="p-1.5 rounded-full hover:bg-white/10 text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Profile Overview Card */}
            <div className="bg-[#1A070E] p-4 rounded-2xl border border-[#3E1421] grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <span className="text-[10px] text-gray-400 uppercase font-bold block">Contact Phone</span>
                <span className="font-mono font-bold text-[#E5DAC8] text-sm">{selectedCustomer.phone}</span>
              </div>
              <div>
                <span className="text-[10px] text-gray-400 uppercase font-bold block">Email Address</span>
                <span className="text-[#FAF5EB] truncate block">{selectedCustomer.email}</span>
              </div>
              <div>
                <span className="text-[10px] text-gray-400 uppercase font-bold block">Location</span>
                <span className="text-[#FAF5EB]">{selectedCustomer.city}, {selectedCustomer.state}</span>
              </div>
            </div>

            {/* Order History */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <h4 className="font-serif font-bold text-sm text-white flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4 text-[#CD97A5]" />
                  <span>Order Purchase History ({selectedCustomer.orders?.length || 0})</span>
                </h4>
                <span className="text-xs text-[#E5DAC8] font-bold">
                  Total Spend: ₹{selectedCustomer.totalSpent?.toLocaleString("en-IN")}
                </span>
              </div>

              {selectedCustomer.orders && selectedCustomer.orders.length > 0 ? (
                <div className="space-y-2">
                  {selectedCustomer.orders.map((order) => (
                    <div key={order.id} className="p-3 rounded-xl bg-[#1A070E] border border-[#3E1421] flex items-center justify-between text-xs">
                      <div>
                        <span className="font-mono font-bold text-[#E5DAC8]">#{order.id}</span>
                        <span className="text-[11px] text-gray-400 block">{order.formattedDate}</span>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-white">₹{order.totalAmount?.toLocaleString("en-IN")}</span>
                        <span className="text-[10px] text-[#CD97A5] block">{order.orderStatus}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-gray-500 italic p-3 bg-[#1A070E] rounded-xl border border-[#3E1421]">
                  This user has registered but has not placed any orders yet.
                </p>
              )}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedCustomer(null)}
                className="px-5 py-2 rounded-xl bg-[#3A101C] text-[#E5DAC8] hover:bg-[#521D2C] text-xs font-semibold"
              >
                Close Dossier
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
