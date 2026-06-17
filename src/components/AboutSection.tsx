import React from "react";
import { Sparkles, Trophy, ShieldAlert, CheckCircle2, ChevronRight, HardHat, FileBadge2 } from "lucide-react";
import { translations } from "../translations";
import { SystemSettings } from "../types";

interface AboutSectionProps {
  currentLanguage: "en" | "bn";
  settings: SystemSettings | null;
}

export default function AboutSection({ currentLanguage, settings }: AboutSectionProps) {
  const t = translations[currentLanguage];

  const coreValues = [
    {
      title: currentLanguage === "en" ? "Police Clearance Standards" : "কঠোর চারিত্রিক যাচাইকরণ",
      desc: currentLanguage === "en" ? "We enforce mandatory police vetting, address tracking, and sub-district verification for every individual on our platform." : "আমাদের প্রতিটি কর্মীর জন্য পুলিশ ভেরিফিকেশন এবং ইউনিয়ন পরিষদ বা চেয়ারম্যান চারিত্রিক ক্লিয়ারেন্স ও এনআইডি ডাটা চেক করা হয়।"
    },
    {
      title: currentLanguage === "en" ? "Safe Wages & Dignity" : "ন্যায্য মজুরি ও সস্মান",
      desc: currentLanguage === "en" ? "We ensure workers are paid fair wages directly, protecting them from predatory agents and middle-man fee cuts." : "আমরা কর্মীদের জন্য সরকার নির্ধারিত ন্যায্য বেতন এবং নিয়মিত কাজের পরিবেশ নিশ্চিত করি, কোনো মধ্যস্বত্বভোগীদের হস্তক্ষেপ ছাড়া।"
    },
    {
      title: currentLanguage === "en" ? "Continuous Professional Training" : "পেশাদার কাজের ট্রেনিং",
      desc: currentLanguage === "en" ? "Before deployed, personnel go through special behavioral, hygiene, first aid, and fire-escape response classes." : "বাসায় বা অফিসে কাজে যোগ দেওয়ার আগে সকল সাহায্যকারী ও সিকিউরিটিকে আচরণগত শিষ্টাচার ও নিরাপত্তা সচেতনতা ট্রেনিং দেওয়া হয়।"
    }
  ];

  return (
    <div id="about_view_container" className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-16">
      
      {/* Editorial Title */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          {t.aboutTitle}
        </h2>
        <p className="text-slate-500 text-sm sm:text-base leading-relaxed">
          {t.aboutSub}
        </p>
      </div>

      {/* Grid: Narrative Block */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <span className="text-xs uppercase tracking-widest font-bold text-indigo-600">
            {currentLanguage === "en" ? "Who We Are" : "আমাদের পরিচিতি"}
          </span>
          <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Connecting premium employers with vetted, secure, and disciplined manpower solutions in Dhaka.
          </h3>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            {currentLanguage === "en"
              ? "Founded during demanding periods for reliable service partners, our agency acts as a legal and structural marketplace bridged between households, real-estates, commercial centers, and top-tier service specialists. We handle the end-to-end recruitment, document checking, background searches, and scheduling, giving employers complete peace of mind."
              : "বিশ্বস্ত গৃহকর্মী, দক্ষ সিকিউরিটি প্রহরী এবং নিয়মিত পিকআপ ড্রাইভার খোঁজার নিরাপদ প্ল্যাটফর্ম হিসেবে নিরপত্তা ও সেবা ম্যানপাওয়ার সার্ভিসেস সুনামের সাথে কাজ করে আসছে। আমরা প্রতিটি কর্মীর ব্যাকগ্রাউন্ড, চারিত্রিক সনদ ও কাজের অভিজ্ঞতা সরাসরি তদন্ত করে নিয়োগ দিয়ে থাকি যাতে আপনার পরিবার ও সম্পদের নিরাপত্তা নিশ্চিত হয়।"}
          </p>

          <div className="grid grid-cols-2 gap-6 pt-4 border-t border-gray-100">
            <div className="space-y-1">
              <span className="block text-3xl font-extrabold text-indigo-600">RL-20387</span>
              <span className="block text-xs text-slate-500 font-semibold uppercase tracking-wider">Recruitment License</span>
            </div>
            <div className="space-y-1">
              <span className="block text-3xl font-extrabold text-cyan-600">100%</span>
              <span className="block text-xs text-slate-500 font-semibold uppercase tracking-wider">Vetting Rate</span>
            </div>
          </div>
        </div>

        <div className="aspect-square rounded-2xl overflow-hidden shadow-md border border-gray-100 bg-slate-50 relative">
          <img
            src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=800"
            alt="Office workspace"
            className="h-full w-full object-cover filter brightness-95"
          />
          <div className="absolute top-4 right-4 bg-white/95 backdrop-blur px-4 py-2.5 rounded-xl border border-gray-100 flex items-center gap-2 shadow text-xs font-bold text-slate-800">
            <FileBadge2 className="h-4 w-4 text-indigo-650" />
            <span>ISO 9001 Vetted Standard</span>
          </div>
        </div>
      </div>

      {/* Mission & Vision Bento */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-gradient-to-br from-indigo-900 to-indigo-950 text-indigo-100 p-8 rounded-2xl border border-indigo-800/20 space-y-4">
          <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-indigo-500/20 border border-indigo-400/25">
            <Trophy className="h-5 w-5 text-indigo-200" />
          </div>
          <h4 className="text-xl font-bold text-white tracking-tight">{t.mission}</h4>
          <p className="text-sm text-indigo-200/90 leading-relaxed font-sans">
            {t.missionText}
          </p>
        </div>

        <div className="bg-gradient-to-br from-slate-900 to-slate-950 text-slate-100 p-8 rounded-2xl border border-slate-800/20 space-y-4">
          <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-slate-800 border border-slate-700/25">
            <Sparkles className="h-5 w-5 text-slate-200" />
          </div>
          <h4 className="text-xl font-bold text-white tracking-tight">{t.vision}</h4>
          <p className="text-sm text-slate-200/90 leading-relaxed font-sans">
            {t.visionText}
          </p>
        </div>
      </div>

      {/* Core Values / Standard Compliance */}
      <section className="space-y-8 bg-slate-55 p-8 rounded-2xl border border-slate-100">
        <div className="max-w-2xl">
          <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest block mb-1">Our Standards</span>
          <h4 className="text-2xl font-bold text-slate-900 tracking-tight">Strict Compliance & Care Vow</h4>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {coreValues.map((val, i) => (
            <div key={i} className="space-y-2">
              <div className="h-2 w-10 bg-indigo-500 rounded-full"></div>
              <h5 className="font-bold text-slate-900 text-base pt-2">{val.title}</h5>
              <p className="text-slate-500 text-xs leading-relaxed">{val.desc}</p>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
