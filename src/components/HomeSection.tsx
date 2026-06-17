import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { 
  ShieldCheck, UserCheck, Star, ArrowRight, ClipboardCheck, 
  PhoneCall, Calendar, Award, CheckCircle2, MapPin, Briefcase, 
  Target, Users, ArrowUpRight, Sparkles, Building, BookOpen
} from "lucide-react";
import { translations } from "../translations";
import { SystemSettings, Notice } from "../types";

// Animated counter component for premium stats section
function AnimatedCounter({ value, duration = 1500 }: { value: string; duration?: number }) {
  const numericValue = parseInt(value.replace(/[^0-9]/g, ""), 10) || 0;
  const suffix = value.replace(/[0-9]/g, "");
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number | null = null;
    let animationFrameId: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * numericValue));
      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animate);
      }
    };
    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, [numericValue, duration]);

  return (
    <span className="font-poppins text-4xl sm:text-5xl font-black text-[#1E3566]">
      {count.toLocaleString()}{suffix}
    </span>
  );
}

interface HomeSectionProps {
  currentLanguage: "en" | "bn";
  onViewChange: (view: string) => void;
  settings: SystemSettings | null;
  notices: Notice[];
}

export default function HomeSection({
  currentLanguage,
  onViewChange,
  settings,
  notices,
}: HomeSectionProps) {
  const t = translations[currentLanguage];
  const recentNotices = notices.slice(0, 3);

  const stats = [
    { 
      value: "10,000+", 
      label: currentLanguage === "en" ? "Verified Workers" : "যাচাইকৃত কর্মী", 
      icon: UserCheck, 
      desc: currentLanguage === "en" ? "Biometric & police-vetted candidates" : "বায়োমেট্রিক ও পুলিশ ভেরিফাইড কর্মী",
    },
    { 
      value: "5,000+", 
      label: currentLanguage === "en" ? "Successful Placements" : "সফল নিয়োগ সমাধান", 
      icon: ClipboardCheck, 
      desc: currentLanguage === "en" ? "Households & Corporate placements" : "বাসা ও কর্পোরেট কারখানায় নিয়োজিত",
    },
    { 
      value: "500+", 
      label: currentLanguage === "en" ? "Corporate Clients" : "কর্পোরেট ক্লায়েন্ট", 
      icon: Building, 
      desc: currentLanguage === "en" ? "Offices, banks & premises protected" : "অফিস, ব্যাংক ও গার্মেন্টস সেবা",
    },
    { 
      value: "15+", 
      label: currentLanguage === "en" ? "Years Experience" : "১৫+ বছরের অভিজ্ঞতা", 
      icon: Award, 
      desc: currentLanguage === "en" ? "Established authority in Bangladesh" : "বাংলাদেশের বিশ্বস্ত ক্যারিয়ার পার্টনার",
    },
  ];

  const categories = [
    {
      id: "helpers",
      title: t.helpersTitle,
      desc: t.helpersDesc,
      icon: Users,
      bullets: currentLanguage === "en" 
        ? ["Professional Cook & Housemaids", "Experienced Child Care & Babysitters", "Senior Citizens Care Assistants", "Professional Deep Cleaning Staff"] 
        : ["দক্ষ হাউসমেড ও বাবুর্চি", "অভিজ্ঞ চাইল্ডকেয়ার ও বেবিসিটার", "বয়স্ক ও রোগাক্রান্তদের বিশেষ কেয়ারগিভার", "ঘরোয়া গভীর পরিচ্ছন্নতা কর্মী"],
      image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&q=80&w=600",
    },
    {
      id: "guards",
      title: t.guardsTitle,
      desc: t.guardsDesc,
      icon: ShieldCheck,
      bullets: currentLanguage === "en" 
        ? ["Residential Building Security", "Commercial office & Mall Watchguards", "Executive Close Protection Escorts", "Public & Private Event Securing"] 
        : ["আবাসিক ও ফ্ল্যাট সিকিউরিটি", "অফিস ও শপিংমল প্রহরী", "ভিআইপি ক্লোজ প্রটেকশন অফিসার", "পাবলিক ও প্রাইভেট প্রোগ্রাম সিকিউরিটি"],
      image: "https://images.unsplash.com/photo-1544027993-37dbfe43562a?auto=format&fit=crop&q=80&w=600",
    },
    {
      id: "pickup",
      title: t.pickupTitle,
      desc: t.pickupDesc,
      icon: Target,
      bullets: currentLanguage === "en" 
        ? ["Daily School Transport Shuttles", "Point-to-Point Executive AC Buses", "VIP Airport Secure Transits", "Vetted Drivers with Verified License"] 
        : ["স্কুল বা মাদ্রাসা দৈনিক শাটল বাস", "পয়েন্ট-টু-পয়েন্ট কর্পোরেট এসি বাহন", "প্রাইভেট এয়ারপোর্ট বুকিং সুবিধা", "বিআরটিএ লাইসেন্সধারী চালক"],
      image: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&q=80&w=600",
    }
  ];

  const featuredWorkers = [
    {
      name: currentLanguage === "en" ? "Mst. Jasmine Begum" : "মোসাম্মৎ জেসমিন বেগম",
      category: currentLanguage === "en" ? "Domestic Helper" : "গৃহকর্মী ও কেয়ার",
      subCategory: currentLanguage === "en" ? "Senior Caregiver & Chef" : "জ্যেষ্ঠ কেয়ার ও শেফ",
      exp: currentLanguage === "en" ? "5 Years Exp" : "৫ বছরের অভিজ্ঞতা",
      nid: "NID-7819****18",
      location: currentLanguage === "en" ? "Gulshan, Dhaka" : "গুলশান, ঢাকা",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300",
      status: currentLanguage === "en" ? "Police Cleared" : "পুলিশ ভেরিফাইড"
    },
    {
      name: currentLanguage === "en" ? "Md. Shahjahan Kabir" : "মোঃ শাহজাহান কবির",
      category: currentLanguage === "en" ? "Security Force" : "নিরাপত্তা প্রহরী",
      subCategory: currentLanguage === "en" ? "Armed Protection Officer" : "সarmed প্রটেকশন অফিসার",
      exp: currentLanguage === "en" ? "8 Years Exp" : "৮ বছরের অভিজ্ঞতা",
      nid: "NID-1982****04",
      location: currentLanguage === "en" ? "Banani, Dhaka" : "বনানী, ঢাকা",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=300",
      status: currentLanguage === "en" ? "Military Checked" : "আইনশৃঙ্খলা বাহিনী ভেরিফাইড"
    },
    {
      name: currentLanguage === "en" ? "Md. Rafiqul Islam" : "মোঃ রফিকুল ইসলাম",
      category: currentLanguage === "en" ? "Transit Professional" : "পিকআপ অ্যান্ড যাতায়াত",
      subCategory: currentLanguage === "en" ? "Corporate AC Driver" : "কর্পোরেট এসি চালক",
      exp: currentLanguage === "en" ? "6 Years Exp" : "৬ বছরের অভিজ্ঞতা",
      nid: "NID-1991****45",
      location: currentLanguage === "en" ? "Mirpur, Dhaka" : "মিরপুর, ঢাকা",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300",
      status: currentLanguage === "en" ? "BRTA Vetted" : "বিআরটিএ লাইসেন্সড"
    }
  ];

  const testimonials = [
    {
      quote: currentLanguage === "en" 
        ? "We requested a full-time senior citizen caregiver from this agency for my elderly grandmother in Gulshan. The vetting standards are outstanding, and they provided a police clearance certification transcript before deployment." 
        : "আমার বয়স্ক নানীর জন্য গুলশানের বাসায় একজন স্থায়ী কেয়ারগিভার নিয়েছি। তাদের ব্যাকগ্রাউন্ড যাচাইকরণ প্রক্রিয়া সত্যিই চমৎকার। কাজে নিয়োগের আগে আমাদের পুলিশ ক্লিয়ারেন্স ফাইলের কপি দেওয়া হয়েছিল।",
      author: "Rezaul Karim Chowdhury",
      role: currentLanguage === "en" ? "Managing Director, Apex Trade" : "ব্যবস্থাপনা পরিচালক, অ্যাপেক্স ট্রেড",
      location: "Gulshan-2, Dhaka",
    },
    {
      quote: currentLanguage === "en" 
        ? "Excellent service deployment of 4 licensed static security guards for our corporate commercial tower. They have perfect uniform discipline, precise shift schedule timing, and very quick response protocols." 
        : "আমাদের কর্পোরেট কমার্শিয়াল টাওয়ারের জন্য ৪ জন লাইসেন্সধারী সিকিউরিটি গার্ড নিয়োগ দিয়েছি। তাদের নিখুঁত ইউনিফর্ম ডিসিপ্লিন, শিফট শিডিউল পরিবর্তন এবং তাৎক্ষণিক সাড়া দেওয়ার দক্ষতা প্রশংসনীয়।",
      author: "Farhana Yasmin",
      role: currentLanguage === "en" ? "Head of Operations, Zenith Group" : "অপারেশনস প্রধান, জেনিথ গ্রুপ",
      location: "Motijheel, Dhaka",
    }
  ];

  // Framer Motion presets for high-end feel
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 80,
        damping: 14,
      },
    },
  };

  return (
    <div id="home_view_wrapper" className="bg-[#FAFBFD] overflow-x-hidden">
      
      {/* 1. HERO SECTION - Premium background with custom shapes and massive typography */}
      <section 
        id="hero_section" 
        className="relative bg-gradient-to-br from-[#0F1E36] via-[#1E3566] to-[#122244] text-white py-24 lg:py-36 border-b border-slate-900 overflow-hidden"
      >
        {/* Abstract subtle glowing backdrops */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-sky-500/10 rounded-full blur-3xl translate-x-1/3 translate-y-1/3" />
        
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            
            {/* Left Side Content with entrance stagger templates */}
            <motion.div 
              className="space-y-8 lg:col-span-7"
              initial="hidden"
              animate="visible"
              variants={containerVariants}
            >
              <motion.div 
                variants={itemVariants}
                className="inline-flex items-center gap-2.5 border border-[#EAB308]/60 px-4 py-1.5 text-xs font-bold text-[#EAB308] tracking-widest uppercase bg-[#EAB308]/5 backdrop-blur-sm shadow-inner"
              >
                <ShieldCheck className="h-4.5 w-4.5 shrink-0 text-[#EAB308]" />
                <span>{currentLanguage === "en" ? "Government Licensed Agency (RL-203874P)" : "সরকারি লাইসেন্সপ্রাপ্ত ও অনুমোদিত এজেন্সি"}</span>
              </motion.div>
              
              <motion.h1 
                variants={itemVariants}
                className="text-4xl sm:text-6xl lg:text-[76px] lg:leading-[1.08] font-black font-poppins tracking-tight text-white"
              >
                {currentLanguage === "en" ? (
                  <>
                    Elite Professional <br />
                    Manpower Vetted <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#EAB308] via-yellow-400 to-[#FACC15]">For Complete Safety</span>
                  </>
                ) : (
                  <>
                    নিরাপদ ও নির্ভরযোগ্য কর্মী <br />
                    সরবরাহ এবং <br />
                    <span className="text-[#EAB308]">ভেরিফাইড জনশক্তি সেবা</span>
                  </>
                )}
              </motion.h1>
              
              <motion.p 
                variants={itemVariants}
                className="text-lg sm:text-xl lg:text-[24px] text-slate-300 leading-relaxed max-w-2xl font-light font-sans"
              >
                {t.heroSub}
              </motion.p>

              {/* Action buttons list (Large and Prominent CTA) */}
              <motion.div 
                variants={itemVariants}
                className="flex flex-col sm:flex-row gap-5 pt-4"
              >
                <button
                  onClick={() => onViewChange("hire_now")}
                  className="group flex items-center justify-center gap-2.5 rounded-none bg-[#EAB308] hover:bg-[#FACC15] px-10 py-5 text-sm font-black text-[#1E3566] transition-all cursor-pointer uppercase tracking-widest shadow-xl shadow-yellow-500/10 hover:shadow-yellow-500/20 active:scale-[0.98]"
                >
                  <span>{t.btnHireNow}</span>
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1.5 transition-transform" />
                </button>
                
                <button
                  onClick={() => onViewChange("apply_work")}
                  className="flex items-center justify-center gap-2 rounded-none border-2 border-white bg-transparent hover:bg-white/10 px-10 py-5 text-sm font-bold text-white transition-all cursor-pointer uppercase tracking-widest active:scale-[0.98]"
                >
                  <span>{t.btnApplyWork}</span>
                </button>
              </motion.div>

              {/* Minimalist key checklist features */}
              <motion.div 
                variants={itemVariants}
                className="flex flex-wrap items-center gap-y-3 gap-x-8 pt-8 border-t border-white/10 text-xs sm:text-sm text-slate-300 font-semibold"
              >
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-[#EAB308]" />
                  {currentLanguage === "en" ? "National ID Verified" : "জাতীয় পরিচয়পত্র দ্বারা যাচাইকৃত"}
                </span>
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-[#EAB308]" />
                  {currentLanguage === "en" ? "Mandatory Police Clearance" : "থানা পুলিশ ক্লিয়ারেন্স ভেরিফাইড"}
                </span>
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-[#EAB308]" />
                  {currentLanguage === "en" ? "100% Guaranteed Replacement" : "সম্পূর্ণ কর্মী প্রতিস্থাপন পলিসি"}
                </span>
              </motion.div>
            </motion.div>

            {/* Right Side Image Block */}
            <motion.div 
              className="lg:col-span-5 relative self-stretch flex items-center justify-center"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              <div className="w-full h-full aspect-[4/3] lg:aspect-square overflow-hidden bg-[#243B72] border-2 border-[#EAB308]/30 shadow-2xl relative">
                <img
                  src="https://images.unsplash.com/photo-1521791136368-1a46827d0adb?auto=format&fit=crop&q=80&w=700"
                  alt="Corporate Recruiter Dhaka"
                  className="h-full w-full object-cover filter contrast-[1.03]"
                  referrerPolicy="no-referrer"
                />
                
                {/* Floating Experience Tag inside the Image */}
                <div className="absolute bottom-5 left-5 bg-[#0F1E36]/90 border border-[#EAB308]/40 p-4 backdrop-blur-md">
                  <div className="text-2xl font-black text-[#EAB308] leading-none">15+ Years</div>
                  <div className="text-[10px] text-slate-300 uppercase tracking-widest mt-1">Industry Excellence</div>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* 2. SUCCESS STATISTICS ROW (Clean flat metrics boxes with count animations) */}
      <section id="statistics_row" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 -mt-12 relative z-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <motion.div 
              key={i} 
              className="bg-white p-8 rounded-none border-b-4 border-[#1E3566] border-t border-x border-slate-205 shadow-xl flex flex-col justify-between hover:-translate-y-1.5 transition-transform duration-300"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <div>
                <div className="flex items-center justify-between gap-1.5 mb-3">
                  <span className="text-xs uppercase tracking-wider font-extrabold text-slate-400 font-mono">{stat.label}</span>
                  <div className="p-2.5 bg-slate-50 text-[#1E3566]">
                    <stat.icon className="h-5 w-5" />
                  </div>
                </div>
                <div className="mb-1">
                  <AnimatedCounter value={stat.value} />
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-slate-100 text-xs text-slate-500 font-semibold leading-relaxed">
                {stat.desc}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 3. CORE SERVICE DIVISIONS - Responsive layouts with larger icons & translateY hover effects */}
      <section id="services_section" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-28 md:py-36 space-y-16">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="text-xs font-black text-[#EAB308] tracking-widest uppercase block">
            {currentLanguage === "en" ? "Licensed Manpower Solutions" : "লাইসেন্সকৃত জনশক্তি সেবা"}
          </span>
          <h2 className="text-4xl md:text-5xl font-black text-[#1E3566] tracking-tight font-poppins">
            {t.servicesTitle}
          </h2>
          <p className="text-slate-600 text-base md:text-lg leading-relaxed max-w-2xl mx-auto font-light font-sans">
            {t.servicesSubtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {categories.map((cat, index) => (
            <motion.div
              key={cat.id}
              id={`service_card_${cat.id}`}
              className="bg-white rounded-none border border-slate-205 hover:border-[#1E3566] shadow-md hover:shadow-2xl transition-all duration-300 flex flex-col justify-between"
              style={{ transformOrigin: "center" }}
              whileHover={{ y: -8 }}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
            >
              <div className="space-y-6">
                {/* Visual Image with overlay details */}
                <div className="aspect-[16/10] w-full overflow-hidden bg-slate-100 border-b border-slate-200 relative">
                  <img
                    src={cat.image}
                    alt={cat.title}
                    className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-4 right-4 bg-[#1E3566] text-[#EAB308] p-3 shadow-md">
                    <cat.icon className="h-6 w-6" />
                  </div>
                </div>
                
                {/* Context */}
                <div className="px-8 space-y-4">
                  <h3 className="text-lg font-black text-[#1E3566] uppercase tracking-wide font-poppins">
                    {cat.title}
                  </h3>
                  <p className="text-slate-500 text-sm leading-relaxed font-light">
                    {cat.desc}
                  </p>
                </div>

                {/* Bullets List */}
                <ul className="px-8 space-y-3.5 pt-4 border-t border-slate-100">
                  {cat.bullets.map((bullet, idx) => (
                    <li key={idx} className="flex items-start gap-3.5 text-xs sm:text-sm text-slate-800 font-bold leading-relaxed">
                      <div className="h-2 w-2 bg-[#EAB308] shrink-0 mt-2"></div>
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Button */}
              <div className="p-8">
                <button
                  onClick={() => onViewChange(cat.id)}
                  className="flex items-center justify-center gap-2.5 w-full rounded-none bg-[#1E3566] hover:bg-[#EAB308] py-4 text-xs font-black text-white hover:text-[#1E3566] transition-all uppercase tracking-widest cursor-pointer shadow-sm hover:shadow-md"
                >
                  <span>{currentLanguage === "en" ? "Open Active Listings" : "অনুমোদিত তালিকা দেখুন"}</span>
                  <ArrowRight className="h-4.5 w-4.5" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 4. WHY CHOOSE US - Two crisp corporate columns with staggered reveal */}
      <section id="why_choose_us" className="bg-[#0F1E36] text-white py-24 md:py-32 border-y border-slate-900 relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(234,179,8,0.05),transparent_50%)]" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
            
            <motion.div 
              className="space-y-8"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <span className="text-xs font-black text-[#EAB308] tracking-widest uppercase block">
                {currentLanguage === "en" ? "Compliance & Accountability" : "কমপ্লায়েন্স ও জবাবদিহিতা"}
              </span>
              <h2 className="text-4xl sm:text-5xl font-black text-white tracking-tight font-poppins leading-tight">
                {t.whyChooseUsTitle} <br />
                <span className="text-[#EAB308]">Vetted Security & Hospitality</span>
              </h2>
              <p className="text-slate-300 text-base font-light leading-relaxed max-w-xl font-sans">
                {t.whyChooseUsSub}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-6 border-t border-white/10">
                <div className="space-y-2">
                  <h4 className="font-extrabold text-sm text-[#EAB308] uppercase tracking-wider">{t.verifiedStaff}</h4>
                  <p className="text-xs text-slate-400 leading-relaxed font-light">{t.verifiedStaffDesc}</p>
                </div>

                <div className="space-y-2">
                  <h4 className="font-extrabold text-sm text-[#EAB308] uppercase tracking-wider">{t.exprTeam}</h4>
                  <p className="text-xs text-slate-400 leading-relaxed font-light">{t.exprTeamDesc}</p>
                </div>

                <div className="space-y-2">
                  <h4 className="font-extrabold text-sm text-[#EAB308] uppercase tracking-wider">{t.affordPrice}</h4>
                  <p className="text-xs text-slate-400 leading-relaxed font-light">{t.affordPriceDesc}</p>
                </div>

                <div className="space-y-2">
                  <h4 className="font-extrabold text-sm text-[#EAB308] uppercase tracking-wider">{t.support24}</h4>
                  <p className="text-xs text-slate-400 leading-relaxed font-light">{t.support24Desc}</p>
                </div>
              </div>
            </motion.div>

            {/* Vetting Steps pipeline cards */}
            <motion.div 
              className="bg-white/5 border border-white/10 p-10 space-y-8 backdrop-blur-sm shadow-2xl"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h3 className="text-xl font-black text-white uppercase tracking-wider font-poppins">
                {currentLanguage === "en" ? "Official Vetting Pipeline" : "আইনি প্রার্থী যাচাইকরণ প্রোটোকল"}
              </h3>
              
              <div className="space-y-8">
                <div className="flex gap-5">
                  <span className="text-base font-black text-[#EAB308] font-mono shrink-0 pt-0.5">01</span>
                  <div>
                    <span className="block text-sm font-extrabold text-white uppercase tracking-wider">
                      {currentLanguage === "en" ? "Government NID Matching" : "জাতীয় পরিচয়পত্র তথ্য যাচাই"}
                    </span>
                    <span className="block text-xs sm:text-sm text-slate-400 mt-2 leading-relaxed font-light">
                      {currentLanguage === "en" 
                        ? "Verification with national records NID API confirms true credentials before displaying records on our portal." 
                        : "সরকারি প্রোটোকল অনুযায়ী প্রার্থীর জাতীয় পরিচয়পত্র ও স্থায়ী ঠিকানা নিশ্চিত করা হয়।"}
                    </span>
                  </div>
                </div>

                <div className="flex gap-5">
                  <span className="text-base font-black text-[#EAB308] font-mono shrink-0 pt-0.5">02</span>
                  <div>
                    <span className="block text-sm font-extrabold text-white uppercase tracking-wider">
                      {currentLanguage === "en" ? "Police Records Verification" : "থানা পুলিশ রেকর্ড বিশ্লেষণ"}
                    </span>
                    <span className="block text-xs sm:text-sm text-slate-400 mt-2 leading-relaxed font-light">
                      {currentLanguage === "en" 
                        ? "Mandatory police clearance papers check and background checks verified through district superintendents." 
                        : "নির্ধারিত থানা থেকে ফৌজদারি অপরাধমুক্ত প্রশংসাপত্র নিশ্চিত করে তালিকায় অন্তর্ভুক্তি।"}
                    </span>
                  </div>
                </div>

                <div className="flex gap-5">
                  <span className="text-base font-black text-[#EAB308] font-mono shrink-0 pt-0.5">03</span>
                  <div>
                    <span className="block text-sm font-extrabold text-white uppercase tracking-wider">
                      {currentLanguage === "en" ? "Professional & Medical Fitness Checks" : "পেশাদার ও শারীরিক সুস্থতা রিভিউ"}
                    </span>
                    <span className="block text-xs sm:text-sm text-slate-400 mt-2 leading-relaxed font-light">
                      {currentLanguage === "en" 
                        ? "Physical fitness evaluations, infectious virus scans, and comprehensive work etiquette training." 
                        : "সংক্রামক ব্যাধি দূরীকরণ এবং শারীরিক কাজ পরিচালনার সামর্থ্য নিশ্চিত করতে মেডিকেল টেস্টিং।"}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* 5. FEATURED VETTED WORKERS - Bento format, custom profiles list, premium cards */}
      <section id="featured_workers" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-28 md:py-36 space-y-16">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs font-black text-[#EAB308] tracking-widest uppercase block">
            {currentLanguage === "en" ? "Instant Deployment Selection" : "তাৎক্ষণিক নিয়োগ প্যানেল"}
          </span>
          <h2 className="text-4xl md:text-5xl font-black text-[#1E3566] tracking-tight font-poppins">
            {currentLanguage === "en" ? "Vetted Candidates Roster" : "বিশেষ ভেরিফাইড প্রার্থীর প্রোফাইল"}
          </h2>
          <p className="text-slate-600 text-base md:text-lg font-light font-sans leading-relaxed">
            {currentLanguage === "en" 
              ? "Hire safely from our pre-vetted pool of corporate guards, elite caregivers, and verified drivers." 
              : "নিচের প্রার্থীরা পুলিশ ভেরিফিকেশন ও এনআইডি পরীক্ষা সফলভাবে সম্পন্ন করে কর্মস্থলে যোগ দিতে সম্পূর্ণ প্রস্তুত।"}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {featuredWorkers.map((worker, index) => (
            <motion.div 
              key={index} 
              className="bg-white border border-slate-200 hover:border-[#1E3566] hover:shadow-2xl transition-all duration-300 flex flex-col justify-between"
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15, duration: 0.6 }}
              whileHover={{ y: -8 }}
            >
              
              <div className="p-8 space-y-6">
                
                {/* Visual Header with extra large photo */}
                <div className="flex gap-5 items-center">
                  <div className="h-20 w-20 rounded-none border-2 border-[#1E3566]/20 shrink-0 overflow-hidden bg-slate-100">
                    <img 
                      src={worker.image} 
                      alt={worker.name} 
                      className="h-full w-full object-cover transition-all duration-300 hover:scale-105"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-extrabold text-slate-900 text-base leading-tight font-poppins">
                      {worker.name}
                    </h3>
                    <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                      <span className="text-[10px] font-black text-[#1E3566] bg-slate-100 px-2 py-0.5 uppercase tracking-wider">
                        {worker.category}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400 block">
                        {worker.nid}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Badges Layout */}
                <div className="flex flex-wrap gap-2 pt-2">
                  <div className="text-[10px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1 uppercase tracking-wider">
                    {worker.status}
                  </div>
                  <div className="text-[10px] font-bold text-amber-800 bg-amber-50 border border-amber-200 px-3 py-1 uppercase tracking-wider">
                    {worker.exp}
                  </div>
                </div>

                {/* Sub details with superior alignment */}
                <div className="pt-5 border-t border-slate-100 space-y-3.5 text-xs sm:text-sm text-slate-700 font-semibold">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 font-medium">{currentLanguage === "en" ? "Specialty Field" : "বিশেষ কর্মক্ষেত্র"}:</span>
                    <span className="text-[#1E3566] font-bold uppercase tracking-wide">{worker.subCategory}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 font-medium">{currentLanguage === "en" ? "Deploy Location" : "পোস্টিং এলাকা"}:</span>
                    <span className="text-slate-900 font-bold flex items-center gap-1">
                      <MapPin className="h-4 w-4 text-[#EAB308]" />
                      {worker.location}
                    </span>
                  </div>
                </div>

              </div>

              {/* View profile button configured for hiring request redirection */}
              <div className="p-8 pt-0 border-t border-slate-50">
                <button
                  onClick={() => onViewChange("hire_now")}
                  className="w-full rounded-none py-4 text-xs font-black text-[#1E3566] bg-[#FAFBFD] hover:bg-[#1E3566] hover:text-[#EAB308] border border-slate-205 hover:border-[#1E3566] transition-all uppercase tracking-widest flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                >
                  <Briefcase className="h-4 w-4" />
                  <span>{currentLanguage === "en" ? "Send Hiring Request" : "সাক্ষাৎকারের অনুরোধ পাঠান"}</span>
                </button>
              </div>

            </motion.div>
          ))}
        </div>
      </section>

      {/* 6. RECENT ANNOUNCEMENTS BOARD */}
      <section id="announcements" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24 border-t border-slate-200">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 items-start">
          
          {/* Recent notices column (Span 2) */}
          <div className="lg:col-span-2 space-y-8">
            <div className="flex items-center justify-between border-b border-slate-150 pb-4">
              <h3 className="text-xl font-black text-[#1E3566] uppercase font-poppins tracking-wider flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-[#EAB308]" />
                <span>{t.latestNotices}</span>
              </h3>
              <button
                onClick={() => onViewChange("notices")}
                className="text-xs font-black text-[#1E3566] hover:text-[#EAB308] flex items-center gap-1.5 cursor-pointer transition-colors uppercase tracking-widest"
              >
                <span>{currentLanguage === "en" ? "All Notices" : "সব নোটিশ দেখুন"}</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>

            {recentNotices.length === 0 ? (
              <div className="text-center py-16 bg-white border border-slate-200 text-slate-400 text-sm font-medium">
                {currentLanguage === "en" ? "No active board notices published today." : "এই মুহূর্তে কোনো নোটিশ প্রকাশিত হয়নি।"}
              </div>
            ) : (
              <div className="space-y-5">
                {recentNotices.map((notice, idx) => (
                  <motion.div
                    key={notice.id}
                    onClick={() => onViewChange("notices")}
                    className="p-6 bg-white border border-slate-202 hover:border-[#1E3566] shadow-sm hover:shadow-lg transition-all cursor-pointer space-y-3 group"
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                  >
                    <div className="flex items-center justify-between gap-3 text-[10px] font-bold font-mono">
                      <span className="text-slate-400 flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5" />
                        {new Date(notice.published_date).toLocaleDateString(currentLanguage === "en" ? "en-US" : "bn-BD", {
                          dateStyle: "medium"
                        })}
                      </span>
                      {notice.is_pinned && (
                        <span className="bg-[#EAB308]/15 text-[#1E3566] border border-[#EAB308] px-2 py-0.5 uppercase tracking-wide">
                          PINNED BULLETIN
                        </span>
                      )}
                    </div>
                    
                    <h4 className="font-poppins font-black text-slate-900 text-base sm:text-lg group-hover:text-[#1E3566] transition-colors leading-tight">
                      {notice.title}
                    </h4>
                    
                    <p className="text-slate-500 text-sm leading-relaxed line-clamp-2 font-light">
                      {notice.content}
                    </p>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Guidelines Details panel */}
          <div className="space-y-8">
            <motion.div 
              className="bg-[#1E3566] p-8 text-white border-b-4 border-[#EAB308] space-y-5 shadow-lg"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h3 className="font-poppins font-black text-sm text-[#EAB308] uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="h-5 w-5" />
                <span>{currentLanguage === "en" ? "Reliability Framework" : "কর্মী প্রতিস্থাপন গ্যারান্টি"}</span>
              </h3>
              
              <p className="text-xs sm:text-sm leading-relaxed text-slate-300 font-light font-sans">
                {currentLanguage === "en" 
                  ? "Should a deployed professional require unexpected leave or manifest unsatisfactory conduct, our team ensures an alternative matching profile is supplied within 24-48 business hours." 
                  : "যদি কোনো নিযুক্ত কর্মী ছুটিতে যান বা আচরণগত অসন্তুষ্টতা দেখা দেয়, আমাদের সাপোর্ট ডেক্স ২৪ থেকে ৪৮ ঘণ্টার মধ্যে বিকল্প কর্মী সরবরাহ করতে বাধ্য থাকবে।"}
              </p>

              <div className="border-t border-white/10 pt-4 text-xs font-mono text-slate-400">
                Central Headquarters: <strong className="text-white">support@nirapottaseba.com</strong>
              </div>
            </motion.div>

            <div className="bg-white p-7 border border-slate-200 shadow-sm space-y-3">
              <h4 className="font-poppins font-bold text-xs text-[#1E3566] uppercase tracking-wider flex items-center gap-1.5">
                <BookOpen className="h-4 w-4 text-[#EAB308]" />
                <span>{currentLanguage === "en" ? "Corporate Certifications" : "নিবন্ধন ও লাইসেন্স"}</span>
              </h4>
              <p className="text-xs text-slate-500 leading-relaxed font-light">
                Approved and compliant under local municipality guidelines and manpower outsourcing regulations. ISO 9001 audited framework.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* 7. REAL TESTIMONIALS (Generous spacing, gorgeous layout) */}
      <section id="testimonials" className="bg-[#FAFBFD] py-24 md:py-32 border-t border-slate-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-16">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-black text-[#EAB308] tracking-widest uppercase block">
              {currentLanguage === "en" ? "Client Endorsements" : "গ্রাহকদের মূল্যায়ন"}
            </span>
            <h2 className="text-4xl md:text-5xl font-black text-[#1E3566] tracking-tight font-poppins">
              {t.testimonialsTitle}
            </h2>
            <p className="text-slate-500 text-sm sm:text-base font-light">
              {t.testimonialsSub}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {testimonials.map((test, idx) => (
              <motion.div 
                key={idx} 
                className="bg-white p-10 border border-slate-205 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.15 }}
              >
                <div className="space-y-5">
                  <div className="flex gap-1 text-[#EAB308]">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-current" />
                    ))}
                  </div>
                  <p className="text-slate-700 text-sm sm:text-base italic leading-relaxed font-light">
                    "{test.quote}"
                  </p>
                </div>
                
                <div className="pt-6 mt-6 border-t border-slate-100 flex justify-between items-center text-xs">
                  <div>
                    <span className="block font-black text-slate-900 text-sm leading-none">{test.author}</span>
                    <span className="block text-[10px] text-slate-400 font-extrabold uppercase tracking-wider mt-2">{test.role}</span>
                  </div>
                  <span className="text-[10px] font-black tracking-wide text-[#1E3566] bg-slate-100 px-3.5 py-1.5 uppercase font-mono">
                    {test.location}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. WHATSAPP & HOTLINE CTA SECTION */}
      <section id="whatsapp_cta_anchor" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-28">
        <motion.div 
          className="bg-[#1E3566] text-white p-10 sm:p-20 text-center space-y-8 border-b-4 border-[#EAB308] shadow-2xl relative overflow-hidden"
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
        >
          <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />
          
          <div className="max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-black text-[#EAB308] tracking-widest uppercase block">
              {currentLanguage === "en" ? "Direct Headquarters Contact" : "সরাসরি হেডকোয়ার্টার যোগাযোগ"}
            </span>
            <h3 className="text-3xl sm:text-4xl font-black tracking-tight text-white font-poppins">
              {t.contactCTATitle}
            </h3>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-xl mx-auto font-light">
              {t.contactCTASub}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-5 pt-4">
            
            <a
              id="cta_whatsapp_btn"
              href={`https://wa.me/${settings?.whatsapp_number?.replace(/[^0-9]/g, "") || "8801700001122"}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-3 w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs px-10 py-5 transition-colors uppercase tracking-widest shadow-lg shadow-emerald-600/10 active:scale-[0.98]"
            >
              <svg className="h-5 w-5 fill-current shrink-0" viewBox="0 0 24 24">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.5-5.729-1.448L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.97C16.528 2.017 14.077 1 11.601 1 6.162 1 1.74 5.37 1.737 10.8c-.001 1.638.445 3.238 1.293 4.646L2.1 21.05s2.23-.585 4.547-1.356z" />
              </svg>
              <span>{currentLanguage === "en" ? "Chat on WhatsApp Support" : "সরাসরি হোয়াটসঅ্যাপ চ্যাট শুরু করুন"}</span>
            </a>

            <a
              id="cta_call_btn"
              href={`tel:${settings?.contact_number || "+8801700001122"}`}
              className="flex items-center justify-center gap-2.5 w-full sm:w-auto bg-transparent border-2 border-[#EAB308] text-[#EAB308] hover:bg-white/5 font-black text-xs px-10 py-5 transition-all uppercase tracking-widest active:scale-[0.98]"
            >
              <PhoneCall className="h-5 w-5" />
              <span>{settings?.contact_number || "+880 1700-001122"}</span>
            </a>

          </div>

          <div className="text-xs text-slate-400 font-mono pt-4">
            {currentLanguage === "en" ? "Available daily 9:00 AM - 9:00 PM for client consultation" : "জরুরি প্রার্থী নিয়োগ ও পরামর্শের জন্য প্রতিদিন সকাল ৯:০০ টা থেকে রাত ৯:০০ টা পর্যন্ত খোলা থাকে"}
          </div>

        </motion.div>
      </section>

    </div>
  );
}
