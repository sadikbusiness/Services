import React, { useState } from "react";
import { Shield, Sparkles, Languages, Menu, X, Landmark, UserCheck, Phone, Mail, MapPin } from "lucide-react";
import { translations } from "../translations";
import { SystemSettings } from "../types";

interface HeaderProps {
  currentLanguage: "en" | "bn";
  onLanguageChange: (lang: "en" | "bn") => void;
  currentView: string;
  onViewChange: (view: string) => void;
  settings: SystemSettings | null;
}

export default function Header({
  currentLanguage,
  onLanguageChange,
  currentView,
  onViewChange,
  settings,
}: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const t = translations[currentLanguage];

  const menuItems = [
    { id: "home", label: t.navHome },
    { id: "about", label: t.navAbout },
    { id: "helpers", label: t.navHelpers },
    { id: "guards", label: t.navGuards },
    { id: "pickup", label: t.navPickup },
    { id: "notices", label: t.navNotices },
    { id: "contact", label: t.navContact },
  ];

  const handleNavClick = (viewId: string) => {
    onViewChange(viewId);
    setMobileMenuOpen(false);
  };

  return (
    <div className="w-full flex flex-col z-50">
      
      {/* 1. TOP CONTACT BAR */}
      <div id="top_contact_bar" className="w-full bg-[#1E3566] text-white py-2 px-4 sm:px-6 lg:px-8 border-b border-white/10">
        <div className="mx-auto max-w-7xl flex flex-col sm:flex-row justify-between items-center gap-2 text-xs font-medium">
          
          {/* Leftside: Contact details */}
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-[11px] font-sans">
            <a href={`tel:${settings?.contact_number || "+8801700001122"}`} className="flex items-center gap-1.5 hover:text-[#E6B325] transition-colors">
              <Phone className="h-3.5 w-3.5 text-[#E6B325]" />
              <span>{settings?.contact_number || "+880 1700-001122"}</span>
            </a>
            <a href={`mailto:${settings?.email || "info@exprogroupbd.com"}`} className="flex items-center gap-1.5 hover:text-[#E6B325] transition-colors">
              <Mail className="h-3.5 w-3.5 text-[#E6B325]" />
              <span>{settings?.email || "info@exprogroupbd.com"}</span>
            </a>
            <div className="hidden md:flex items-center gap-1.5 text-white/90">
              <MapPin className="h-3.5 w-3.5 text-[#E6B325]" />
              <span>{settings?.office_address || "Dhaka, Bangladesh"}</span>
            </div>
          </div>

          {/* Rightside: Licensing Info and Language toggle */}
          <div className="flex items-center gap-4 text-[11px]">
            <span className="hidden sm:inline-block text-white/70 border-r border-white/20 pr-4 font-mono">
              Govt. Approved License: RL-203874P
            </span>
            <button
              id="btn_lang_toggle"
              onClick={() => onLanguageChange(currentLanguage === "en" ? "bn" : "en")}
              className="flex items-center gap-1 hover:text-[#E6B325] transition-colors font-bold uppercase cursor-pointer"
              title="Switch Language"
            >
              <Languages className="h-3.5 w-3.5 text-[#E6B325]" />
              <span>{currentLanguage === "en" ? "বাংলা" : "English"}</span>
            </button>
          </div>

        </div>
      </div>

      {/* 2. CORPORATE NAVIGATION HEADER */}
      <header id="app_header_navigation" className="sticky top-0 w-full border-b border-slate-205 bg-white shadow-sm">
        <div className="mx-auto flex max-w-7xl h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          
          {/* Left: Brand Logo & Title */}
          <button
            id="btn_brand_logo"
            onClick={() => handleNavClick("home")}
            className="flex items-center gap-3 text-left cursor-pointer focus:outline-none transition-transform active:scale-95"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#1E3566] text-white font-black text-sm shrink-0 tracking-tight border-2 border-[#E6B325]">
              NS
            </div>
            <div>
              <span className="block font-poppins text-sm sm:text-base font-black leading-none tracking-tight text-[#1E3566]">
                {settings?.company_name || "Nirapotta & Seba"}
              </span>
              <span className="block font-mono text-[9px] tracking-widest text-[#E6B325] uppercase mt-0.5 font-bold">
                Manpower Ltd.
              </span>
            </div>
          </button>

          {/* Center: Desktop Navigation List */}
          <nav id="desktop_nav_links" className="hidden lg:flex items-center gap-1">
            {menuItems.map((item) => {
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav_link_${item.id}`}
                  onClick={() => handleNavClick(item.id)}
                  className={`px-3 py-1.5 text-xs font-bold rounded transition-all duration-150 cursor-pointer ${
                    isActive
                      ? "text-[#1E3566] border-b-2 border-[#E6B325] rounded-none bg-slate-50"
                      : "text-slate-600 hover:text-[#1E3566] hover:bg-slate-50"
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Right Action buttons */}
          <div id="desktop_nav_actions" className="flex items-center gap-2">
            
            {/* Join Portal (Apply) */}
            <button
              id="btn_cta_apply"
              onClick={() => handleNavClick("apply_work")}
              className="hidden sm:inline-flex items-center gap-1.5 rounded border border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 transition-colors cursor-pointer active:scale-95 hover:border-[#1E3566]"
            >
              <UserCheck className="h-3.5 w-3.5 text-emerald-600" />
              {t.navApplyWork}
            </button>

            {/* Hire Now Trigger */}
            <button
              id="btn_cta_hire"
              onClick={() => handleNavClick("hire_now")}
              className="hidden sm:inline-flex items-center gap-1.5 rounded bg-[#1E3566] border border-[#1E3566] px-3.5 py-1.5 text-xs font-bold text-white hover:bg-[#243B72] hover:border-[#E6B325] transition-all cursor-pointer active:scale-95 shadow-sm"
            >
              <Sparkles className="h-3.5 w-3.5 text-[#E6B325]" />
              {t.navHireNow}
            </button>

            {/* Admin Panel Entry */}
            <button
              id="btn_cta_admin"
              onClick={() => handleNavClick("admin")}
              className={`flex items-center justify-center p-1.5 rounded text-xs font-semibold transition-colors border cursor-pointer ${
                currentView === "admin"
                  ? "bg-[#1E3566] border-[#E6B325] text-white"
                  : "border-slate-200 text-slate-700 hover:bg-slate-50"
              }`}
              title="Admin Login Dashboard"
            >
              <Landmark className="h-4 w-4" />
              <span className="sr-only">Admin</span>
            </button>

            {/* Mobile responsive toggle */}
            <button
              id="btn_mobile_menu_toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex lg:hidden items-center justify-center rounded p-1.5 text-[#1E3566] hover:bg-slate-100 hover:text-slate-900 focus:outline-none cursor-pointer"
            >
              {mobileMenuOpen ? <X className="h-5.5 w-5.5" /> : <Menu className="h-5.5 w-5.5" />}
            </button>
          </div>
        </div>

        {/* Mobile Nav Drawer */}
        {mobileMenuOpen && (
          <div id="mobile_nav_drawer" className="lg:hidden border-t border-slate-200 bg-white px-4 py-3 shadow-md space-y-1.5">
            {menuItems.map((item) => {
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  id={`mobile_nav_link_${item.id}`}
                  onClick={() => handleNavClick(item.id)}
                  className={`block w-full text-left px-3 py-2 text-xs font-bold rounded transition-colors cursor-pointer ${
                    isActive
                      ? "bg-[#1E3566] text-white border-l-4 border-[#E6B325]"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
            
            <div className="grid grid-cols-2 gap-2 pt-2.5 border-t border-slate-100">
              <button
                id="mobile_btn_apply"
                onClick={() => handleNavClick("apply_work")}
                className="flex items-center justify-center gap-1.5 rounded border border-slate-200 py-2.5 text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 cursor-pointer"
              >
                <UserCheck className="h-3.5 w-3.5 text-emerald-600" />
                {t.navApplyWork}
              </button>

              <button
                id="mobile_btn_hire"
                onClick={() => handleNavClick("hire_now")}
                className="flex items-center justify-center gap-1.5 rounded bg-[#1E3566] py-2.5 text-xs font-bold text-white hover:bg-[#243B72] cursor-pointer"
              >
                <Sparkles className="h-3.5 w-3.5 text-[#E6B325]" />
                {t.navHireNow}
              </button>
            </div>
          </div>
        )}
      </header>
    </div>
  );
}
