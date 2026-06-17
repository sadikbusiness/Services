import React from "react";
import { Mail, Phone, MapPin, Facebook, Twitter, Linkedin, ShieldAlert } from "lucide-react";
import { translations } from "../translations";
import { SystemSettings } from "../types";

interface FooterProps {
  currentLanguage: "en" | "bn";
  onViewChange: (view: string) => void;
  settings: SystemSettings | null;
}

export default function Footer({ currentLanguage, onViewChange, settings }: FooterProps) {
  const t = translations[currentLanguage];

  return (
    <footer id="app_footer_container" className="bg-[#111E38] text-slate-300 border-t-4 border-[#E6B325]">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-4">
          
          {/* Col 1: Brand & Licensing */}
          <div className="space-y-4">
            <h3 className="text-white font-poppins font-black text-lg tracking-tight uppercase border-b-2 border-[#E6B325]/30 pb-2">
              {settings?.company_name || "Nirapotta & Seba"}
              <span className="block text-[#E6B325] text-xs font-mono font-bold lowercase tracking-wider mt-1">manpower outsourced ltd.</span>
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed font-sans font-medium">
              {settings?.seo_description || "Connecting modern businesses and premium households with government approved background scrutinized domestic assistance, elite watchguards, and corporately managed daily AC transport lines across Bangladesh."}
            </p>
            <div className="flex gap-2 pt-2">
              {settings?.social_facebook && (
                <a
                  href={settings.social_facebook}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 rounded bg-white/5 border border-white/10 text-slate-400 hover:bg-[#E6B325] hover:text-[#111E38] hover:border-[#E6B325] transition-all transform hover:-translate-y-0.5"
                  title="Follow on Facebook"
                >
                  <Facebook className="h-4 w-4" />
                </a>
              )}
              {settings?.social_twitter && (
                <a
                  href={settings.social_twitter}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 rounded bg-white/5 border border-white/10 text-slate-400 hover:bg-[#E6B325] hover:text-[#111E38] hover:border-[#E6B325] transition-all transform hover:-translate-y-0.5"
                  title="Follow on Twitter"
                >
                  <Twitter className="h-4 w-4" />
                </a>
              )}
              {settings?.social_linkedin && (
                <a
                  href={settings.social_linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 rounded bg-white/5 border border-white/10 text-slate-400 hover:bg-[#E6B325] hover:text-[#111E38] hover:border-[#E6B325] transition-all transform hover:-translate-y-0.5"
                  title="Connect on LinkedIn"
                >
                  <Linkedin className="h-4 w-4" />
                </a>
              )}
            </div>
          </div>

          {/* Col 2: Services Quick Links */}
          <div className="space-y-4">
            <h4 className="text-[11px] font-black text-[#E6B325] uppercase tracking-widest font-mono border-l-2 border-[#E6B325] pl-2">
              {currentLanguage === "en" ? "Service Divisions" : "আমাদের সার্ভিসসমূহ"}
            </h4>
            <div className="flex flex-col gap-2.5 text-xs">
              <button
                onClick={() => onViewChange("helpers")}
                className="text-left text-slate-300 hover:text-white hover:underline transition-all cursor-pointer font-bold uppercase tracking-wide"
              >
                {t.navHelpers}
              </button>
              <button
                onClick={() => onViewChange("guards")}
                className="text-left text-slate-300 hover:text-white hover:underline transition-all cursor-pointer font-bold uppercase tracking-wide"
              >
                {t.navGuards}
              </button>
              <button
                onClick={() => onViewChange("pickup")}
                className="text-left text-slate-300 hover:text-white hover:underline transition-all cursor-pointer font-bold uppercase tracking-wide"
              >
                {t.navPickup}
              </button>
              <button
                onClick={() => onViewChange("notices")}
                className="text-left text-slate-300 hover:text-white hover:underline transition-all cursor-pointer font-bold uppercase tracking-wide"
              >
                {t.navNotices}
              </button>
            </div>
          </div>

          {/* Col 3: Corporate Portals */}
          <div className="space-y-4">
            <h4 className="text-[11px] font-black text-[#E6B325] uppercase tracking-widest font-mono border-l-2 border-[#E6B325] pl-2">
              {currentLanguage === "en" ? "Corporate Portals" : "যোগ দিন"}
            </h4>
            <div className="flex flex-col gap-2.5 text-xs">
              <button
                onClick={() => onViewChange("apply_work")}
                className="text-left text-slate-300 hover:text-white hover:underline transition-all cursor-pointer font-bold uppercase tracking-wide"
              >
                {t.navApplyWork}
              </button>
              <button
                onClick={() => onViewChange("hire_now")}
                className="text-left text-slate-300 hover:text-white hover:underline transition-all cursor-pointer font-bold uppercase tracking-wide"
              >
                {t.navHireNow}
              </button>
              <button
                onClick={() => onViewChange("about")}
                className="text-left text-slate-300 hover:text-white hover:underline transition-all cursor-pointer font-bold uppercase tracking-wide"
              >
                {t.navAbout}
              </button>
              <button
                onClick={() => onViewChange("contact")}
                className="text-left text-slate-300 hover:text-white hover:underline transition-all cursor-pointer font-bold uppercase tracking-wide"
              >
                {t.navContact}
              </button>
            </div>
          </div>

          {/* Col 4: Contact & Office info */}
          <div className="space-y-4">
            <h4 className="text-[11px] font-black text-[#E6B325] uppercase tracking-widest font-mono border-l-2 border-[#E6B325] pl-2">
              {currentLanguage === "en" ? "Dhaka Headquarters" : "সরাসরি যোগাযোগ"}
            </h4>
            <div className="flex flex-col gap-3 text-xs text-slate-300">
              <div className="flex items-start gap-2.5">
                <MapPin className="h-4.5 w-4.5 text-[#E6B325] mt-0.5 shrink-0" />
                <span className="leading-tight text-slate-400 font-bold">{settings?.office_address || "Dhaka Office, Bangladesh"}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="h-4.5 w-4.5 text-emerald-500 shrink-0" />
                <span className="text-slate-400 font-bold">{settings?.contact_number || "+880 1700-001122"}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="h-4.5 w-4.5 text-orange-400 shrink-0" />
                <span className="truncate text-slate-400 font-bold">{settings?.email || "info@exprogroupbd.com"}</span>
              </div>
            </div>
            
            {/* Custom security badge element */}
            <div className="text-[10px] bg-black/30 p-3 rounded border border-white/10 font-mono text-slate-400 flex items-start gap-2 leading-tight">
              <ShieldAlert className="h-4.5 w-4.5 text-amber-500 shrink-0" />
              <span>
                {t.officeHours}:<br />
                <strong className="text-white mt-1 block">{t.officeHoursVal}</strong>
              </span>
            </div>
          </div>

        </div>

        {/* Bottom copyright alignment bar */}
        <div className="mt-16 pt-8 border-t border-white/5 text-center flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-medium">
          <p className="text-[11px] text-slate-500 font-mono">
            {settings?.footer_text || "© 2026 Nirapotta & Seba Manpower Ltd. All rights reserved."}
          </p>
          <div className="flex flex-wrap items-center gap-4 text-[10px] font-mono text-slate-500">
            <span>License No: <strong className="text-slate-400">RL-203874P</strong></span>
            <span className="hidden sm:inline text-white/10">•</span>
            <span>Security ID: <strong className="text-slate-400">SEC-BD942</strong></span>
            <span className="hidden sm:inline text-white/10">•</span>
            <span className="text-emerald-500 font-bold">● System Secured</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
