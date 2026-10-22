import React, { useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Package, 
  Users, 
  MessageSquare, 
  Settings, 
  LogOut, 
  Menu, 
  X,
  ExternalLink,
  Layers,
  Sparkles,
  Image as ImageIcon,
  RefreshCw,
  Sliders,
  Compass
} from "lucide-react";
import { useApp } from "../../context/AppContext";
import { AdminLogin } from "./AdminLogin";

export const AdminLayout = () => {
  const { adminUser, adminLogout, settings, syncAllWithFirestore, isSyncing } = useApp();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // If not logged in as admin, show the secure AdminLogin page
  if (!adminUser) {
    return <AdminLogin />;
  }

  const navItems = [
    { 
      group: "Operations",
      items: [
        { name: "Dashboard", path: "/admin", icon: LayoutDashboard },
        { name: "Orders", path: "/admin/orders", icon: ShoppingBag },
        { name: "Products", path: "/admin/products", icon: Package },
        { name: "Users & Customers", path: "/admin/customers", icon: Users },
        { name: "Forms & Enquiries", path: "/admin/enquiries", icon: MessageSquare }
      ]
    },
    { 
      group: "Website Content",
      items: [
        { name: "Website Menu Pages", path: "/admin/pages", icon: Compass },
        { name: "Home Page Sections", path: "/admin/home-sections", icon: Layers },
        { name: "Media & Images", path: "/admin/media", icon: ImageIcon },
        { name: "Brand Settings", path: "/admin/content", icon: Settings }
      ]
    }
  ];

  const isActive = (path) => {
    if (path === "/admin") return location.pathname === "/admin";
    return location.pathname.startsWith(path);
  };

  const handleLogout = () => {
    adminLogout();
    navigate("/admin");
  };

  return (
    <div className="h-screen w-full bg-[#18060C] flex flex-col md:flex-row text-[#FAF5EB] antialiased selection:bg-[#632736] selection:text-white overflow-hidden">
      
      {/* Mobile Top Header */}
      <div className="md:hidden shrink-0 bg-[#240B13] border-b border-[#4A1826] text-white px-4 py-3 flex items-center justify-between shadow-lg sticky top-0 z-50">
        <div className="flex items-center gap-2.5">
          <img
            src={settings.logo || "/logo.png"}
            alt="Logo"
            className="w-8 h-8 rounded-full bg-white object-cover border border-[#CD97A5]/40"
            onError={(e) => { e.target.src = "/logo.png"; }}
          />
          <div>
            <span className="font-serif font-bold text-sm text-[#FAF5EB] block leading-tight">
              {settings.storeName}
            </span>
            <span className="text-[10px] text-[#CD97A5] tracking-wider block">Admin Panel</span>
          </div>
        </div>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-1.5 rounded-lg text-white hover:bg-white/10 cursor-pointer"
          aria-label="Toggle Navigation"
        >
          {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Backdrop Overlay */}
      {sidebarOpen && (
        <div 
          onClick={() => setSidebarOpen(false)} 
          className="fixed inset-0 bg-black/60 z-30 md:hidden"
        />
      )}

      {/* Left Sidebar: Independent scroll container with all text in bright white (#FFFFFF) */}
      <aside
        className={`fixed md:relative inset-y-0 left-0 z-40 w-64 h-full shrink-0 bg-[#220A12] border-r border-[#3E1421] text-[#FFFFFF] flex flex-col justify-between transition-transform duration-300 md:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex-1 overflow-y-auto overscroll-contain scrollbar-thin scrollbar-thumb-[#4D1B28]">
          {/* Logo & Portal Branding */}
          <div className="p-5 border-b border-[#3E1421] flex items-center gap-3 bg-[#1C070F] shrink-0">
            <div className="w-11 h-11 rounded-full bg-white overflow-hidden shrink-0 border-2 border-[#CD97A5]/60 shadow-md">
              <img
                src={settings.logo || "/logo.png"}
                alt="Ruchi Creation"
                className="w-full h-full object-cover"
                onError={(e) => { e.target.src = "/logo.png"; }}
              />
            </div>
            <div className="overflow-hidden text-left">
              <h2 className="font-serif font-bold text-sm text-[#FFFFFF] tracking-wide truncate">
                {settings.storeName}
              </h2>
              <span className="text-[10px] text-[#FFFFFF] font-medium tracking-widest uppercase block">
                ADMINISTRATION
              </span>
            </div>
          </div>

          {/* Navigation Groups */}
          <nav className="p-3 space-y-5 text-xs text-left">
            {navItems.map((group, gIdx) => (
              <div key={gIdx} className="space-y-1">
                <div className="px-3.5 text-[10px] uppercase font-bold tracking-widest text-[#FFFFFF] mb-1.5">
                  {group.group}
                </div>
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.path);

                  return (
                    <Link
                      key={item.name}
                      to={item.path}
                      onClick={() => setSidebarOpen(false)}
                      className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all ${
                        active
                          ? "bg-[#4D1B28] text-[#FFFFFF] font-semibold border border-[#7D2C42] shadow-sm shadow-[#1F070E]"
                          : "text-[#FFFFFF] hover:bg-[#32111D]"
                      }`}
                    >
                      <Icon className={`w-4 h-4 shrink-0 ${active ? "text-[#E5DAC8]" : "text-[#CD97A5]"}`} />
                      <span className="tracking-wide text-[#FFFFFF]">{item.name}</span>
                    </Link>
                  );
                })}
              </div>
            ))}
          </nav>
        </div>

        {/* Sidebar Footer: Storefront Link, Sync & Logout */}
        <div className="p-3 border-t border-[#3E1421] bg-[#1C070F] space-y-1.5 text-xs shrink-0">
          <Link
            to="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between px-3 py-2 rounded-lg text-[#FFFFFF] hover:bg-white/5 transition-colors"
          >
            <span className="flex items-center gap-2 text-[#FFFFFF]">
              <ExternalLink className="w-3.5 h-3.5 text-[#CD97A5]" />
              <span className="text-[#FFFFFF]">View Live Website</span>
            </span>
            <span className="text-[10px] text-[#FFFFFF] bg-black/40 px-1.5 py-0.5 rounded">Store</span>
          </Link>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-[#FFFFFF] hover:bg-rose-950/40 transition-colors cursor-pointer text-left"
          >
            <LogOut className="w-3.5 h-3.5 shrink-0 text-rose-400" />
            <span className="text-[#FFFFFF]">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area: Independent scroll container */}
      <main className="flex-1 flex flex-col h-full min-w-0 overflow-y-auto overscroll-contain">
        {/* Top Header Bar */}
        <header className="hidden md:flex shrink-0 bg-[#220A12] border-b border-[#3E1421] text-white px-8 py-3.5 items-center justify-between sticky top-0 z-30 shadow-md">
          <div className="flex items-center gap-3">
            <h1 className="text-sm font-semibold tracking-wider text-[#FAF5EB] uppercase">
              Admin Portal
            </h1>
            <span className="text-xs px-2 py-0.5 rounded-full bg-[#4D1B28] text-[#E5DAC8] border border-[#632736]">
              Dark Burgundy Mode
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs">
            {/* Quick Sync Button */}
            <button
              onClick={() => syncAllWithFirestore()}
              disabled={isSyncing}
              title="Sync orders with Cloud Firestore"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#32111D] hover:bg-[#4D1B28] border border-[#521D2C] text-[#E5DAC8] transition-all cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? "animate-spin text-amber-400" : ""}`} />
              <span>{isSyncing ? "Syncing..." : "Sync Orders"}</span>
            </button>

            {/* View Live Store */}
            <Link
              to="/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-[#CD97A5] hover:text-white transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Live Website</span>
            </Link>

            {/* Profile Pill */}
            <div className="flex items-center gap-2.5 pl-3 border-l border-[#3E1421]">
              <div className="text-right">
                <span className="block font-semibold text-white leading-tight">
                  {settings.owner || "Ruchika Anvekar"}
                </span>
                <span className="text-[10px] text-[#CD97A5] block">Store Administrator</span>
              </div>
              <div className="w-8 h-8 rounded-full bg-[#632736] text-white flex items-center justify-center font-bold text-xs border border-[#CD97A5]/40 shadow-xs">
                RA
              </div>
            </div>
          </div>
        </header>

        {/* Content Container with Luxury Dark Burgundy Background */}
        <div className="p-4 sm:p-8 bg-[#18060C] flex-1">
          <Outlet />
        </div>
      </main>

    </div>
  );
};
