import React, { useState } from "react";
import { Search, ShieldAlert, ShieldCheck, MapPin, Clock, Calendar, Star, SlidersHorizontal, Check, X, Award, FileText } from "lucide-react";
import { translations } from "../translations";
import { Applicant } from "../types";
import ApiService from "../api";

interface GuardSectionProps {
  currentLanguage: "en" | "bn";
  guards: Applicant[];
  onOpenRequestForm: (category: string, prefillWorker?: Applicant) => void;
}

export default function GuardSection({
  currentLanguage,
  guards,
  onOpenRequestForm,
}: GuardSectionProps) {
  const t = translations[currentLanguage];

  // States
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [filterExperience, setFilterExperience] = useState<string>("all");
  const [filterLocation, setFilterLocation] = useState<string>("all");
  const [selectedGuard, setSelectedGuard] = useState<Applicant | null>(null);

  // Hiring form state within guard detailed view modal
  const [submittingRequest, setSubmittingRequest] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [reqForm, setReqForm] = useState({
    customer_name: "",
    phone: "",
    email: "",
    address: "",
    duration: "1 Year",
    budget: "",
    notes: "",
  });

  // Extract locations
  const uniqueLocations = Array.from(
    new Set(
      guards
        .map((g) => g.location || "")
        .filter((loc) => loc !== "")
        .map((loc) => loc.split("/")[0].trim())
    )
  );

  const filteredGuards = guards.filter((guard) => {
    // Search
    const nameMatch = guard.full_name.toLowerCase().includes(searchQuery.toLowerCase());
    const skillsMatch = (guard.skills || "").toLowerCase().includes(searchQuery.toLowerCase());
    const descMatch = (guard.description || "").toLowerCase().includes(searchQuery.toLowerCase());
    const trainingMatch = (guard.training || "").toLowerCase().includes(searchQuery.toLowerCase());
    const searchMatches = nameMatch || skillsMatch || descMatch || trainingMatch;

    // Filters
    const typeMatches = filterType === "all" || guard.security_type === filterType;

    let expMatches = true;
    if (filterExperience !== "all") {
      const expNum = parseInt(guard.experience) || 0;
      if (filterExperience === "1-3") expMatches = expNum >= 1 && expNum <= 3;
      else if (filterExperience === "3-5") expMatches = expNum > 3 && expNum <= 5;
      else if (filterExperience === "5+") expMatches = expNum > 5;
    }

    const areaMatches =
      filterLocation === "all" ||
      (guard.location || "").toLowerCase().includes(filterLocation.toLowerCase());

    return searchMatches && typeMatches && expMatches && areaMatches;
  });

  const handleModalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedGuard) return;
    if (!reqForm.customer_name || !reqForm.phone || !reqForm.address) {
      setSubmitError("Name, Phone and Office/Home Address are required.");
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
        service_type: "Security Guard",
        duration: reqForm.duration,
        budget: reqForm.budget || "BDT 18,000 - 25,000",
        notes: `REQUESTING SPECIFIC GUARD: ${selectedGuard.full_name} (ID: ${selectedGuard.id}). Client details: ${reqForm.notes}`,
      };

      await ApiService.submitCustomerRequest(payload);
      setSubmitSuccess(true);
      setReqForm({
        customer_name: "",
        phone: "",
        email: "",
        address: "",
        duration: "1 Year",
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
    <div id="guards_view_container" className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 space-y-10">
      
      {/* Title */}
      <div className="max-w-3xl space-y-2">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          {t.guardsTitle}
        </h2>
        <p className="text-slate-500 text-sm leading-relaxed">
          {currentLanguage === "en"
            ? "Hire highly trained, backgrounds-vetted residential, commercial executive, and tactical armed security guards with army or defense force backgrounds in Dhaka."
            : "আমাদের এলিট, অবসরপ্রাপ্ত সেনা সদস্য অথবা বিশেষ ট্রেনিংপ্রাপ্ত সুঠাম দেহের আবাসিক, ক্যাশ-ইন-ট্রানজিট ও ইভেন্ট সিকিউরিটি গার্ড রাজকীয় নিরাপত্তা দিয়ে থাকে।"}
        </p>
      </div>

      {/* Control filters */}
      {/* SEARCH AND FILTERS PANEL */}
      <section id="guards_search_filter_bar" className="bg-white border border-slate-200 p-6 rounded-none shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative w-full">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              id="inp_guard_search"
              placeholder="Search guard names, physical features, training details, areas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-none border border-slate-200 text-xs focus:outline-none focus:border-[#183A72] bg-white transition-colors"
            />
          </div>
          <div className="flex items-center gap-1.5 shrink-0 text-slate-700 text-xs font-bold uppercase tracking-wider self-start sm:self-center">
            <SlidersHorizontal className="h-4 w-4 text-[#183A72]" />
            <span>{t.filterTitle}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Security Type */}
          <div>
            <label className="block text-[10px] font-bold text-slate-500 mb-1.5 uppercase tracking-wider">
              Security Category
            </label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full text-xs rounded-none border border-slate-200 p-2.5 focus:outline-none focus:border-[#183A72] bg-white text-slate-700"
            >
              <option value="all">All Security Divisions</option>
              <option value="Residential Security">Residential Protection</option>
              <option value="Commercial Security">Commercial complex Security</option>
              <option value="Event Security">Event Crowd Management</option>
            </select>
          </div>

          {/* Experience */}
          <div>
            <label className="block text-[10px] font-bold text-slate-500 mb-1.5 uppercase tracking-wider">
              Experience Level
            </label>
            <select
              value={filterExperience}
              onChange={(e) => setFilterExperience(e.target.value)}
              className="w-full text-xs rounded-none border border-slate-200 p-2.5 focus:outline-none focus:border-[#183A72] bg-white text-slate-700"
            >
              <option value="all">Any Years on Service</option>
              <option value="1-3">1 to 3 Years</option>
              <option value="3-5">3 to 5 Years</option>
              <option value="5+">Over 5 Years (Highly Senior)</option>
            </select>
          </div>

          {/* Location Area */}
          <div>
            <label className="block text-[10px] font-bold text-slate-500 mb-1.5 uppercase tracking-wider">
              Location Area
            </label>
            <select
              value={filterLocation}
              onChange={(e) => setFilterLocation(e.target.value)}
              className="w-full text-xs rounded-none border border-slate-200 p-2.5 focus:outline-none focus:border-[#183A72] bg-white text-slate-700"
            >
              <option value="all">All Dhaka Districts</option>
              {uniqueLocations.map((loc, idx) => (
                <option key={idx} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* Grid rendering list */}
      <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider border-b border-gray-100 pb-2">
        {guards.length === 0 ? "No records on file" : `${filteredGuards.length} Verified Security Guards Available`}
      </h3>

      {filteredGuards.length === 0 ? (
        <div className="text-center py-16 bg-slate-50 border border-slate-205">
          <p className="text-gray-500 text-sm">No security personnel matching current filter configurations.</p>
        </div>
      ) : (
        <div id="guards_cards_grid" className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {filteredGuards.map((guard) => (
            <div
              key={guard.id}
              id={`guard_item_card_${guard.id}`}
              className="bg-white border-0 border-b-2 border-slate-250 hover:border-[#183A72] overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              {/* Image block */}
              <div className="relative">
                <div className="aspect-square bg-slate-100 w-full overflow-hidden">
                  <img
                    src={guard.photo || "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400"}
                    alt={guard.full_name}
                    referrerPolicy="no-referrer"
                    className="h-full w-full object-cover filter brightness-[0.9]"
                  />
                </div>
                <span className="absolute top-3 left-3 bg-[#183A72] text-[#EAB308] font-bold text-[9px] px-2.5 py-1 uppercase tracking-wider">
                  {guard.security_type || "Sentinel Guard"}
                </span>
                <span className="absolute top-3 right-3 bg-white/95 text-emerald-800 border border-emerald-300 font-bold text-[9px] px-2 py-0.5 flex items-center gap-1">
                  <ShieldCheck className="h-3 w-3 text-emerald-600" />
                  <span>Licensed</span>
                </span>
              </div>

              {/* Body */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4 font-sans">
                <div className="space-y-2">
                  <h4 className="text-xl font-bold text-slate-900 tracking-tight leading-tighter uppercase font-poppins">
                    {guard.full_name}
                  </h4>
                  
                  <div className="flex flex-wrap items-center gap-2 text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                    <span className="flex items-center gap-0.5 shrink-0">
                      <Clock className="h-3.5 w-3.5 text-gray-400" />
                      {guard.experience} Experience
                    </span>
                    <span className="text-slate-300">•</span>
                    <span className="flex items-center gap-0.5 max-w-[130px] truncate">
                      <MapPin className="h-3.5 w-3.5 text-gray-400 shrink-0" />
                      {guard.location || "Dhaka"}
                    </span>
                  </div>
                </div>

                <div className="text-xs bg-[#F8FAFC] p-3 border border-slate-200 uppercase tracking-wide">
                  <span className="block font-bold text-[9px] text-slate-400 uppercase tracking-widest mb-1">Key Training Verified:</span>
                  <p className="line-clamp-1 font-bold text-[#183A72] text-[11px]">
                    {guard.training || "Tactical security defense operations, physical layout scans"}
                  </p>
                </div>

                <p className="text-slate-500 text-xs leading-relaxed line-clamp-3 font-sans">
                  {guard.description || "Disciplined security specialist focusing on overall loss prevention, physical assets monitoring and protection of commercial sectors."}
                </p>

                {/* Direct Action Triggers */}
                <div className="pt-4 border-t border-slate-100 flex gap-2">
                  <button
                    onClick={() => {
                      setSelectedGuard(guard);
                      setSubmitSuccess(false);
                      setSubmitError("");
                    }}
                    className="flex-1 bg-[#183A72] py-3 text-center text-xs font-bold text-white uppercase tracking-wider hover:bg-[#1E468A] hover:text-[#EAB308] transition-colors cursor-pointer whitespace-nowrap"
                  >
                    View Secure Resume
                  </button>
                  <button
                    onClick={() => onOpenRequestForm("Security Guard", guard)}
                    className="border border-slate-200 p-3 text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
                    title="Book Sentinel Guard"
                  >
                    <ShieldCheck className="h-4 w-4 text-[#183A72]" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* SINGLE PROFILE MODAL DRAWER */}
      {selectedGuard && (
        <div id="guard_detailed_modal_dialog" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-100 flex flex-col md:flex-row relative">
            
            <button
              onClick={() => setSelectedGuard(null)}
              className="absolute top-4 right-4 z-10 bg-slate-100 hover:bg-slate-200 text-slate-600 p-2 rounded-full cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Left Photo */}
            <div className="sm:w-5/12 bg-slate-50 p-6 sm:p-8 space-y-6 border-r border-gray-100 text-slate-800 font-sans">
              <div className="aspect-square rounded-none overflow-hidden bg-white border border-gray-150">
                <img
                  src={selectedGuard.photo || "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400"}
                  alt={selectedGuard.full_name}
                  referrerPolicy="no-referrer"
                  className="h-full w-full object-cover filter brightness-[0.88]"
                />
              </div>

              <div className="space-y-4">
                <div>
                  <span className="inline-block bg-[#F8FAFC] border border-slate-200 text-[#183A72] text-[9px] font-bold px-2.5 py-1 uppercase tracking-wider mb-2">
                    {selectedGuard.security_type || "Sentinel Guard"}
                  </span>
                  <h3 className="text-2xl font-extrabold tracking-tight text-slate-500 uppercase font-poppins">
                    {selectedGuard.full_name}
                  </h3>
                  <p className="text-xs font-bold uppercase text-slate-500 mt-1 flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                    {selectedGuard.location}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 text-[10px] uppercase font-bold tracking-wider bg-white p-4 border border-slate-200 text-slate-705">
                  <div>
                    <span className="text-slate-400 block mb-1">Experience</span>
                    <span className="font-bold text-slate-800 text-xs">{selectedGuard.experience}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block mb-1">Age</span>
                    <span className="font-bold text-slate-800 text-xs">{selectedGuard.age || 35} Years</span>
                  </div>
                </div>

                <div className="space-y-1.5 pt-2">
                  <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                    Vetted Files Submitted:
                  </span>
                  <p className="text-slate-605 text-xs font-bold uppercase text-[#183A72]">
                    {selectedGuard.documents || "NID Verification, physical training certificate cleared"}
                  </p>
                </div>
              </div>
            </div>

            {/* Right Form */}
            <div className="sm:w-7/12 p-6 sm:p-8 space-y-6 flex flex-col justify-between font-sans">
              
              <div className="space-y-5">
                <div className="space-y-2">
                  <span className="text-xs uppercase tracking-wider font-bold text-[#183A72] block">Professional Background</span>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-sans">
                    {selectedGuard.description || "A highly disciplined sentinel guard force professional. Experienced in overall security control, crowd patrol, layout scanning, fire-response systems, and secure defense logistics."}
                  </p>
                </div>

                <div className="space-y-2">
                  <span className="text-xs uppercase tracking-wider font-bold text-[#183A72] block">Security Training & Certification</span>
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-none space-y-1.5 text-slate-700">
                    <div className="flex items-center gap-1.5 text-[#183A72] font-bold text-xs uppercase tracking-wider">
                      <Award className="h-4 w-4 text-[#EAB308]" />
                      <span>Certified Security Specialist</span>
                    </div>
                    <p className="text-xs leading-relaxed">
                      {selectedGuard.training || "Tactical crisis response, gate pass validation, metallic hazard scanning systems operations, physical fitness test cleared."}
                    </p>
                  </div>
                </div>
              </div>

              {/* Recruitment requesting box */}
              <div className="bg-slate-50 p-5 rounded-none border border-slate-200 space-y-4">
                <div>
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-widest">
                    {currentLanguage === "en" ? `Recruit Officer ${selectedGuard.full_name}` : `নিরাপত্তা প্রহরী সরাসরি নিয়োগের আবেদন`}
                  </h4>
                  <p className="text-slate-500 text-[11px] mt-1">
                    {currentLanguage === "en"
                       ? "Submit your organization/residence details to dispatch this guard. Placement coordination is quick."
                       : "আপনার অফিস বা বাসার ঠিকানা দিয়ে আবেদন জমা দিন। কাস্টমার রিলেশন ডেস্ক দ্রুত যোগাযোগ করবে।"}
                  </p>
                </div>

                {submitSuccess ? (
                  <div className="bg-emerald-50 border border-emerald-205 text-emerald-800 p-4 rounded-none text-center space-y-1">
                    <ShieldCheck className="h-6 w-6 text-emerald-600 mx-auto" />
                    <span className="block font-bold text-xs uppercase tracking-wider">Sentinel Placement Saved!</span>
                    <span className="block text-[11px]">Registration processed successfully. We will follow up.</span>
                  </div>
                ) : (
                  <form onSubmit={handleModalSubmit} className="space-y-3 font-sans">
                    {submitError && (
                      <div className="text-[10px] bg-red-50 text-red-650 p-2 rounded">
                        {submitError}
                      </div>
                    )}
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <input
                          type="text"
                          required
                          placeholder="Your Name / Company"
                          value={reqForm.customer_name}
                          onChange={(e) => setReqForm({ ...reqForm, customer_name: e.target.value })}
                          className="w-full bg-white text-xs p-3 border border-slate-200 rounded-none focus:outline-none focus:border-[#183A72]"
                        />
                      </div>
                      <div>
                        <input
                          type="tel"
                          required
                          placeholder="Contact Number"
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
                        placeholder="Corporate Office Address or Home Location"
                        value={reqForm.address}
                        onChange={(e) => setReqForm({ ...reqForm, address: e.target.value })}
                        className="w-full bg-white text-xs p-3 border border-slate-200 rounded-none focus:outline-none focus:border-[#183A72]"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <select
                          value={reqForm.duration}
                          onChange={(e) => setReqForm({ ...reqForm, duration: e.target.value })}
                          className="w-full bg-white text-xs p-3 border border-slate-200 rounded-none focus:outline-none focus:border-[#183A72] text-[#183A72] font-bold text-[10px] uppercase tracking-wider"
                        >
                          <option value="1 Year">1 Year Contractual</option>
                          <option value="6 Months">6 Months Deployment</option>
                          <option value="Urgent Event">Urgent Custom Event Duty</option>
                        </select>
                      </div>
                      <div>
                        <input
                          type="text"
                          placeholder="Salary Budget offered (BDT)"
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
                      {submittingRequest ? "Registering request..." : "Dispatch Guard Booking Request"}
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
