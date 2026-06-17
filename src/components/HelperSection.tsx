import React, { useState } from "react";
import { Search, UserCheck, MapPin, Calendar, Clock, Star, Phone, ShieldCheck, Mail, SlidersHorizontal, Check, X, FileBadge } from "lucide-react";
import { translations } from "../translations";
import { Applicant } from "../types";
import ApiService from "../api";

interface HelperSectionProps {
  currentLanguage: "en" | "bn";
  helpers: Applicant[];
  onOpenRequestForm: (category: string, prefillWorker?: Applicant) => void;
}

export default function HelperSection({
  currentLanguage,
  helpers,
  onOpenRequestForm,
}: HelperSectionProps) {
  const t = translations[currentLanguage];

  // Client States
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [filterExperience, setFilterExperience] = useState<string>("all");
  const [filterAge, setFilterAge] = useState<string>("all");
  const [filterLocation, setFilterLocation] = useState<string>("all");
  const [selectedHelper, setSelectedHelper] = useState<Applicant | null>(null);

  // Form Submission feedback inside Profile Modal
  const [submittingRequest, setSubmittingRequest] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [reqForm, setReqForm] = useState({
    customer_name: "",
    phone: "",
    email: "",
    address: "",
    duration: "6 Months",
    budget: "",
    notes: "",
  });

  // Extract unique locations for the filter list
  const uniqueLocations = Array.from(
    new Set(
      helpers
        .map((h) => h.location || "")
        .filter((loc) => loc !== "")
        .map((loc) => loc.split("/")[0].trim()) // grab main prefix
    )
  );

  // Filter Helper list
  const filteredHelpers = helpers.filter((helper) => {
    // 1. Category search matches
    const nameMatch = helper.full_name.toLowerCase().includes(searchQuery.toLowerCase());
    const skillsMatch = (helper.skills || "").toLowerCase().includes(searchQuery.toLowerCase());
    const descMatch = (helper.description || "").toLowerCase().includes(searchQuery.toLowerCase());
    const locMatchQuery = (helper.location || "").toLowerCase().includes(searchQuery.toLowerCase());
    const searchMatches = nameMatch || skillsMatch || descMatch || locMatchQuery;

    // 2. Filter Helper Type
    const typeMatches = filterType === "all" || helper.helper_type === filterType;

    // 3. Filter Experience
    let expMatches = true;
    if (filterExperience !== "all") {
      const expNum = parseInt(helper.experience) || 0;
      if (filterExperience === "1-3") expMatches = expNum >= 1 && expNum <= 3;
      else if (filterExperience === "3-5") expMatches = expNum > 3 && expNum <= 5;
      else if (filterExperience === "5+") expMatches = expNum > 5;
    }

    // 4. Filter Age
    let ageMatches = true;
    if (filterAge !== "all" && helper.age) {
      if (filterAge === "under30") ageMatches = helper.age < 30;
      else if (filterAge === "30to40") ageMatches = helper.age >= 30 && helper.age <= 40;
      else if (filterAge === "over40") ageMatches = helper.age > 40;
    }

    // 5. Filter Location area
    const areaMatches =
      filterLocation === "all" ||
      (helper.location || "").toLowerCase().includes(filterLocation.toLowerCase());

    return searchMatches && typeMatches && expMatches && ageMatches && areaMatches;
  });

  const handleModalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedHelper) return;
    if (!reqForm.customer_name || !reqForm.phone || !reqForm.address) {
      setSubmitError("Name, Phone, and Address are required.");
      return;
    }

    setSubmittingRequest(true);
    setSubmitError("");
    setSubmitSuccess(false);

    try {
      const payload = {
        customer_name: reqForm.customer_name,
        phone: reqForm.phone,
        email: reqForm.email,
        address: reqForm.address,
        service_type: "Domestic Helper",
        duration: reqForm.duration,
        budget: reqForm.budget || "BDT 12,000 - 15,000",
        notes: `REQUESTING SPECIFIC CANDIDATE: ${selectedHelper.full_name} (ID: ${selectedHelper.id}). Notes: ${reqForm.notes}`,
      };

      await ApiService.submitCustomerRequest(payload);
      setSubmitSuccess(true);
      setReqForm({
        customer_name: "",
        phone: "",
        email: "",
        address: "",
        duration: "6 Months",
        budget: "",
        notes: "",
      });
    } catch (err: any) {
      setSubmitError(err.message || "Failed to submit request.");
    } finally {
      setSubmittingRequest(false);
    }
  };

  return (
    <div id="helpers_view_container" className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 space-y-10">
      
      {/* Editorial Header */}
      <div className="max-w-3xl space-y-2">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          {t.helpersTitle}
        </h2>
        <p className="text-slate-500 text-sm leading-relaxed">
          {currentLanguage === "en"
            ? "Browse through our verified domestic assistants, babysitters, senior caregivers, and residential cleaners available for immediate service placement in Dhaka."
            : "আমাদের সম্মানিত গৃহকর্মী, বেবিসিটার, বয়স্ক ও অটিস্টিক কেয়ারগিভার এবং প্রফেশনাল বাসা ক্লিনারের তালিকা দেখুন। তারা সবাই পুলিশ ভেরিফাইড এবং কাজের জন্য প্রস্তুত।"}
        </p>
      </div>

      {/* SEARCH AND FILTERS PANEL */}
      <section id="filters_control_panel" className="bg-white border border-slate-200 p-6 rounded-none shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative w-full">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              id="inp_helper_search"
              placeholder={t.searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-none border border-slate-200 text-xs focus:outline-none focus:border-[#183A72] transition-colors bg-white"
            />
          </div>
          <div className="flex items-center gap-1.5 shrink-0 text-slate-700 text-xs font-bold uppercase tracking-wider self-start sm:self-center">
            <SlidersHorizontal className="h-4 w-4 text-[#183A72]" />
            <span>{t.filterTitle}</span>
          </div>
        </div>

        {/* Filters Multi-selectors Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          
          {/* Helper Classification Type */}
          <div>
            <label className="block text-[10px] font-bold text-slate-500 mb-1.5 uppercase tracking-wider">
              {currentLanguage === "en" ? "Service Custom" : "সেবার ধরণ"}
            </label>
            <select
              id="sel_filter_type"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full text-xs rounded-none border border-slate-200 p-2.5 focus:outline-none focus:border-[#183A72] bg-white text-slate-700"
            >
              <option value="all">{currentLanguage === "en" ? "All Classifications" : "সব শ্রেণির গৃহকর্মী"}</option>
              <option value="Housemaid">{currentLanguage === "en" ? "Housemaid" : "বাসার গৃহকর্মী"}</option>
              <option value="Babysitter">{currentLanguage === "en" ? "Babysitter (Nanny)" : "বেবিসিটার"}</option>
              <option value="Caregiver">{currentLanguage === "en" ? "Specialist Caregiver" : "কেয়ারগিভার (রোগী সেবা)"}</option>
              <option value="Cleaner">{currentLanguage === "en" ? "Deep Cleaner" : "ক্লিনার"}</option>
            </select>
          </div>

          {/* Helper Experience Level */}
          <div>
            <label className="block text-[10px] font-bold text-slate-500 mb-1.5 uppercase tracking-wider">
              {currentLanguage === "en" ? "Exp Level" : "বাস্তব অভিজ্ঞতা"}
            </label>
            <select
              id="sel_filter_exp"
              value={filterExperience}
              onChange={(e) => setFilterExperience(e.target.value)}
              className="w-full text-xs rounded-none border border-slate-200 p-2.5 focus:outline-none focus:border-[#183A72] bg-white text-slate-700"
            >
              <option value="all">{currentLanguage === "en" ? "Any Experience" : "যেকোনো অভিজ্ঞতা"}</option>
              <option value="1-3">{currentLanguage === "en" ? "1 to 3 Years" : "১ থেকে ৩ বছর"}</option>
              <option value="3-5">{currentLanguage === "en" ? "3 to 5 Years" : "৩ থেকে ৫ বছর"}</option>
              <option value="5+">{currentLanguage === "en" ? "Over 5 Years" : "৫ বছরের বেশি"}</option>
            </select>
          </div>

          {/* Helper Age Range */}
          <div>
            <label className="block text-[10px] font-bold text-slate-500 mb-1.5 uppercase tracking-wider">
              {currentLanguage === "en" ? "Age Group" : "বয়স সীমা"}
            </label>
            <select
              id="sel_filter_age"
              value={filterAge}
              onChange={(e) => setFilterAge(e.target.value)}
              className="w-full text-xs rounded-none border border-slate-200 p-2.5 focus:outline-none focus:border-[#183A72] bg-white text-slate-700"
            >
              <option value="all">{currentLanguage === "en" ? "Any Age" : "যেকোনো বয়স"}</option>
              <option value="under30">{currentLanguage === "en" ? "Under 30" : "৩০ বছরের নিচে"}</option>
              <option value="30to40">{currentLanguage === "en" ? "30 to 40" : "৩০ থেকে ৪০ বছর"}</option>
              <option value="over40">{currentLanguage === "en" ? "Over 40" : "৪০ বছরের বেশি"}</option>
            </select>
          </div>

          {/* Helper Area Location */}
          <div>
            <label className="block text-[10px] font-bold text-slate-500 mb-1.5 uppercase tracking-wider">
              {currentLanguage === "en" ? "Location Area" : "কাজের এলাকা"}
            </label>
            <select
              id="sel_filter_location"
              value={filterLocation}
              onChange={(e) => setFilterLocation(e.target.value)}
              className="w-full text-xs rounded-none border border-slate-200 p-2.5 focus:outline-none focus:border-[#183A72] bg-white text-slate-700"
            >
              <option value="all">{currentLanguage === "en" ? "All Dhaka Areas" : "সকল এলাকা"}</option>
              {uniqueLocations.map((loc, idx) => (
                <option key={idx} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
          </div>

        </div>
      </section>

      {/* CARDS LIST GRID */}
      <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider border-b border-gray-100 pb-2">
        {currentLanguage === "en" ? `${filteredHelpers.length} Approved Professionals Found` : `${filteredHelpers.length} জন ভেরিফাইড প্রফেশনাল পাওয়া গেছে`}
      </h3>

      {filteredHelpers.length === 0 ? (
        <div className="text-center py-16 bg-slate-50 border border-slate-200">
          <p className="text-gray-500 text-sm">No helpers match your selected search criteria.</p>
          <button
            onClick={() => {
              setSearchQuery("");
              setFilterType("all");
              setFilterExperience("all");
              setFilterAge("all");
              setFilterLocation("all");
            }}
            className="mt-3 text-xs font-bold text-[#183A72] hover:underline cursor-pointer"
          >
            Clear All Filters & Reset
          </button>
        </div>
      ) : (
        <div id="helpers_cards_grid" className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {filteredHelpers.map((helper) => (
            <div
              key={helper.id}
              id={`helper_item_card_${helper.id}`}
              className="bg-white border-0 border-b-2 border-slate-250 hover:border-[#183A72] overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              {/* Photo & Priority badge */}
              <div className="relative">
                <div className="aspect-square bg-slate-100 w-full overflow-hidden">
                  <img
                    src={helper.photo || "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400"}
                    alt={helper.full_name}
                    referrerPolicy="no-referrer"
                    className="h-full w-full object-cover transform hover:scale-101 transition-transform duration-500 filter brightness-95"
                  />
                </div>
                <div className="absolute top-3 left-3 bg-[#183A72] text-white font-bold text-[9px] px-2.5 py-1 uppercase tracking-wider shadow-sm">
                  {helper.helper_type || "Helper"}
                </div>
                <div className="absolute top-3 right-3 bg-white/95 text-emerald-800 border border-emerald-300 font-bold text-[9px] px-2 py-0.5 flex items-center gap-1">
                  <ShieldCheck className="h-3 w-3 text-emerald-600" />
                  <span>Verified</span>
                </div>
              </div>

              {/* Card Meta Content */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <h4 className="text-xl font-bold text-slate-900 tracking-tight leading-tighter uppercase font-poppins">
                    {helper.full_name}
                  </h4>
                  
                  <div className="flex flex-wrap gap-y-1 items-center gap-2 text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                    <span className="flex items-center gap-0.5 shrink-0">
                      <Clock className="h-3 w-3 text-gray-400" />
                      {helper.experience} {t.experience}
                    </span>
                    <span className="text-slate-300">•</span>
                    <span>{helper.age || 30} {t.age}</span>
                    <span className="text-slate-300">•</span>
                    <span className="flex items-center gap-0.5 max-w-[125px] truncate">
                      <MapPin className="h-3 w-3 text-gray-400 shrink-0" />
                      {helper.location || "Dhaka"}
                    </span>
                  </div>
                </div>

                {/* Bullet Skills */}
                <div className="flex flex-wrap gap-1">
                  {helper.skills ? (
                    helper.skills.split(",").slice(0, 3).map((skill, idx) => (
                      <span
                        key={idx}
                        className="bg-[#F8FAFC] border border-slate-200 text-slate-800 text-[9px] uppercase tracking-wider font-bold px-2 py-0.5"
                      >
                        {skill.trim()}
                      </span>
                    ))
                  ) : (
                    <span className="bg-[#F8FAFC] border border-slate-200 text-slate-800 text-[9px] uppercase tracking-wider font-bold px-2 py-0.5">Domestic Assistant</span>
                  )}
                </div>

                <p className="text-slate-500 text-xs leading-relaxed line-clamp-3">
                  {helper.description || "Background checked and trained caregiver specializing in overall management of domestic households."}
                </p>

                {/* Footer Action */}
                <div className="pt-4 border-t border-slate-100 flex gap-2">
                  <button
                    id={`btn_view_${helper.id}`}
                    onClick={() => {
                      setSelectedHelper(helper);
                      setSubmitSuccess(false);
                      setSubmitError("");
                    }}
                    className="flex-1 bg-[#183A72] py-3 text-center text-xs font-bold text-white uppercase tracking-wider hover:bg-[#1E468A] hover:text-[#EAB308] transition-colors cursor-pointer"
                  >
                    {t.viewProfile}
                  </button>
                  <button
                    id={`btn_request_${helper.id}`}
                    onClick={() => onOpenRequestForm("Domestic Helper", helper)}
                    className="border border-slate-200 p-3 text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
                    title={t.requestContact}
                  >
                    <UserCheck className="h-4 w-4 text-[#183A72]" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODAL VIEW DETAILS */}
      {selectedHelper && (
        <div id="helper_detailed_modal_dialog" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-100 flex flex-col md:flex-row relative">
            
            {/* Close trigger button */}
            <button
              onClick={() => setSelectedHelper(null)}
              className="absolute top-4 right-4 z-10 bg-slate-100 hover:bg-slate-200 text-slate-600 p-2 rounded-full cursor-pointer focus:outline-none transition-colors"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Left Col: Photo & Professional Info */}
            <div className="md:w-5/12 bg-slate-50 p-6 sm:p-8 space-y-6 border-r border-gray-100 text-slate-800">
              <div className="aspect-square rounded-none overflow-hidden bg-white shadow-inner border border-gray-150">
                <img
                  src={selectedHelper.photo || "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400"}
                  alt={selectedHelper.full_name}
                  referrerPolicy="no-referrer"
                  className="h-full w-full object-cover filter brightness-95"
                />
              </div>

              <div className="space-y-4 font-sans">
                <div>
                  <span className="inline-block bg-[#F8FAFC] border border-slate-200 text-[#183A72] text-[9px] font-bold px-2.5 py-1 uppercase tracking-wider mb-2">
                    {selectedHelper.helper_type || "Domestic Helper"}
                  </span>
                  <h3 className="text-2xl font-extrabold tracking-tight text-slate-900 uppercase font-poppins">
                    {selectedHelper.full_name}
                  </h3>
                  <p className="text-xs font-bold uppercase text-slate-500 mt-1 flex items-center gap-1">
                    <MapPin className="h-3 w-3 text-amber-500 shrink-0" />
                    {selectedHelper.location}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 text-[10px] bg-white p-4 rounded-none border border-slate-200 uppercase font-bold tracking-wider">
                  <div>
                    <span className="text-slate-500 block mb-1">Experience</span>
                    <span className="font-bold text-slate-800 text-xs">{selectedHelper.experience}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block mb-1">Age</span>
                    <span className="font-bold text-slate-800 text-xs">{selectedHelper.age || 30} Years</span>
                  </div>
                  <div className="col-span-2 pt-2 border-t border-slate-100 flex items-center gap-1.5 text-emerald-750 font-bold">
                    <ShieldCheck className="h-4 w-4" />
                    <span>NID & Police Clearance Vetted</span>
                  </div>
                </div>

                {/* Submitting documents display info */}
                <div className="space-y-1.5 pt-2">
                  <span className="block text-xs font-bold text-slate-500 uppercase tracking-widest">
                    Vetted Files Submitted:
                  </span>
                  <p className="text-slate-600 text-xs leading-relaxed font-sans font-medium">
                    {selectedHelper.documents || "NID Verification pending"}
                  </p>
                </div>
              </div>
            </div>

            {/* Right Col: Personal resume, Key skills, & Direct Hire Request form */}
            <div className="md:w-7/12 p-6 sm:p-8 space-y-6 flex flex-col justify-between">
              
              <div className="space-y-5">
                <div className="space-y-2">
                  <span className="text-xs uppercase tracking-wider font-bold text-[#183A72] font-sans block mb-2">Biography</span>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-sans whitespace-pre-line">
                    {selectedHelper.description || "A highly skilled home maintenance expert. Fluent in Bangla, highly reliable, and cleared of all primary security checks."}
                  </p>
                </div>

                <div className="space-y-2.5">
                  <span className="text-xs uppercase tracking-wider font-bold text-cyan-600 font-mono block">Verified Skills</span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedHelper.skills ? (
                      selectedHelper.skills.split(",").map((sk, idx) => (
                        <span
                          key={idx}
                          className="bg-slate-100 text-slate-800 text-xs font-semibold px-3 py-1 rounded-lg border border-slate-150/40 flex items-center gap-1"
                        >
                          <Check className="h-3.5 w-3.5 text-[#183A72] shrink-0" />
                          <span>{sk.trim()}</span>
                        </span>
                      ))
                    ) : (
                      <span className="text-gray-500 text-xs">Specialized Domestic helper</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Integrated recruitment form */}
              <div className="bg-slate-50 p-5 rounded-2xl border border-gray-200/50 space-y-4">
                <div>
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    {currentLanguage === "en" ? `Hire ${selectedHelper.full_name} Directly` : `সরাসরি এঁকে পার্সোনাল নিয়োগের আবেদন`}
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    {currentLanguage === "en"
                      ? "Submit your information below. Our service agents will contact you to coordinate placement."
                      : "নিচের ছকটি পূরণ করে আবেদন দিন। আমাদের অফিস থেকে ম্যাচিং করতে আপনাকে সরাসরি ফোন দিবে।"}
                  </p>
                </div>

                {submitSuccess ? (
                  <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-xl text-center space-y-2">
                    <Check className="h-6 w-6 text-emerald-600 mx-auto" />
                    <span className="block font-bold text-xs">Request Saved Successfully!</span>
                    <span className="block text-[11px] text-emerald-700">All admins have been notified. We will call you within 2-4 working hours.</span>
                  </div>
                ) : (
                  <form onSubmit={handleModalSubmit} className="space-y-3 font-sans">
                    {submitError && (
                      <div className="text-[10px] bg-red-50 text-red-650 p-2 rounded border border-red-150">
                        {submitError}
                      </div>
                    )}
                    <div className="grid grid-cols-2 gap-2.5">
                      <div>
                        <input
                          type="text"
                          required
                          placeholder="Your Full Name"
                          value={reqForm.customer_name}
                          onChange={(e) => setReqForm({ ...reqForm, customer_name: e.target.value })}
                          className="w-full bg-white text-xs p-3 border border-slate-200 rounded-none focus:outline-none focus:border-[#183A72]"
                        />
                      </div>
                      <div>
                        <input
                          type="tel"
                          required
                          placeholder="Contact Mobile Number"
                          value={reqForm.phone}
                          onChange={(e) => setReqForm({ ...reqForm, phone: e.target.value })}
                          className="w-full bg-white text-xs p-3 border border-slate-200 rounded-none focus:outline-none focus:border-[#183A72]"
                        />
                      </div>
                    </div>
                    <div>
                      <input
                        type="text"
                        required
                        placeholder="Your Present Address (Where Service Is Required)"
                        value={reqForm.address}
                        onChange={(e) => setReqForm({ ...reqForm, address: e.target.value })}
                        className="w-full bg-white text-xs p-3 border border-slate-200 rounded-none focus:outline-none focus:border-[#183A72]"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2.5">
                      <div>
                        <select
                          value={reqForm.duration}
                          onChange={(e) => setReqForm({ ...reqForm, duration: e.target.value })}
                          className="w-full bg-white text-xs p-3 border border-slate-200 rounded-none focus:outline-none focus:border-[#183A72] text-[#183A72] font-bold uppercase tracking-wider text-[10px]"
                        >
                          <option value="6 Months">Need for 6 Months</option>
                          <option value="1 Year">Need for 1 Year Contract</option>
                          <option value="Per Hour">Hourly Basis (Part-time)</option>
                        </select>
                      </div>
                      <div>
                        <input
                          type="text"
                          placeholder="Budget Details (e.g., BDT 15K)"
                          value={reqForm.budget}
                          onChange={(e) => setReqForm({ ...reqForm, budget: e.target.value })}
                          className="w-full bg-white text-xs p-3 border border-slate-200 rounded-none focus:outline-none focus:border-[#183A72]"
                        />
                      </div>
                    </div>
                    
                    <button
                      type="submit"
                      disabled={submittingRequest}
                      className="w-full py-3.5 bg-[#183A72] hover:bg-[#1E468A] hover:text-[#EAB308] text-white font-bold text-xs rounded-none shadow cursor-pointer uppercase tracking-wider transition-colors"
                    >
                      {submittingRequest ? "Registering Request..." : "Confirm Booking Placement"}
                    </button>
                  </form>
                )}
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}
