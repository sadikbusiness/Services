import React, { useState, useEffect } from "react";
import { ShieldAlert } from "lucide-react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import HomeSection from "./components/HomeSection";
import AboutSection from "./components/AboutSection";
import HelperSection from "./components/HelperSection";
import GuardSection from "./components/GuardSection";
import PickupSection from "./components/PickupSection";
import NoticeSection from "./components/NoticeSection";
import CustomerForm from "./components/CustomerForm";
import WorkerForm from "./components/WorkerForm";
import ContactSection from "./components/ContactSection";
import AdminDashboard from "./components/AdminDashboard";
import ApiService from "./api";
import { Applicant, Notice, SystemSettings } from "./types";

export default function App() {
  const [currentView, setCurrentView] = useState<string>(() => {
    const path = window.location.pathname;
    if (path.startsWith("/admin") || path.startsWith("/dashboard")) {
      return "admin";
    }
    const slug = path.slice(1);
    const validViews = ["about", "helpers", "guards", "pickups", "notices", "hire", "apply", "contact"];
    if (validViews.includes(slug)) {
      return slug;
    }
    return "home";
  });
  const [currentLanguage, setCurrentLanguage] = useState<"en" | "bn">("en");

  // Global Loaded Database states
  const [helpers, setHelpers] = useState<Applicant[]>([]);
  const [guards, setGuards] = useState<Applicant[]>([]);
  const [pickups, setPickups] = useState<Applicant[]>([]);
  const [notices, setNotices] = useState<Notice[]>([]);
  const [settings, setSettings] = useState<SystemSettings | null>(null);

  // States for hiring preset form prefill
  const [requestPrefillCategory, setRequestPrefillCategory] = useState<string>("Domestic Helper");
  const [requestPrefillWorker, setRequestPrefillWorker] = useState<Applicant | undefined>(undefined);

  const [loading, setLoading] = useState(true);
  const [errorBanner, setErrorBanner] = useState("");

  const loadGlobalDirectory = async () => {
    setLoading(true);
    setErrorBanner("");
    try {
      // 1. Fetch system details
      const settingsData = await ApiService.getSettings().catch(() => null);
      if (settingsData) setSettings(settingsData);

      // 2. Fetch approved applicants using the correct ApiService endpoints
      const allWorkers = await ApiService.getPublicApplicants().catch(() => []);
      
      const approvedHelpers = allWorkers.filter((w: Applicant) => w.category === "helper" && w.status === "approved");
      const approvedGuards = allWorkers.filter((w: Applicant) => w.category === "security" && w.status === "approved");
      const approvedPickups = allWorkers.filter((w: Applicant) => w.category === "pickup" && w.status === "approved");

      setHelpers(approvedHelpers);
      setGuards(approvedGuards);
      setPickups(approvedPickups);

      // 3. Fetch notices using correct endpoint
      const allNotices = await ApiService.getPublicNotices().catch(() => []);
      setNotices(allNotices);

    } catch (err) {
      setErrorBanner("Failed to communicate with fullstack directory server. Verify Node process running.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGlobalDirectory();
  }, []);

  useEffect(() => {
    const handleUrlRouting = () => {
      const path = window.location.pathname;
      if (path.startsWith("/admin") || path.startsWith("/dashboard")) {
        setCurrentView("admin");
        setRequestPrefillWorker(undefined); // Fixed: Clean stale worker states on manual backward route
      } else {
        const slug = path.slice(1);
        const validViews = ["about", "helpers", "guards", "pickups", "notices", "hire", "apply", "contact"];
        if (validViews.includes(slug)) {
          setCurrentView(slug);
          if (slug !== "hire") setRequestPrefillWorker(undefined); // Fixed: Prevent memory leaks
        } else if (!slug || slug === "") {
          setCurrentView("home");
          setRequestPrefillWorker(undefined);
        }
      }
    };

    window.addEventListener("popstate", handleUrlRouting);
    return () => window.removeEventListener("popstate", handleUrlRouting);
  }, []);

  const handleOpenRequestForm = (category: string, prefillWorker?: Applicant) => {
    setRequestPrefillCategory(category);
    setRequestPrefillWorker(prefillWorker);
    setCurrentView("hire");
    window.history.pushState(null, "", "/hire");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleNavigate = (view: string) => {
    // Check custom Footer routes mapping
    let targetView = view;
    if (view === "apply_work") targetView = "apply";
    if (view === "hire_now") targetView = "hire";
    if (view === "pickup") targetView = "pickups";

    setCurrentView(targetView);
    if (targetView === "admin") {
      window.history.pushState(null, "", "/admin");
    } else if (targetView === "home") {
      window.history.pushState(null, "", "/");
    } else {
      window.history.pushState(null, "", `/${targetView}`);
    }

    // Reset prefills if navigate elsewhere
    if (targetView !== "hire") {
      setRequestPrefillWorker(undefined);
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const isRoutingAdmin = currentView === "admin";

  return (
    <div 
      id="manpower_portal_root" 
      className={isRoutingAdmin ? "min-h-screen bg-[#F8FAFC] flex flex-col justify-between text-slate-900 font-sans" : "min-h-screen bg-[#f1f5f9] flex flex-col justify-between text-slate-900 font-sans"}
    >
      
      {/* 1. Header Navigation Bar (Only for Public Views) */}
      {!isRoutingAdmin && (
        <Header
          currentView={currentView}
          currentLanguage={currentLanguage}
          onViewChange={handleNavigate}
          onLanguageChange={setCurrentLanguage}
          settings={settings}
        />
      )}

      {/* Connection error banner */}
      {errorBanner && (
        <div className="bg-amber-50 border-b border-amber-200 py-2.5 text-center text-xs text-amber-900 font-semibold flex items-center justify-center gap-2 z-50">
          <ShieldAlert className="h-4.5 w-4.5 text-amber-600 shrink-0" />
          <span>{errorBanner}</span>
          <button
            onClick={loadGlobalDirectory}
            className="underline ml-2 text-indigo-700 hover:text-indigo-900 pointer-events-auto cursor-pointer"
          >
            Retry Connection Link
          </button>
        </div>
      )}

      {/* 2. Primary Page Router Viewports */}
      <div id="portal_view_stage" className="flex-1 flex flex-col">
        
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 space-y-3 flex-1">
            <div className="animate-spin h-8 w-8 border-4 border-slate-900 border-t-transparent rounded-full"></div>
            <p className="text-slate-500 text-xs font-medium uppercase tracking-wider">Syncing portal rosters...</p>
          </div>
        ) : (
          <>
            {currentView === "home" && (
              <HomeSection
                currentLanguage={currentLanguage}
                onViewChange={handleNavigate}
                notices={notices}
                settings={settings}
              />
            )}

            {currentView === "about" && (
              <AboutSection currentLanguage={currentLanguage} settings={settings} />
            )}

            {currentView === "helpers" && (
              <HelperSection
                currentLanguage={currentLanguage}
                helpers={helpers}
                onOpenRequestForm={handleOpenRequestForm}
              />
            )}

            {currentView === "guards" && (
              <GuardSection
                currentLanguage={currentLanguage}
                guards={guards}
                onOpenRequestForm={handleOpenRequestForm}
              />
            )}

            {currentView === "pickups" && (
              <PickupSection
                currentLanguage={currentLanguage}
                pickups={pickups}
                onOpenRequestForm={handleOpenRequestForm}
              />
            )}

            {currentView === "notices" && (
              <NoticeSection
                currentLanguage={currentLanguage}
                notices={notices}
              />
            )}

            {currentView === "hire" && (
              <CustomerForm
                currentLanguage={currentLanguage}
                prefillCategory={requestPrefillCategory}
                prefillWorker={requestPrefillWorker}
              />
            )}

            {currentView === "apply" && (
              <WorkerForm currentLanguage={currentLanguage} />
            )}

            {currentView === "contact" && (
              <ContactSection
                currentLanguage={currentLanguage}
                settings={settings}
              />
            )}

            {currentView === "admin" && (
              <AdminDashboard
                currentLanguage={currentLanguage}
                onSettingsChanged={loadGlobalDirectory}
              />
            )}
          </>
        )}

      </div>

      {/* 3. Footer branding section (Only for Public Views) */}
      {!isRoutingAdmin && (
        <Footer
          currentLanguage={currentLanguage}
          onViewChange={handleNavigate}
          settings={settings}
        />
      )}

    </div>
  );
}