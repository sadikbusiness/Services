import React, { useState } from "react";
import { UserCheck, ShieldCheck, Upload, CheckCircle2, AlertTriangle, ArrowRight, ArrowLeft } from "lucide-react";
import { translations } from "../translations";
import ApiService from "../api";

interface WorkerFormProps {
  currentLanguage: "en" | "bn";
}

export default function WorkerForm({ currentLanguage }: WorkerFormProps) {
  const t = translations[currentLanguage];

  const categorySkills: Record<string, string[]> = {
    helper: ["Cooking", "Cleaning", "Babysitting", "Elder Care", "Laundry"],
    security: ["CCTV Monitoring", "Gate Security", "Crowd Control", "Armed Security", "Patrol Duty"],
    pickup: ["School Transport", "Office Transport", "Private Driver", "Delivery Service"]
  };

  // Steps state (Wizard form makes long recruitment forms visually easy!)
  const [currentStep, setCurrentStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState("");

  // Base Form values
  const [formData, setFormData] = useState({
    full_name: "",
    father_name: "",
    mother_name: "",
    dob: "",
    nid: "",
    phone: "",
    email: "",
    address: "",
    category: "helper" as "helper" | "security" | "pickup",
    experience: "",
    skills: "",
    description: "",
    
    // Category specific
    helper_type: "Housemaid" as any,
    security_type: "Residential Security" as any,
    location: "Dhanmondi, Dhaka",

    vehicle_type: "",
    route: "",
    capacity: "",
    schedule: "",
    area: "",

    // Encoded attachments
    photo: "",
    front_nid: "",
    back_nid: "",
    certificates: "",
  });

  // Base64 File Loader Helper
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, fieldName: "photo" | "front_nid" | "back_nid" | "certificates") => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData((prev) => ({
        ...prev,
        [fieldName]: reader.result as string,
      }));
    };
    reader.readAsDataURL(file);
  };

  // Pre-load visual mock photos so the applicant profile doesn't look empty if they don't upload one
  const useSampleMedia = (fieldName: "photo" | "front_nid" | "back_nid" | "certificates", sampleUrl: string) => {
    setFormData((prev) => ({
      ...prev,
      [fieldName]: sampleUrl,
    }));
  };

  const handleNextStep = () => {
    // Basic validations per step
    if (currentStep === 1) {
      if (!formData.full_name || !formData.phone || !formData.nid || !formData.dob) {
        setSubmitError("Please fill out Name, Phone, Date of Birth, and National ID to continue.");
        return;
      }
    }
    setSubmitError("");
    setCurrentStep((prev) => Math.min(prev + 1, 3));
  };

  const handlePrevStep = () => {
    setSubmitError("");
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError("");
    setSubmitting(true);

    try {
      // Final validations
      if (!formData.experience) {
        throw new Error("Professional working experience is required.");
      }
      if (!formData.front_nid || !formData.back_nid) {
        throw new Error("Both Front Side and Back Side NID documents are required to complete registration.");
      }

      // Inject default visual fallbacks if files were skipped
      const payload = {
        ...formData,
        photo: formData.photo || "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400",
        documents: "Front Side and Back Side NID Copies provided online",
      };

      await ApiService.submitApplication(payload);
      setSubmitSuccess(true);
      
      // Reset form
      setFormData({
        full_name: "",
        father_name: "",
        mother_name: "",
        dob: "",
        nid: "",
        phone: "",
        email: "",
        address: "",
        category: "helper",
        experience: "",
        skills: "",
        description: "",
        helper_type: "Housemaid",
        security_type: "Residential Security",
        location: "Dhanmondi, Dhaka",
        vehicle_type: "",
        route: "",
        capacity: "",
        schedule: "",
        area: "",
        photo: "",
        front_nid: "",
        back_nid: "",
        certificates: "",
      });
      setCurrentStep(1);
    } catch (err: any) {
      setSubmitError(err.message || "Failed to submit application. Ensure all fields are filled.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div id="recruit_form_container" className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      
      <div className="bg-white rounded-none border border-slate-200 overflow-hidden shadow-sm p-8 sm:p-12 space-y-8">
        
        {/* Title */}
        <div className="text-center space-y-3">
          <div className="mx-auto h-12 w-12 flex items-center justify-center bg-[#F8FAFC] border border-slate-200 text-[#183A72]">
            <UserCheck className="h-5 w-5" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight uppercase font-poppins">
            {t.applyFormTitle}
          </h2>
          <div className="h-1 w-12 bg-[#EAB308] mx-auto"></div>
          <p className="text-slate-500 text-xs max-w-md mx-auto leading-relaxed">
            {t.applyFormSub}
          </p>
        </div>

        {/* Wizard Progress flow bar */}
        <div className="flex items-center justify-center gap-2 max-w-md mx-auto pb-4">
          {[1, 2, 3].map((step) => (
            <React.Fragment key={step}>
              <div className="flex items-center gap-2">
                <div className={`h-8 w-8 rounded-none border flex items-center justify-center font-bold text-xs select-none transition-all ${
                  currentStep === step
                    ? "bg-[#183A72] border-[#183A72] text-white font-mono scale-105 shadow-sm"
                    : currentStep > step
                    ? "bg-[#EAB308] border-[#EAB308] text-white"
                    : "bg-[#F8FAFC] border-slate-200 text-slate-400"
                }`}>
                  {step}
                </div>
                <span className="hidden sm:inline text-[9px] font-bold uppercase tracking-wider text-slate-500">
                  {step === 1 ? "Personal" : step === 2 ? "Professional" : "Uploads"}
                </span>
              </div>
              {step < 3 && <div className={`flex-1 h-px max-w-[50px] ${currentStep > step ? 'bg-[#EAB308]' : 'bg-slate-200'}`}></div>}
            </React.Fragment>
          ))}
        </div>

        {submitSuccess ? (
          <div className="text-center bg-emerald-50 border border-emerald-100 text-emerald-800 p-8 rounded-none space-y-4 max-w-md mx-auto font-sans">
            <CheckCircle2 className="h-10 w-10 text-emerald-600 mx-auto" />
            <h3 className="font-bold text-base uppercase tracking-wider">{currentLanguage === "en" ? "Application Received" : "আবেদন সম্পন্ন হয়েছে"}</h3>
            <p className="text-xs leading-relaxed text-emerald-700">
              {currentLanguage === "en" 
                ? "Your professional application has been saved to our vetted manpower roster under status PENDING. Our recruitment officer will call you to schedule physical NID checking."
                : "আপনার আবেদনটি সফলভাবে সংরক্ষিত হয়েছে। আমাদের ঢাকা অফিস থেকে শীঘ্রই সরাসরি ইন্টারভিউ ও কাগজপত্র যাচাইয়ের জন্য কল দেওয়া হবে।"}
            </p>
            <button
              onClick={() => setSubmitSuccess(false)}
              className="mt-4 px-6 py-3 bg-[#183A72] text-white text-xs font-bold uppercase tracking-widest hover:bg-[#1E468A] cursor-pointer transition-all"
            >
              {currentLanguage === "en" ? "Apply Another Candidate" : "আরেকটি আবেদন করুন"}
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {submitError && (
              <div className="p-3 bg-rose-50 border border-rose-100 text-rose-800 text-xs rounded-none flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 text-rose-500 shrink-0 mt-0.5" />
                <span>{submitError}</span>
              </div>
            )}

            {/* STEP 1: PERSONAL INFORMATION */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider border-b border-slate-100 pb-2">
                  1. Candidate Personal Registration
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1 tracking-wider">{t.fullName} *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Rahima Khatun"
                      value={formData.full_name}
                      onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                      className="w-full text-xs p-3 rounded-none border border-slate-200 focus:outline-none focus:border-[#183A72] bg-white transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1 tracking-wider">{t.phone} *</label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. 017xxxxxxxx"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full text-xs p-3 rounded-none border border-slate-200 focus:outline-none focus:border-[#183A72] bg-white transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1 tracking-wider">{t.nid} *</label>
                    <input
                      type="text"
                      required
                      placeholder="NID card or smart card number"
                      value={formData.nid}
                      onChange={(e) => setFormData({ ...formData, nid: e.target.value })}
                      className="w-full text-xs p-3 rounded-none border border-slate-200 focus:outline-none focus:border-[#183A72] bg-white transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1 tracking-wider">{t.dob} *</label>
                    <input
                      type="date"
                      required
                      value={formData.dob}
                      onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                      className="w-full text-xs p-3 rounded-none border border-slate-200 focus:outline-none focus:border-[#183A72] bg-white transition-colors text-slate-700"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1 tracking-wider">{t.fatherName}</label>
                    <input
                      type="text"
                      placeholder="Father's name"
                      value={formData.father_name}
                      onChange={(e) => setFormData({ ...formData, father_name: e.target.value })}
                      className="w-full text-xs p-3 rounded-none border border-slate-200 focus:outline-none focus:border-[#183A72] bg-white transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1 tracking-wider">{t.motherName}</label>
                    <input
                      type="text"
                      placeholder="Mother's name"
                      value={formData.mother_name}
                      onChange={(e) => setFormData({ ...formData, mother_name: e.target.value })}
                      className="w-full text-xs p-3 rounded-none border border-slate-200 focus:outline-none focus:border-[#183A72] bg-white transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1 tracking-wider">{t.email}</label>
                    <input
                      type="email"
                      placeholder="Email address (Optional)"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full text-xs p-3 rounded-none border border-slate-200 focus:outline-none focus:border-[#183A72] bg-white transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1 tracking-wider">{t.address}</label>
                    <input
                      type="text"
                      placeholder="Present residency location in Dhaka"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      className="w-full text-xs p-3 rounded-none border border-slate-200 focus:outline-none focus:border-[#183A72] bg-white transition-colors"
                    />
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <button
                    type="button"
                    onClick={handleNextStep}
                    className="flex items-center gap-2 bg-[#183A72] hover:bg-[#1E468A] hover:text-[#EAB308] px-6 py-3.5 text-xs font-bold text-white uppercase tracking-wider transition-colors"
                  >
                    <span>Proceed to step 2</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: PROFESSIONAL DETAILS */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider border-b border-slate-100 pb-2">
                  2. Professional Info & Division
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-1">
                    <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1 tracking-wider">Service Division *</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                      className="w-full text-xs p-3 rounded-none border border-slate-200 focus:outline-none focus:border-[#183A72] bg-white transition-colors"
                    >
                      <option value="helper">Domestic Helper</option>
                      <option value="security">Security Guard</option>
                      <option value="pickup">Pickup Service / Driver</option>
                    </select>
                  </div>
                  
                  <div className="sm:col-span-1">
                    <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1 tracking-wider">Experience Level *</label>
                    <select
                      required
                      value={formData.experience}
                      onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                      className="w-full text-xs p-3 rounded-none border border-slate-200 focus:outline-none focus:border-[#183A72] bg-white transition-colors text-slate-700 font-medium"
                    >
                      <option value="">Select Experience</option>
                      <option value="No Experience">No Experience</option>
                      <option value="Less than 1 Year">Less than 1 Year</option>
                      <option value="1-3 Years">1-3 Years</option>
                      <option value="3-5 Years">3-5 Years</option>
                      <option value="5-10 Years">5-10 Years</option>
                      <option value="10+ Years">10+ Years</option>
                    </select>
                  </div>

                  <div className="sm:col-span-1">
                    <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1 tracking-wider">{t.location} *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Mirpur, Dhaka"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      className="w-full text-xs p-3 rounded-none border border-slate-200 focus:outline-none focus:border-[#183A72] bg-white transition-colors"
                    />
                  </div>
                </div>

                {/* Subcategory Fields */}
                <div className="p-5 bg-[#F8FAFC] border border-slate-150 space-y-4 font-sans">
                  <span className="text-[10px] font-extrabold text-[#183A72] uppercase tracking-wider block">
                    Division specific details
                  </span>

                  {formData.category === "helper" && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1 tracking-wider">Domestic Helper Category</label>
                        <select
                          value={formData.helper_type}
                          onChange={(e) => setFormData({ ...formData, helper_type: e.target.value as any })}
                          className="w-full text-xs p-2.5 rounded-none border border-slate-200 focus:outline-none focus:border-[#183A72] bg-white"
                        >
                          <option value="Housemaid">Housemaid (রান্না ও গৃহস্থালি)</option>
                          <option value="Babysitter">Babysitter / Nanny (শিশু লালন-পালন)</option>
                          <option value="Caregiver">Elder Caregiver (বয়স্ক সেবা)</option>
                          <option value="Cleaner">Deep Residential Cleaner (ঝাড়ু-মোছা)</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1 tracking-wider">Select Skills (Optional)</label>
                        <select
                          value=""
                          onChange={(e) => {
                            const val = e.target.value;
                            if (val) {
                              const sArray = formData.skills.split(", ").map(x => x.trim()).filter(Boolean);
                              if (!sArray.includes(val)) {
                                sArray.push(val);
                                setFormData({ ...formData, skills: sArray.join(", ") });
                              }
                            }
                          }}
                          className="w-full text-xs p-2.5 rounded-none border border-slate-200 focus:outline-none focus:border-[#183A72] bg-white text-slate-700"
                        >
                          <option value="">Select Skills (Optional)</option>
                          {categorySkills.helper.map(skill => (
                            <option key={skill} value={skill}>{skill}</option>
                          ))}
                        </select>
                        {formData.skills && (
                          <div className="flex flex-wrap gap-1.5 mt-2">
                            {formData.skills.split(", ").map(x => x.trim()).filter(Boolean).map(skill => (
                              <span key={skill} className="inline-flex items-center gap-1 bg-[#183A72]/10 text-[#183A72] text-[10px] font-bold px-2 py-0.5 border border-[#183A72]/20">
                                {skill}
                                <button
                                  type="button"
                                  onClick={() => {
                                    const filtered = formData.skills
                                      .split(", ")
                                      .map(x => x.trim())
                                      .filter(s => s !== skill)
                                      .join(", ");
                                    setFormData({ ...formData, skills: filtered });
                                  }}
                                  className="text-slate-500 hover:text-red-500 font-bold ml-1 cursor-pointer"
                                >
                                  ×
                                </button>
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {formData.category === "security" && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1 tracking-wider">Defense Training Certification</label>
                        <select
                          value={formData.security_type}
                          onChange={(e) => setFormData({ ...formData, security_type: e.target.value as any })}
                          className="w-full text-xs p-2.5 rounded-none border border-slate-200 focus:outline-none focus:border-[#183A72] bg-white"
                        >
                          <option value="Residential Security">Residential guard force</option>
                          <option value="Commercial Security">Commercial complex guard force</option>
                          <option value="Event Security">Special elite event patrol</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1 tracking-wider">Select Skills (Optional)</label>
                        <select
                          value=""
                          onChange={(e) => {
                            const val = e.target.value;
                            if (val) {
                              const sArray = formData.skills.split(", ").map(x => x.trim()).filter(Boolean);
                              if (!sArray.includes(val)) {
                                sArray.push(val);
                                setFormData({ ...formData, skills: sArray.join(", ") });
                              }
                            }
                          }}
                          className="w-full text-xs p-2.5 rounded-none border border-slate-200 focus:outline-none focus:border-[#183A72] bg-white text-slate-700"
                        >
                          <option value="">Select Skills (Optional)</option>
                          {categorySkills.security.map(skill => (
                            <option key={skill} value={skill}>{skill}</option>
                          ))}
                        </select>
                        {formData.skills && (
                          <div className="flex flex-wrap gap-1.5 mt-2">
                            {formData.skills.split(", ").map(x => x.trim()).filter(Boolean).map(skill => (
                              <span key={skill} className="inline-flex items-center gap-1 bg-[#183A72]/10 text-[#183A72] text-[10px] font-bold px-2 py-0.5 border border-[#183A72]/20">
                                {skill}
                                <button
                                  type="button"
                                  onClick={() => {
                                    const filtered = formData.skills
                                      .split(", ")
                                      .map(x => x.trim())
                                      .filter(s => s !== skill)
                                      .join(", ");
                                    setFormData({ ...formData, skills: filtered });
                                  }}
                                  className="text-slate-500 hover:text-red-500 font-bold ml-1 cursor-pointer"
                                >
                                  ×
                                </button>
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {formData.category === "pickup" && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1 tracking-wider">Vehicle Details Driven</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Toyota Hiace Microbus 2018"
                            value={formData.vehicle_type}
                            onChange={(e) => setFormData({ ...formData, vehicle_type: e.target.value })}
                            className="w-full text-xs p-2.5 rounded-none border border-slate-200 focus:outline-none focus:border-[#183A72] bg-white"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1 tracking-wider">Transit Routes coverage</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Uttara to Dhanmondi (Mohakhali rd)"
                            value={formData.route}
                            onChange={(e) => setFormData({ ...formData, route: e.target.value })}
                            className="w-full text-xs p-2.5 rounded-none border border-slate-200 focus:outline-none focus:border-[#183A72] bg-white"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1 tracking-wider">Passenger seats</label>
                          <input
                            type="number"
                            required
                            placeholder="e.g. 12"
                            value={formData.capacity}
                            onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                            className="w-full text-xs p-2.5 rounded-none border border-slate-200 focus:outline-none focus:border-[#183A72] bg-white"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1 tracking-wider">Commute Schedule hours</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. 7:00 AM - 4:00 PM (Weekly)"
                            value={formData.schedule}
                            onChange={(e) => setFormData({ ...formData, schedule: e.target.value })}
                            className="w-full text-xs p-2.5 rounded-none border border-slate-200 focus:outline-none focus:border-[#183A72] bg-white"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1 tracking-wider">Driving License Number</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. BRTA_DK_298471"
                            value={formData.area}
                            onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                            className="w-full text-xs p-2.5 rounded-none border border-slate-200 focus:outline-none focus:border-[#183A72] bg-white"
                          />
                        </div>
                      </div>

                      <div className="pt-2">
                        <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1 tracking-wider">Select Skills (Optional)</label>
                        <select
                          value=""
                          onChange={(e) => {
                            const val = e.target.value;
                            if (val) {
                              const sArray = formData.skills.split(", ").map(x => x.trim()).filter(Boolean);
                              if (!sArray.includes(val)) {
                                sArray.push(val);
                                setFormData({ ...formData, skills: sArray.join(", ") });
                              }
                            }
                          }}
                          className="w-full text-xs p-2.5 rounded-none border border-slate-200 focus:outline-none focus:border-[#183A72] bg-white text-slate-700 font-sans"
                        >
                          <option value="">Select Skills (Optional)</option>
                          {categorySkills.pickup.map(skill => (
                            <option key={skill} value={skill}>{skill}</option>
                          ))}
                        </select>
                        {formData.skills && (
                          <div className="flex flex-wrap gap-1.5 mt-2">
                            {formData.skills.split(", ").map(x => x.trim()).filter(Boolean).map(skill => (
                              <span key={skill} className="inline-flex items-center gap-1 bg-[#183A72]/10 text-[#183A72] text-[10px] font-bold px-2 py-0.5 border border-[#183A72]/20">
                                {skill}
                                <button
                                  type="button"
                                  onClick={() => {
                                    const filtered = formData.skills
                                      .split(", ")
                                      .map(x => x.trim())
                                      .filter(s => s !== skill)
                                      .join(", ");
                                    setFormData({ ...formData, skills: filtered });
                                  }}
                                  className="text-slate-500 hover:text-red-500 font-bold ml-1 cursor-pointer"
                                >
                                  ×
                                </button>
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                </div>

                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1 tracking-wider">Brief Narrative Background</label>
                  <textarea
                    rows={3}
                    placeholder="Describe your previous work places, behavior records, and why you are applying..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full text-xs p-3 rounded-none border border-slate-200 focus:outline-none focus:border-[#183A72] bg-white transition-colors"
                  />
                </div>

                <div className="pt-4 flex justify-between">
                  <button
                    type="button"
                    onClick={handlePrevStep}
                    className="flex items-center gap-1.5 border border-slate-300 bg-white px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    <span>Back</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleNextStep}
                    className="flex items-center gap-2 bg-[#183A72] hover:bg-[#1E468A] hover:text-[#EAB308] px-6 py-3.5 text-xs font-bold text-white uppercase tracking-wider transition-colors"
                  >
                    <span>Proceed to step 3</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: FILE UPLOADS/SAMPLES */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider border-b border-slate-100 pb-2">
                  3. Documents, Profile Photo & NID (Required)
                </h3>

                <p className="text-xs text-slate-500 leading-relaxed">
                  Select and upload JPG/PNG or PDF copies. You can also use our preloaded, high-quality demo visuals to expedite your testing:
                </p>

                {(() => {
                  const renderFilePreview = (data: string) => {
                    if (!data) return null;
                    if (data.startsWith("data:application/pdf") || data.includes("PDF") || data.includes("pdf") || data.includes("SAMPLE_NID")) {
                      return (
                        <div className="mt-2 p-2 bg-emerald-50 border border-emerald-200 flex items-center justify-center gap-1.5 text-emerald-800 text-[10px] font-bold font-mono">
                          <span className="px-1.5 py-0.5 bg-[#183A72] text-white rounded">NID</span>
                          DOCUMENT LOADED
                        </div>
                      );
                    }
                    return (
                      <div className="mt-2 flex justify-center">
                        <img src={data} alt="Upload preview" className="max-h-24 object-contain border border-slate-200 shadow-xs" />
                      </div>
                    );
                  };

                  return (
                    <div className="space-y-6">
                      {/* Portrait photo slot */}
                      <div className="p-6 rounded-none border border-dashed border-slate-300 flex flex-col items-center justify-center text-center space-y-3 bg-[#F8FAFC]">
                        <Upload className="h-5 w-5 text-[#183A72]" />
                        <div>
                          <span className="block font-bold text-slate-800 text-xs uppercase tracking-wider">{t.uploadPhoto}</span>
                          <span className="block text-[10px] text-slate-400 mt-1">JPG or PNG (max 5 MB)</span>
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileChange(e, "photo")}
                          className="hidden"
                          id="upload_photo_input"
                        />
                        <label
                          htmlFor="upload_photo_input"
                          className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-[9px] uppercase tracking-wider cursor-pointer transition-colors"
                        >
                          Choose File
                        </label>

                        {formData.photo ? (
                          <div className="w-full">
                            <span className="text-[10px] text-emerald-600 font-semibold flex items-center justify-center gap-1">
                              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                              Selected successfully
                            </span>
                            {renderFilePreview(formData.photo)}
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => useSampleMedia("photo", "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400")}
                            className="text-[10px] text-[#183A72] hover:underline cursor-pointer"
                          >
                            [Use Professional Sample Portrait]
                          </button>
                        )}
                      </div>

                      {/* NID FRONT & BACK SLOTS */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        
                        {/* FRONT SLOT */}
                        <div className="p-6 rounded-none border border-dashed border-slate-300 flex flex-col items-center justify-center text-center space-y-3 bg-[#F8FAFC]">
                          <Upload className="h-5 w-5 text-[#183A72]" />
                          <div>
                            <span className="block font-bold text-slate-800 text-xs uppercase tracking-wider">Front Side NID Upload *</span>
                            <span className="block text-[10px] text-slate-400 mt-1">JPG, JPEG, PNG, or PDF</span>
                          </div>
                          <input
                            type="file"
                            accept="image/*,application/pdf"
                            onChange={(e) => handleFileChange(e, "front_nid")}
                            className="hidden"
                            id="upload_front_nid"
                          />
                          <label
                            htmlFor="upload_front_nid"
                            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-[9px] uppercase tracking-wider cursor-pointer transition-colors"
                          >
                            Choose File
                          </label>

                          {formData.front_nid ? (
                            <div className="w-full">
                              <span className="text-[10px] text-emerald-600 font-semibold flex items-center justify-center gap-1">
                                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                                Front Uploaded Successfully
                              </span>
                              {renderFilePreview(formData.front_nid)}
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={() => useSampleMedia("front_nid", "https://images.unsplash.com/photo-1554774853-aae0a22c8aa4?auto=format&fit=crop&q=80&w=400")}
                              className="text-[10px] text-[#183A72] hover:underline cursor-pointer"
                            >
                              [Preload Demo Front NID]
                            </button>
                          )}
                        </div>

                        {/* BACK SLOT */}
                        <div className="p-6 rounded-none border border-dashed border-slate-300 flex flex-col items-center justify-center text-center space-y-3 bg-[#F8FAFC]">
                          <Upload className="h-5 w-5 text-[#183A72]" />
                          <div>
                            <span className="block font-bold text-slate-800 text-xs uppercase tracking-wider">Back Side NID Upload *</span>
                            <span className="block text-[10px] text-slate-400 mt-1">JPG, JPEG, PNG, or PDF</span>
                          </div>
                          <input
                            type="file"
                            accept="image/*,application/pdf"
                            onChange={(e) => handleFileChange(e, "back_nid")}
                            className="hidden"
                            id="upload_back_nid"
                          />
                          <label
                            htmlFor="upload_back_nid"
                            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-[9px] uppercase tracking-wider cursor-pointer transition-colors"
                          >
                            Choose File
                          </label>

                          {formData.back_nid ? (
                            <div className="w-full">
                              <span className="text-[10px] text-emerald-600 font-semibold flex items-center justify-center gap-1">
                                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                                Back Uploaded Successfully
                              </span>
                              {renderFilePreview(formData.back_nid)}
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={() => useSampleMedia("back_nid", "https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&q=80&w=400")}
                              className="text-[10px] text-[#183A72] hover:underline cursor-pointer"
                            >
                              [Preload Demo Back NID]
                            </button>
                          )}
                        </div>

                      </div>
                    </div>
                  );
                })()}

                <div className="pt-4 flex justify-between border-t border-slate-100">
                  <button
                    type="button"
                    onClick={handlePrevStep}
                    className="flex items-center gap-1.5 border border-slate-300 bg-white px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    <span>Back</span>
                  </button>
                  
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex items-center gap-2 bg-[#183A72] border border-[#183A72] px-6 py-3 text-xs font-bold text-white uppercase tracking-wider hover:bg-[#1E468A] hover:text-[#EAB308] cursor-pointer disabled:opacity-50 transition-colors"
                  >
                    <ShieldCheck className="h-4 w-4 text-[#EAB308]" />
                    <span>{submitting ? "Submitting Application..." : "Complete & Submit Application"}</span>
                  </button>
                </div>
              </div>
            )}

          </form>
        )}

      </div>
    </div>
  );
}
