import React, { useState } from "react";
import { ClipboardCheck, Sparkles, CheckCircle, AlertTriangle } from "lucide-react";
import { translations } from "../translations";
import ApiService from "../api";

interface CustomerFormProps {
  currentLanguage: "en" | "bn";
  prefillCategory?: string;
  prefillWorker?: any;
}

export default function CustomerForm({ currentLanguage, prefillCategory = "Domestic Helper", prefillWorker }: CustomerFormProps) {
  const t = translations[currentLanguage];

  // Form states
  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [serviceType, setServiceType] = useState<any>(prefillCategory);
  const [duration, setDuration] = useState("6 Months");
  const [budget, setBudget] = useState("");
  const [notes, setNotes] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !phone || !address || !serviceType) {
      setError("Please fill out your Name, Phone Number, Service Location, and Service Type.");
      return;
    }

    setError("");
    setSubmitting(true);

    try {
      const extraNotes = prefillWorker 
        ? `[AUTO-REQUEST-CANDIDATE: ${prefillWorker.full_name} (${prefillWorker.id})] ${notes}`
        : notes;

      const payload = {
        customer_name: customerName,
        phone,
        email,
        address,
        service_type: serviceType,
        duration,
        budget: budget || "As per company package standards",
        notes: extraNotes,
      };

      await ApiService.submitCustomerRequest(payload);
      setSuccess(true);
      setCustomerName("");
      setPhone("");
      setEmail("");
      setAddress("");
      setBudget("");
      setNotes("");
    } catch (err: any) {
      setError(err.message || "Failed to submit helpdesk request.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div id="customer_request_form_container" className="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:px-8">
      
      <div className="bg-white rounded-none border border-slate-200 p-8 sm:p-12 space-y-8 shadow-sm">
        
        {/* Title */}
        <div className="space-y-3 text-center">
          <div className="mx-auto h-12 w-12 flex items-center justify-center bg-[#F8FAFC] border border-slate-200 text-[#183A72]">
            <ClipboardCheck className="h-5 w-5" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight mt-2 uppercase font-poppins">
            {t.requestFormTitle}
          </h2>
          <div className="h-1 w-12 bg-[#EAB308] mx-auto"></div>
          <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
            {t.requestFormSub}
          </p>
        </div>

        {prefillWorker && (
          <div className="p-4 bg-[#F8FAFC] border-l-4 border-[#EAB308] flex items-center gap-3 text-xs text-slate-700 font-semibold max-w-lg mx-auto">
            <Sparkles className="h-4.5 w-4.5 text-[#EAB308] shrink-0" />
            <span>
              {currentLanguage === "en" ? "Requesting candidate profile of" : "অনুরোধকৃত নির্দিষ্ট প্রার্থীর প্রোফাইল:"} <strong>{prefillWorker.full_name}</strong> ({prefillWorker.category})
            </span>
          </div>
        )}

        {success ? (
          <div className="text-center bg-emerald-50 border border-emerald-100 text-emerald-800 p-8 rounded-none space-y-4 max-w-md mx-auto">
            <CheckCircle className="h-10 w-10 text-emerald-600 mx-auto" />
            <h3 className="font-bold text-base uppercase tracking-wider">{currentLanguage === "en" ? "Query Received" : "আবেদন সম্পন্ন হয়েছে"}</h3>
            <p className="text-xs leading-relaxed text-emerald-700">
              {currentLanguage === "en" 
                ? "Your corporate service request has been securely recorded. Our Dhaka office coordinators will contact you over phone within 1-2 working hours."
                : "আপনার সার্ভিস রিকোয়েস্ট সফলভাবে নিবন্ধিত হয়েছে। আমাদের সাপোর্ট কো-অর্ডিনেটর খুব শীঘ্রই আপনার দেওয়া নাম্বারে যোগাযোগ করবেন।"}
            </p>
            <button
              onClick={() => setSuccess(false)}
              className="mt-4 px-6 py-3 bg-[#183A72] text-white text-xs font-bold uppercase tracking-widest hover:bg-[#1E468A] cursor-pointer transition-colors"
            >
              {currentLanguage === "en" ? "Submit Another Query" : "নতুন আরেকটি রিকোয়েস্ট পাঠান"}
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5 font-sans">
            
            {error && (
              <div className="p-3 bg-red-50 text-red-700 border border-red-100 text-xs rounded-none flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1.5 tracking-wider">{t.fullName} *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sajib Ahmed"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full text-xs p-3 rounded-none border border-slate-200 focus:outline-none focus:border-[#183A72] bg-white transition-colors"
                />
              </div>
              
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1.5 tracking-wider">{t.phone} *</label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. 017xxxxxxxx"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full text-xs p-3 rounded-none border border-slate-200 focus:outline-none focus:border-[#183A72] bg-white transition-colors"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1.5 tracking-wider">{t.email}</label>
                <input
                  type="email"
                  placeholder="e.g. customer@gmail.com (Optional)"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full text-xs p-3 rounded-none border border-slate-200 focus:outline-none focus:border-[#183A72] bg-white transition-colors"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1.5 tracking-wider">{currentLanguage === "en" ? "Service Required" : "কাঙ্ক্ষিত সেবা"} *</label>
                <select
                  value={serviceType}
                  onChange={(e) => setServiceType(e.target.value as any)}
                  className="w-full text-xs p-3 rounded-none border border-slate-200 focus:outline-none focus:border-[#183A72] bg-white transition-colors"
                >
                  <option value="Domestic Helper">{currentLanguage === "en" ? "Domestic Helper & Caregiver" : "গৃহকর্মী ও কেয়ারজিভার"}</option>
                  <option value="Security Guard">{currentLanguage === "en" ? "Security Guard Service" : "নিরাপত্তা প্রহরী"}</option>
                  <option value="Pickup Service">{currentLanguage === "en" ? "Daily Transport Commute" : "দৈনিক যাতায়াত গাড়ি"}</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1.5 tracking-wider">{currentLanguage === "en" ? "Service Allocation Location" : "পোস্টিং এরিয়া ঠিকানা"} *</label>
              <input
                type="text"
                required
                placeholder="e.g. House 4, Road 11, Banani, Dhaka"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full text-xs p-3 rounded-none border border-slate-200 focus:outline-none focus:border-[#183A72] bg-white transition-colors"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1.5 tracking-wider">{currentLanguage === "en" ? "Required Placement Duration" : "নিয়োগের চুক্তিকাল"}</label>
                <select
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="w-full text-xs p-3 rounded-none border border-slate-200 focus:outline-none focus:border-[#183A72] bg-white transition-colors"
                >
                  <option value="Daily">{currentLanguage === "en" ? "Daily Basis" : "দৈনিক ভিত্তিতে"}</option>
                  <option value="Monthly">{currentLanguage === "en" ? "Monthly Basis" : "মাসিক চুক্তিতে"}</option>
                  <option value="6 Months">{currentLanguage === "en" ? "6 Months Contract" : "৬ মাস মেয়াদি চুক্তি"}</option>
                  <option value="1 Year">{currentLanguage === "en" ? "1 Year Vetted Contract" : "১ বছরের নিশ্চিত চুক্তি"}</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1.5 tracking-wider">{currentLanguage === "en" ? "Monthly Budget (BDT)" : "মাসিক স্যালারি বাজেট"}</label>
                <input
                  type="text"
                  placeholder="e.g. BDT 15,000 / month"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  className="w-full text-xs p-3 rounded-none border border-slate-200 focus:outline-none focus:border-[#183A72] bg-white transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1.5 tracking-wider">{currentLanguage === "en" ? "Additional Notes / Special Vetting Requirements" : "বাড়তি প্রয়োজনীয়তা / বিশেষ বিষয়াদি"}</label>
              <textarea
                rows={3}
                placeholder={currentLanguage === "en" ? "e.g., Cooking preference (must speak basic English), specific uniform constraints..." : "যেমন: রান্নার দক্ষতা, নির্দিষ্ট ইউনিফর্ম বা বিশেষ কোনো যোগ্যতা..."}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full text-xs p-3 rounded-none border border-slate-200 focus:outline-none focus:border-[#183A72] bg-white transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-4 bg-[#183A72] text-white font-bold text-xs uppercase tracking-widest hover:bg-[#1E468A] hover:text-[#EAB308] cursor-pointer transition-colors"
            >
              {submitting ? (currentLanguage === "en" ? "PROCESSING SUBMISSION..." : "সংরক্ষণ করা হচ্ছে...") : t.btnHireNow}
            </button>

          </form>
        )}

      </div>
    </div>
  );
}
