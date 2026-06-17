import React, { useState } from "react";
import { Search, MapPin, Calendar, Clock, Users, ArrowRight, Check, X, ShieldCheck, Mail, SlidersHorizontal, Map, Bus, Car } from "lucide-react";
import { translations } from "../translations";
import { Applicant } from "../types";
import ApiService from "../api";

interface PickupSectionProps {
  currentLanguage: "en" | "bn";
  pickups: Applicant[];
  onOpenRequestForm: (category: string, prefillWorker?: Applicant) => void;
}

export default function PickupSection({
  currentLanguage,
  pickups,
  onOpenRequestForm,
}: PickupSectionProps) {
  const t = translations[currentLanguage];

  // Client Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [filterArea, setFilterArea] = useState<string>("all");
  const [filterVehicleType, setFilterVehicleType] = useState<string>("all");
  const [filterSchedule, setFilterSchedule] = useState<string>("all");
  const [selectedPickup, setSelectedPickup] = useState<Applicant | null>(null);

  // Hiring Form Context within Modal
  const [submittingRequest, setSubmittingRequest] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [reqForm, setReqForm] = useState({
    customer_name: "",
    phone: "",
    email: "",
    address: "",
    duration: "Monthly basis",
    budget: "",
    notes: "",
  });

  // Extract unique areas/zones from routes or categories
  const uniqueAreas = Array.from(
    new Set(
      pickups
        .map((p) => p.area || p.location || "")
        .filter((area) => area !== "")
        .map((area) => area.split("(")[0].trim())
    )
  );

  const filteredPickups = pickups.filter((p) => {
    // Search
    const nameMatch = p.full_name.toLowerCase().includes(searchQuery.toLowerCase());
    const routeMatch = (p.route || "").toLowerCase().includes(searchQuery.toLowerCase());
    const descMatch = (p.description || "").toLowerCase().includes(searchQuery.toLowerCase());
    const vTypeMatch = (p.vehicle_type || "").toLowerCase().includes(searchQuery.toLowerCase());
    const searchMatches = nameMatch || routeMatch || descMatch || vTypeMatch;

    // Filters
    const areaMatches =
      filterArea === "all" ||
      (p.area || p.location || "").toLowerCase().includes(filterArea.toLowerCase()) ||
      (p.route || "").toLowerCase().includes(filterArea.toLowerCase());

    const vehicleMatches =
      filterVehicleType === "all" ||
      (p.vehicle_type || "").toLowerCase().includes(filterVehicleType.toLowerCase());

    const scheduleMatches =
      filterSchedule === "all" ||
      (p.schedule || "").toLowerCase().includes(filterSchedule.toLowerCase());

    return searchMatches && areaMatches && vehicleMatches && scheduleMatches;
  });

  const handleModalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPickup) return;
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
        service_type: "Pickup Service",
        duration: reqForm.duration,
        budget: reqForm.budget || "BDT 8,000 - 12,000 / Month",
        notes: `REQUESTING SPECIFIC COMMUTE ROUTE DRIVER: ${selectedPickup.full_name} (ID: ${selectedPickup.id}). Vehicle details: ${selectedPickup.vehicle_type}, Route Area: ${selectedPickup.route}. Extra client requirements: ${reqForm.notes}`,
      };

      await ApiService.submitCustomerRequest(payload);
      setSubmitSuccess(true);
      setReqForm({
        customer_name: "",
        phone: "",
        email: "",
        address: "",
        duration: "Monthly basis",
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
    <div id="pickup_view_container" className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 space-y-10">
      
      {/* Editorial Title */}
      <div className="max-w-3xl space-y-2">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          {t.pickupTitle}
        </h2>
        <p className="text-slate-500 text-sm leading-relaxed">
          {currentLanguage === "en"
            ? "Pre-arrange secure daily AC school pickup, home-to-office premium commutes, point-to-point office shuttles, and airport transits managed by police-vetted executive drivers in Dhaka."
            : "আমাদের এসি মাইক্রোবাস, হাইএস কিংবা প্রাইভেট সিডান কার সার্ভিসের দৈনিক সময়সূচী দেখুন। আপনার শিশুর স্কুল কিংবা নিজস্ব অফিসের যাতায়াতে পেশাদার ড্রাইভারের নির্ভরযোগ্য সেবা।"}
        </p>
      </div>

      {/* SEARCH AND FILTERS PANEL */}
      <section id="pickup_filter_controls" className="bg-white border border-slate-200 p-6 rounded-none shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative w-full">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              id="inp_pickup_search"
              placeholder="Search driver names, specific routes, vehicle models, or areas of Dhaka..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-none border border-slate-200 text-xs focus:outline-none focus:border-[#183A72] transition-colors bg-white font-sans"
            />
          </div>
          <div className="flex items-center gap-1.5 shrink-0 text-slate-700 text-xs font-bold uppercase tracking-wider self-start sm:self-center">
            <SlidersHorizontal className="h-4 w-4 text-[#183A72]" />
            <span>{t.filterTitle}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 font-sans">
          {/* Cover Area */}
          <div>
            <label className="block text-[10px] font-bold text-slate-500 mb-1.5 uppercase tracking-wider">
              Service Area / Zone
            </label>
            <select
              value={filterArea}
              onChange={(e) => setFilterArea(e.target.value)}
              className="w-full text-xs rounded-none border border-slate-200 p-2.5 focus:outline-none focus:border-[#183A72] bg-white text-slate-700"
            >
              <option value="all">Any Covered Dhaka Zone</option>
              {uniqueAreas.map((area, idx) => (
                <option key={idx} value={area}>
                  {area}
                </option>
              ))}
            </select>
          </div>

          {/* Vehicle Type */}
          <div>
            <label className="block text-[10px] font-bold text-slate-500 mb-1.5 uppercase tracking-wider">
              Vehicle Classification
            </label>
            <select
              value={filterVehicleType}
              onChange={(e) => setFilterVehicleType(e.target.value)}
              className="w-full text-xs rounded-none border border-slate-200 p-2.5 focus:outline-none focus:border-[#183A72] bg-white text-slate-700"
            >
              <option value="all">Any Microbus or Private Car</option>
              <option value="HiAce">Toyota HiAce Microbus</option>
              <option value="Corolla">Toyota Corolla Sedan</option>
              <option value="Minivan">AC Minivan / Noah</option>
            </select>
          </div>

          {/* Transit Time Schedule */}
          <div>
            <label className="block text-[10px] font-bold text-slate-500 mb-1.5 uppercase tracking-wider">
              Schedule Timings
            </label>
            <select
              value={filterSchedule}
              onChange={(e) => setFilterSchedule(e.target.value)}
              className="w-full text-xs rounded-none border border-slate-200 p-2.5 focus:outline-none focus:border-[#183A72] bg-white text-slate-700"
            >
              <option value="all">Any Timings / Daily</option>
              <option value="Sunday">Sunday to Thursday (School Basis)</option>
              <option value="8:00 AM">Office Peak Hours commuting</option>
            </select>
          </div>
        </div>
      </section>

      {/* RENDER LISTS */}
      <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider border-b border-gray-100 pb-2">
        {pickups.length === 0 ? "No records on file" : `${filteredPickups.length} Verified Commute Driver Placements Found`}
      </h3>

      {filteredPickups.length === 0 ? (
        <div className="text-center py-16 bg-slate-50 rounded-2xl border border-dashed border-gray-200">
          <p className="text-gray-500 text-sm">No drivers or vehicles match the checked requirements currently.</p>
        </div>
      ) : (
        <div id="pickups_cards_grid" className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredPickups.map((p) => (
            <div
              key={p.id}
              id={`pickup_item_card_${p.id}`}
              className="bg-white border-0 border-b-2 border-slate-250 hover:border-[#183A72] overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row"
            >
              
              {/* Left Column in card: Driver portrait & Vehicle snap */}
              <div className="md:w-5/12 bg-slate-50 relative flex flex-col border-r border-[#E2E8F0] min-h-[220px]">
                <div className="h-full w-full bg-slate-100 overflow-hidden shrink-0">
                  <img
                    src={p.photo || "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400"}
                    alt={p.full_name}
                    referrerPolicy="no-referrer"
                    className="h-full w-full object-cover filter brightness-[0.95]"
                  />
                </div>
                {p.vehicle_photo && (
                  <div className="hidden md:block absolute bottom-2 right-2 h-14 w-20 rounded-none overflow-hidden border-2 border-white shadow bg-zinc-150">
                    <img
                       src={p.vehicle_photo}
                       alt={p.vehicle_type}
                       className="h-full w-full object-cover"
                     />
                  </div>
                )}
                <div className="absolute top-2.5 left-2.5 bg-[#183A72] text-[#EAB308] font-bold text-[9px] px-2 py-0.5 rounded-none uppercase">
                  {p.experience} Exp
                </div>
              </div>

              {/* Right Column: Route, capacity, driver name, vehicle info, actions */}
              <div className="md:w-7/12 p-6 flex flex-col justify-between space-y-4 font-sans">
                
                <div className="space-y-3">
                  <div className="space-y-1">
                    <span className="block font-bold text-[10px] uppercase text-[#183A72] tracking-wider flex items-center gap-1">
                      <Bus className="h-3.5 w-3.5 text-[#183A72]" />
                      {p.vehicle_type || "Toyota commute micro"}
                    </span>
                    <h4 className="text-xl font-bold text-slate-900 tracking-tight uppercase font-poppins">
                      {p.full_name}
                    </h4>
                  </div>

                  {/* Route Mapping box */}
                  <div className="p-3.5 rounded-none bg-[#F8FAFC] border border-slate-200 text-xs text-slate-700 space-y-1.5 leading-tight uppercase font-bold tracking-wider">
                    <div className="flex items-start gap-1 text-[9px] text-slate-400">
                      <Map className="h-3.5 w-3.5 text-[#183A72] shrink-0" />
                      <span>Primary Active Routing:</span>
                    </div>
                    <p className="font-bold text-[#183A72] text-[11px] tracking-wide normal-case">
                      {p.route || "Uttara to Dhanmondi (Daily)"}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    <span className="flex items-center gap-1 truncate text-slate-500">
                      <Users className="h-3.5 w-3.5 text-[#183A72] shrink-0" />
                      Capacity: {p.capacity || 10} Seats
                    </span>
                    <span className="flex items-center gap-1 truncate text-slate-500">
                      <Clock className="h-3.5 w-3.5 text-[#183A72] shrink-0" />
                      {p.schedule || "Daily Transit"}
                    </span>
                  </div>
                </div>

                <p className="text-slate-500 text-xs leading-relaxed line-clamp-2">
                  {p.description || "Experienced driver cleared on BRTA license records, operating clean daily school schedules."}
                </p>

                {/* Direct Action Triggers */}
                <div className="pt-4 border-t border-slate-100 flex gap-2">
                  <button
                    onClick={() => {
                      setSelectedPickup(p);
                      setSubmitSuccess(false);
                      setSubmitError("");
                    }}
                    className="flex-1 border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-xs py-3 text-center transition-colors uppercase tracking-wider cursor-pointer"
                  >
                    Details & Vehicle
                  </button>
                  <button
                    onClick={() => onOpenRequestForm("Pickup Service", p)}
                    className="bg-[#183A72] hover:bg-[#1E468A] hover:text-[#EAB308] text-white font-bold text-xs py-3 px-5 transition-colors uppercase tracking-wider flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>Rent Service</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>

              </div>

            </div>
          ))}
        </div>
      )}

      {/* DRILLDOWN DETAILED POPUP MODAL */}
      {selectedPickup && (
        <div id="pickup_detailed_modal_dialog" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-none max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-205 flex flex-col md:flex-row relative">
            
            <button
              onClick={() => setSelectedPickup(null)}
              className="absolute top-4 right-4 z-10 bg-slate-100 hover:bg-slate-200 text-slate-600 p-2 rounded-full cursor-pointer focus:outline-none"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Left Column: Driver portfolio photo + vehicle photo */}
            <div className="md:w-5/12 bg-slate-50 p-6 sm:p-8 space-y-6 border-r border-[#E2E8F0] text-slate-800 flex flex-col justify-between font-sans">
              <div className="space-y-4">
                <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none">Driver Portfolio</span>
                <div className="aspect-square rounded-none overflow-hidden bg-white border border-slate-200">
                  <img
                    src={selectedPickup.photo || "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400"}
                    alt={selectedPickup.full_name}
                    referrerPolicy="no-referrer"
                    className="h-full w-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-extrabold text-slate-900 leading-tight uppercase font-poppins pt-1">
                  {selectedPickup.full_name}
                </h3>
              </div>

              {/* Dedicated large vehicle photograph */}
              <div className="space-y-2 pt-2">
                <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none">Registered Vehicle Spec</span>
                <div className="aspect-video rounded-none overflow-hidden bg-slate-200 border border-slate-200 relative">
                  <img
                    src={selectedPickup.vehicle_photo || "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&q=80&w=600"}
                    alt={selectedPickup.vehicle_type}
                    className="h-full w-full object-cover"
                  />
                  <span className="absolute bottom-2 left-2 bg-[#183A72] px-2.5 py-1 text-[9px] text-[#EAB308] uppercase font-bold">
                    {selectedPickup.vehicle_type || "Toyota HiAce AC"}
                  </span>
                </div>
              </div>
            </div>

            {/* Right Column: Complete route matching & direct booking */}
            <div className="md:w-7/12 p-6 sm:p-8 space-y-6 flex flex-col justify-between">
              
              <div className="space-y-5 text-slate-800">
                <div className="space-y-1">
                  <span className="text-xs uppercase tracking-wider font-bold text-emerald-600 font-mono block">Active Direct Routes</span>
                  <h4 className="text-base font-extrabold text-slate-900 leading-snug">
                    {selectedPickup.route || "Central Dhaka Hub Routes"}
                  </h4>
                  <p className="text-slate-500 text-xs">
                    Area Base: <strong>{selectedPickup.area || "Dhaka Metropolis"}</strong>
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs font-medium font-sans">
                  <div className="p-4 rounded-none border border-slate-205 bg-slate-50 uppercase tracking-wider font-bold">
                    <span className="block text-slate-400 text-[9px] tracking-widest mb-1 font-bold">Seating Capacity</span>
                    <span className="font-bold text-slate-800 text-xs flex items-center gap-1.5">
                      <Users className="h-4 w-4 text-[#183A72]" />
                      {selectedPickup.capacity || 12} Passengers
                    </span>
                  </div>
                  <div className="p-4 rounded-none border border-slate-205 bg-slate-50 uppercase tracking-wider font-bold">
                    <span className="block text-slate-400 text-[9px] tracking-widest mb-1 font-bold">Standard Schedule</span>
                    <span className="font-bold text-slate-800 text-xs flex items-center gap-1.5 line-clamp-1">
                      <Clock className="h-4 w-4 text-[#183A72]" />
                      {selectedPickup.schedule || "Daily Commute"}
                    </span>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <span className="text-xs uppercase tracking-wider font-bold text-slate-550 block">Driver Profile & safety logs</span>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-sans whitespace-pre-line">
                    {selectedPickup.description || "Police-cleared driver with valid BRTA license credentials in order. Fully experienced on major traffic directions of central Dhaka."}
                  </p>
                </div>
              </div>

              {/* Integrated Booking requesting */}
              <div className="bg-slate-50 p-5 rounded-none border border-slate-200 space-y-4">
                <div>
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-widest">
                    {currentLanguage === "en" ? `Commute Booking Form (${selectedPickup.full_name})` : `যাতায়াত বুকিং ও কোটেশন ফরম`}
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-1">
                    {currentLanguage === "en"
                      ? "Submit child school route details or personal office commute. Our transport coord check seats availability."
                      : "আপনার শিশুর স্কুল বা নিজের অফিসের রুট ডিটেইলস সহ বুকিং আবেদন দিন। আসন খালি সাপেক্ষে কল করা হবে।"}
                  </p>
                </div>

                {submitSuccess ? (
                  <div className="bg-emerald-50 border border-emerald-250 text-emerald-800 p-4 rounded-none text-center space-y-1">
                    <ShieldCheck className="h-6 w-6 text-emerald-600 mx-auto" />
                    <span className="block font-bold text-xs uppercase tracking-wider">Route Request Processed!</span>
                    <span className="block text-[11px]">Successfully saved. We are checking seat placement.</span>
                  </div>
                ) : (
                  <form onSubmit={handleModalSubmit} className="space-y-3 font-sans">
                    {submitError && (
                      <div className="text-[10px] bg-red-50 text-red-650 p-2 rounded-none">
                        {submitError}
                      </div>
                    )}
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <input
                          type="text"
                          required
                          placeholder="Your Name"
                          value={reqForm.customer_name}
                          onChange={(e) => setReqForm({ ...reqForm, customer_name: e.target.value })}
                          className="w-full bg-white text-xs p-3 border border-slate-200 rounded-none focus:outline-none focus:border-[#183A72]"
                        />
                      </div>
                      <div>
                        <input
                          type="tel"
                          required
                          placeholder="Mobile Number"
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
                        placeholder="Pickup Home Address"
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
                          <option value="School terms (6 months)">School Terms Daily</option>
                          <option value="Monthly Commuting">Monthly Commuting (Office)</option>
                          <option value="Airport Transfer">Single Airport Transfer</option>
                        </select>
                      </div>
                      <div>
                        <input
                          type="text"
                          placeholder="Salary Budget offered (monthly BDT)"
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
                      {submittingRequest ? "Registering commute..." : "Submit Commute Rent Query"}
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
