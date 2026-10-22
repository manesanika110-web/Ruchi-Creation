import React, { useState } from "react";
import { 
  MessageSquare, 
  Search, 
  Phone, 
  Mail, 
  MessageCircle, 
  CheckCircle, 
  Clock, 
  Trash2, 
  X,
  Eye,
  Filter,
  Calendar,
  Sparkles
} from "lucide-react";
import { useApp } from "../../context/AppContext";

export const AdminEnquiries = () => {
  const { enquiries, updateEnquiryStatus, deleteEnquiry, settings } = useApp();

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedEnq, setSelectedEnq] = useState(null);

  const statuses = ["New", "In Progress", "Responded", "Closed"];

  const filteredEnquiries = enquiries.filter((enq) => {
    const matchesStatus = statusFilter === "All" || enq.status === statusFilter;
    const term = searchTerm.toLowerCase().trim();
    const matchesSearch =
      !term ||
      enq.name?.toLowerCase().includes(term) ||
      enq.phone?.includes(term) ||
      enq.email?.toLowerCase().includes(term) ||
      enq.occasion?.toLowerCase().includes(term) ||
      enq.message?.toLowerCase().includes(term);

    return matchesStatus && matchesSearch;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case "New":
        return "bg-purple-950/80 text-purple-300 border border-purple-800";
      case "In Progress":
        return "bg-amber-950/80 text-amber-300 border border-amber-800";
      case "Responded":
      case "Closed":
        return "bg-emerald-950/80 text-emerald-300 border border-emerald-800";
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
            Storefront Inquiries & Form Submissions
          </span>
          <h1 className="font-serif italic font-bold text-2xl sm:text-3xl text-[#FAF5EB] mt-0.5">
            Forms & Contact Management
          </h1>
          <p className="text-xs text-[#D4B8C1] mt-1">
            Review custom gift requests, corporate gifting queries, and contact form messages submitted from the website.
          </p>
        </div>

        <div className="text-xs text-[#CD97A5] font-semibold bg-[#240B13] px-3.5 py-2 rounded-xl border border-[#4D1B28]">
          Total Inquiries: <span className="text-white font-bold">{enquiries.length}</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-[#240B13] p-4 rounded-3xl border border-[#4D1B28] shadow-md flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="w-full md:w-80 relative">
          <input
            type="text"
            placeholder="Search inquiries by name, phone, message..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-[#1A070E] border border-[#4D1B28] text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-[#8E3E53]"
          />
          <Search className="w-3.5 h-3.5 text-[#CD97A5] absolute left-3 top-1/2 -translate-y-1/2" />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 scrollbar-none">
          <button
            onClick={() => setStatusFilter("All")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer border ${
              statusFilter === "All"
                ? "bg-[#632736] text-white border-[#8E3E53]"
                : "bg-[#1A070E] text-[#D4B8C1] border-[#3E1421] hover:bg-[#32111D] hover:text-white"
            }`}
          >
            All ({enquiries.length})
          </button>
          {statuses.map((st) => {
            const count = enquiries.filter((e) => e.status === st).length;
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
      </div>

      {/* Enquiries Grid */}
      {filteredEnquiries.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredEnquiries.map((enq) => (
            <div
              key={enq.id}
              className="bg-[#240B13] p-5 rounded-3xl border border-[#4D1B28] shadow-sm space-y-3.5 flex flex-col justify-between hover:border-[#8E3E53] transition-all"
            >
              <div className="space-y-2.5">
                <div className="flex justify-between items-start gap-2">
                  <div>
                    <h3 className="font-bold text-sm text-white">{enq.name}</h3>
                    <span className="text-[10px] text-gray-400 block font-mono">{enq.date}</span>
                  </div>
                  <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold ${getStatusBadge(enq.status)}`}>
                    {enq.status}
                  </span>
                </div>

                <div className="text-xs text-[#D4B8C1] space-y-1">
                  <div>Phone: <strong className="text-[#E5DAC8] font-mono">{enq.phone}</strong></div>
                  {enq.email && <div className="truncate">Email: {enq.email}</div>}
                  {enq.occasion && (
                    <div className="pt-0.5">
                      <span className="bg-[#1A070E] text-[#CD97A5] px-2 py-0.5 rounded border border-[#3E1421] text-[10px] font-bold">
                        Occasion: {enq.occasion}
                      </span>
                    </div>
                  )}
                </div>

                <div className="bg-[#1A070E] p-3 rounded-2xl border border-[#3E1421] text-xs text-[#FAF5EB] italic leading-relaxed">
                  "{enq.message || "Customer requested gift design consultation."}"
                </div>
              </div>

              {/* Status and Action Buttons */}
              <div className="pt-3 border-t border-[#3E1421] flex items-center justify-between gap-2">
                <select
                  value={enq.status}
                  onChange={(e) => updateEnquiryStatus(enq.id, e.target.value)}
                  className="text-xs bg-[#1A070E] text-[#FAF5EB] border border-[#4D1B28] rounded-lg px-2 py-1 focus:outline-none cursor-pointer"
                >
                  {statuses.map((st) => (
                    <option key={st} value={st} className="bg-[#240B13]">
                      {st}
                    </option>
                  ))}
                </select>

                <div className="flex items-center gap-1.5">
                  <a
                    href={`https://wa.me/91${enq.phone?.replace(/\D/g, "").slice(-10)}?text=${encodeURIComponent(
                      `Hello ${enq.name}! This is Ruchi Creation responding to your gift inquiry regarding ${enq.occasion || "our collection"}.`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 bg-[#25D366] text-white rounded-lg hover:bg-[#20ba59] transition-colors"
                    title="Respond on WhatsApp"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                  </a>

                  <a
                    href={`tel:${enq.phone}`}
                    className="p-1.5 bg-[#3A101C] text-[#E5DAC8] border border-[#632736] rounded-lg hover:bg-[#521D2C] transition-colors"
                    title="Call Phone"
                  >
                    <Phone className="w-3.5 h-3.5" />
                  </a>

                  <button
                    onClick={() => {
                      if (confirm("Delete this inquiry record?")) {
                        deleteEnquiry(enq.id);
                      }
                    }}
                    className="p-1.5 bg-[#1A070E] text-rose-400 hover:bg-rose-950/40 rounded-lg transition-colors border border-[#3E1421]"
                    title="Delete Inquiry"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-[#240B13] rounded-3xl p-16 text-center border border-[#4D1B28] space-y-2">
          <MessageSquare className="w-12 h-12 mx-auto text-[#CD97A5]/40" />
          <h3 className="font-serif font-bold text-lg text-[#FAF5EB]">No Inquiries Found</h3>
          <p className="text-xs text-[#D4B8C1]">
            Customer inquiries and customization form requests will appear here dynamically.
          </p>
        </div>
      )}

    </div>
  );
};
