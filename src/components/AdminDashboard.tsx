import React, { useState, useEffect, useMemo } from "react";
import {
  ShieldAlert, ShieldCheck, AreaChart as LucideAreaChart, UserCheck, ClipboardCheck, Bell, Settings,
  LogOut, Plus, Trash2, Edit2, Calendar, FileText, Check, X, Shield, Lock, Eye, Clock, 
  KeySquare, HelpCircle, Search, Menu, ChevronLeft, ChevronRight, Filter, Download,
  ExternalLink, Sparkles, Activity, FileSpreadsheet, Users2, ShieldQuestion,
  TrendingUp, TrendingDown, RefreshCw, Layers, Target
} from "lucide-react";
import { 
  ResponsiveContainer, LineChart, Line, BarChart, Bar, XAxis, YAxis, 
  Tooltip, CartesianGrid, AreaChart as RechartsAreaChart, Area 
} from "recharts";
import ApiService from "../api";
import { User, Applicant, ServiceRequest, Notice, ActivityLog, SystemSettings } from "../types";

interface AdminDashboardProps {
  currentLanguage: "en" | "bn";
  onSettingsChanged: () => void;
}

export default function AdminDashboard({ currentLanguage, onSettingsChanged }: AdminDashboardProps) {
  // Login auth state
  const [token, setToken] = useState<string | null>(localStorage.getItem("ns_manpower_admin_token"));
  const [adminUser, setAdminUser] = useState<User | null>(null);

  const [loginEmail, setLoginEmail] = useState("admin@manpower.com");
  const [loginPass, setLoginPass] = useState("admin123");
  const [loginError, setLoginError] = useState("");
  const [loggingIn, setLoggingIn] = useState(false);

  // Dashboard state
  const [activeTab, setActiveTab] = useState<"overview" | "applicants" | "requests" | "notices" | "logs" | "settings">("overview");
  const [stats, setStats] = useState<any>(null);
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [selectedCandidate, setSelectedCandidate] = useState<Applicant | null>(null);
  const [adminUsers, setAdminUsers] = useState<User[]>([]);
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [notices, setNotices] = useState<Notice[]>([]);
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [settingsForm, setSettingsForm] = useState<SystemSettings | null>(null);

  // Search, Filters & Sorting state
  const [applicantSearch, setApplicantSearch] = useState("");
  const [applicantCategoryFilter, setApplicantCategoryFilter] = useState("all");
  const [applicantStatusFilter, setApplicantStatusFilter] = useState("all");

  const [requestSearch, setRequestSearch] = useState("");
  const [requestStatusFilter, setRequestStatusFilter] = useState("all");

  const [noticeSearch, setNoticeSearch] = useState("");

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  // Pagination index
  const [appTablePage, setAppTablePage] = useState(1);
  const [reqTablePage, setReqTablePage] = useState(1);
  const pageSize = 8;

  // Editors CRUD selectors & modals
  const [editingApplicant, setEditingApplicant] = useState<Applicant | null>(null);
  const [editingNotice, setEditingNotice] = useState<Notice | null>(null);
  const [showNoticeCreator, setShowNoticeCreator] = useState(false);
  const [newNotice, setNewNotice] = useState({
    title: "",
    content: "",
    priority: "normal" as any,
    status: "published" as any,
    is_pinned: false,
  });

  const [loading, setLoading] = useState(false);
  const [actionError, setActionError] = useState("");
  const [actionSuccess, setActionSuccess] = useState("");

  // Direct manual Candidate Enrollment form states
  const [enrollModalOpen, setEnrollModalOpen] = useState(false);
  const [enrollForm, setEnrollForm] = useState({
    full_name: "", father_name: "", mother_name: "", dob: "", nid: "", phone: "", email: "", address: "",
    category: "helper" as "helper" | "security" | "pickup", experience: "2 Years", skills: "", photo: "", documents: "Manual Registry", status: "approved" as any,
    helper_type: "maid_cleaner" as any, security_type: "residential_guard" as any, location: "Dhaka",
    vehicle_type: "pickup_small" as any, vehicle_photo: "", route: "", capacity: "" as any, schedule: "day_shift" as any, area: "Dhaka", description: ""
  });

  // SMTP Settings & configuration sub-tab states
  const [smtpSubTab, setSmtpSubTab] = useState<"general" | "smtp">("general");
  const [smtpTesting, setSmtpTesting] = useState(false);
  const [testRecipient, setTestRecipient] = useState("");
  const [smtpTestResult, setSmtpTestResult] = useState<{ success: boolean; message: string } | null>(null);

  const handleEnrollSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionError("");
    setActionSuccess("");
    try {
      const res = await ApiService.enrollApplicantAdmin(enrollForm);
      if (res.success) {
        setActionSuccess(`Candidate "${enrollForm.full_name}" registered and authorized in portal registry successfully.`);
        setEnrollModalOpen(false);
        // Reset form variables
        setEnrollForm({
          full_name: "", father_name: "", mother_name: "", dob: "", nid: "", phone: "", email: "", address: "",
          category: "helper", experience: "2 Years", skills: "", photo: "", documents: "Manual Registry", status: "approved",
          helper_type: "maid_cleaner", security_type: "residential_guard", location: "Dhaka",
          vehicle_type: "pickup_small", vehicle_photo: "", route: "", capacity: "", schedule: "day_shift", area: "Dhaka", description: ""
        });
        await loadDashboardData();
      }
    } catch (err: any) {
      setActionError(err.message || "Failed to manually register applicant profile.");
    }
  };

  const handleTestSmtp = async () => {
    if (!settingsForm) return;
    setSmtpTesting(true);
    setSmtpTestResult(null);
    try {
      const res = await ApiService.testSmtpSettings({
        smtp_host: settingsForm.smtp_host,
        smtp_port: settingsForm.smtp_port,
        smtp_secure: settingsForm.smtp_secure,
        smtp_user: settingsForm.smtp_user,
        smtp_pass: settingsForm.smtp_pass,
        smtp_sender_name: settingsForm.smtp_sender_name,
        smtp_sender_email: settingsForm.smtp_sender_email,
        test_recipient: testRecipient || settingsForm.email || "recipient@manpower-test.com"
      });
      if (res.success) {
        setSmtpTestResult({ success: true, message: res.message });
      }
    } catch (err: any) {
      setSmtpTestResult({ success: false, message: err.message || "Failed dynamic handshake verification." });
    } finally {
      setSmtpTesting(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("ns_manpower_admin_token");
    setToken(null);
    setAdminUser(null);
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail || !loginPass) {
      setLoginError("Email and Password are required");
      return;
    }
    setLoggingIn(true);
    setLoginError("");

    try {
      const res = await ApiService.login({ email: loginEmail, password: loginPass });
      if (res.token) {
        localStorage.setItem("ns_manpower_admin_token", res.token);
        setToken(res.token);
        setAdminUser(res.user);
      }
    } catch (err: any) {
      setLoginError(err.message || "Invalid credentials. Please use admin@manpower.com / admin123");
    } finally {
      setLoggingIn(false);
    }
  };

  // Verify and load session
  useEffect(() => {
    if (token) {
      ApiService.verifySession()
        .then((res) => {
          setAdminUser(res.user);
        })
        .catch(() => {
          handleLogout();
        });
    }
  }, [token]);

  // CSV Export utility definition
  const candidateHeaders = [
    { key: "id", label: "Candidate ID" },
    { key: "full_name", label: "Full Name" },
    { key: "father_name", label: "Father's Name" },
    { key: "mother_name", label: "Mother's Name" },
    { key: "dob", label: "Date of Birth" },
    { key: "nid", label: "National ID ID" },
    { key: "phone", label: "Phone Line" },
    { key: "email", label: "Email Address" },
    { key: "address", label: "Home Address" },
    { key: "category", label: "Operational Category" },
    { key: "experience", label: "Experience Level" },
    { key: "skills", label: "Specialty Skills" },
    { key: "location", label: "Region" },
    { key: "status", label: "Vetting Status" },
    { key: "created_at", label: "Registered Date" }
  ];

  const bookingHeaders = [
    { key: "id", label: "Booking ID" },
    { key: "customer_name", label: "Customer Name" },
    { key: "customer_phone", label: "Customer Phone" },
    { key: "customer_email", label: "Customer Email Address" },
    { key: "service_type", label: "Job booked" },
    { key: "hours_needed", label: "Daily Hours Required" },
    { key: "duration_days", label: "Duration (Days)" },
    { key: "location", label: "Placement Site Address" },
    { key: "special_instructions", label: "Assigned Instructions" },
    { key: "status", label: "Booking State" },
    { key: "assigned_worker_name", label: "Staff Member Assigned" },
    { key: "created_at", label: "Logged Date" }
  ];

  const userHeaders = [
    { key: "id", label: "System User ID" },
    { key: "name", label: "Account Name" },
    { key: "email", label: "System Email" },
    { key: "role", label: "User Access Role" },
    { key: "created_at", label: "Creation Date" }
  ];

  const exportToCSV = (data: any[], filename: string, headers: { key: string; label: string }[]) => {
    try {
      const csvRows = [];
      // Row headers
      csvRows.push(headers.map(h => `"${h.label.replace(/"/g, '""')}"`).join(","));
      
      // Data lines
      for (const row of data) {
        const values = headers.map(h => {
          const val = row[h.key] ?? "";
          const formatted = typeof val === "object" ? JSON.stringify(val) : String(val);
          return `"${formatted.replace(/"/g, '""')}"`;
        });
        csvRows.push(values.join(","));
      }

      const blob = new Blob([csvRows.join("\n")], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", filename);
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error("CSV Export failure:", err);
    }
  };

  // Load dashboard sections data
  const loadDashboardData = async () => {
    if (!token) return;
    setLoading(true);
    setActionError("");
    try {
      const [statsRes, appsRes, reqsRes, noticesRes, usersRes] = await Promise.all([
        ApiService.getAdminStats().catch(() => null),
        ApiService.getApplicantsAdmin().catch(() => []),
        ApiService.getServiceRequestsAdmin().catch(() => []),
        ApiService.getNoticesAdmin().catch(() => []),
        ApiService.getUsersAdmin().catch(() => []),
      ]);

      if (statsRes) setStats(statsRes);
      setApplicants(appsRes);
      setRequests(reqsRes);
      setNotices(noticesRes);
      setAdminUsers(usersRes);

      const logsRes = await ApiService.getSecurityLogs().catch(() => []);
      setLogs(logsRes);

      const settingsRes = await ApiService.getSettings().catch(() => null);
      if (settingsRes) setSettingsForm(settingsRes);
    } catch (err: any) {
      setActionError("Failed to fetch backend data grids. Try refreshing.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (adminUser) {
      loadDashboardData();
    }
  }, [adminUser, activeTab]);

  // CRUD applicant approval
  const handleApplicantStatus = async (id: string, newStatus: "approved" | "rejected" | "pending" | "suspended") => {
    try {
      setActionSuccess("");
      await ApiService.updateApplicant(id, { status: newStatus });
      setActionSuccess(`Applicant state revised to ${newStatus} successfully.`);
      loadDashboardData();
    } catch (err: any) {
      setActionError(err.message || "RBAC Privilege check failed.");
    }
  };

  // CRUD applicant deletion
  const handleApplicantDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to completely de-register this candidate application from records?")) return;
    try {
      setActionSuccess("");
      await ApiService.deleteApplicant(id);
      setActionSuccess("Candidate removed successfully.");
      loadDashboardData();
    } catch (err: any) {
      setActionError(err.message || "Forbidden: Only Admin roles can delete applicants.");
    }
  };

  // Assign approved helper/guard to requests
  const handleAssignWorker = async (requestId: string, workerId: string) => {
    const worker = applicants.find((a) => a.id === workerId);
    if (!worker) return;
    try {
      setActionSuccess("");
      await ApiService.updateServiceRequest(requestId, {
        assigned_worker_id: worker.id,
        assigned_worker_name: worker.full_name,
        status: "in_progress",
      });
      setActionSuccess(`Worker ${worker.full_name} assigned successfully.`);
      loadDashboardData();
    } catch (err: any) {
      setActionError(err.message || "Failed to assign worker.");
    }
  };

  // Update customer request status
  const handleRequestStatus = async (id: string, nextStatus: string) => {
    try {
      setActionSuccess("");
      await ApiService.updateServiceRequest(id, { status: nextStatus });
      setActionSuccess("Service request status saved.");
      loadDashboardData();
    } catch (err: any) {
      setActionError(err.message || "Failed to save request status.");
    }
  };

  // CRUD Customer request delete
  const handleRequestDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this customer request?")) return;
    try {
      setActionSuccess("");
      await ApiService.deleteServiceRequest(id);
      setActionSuccess("Customer request removed.");
      loadDashboardData();
    } catch (err: any) {
      setActionError(err.message || "Forbidden: Only Admin roles can delete entries.");
    }
  };

  // Create Notice board bulletin
  const handlePublishNotice = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setActionSuccess("");
      await ApiService.createNotice(newNotice);
      setActionSuccess("Bulletin published cleanly onto Notice Board.");
      setShowNoticeCreator(false);
      setNewNotice({ title: "", content: "", priority: "normal", status: "published", is_pinned: false });
      loadDashboardData();
    } catch (err: any) {
      setActionError(err.message || "Failed to publish.");
    }
  };

  // CRUD notice delete
  const handleNoticeDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to archive and delete this notice bulletin?")) return;
    try {
      setActionSuccess("");
      await ApiService.deleteNotice(id);
      setActionSuccess("Notice archived and deleted.");
      loadDashboardData();
    } catch (err: any) {
      setActionError(err.message || "Forbidden: Only Admin roles can delete notices.");
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settingsForm) return;
    try {
      setActionSuccess("");
      await ApiService.updateSystemSettings(settingsForm);
      setActionSuccess("Global website configurations saved successfully.");
      onSettingsChanged(); // recall setup settings
      loadDashboardData();
    } catch (err: any) {
      setActionError(err.message || "Only Super Admin and Admin can update settings.");
    }
  };

  // Memoized lists filtered for search
  const filteredApplicantsList = useMemo(() => {
    return applicants.filter((app) => {
      const matchSearch = 
        app.full_name?.toLowerCase().includes(applicantSearch.toLowerCase()) ||
        app.phone?.toLowerCase().includes(applicantSearch.toLowerCase()) ||
        app.nid?.toLowerCase().includes(applicantSearch.toLowerCase()) ||
        app.location?.toLowerCase().includes(applicantSearch.toLowerCase());
      
      const matchCategory = 
        applicantCategoryFilter === "all" || app.category === applicantCategoryFilter;
      
      const matchStatus = 
        applicantStatusFilter === "all" || app.status === applicantStatusFilter;

      return matchSearch && matchCategory && matchStatus;
    });
  }, [applicants, applicantSearch, applicantCategoryFilter, applicantStatusFilter]);

  const filteredRequestsList = useMemo(() => {
    return requests.filter((req) => {
      const matchSearch =
        req.customer_name?.toLowerCase().includes(requestSearch.toLowerCase()) ||
        req.phone?.toLowerCase().includes(requestSearch.toLowerCase()) ||
        req.notes?.toLowerCase().includes(requestSearch.toLowerCase()) ||
        req.assigned_worker_name?.toLowerCase().includes(requestSearch.toLowerCase());

      const matchStatus =
        requestStatusFilter === "all" || req.status === requestStatusFilter;

      return matchSearch && matchStatus;
    });
  }, [requests, requestSearch, requestStatusFilter]);

  const filteredNoticesList = useMemo(() => {
    return notices.filter((n) => {
      return (
        n.title?.toLowerCase().includes(noticeSearch.toLowerCase()) ||
        n.content?.toLowerCase().includes(noticeSearch.toLowerCase())
      );
    });
  }, [notices, noticeSearch]);

  // Analytics Dynamic Series calculations
  const placementChartData = useMemo(() => {
    const helperCount = requests.filter(r => r.service_type?.toLowerCase().includes("helper") || r.service_type === "Domestic Helper").length;
    const guardCount = requests.filter(r => r.service_type?.toLowerCase().includes("guard") || r.service_type === "Security Guard").length;
    const pickupCount = requests.filter(r => r.service_type?.toLowerCase().includes("pickup") || r.service_type === "Pickup Service").length;

    return [
      { name: "Helpers Placed", count: helperCount, pv: 2400, fill: "#6366F1" },
      { name: "Security Guards", count: guardCount, pv: 1398, fill: "#06B6D4" },
      { name: "Transit Shuttles", count: pickupCount, pv: 9800, fill: "#10B981" }
    ];
  }, [requests]);

  const monthlyRecruitmentData = useMemo(() => {
    const approvedTotal = applicants.filter(a => a.status === "approved").length;
    const pendingTotal = applicants.filter(a => a.status === "pending").length;
    const rejectedTotal = applicants.filter(a => a.status === "rejected").length;

    return [
      { name: "Rejected / Suspended", qty: rejectedTotal, fill: "#EF4444" },
      { name: "In Review / Pending", qty: pendingTotal, fill: "#F59E0B" },
      { name: "Vetted & Available", qty: approvedTotal, fill: "#10B981" }
    ];
  }, [applicants]);

  /* ==========================================================================
     UNAUTHENTICATED SECURE SAAS LOGIN VIEW
     ========================================================================== */
  if (!adminUser) {
    return (
      <div id="admin_login_panel" className="min-h-screen bg-[#F8FAFC] text-slate-800 flex items-center justify-center py-20 px-4 relative">
        <div className="absolute top-10 left-10">
          <div className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-[#2563EB]" />
            <span className="font-poppins font-black text-slate-900 text-md tracking-wider uppercase">Nirapotta Seba</span>
          </div>
        </div>

        <div className="w-full max-w-lg bg-white border border-[#E2E8F0] rounded-2xl p-8 sm:p-12 space-y-8 shadow-2xl relative overflow-hidden">
          {/* Subtle decoration lines representing diagnostic tools */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-[#2563EB] to-indigo-500" />
          
          <div className="text-center space-y-2">
            <div className="mx-auto h-14 w-14 flex items-center justify-center rounded-2xl bg-slate-50 border border-[#E2E8F0] text-[#2563EB]">
              <Lock className="h-6 w-6" />
            </div>
            <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight leading-none pt-2 font-poppins">
              SaaS Administration Entry
            </h3>
            <p className="text-[#2563EB] text-xs uppercase tracking-widest font-bold font-mono">
              OFFICIAL WORKSPACE ENVIRONMENT
            </p>
          </div>

          <form onSubmit={handleLoginSubmit} className="space-y-6">
            
            {loginError && (
              <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl flex items-center gap-2">
                <ShieldAlert className="h-4.5 w-4.5 shrink-0 text-rose-500" />
                <span>{loginError}</span>
              </div>
            )}

            <div className="space-y-2">
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider font-mono">Email Credentials</label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="admin@manpower.com"
                  className="w-full text-xs p-3.5 bg-slate-50 border border-[#E2E8F0] text-slate-900 rounded-xl focus:outline-none focus:border-[#2563EB] transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider font-mono">Administration Key</label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={loginPass}
                  onChange={(e) => setLoginPass(e.target.value)}
                  placeholder="••••••••"
                  className="w-full text-xs p-3.5 bg-slate-50 border border-[#E2E8F0] text-slate-900 rounded-xl focus:outline-none focus:border-[#2563EB] transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loggingIn}
              className="w-full py-4 bg-[#2563EB] hover:bg-blue-700 text-white font-black text-xs rounded-xl shadow-lg cursor-pointer uppercase tracking-widest flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
            >
              <ShieldCheck className="h-4.5 w-4.5" />
              <span>{loggingIn ? "Connecting Endpoint..." : "Enter Workspace Portal"}</span>
            </button>

          </form>

          {/* Diagnostics support module */}
          <div className="bg-slate-50 p-5 rounded-xl border border-[#E2E8F0] space-y-3 font-mono">
            <span className="block font-bold text-[10px] text-slate-600 uppercase tracking-widest flex items-center gap-1.5">
              <KeySquare className="h-4 w-4 text-[#2563EB]" />
              <span>Available Diagnostic Credentials:</span>
            </span>
            <div className="text-[11px] text-slate-600 space-y-1.5 leading-snug">
              <div className="flex justify-between items-center text-slate-700">
                <span>Super Admin:</span>
                <span className="text-[#2563EB] font-bold">admin@manpower.com / admin123</span>
              </div>
              <div className="border-t border-slate-200 pt-1.5 flex justify-between items-center text-slate-500">
                <span>Editor Access:</span>
                <span className="font-semibold text-slate-700">editor@manpower.com / editor123</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    );
  }

  /* ==========================================================================
     AUTHENTICATED MASTER SAAS DASHBOARD VIEW
     ========================================================================== */
  return (
    <div id="admin_dashboard_viewport" className="min-h-screen bg-[#F8FAFC] text-slate-800 flex flex-col md:flex-row font-sans">
      
      {/* 1. FIXED DARK SIDEBAR (#0F172A) */}
      <aside 
        className={`${
          sidebarCollapsed ? "md:w-20" : "md:w-64"
        } w-full bg-[#0F172A] border-r border-slate-800 flex flex-col justify-between transition-all duration-300 relative z-30 shrink-0`}
      >
        <div className="flex flex-col">
          {/* Logo brand and toggle */}
          <div className="h-16 border-b border-slate-800 px-5 flex items-center justify-between">
            {!sidebarCollapsed && (
              <div className="flex items-center gap-2.5">
                <Shield className="h-5 w-5 text-[#2563EB]" />
                <span className="font-poppins font-extrabold text-white text-xs uppercase tracking-wider">
                  Nirapotta Admin
                </span>
              </div>
            )}
            {sidebarCollapsed && (
              <Shield className="h-6 w-6 text-[#2563EB] mx-auto" />
            )}
            <button 
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="hidden md:flex p-1.5 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white cursor-pointer"
            >
              <Menu className="h-4 w-4" />
            </button>
          </div>

          {/* User profile metadata */}
          <div className="p-4 border-b border-slate-805 flex items-center gap-3 bg-slate-900/50">
            <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-[#2563EB] text-white font-bold font-mono shrink-0">
              {adminUser.name[0]}
            </div>
            {!sidebarCollapsed && (
              <div className="truncate">
                <span className="block font-bold text-xs text-white line-clamp-1">{adminUser.name}</span>
                <span className="block text-[9px] text-blue-400 uppercase tracking-wider font-extrabold font-mono filter drop-shadow">
                  {adminUser.role.replace("_", " ")}
                </span>
              </div>
            )}
          </div>

          {/* Sidebar Menu options */}
          <nav className="p-3.5 space-y-1.5 flex-1">
            {[
              { id: "overview", label: "Dashboard Metrics", icon: LucideAreaChart },
              { id: "applicants", label: "Candidates Vetting", icon: UserCheck },
              { id: "requests", label: "Service Bookings", icon: ClipboardCheck },
              { id: "notices", label: "Announcements CRUD", icon: Bell },
              { id: "logs", label: "Security Logs", icon: FileText },
              { id: "settings", label: "Global Platform Config", icon: Settings },
            ].map((item) => {
              const isSel = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id as any);
                    setActionError("");
                    setActionSuccess("");
                  }}
                  className={`w-full px-4 py-3 rounded-xl text-xs font-bold transition-all duration-200 flex items-center gap-3 cursor-pointer ${
                    isSel
                      ? "bg-[#2563EB] text-white shadow-lg shadow-blue-500/10 font-black"
                      : "text-slate-400 hover:bg-slate-800 hover:text-white"
                  }`}
                  title={sidebarCollapsed ? item.label : ""}
                >
                  <item.icon className={`h-4.5 w-4.5 ${isSel ? "text-white" : "text-slate-400"}`} />
                  {!sidebarCollapsed && <span>{item.label}</span>}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer actions of Sidebar */}
        <div className="p-4 border-t border-slate-800">
          <button
            onClick={handleLogout}
            className="w-full py-3 rounded-xl border border-slate-800 hover:bg-rose-950/20 hover:border-rose-900 text-slate-400 hover:text-rose-300 transition-colors text-xs font-bold cursor-pointer flex items-center justify-center gap-2"
          >
            <LogOut className="h-4 w-4" />
            {!sidebarCollapsed && <span>Sign Out Session</span>}
          </button>
        </div>
      </aside>

      {/* 2. MAIN LAYOUT CONTAINER (Top Header + Service content Area) */}
      <div className="flex-1 flex flex-col overflow-hidden">
        
        {/* TOP HEADER */}
        <header className="h-16 bg-white border-b border-[#E2E8F0] px-6 sm:px-8 flex items-center justify-between sticky top-0 z-25">
          <div className="flex items-center gap-4">
            <span className="text-sm font-bold text-slate-600 capitalize hidden sm:inline-block font-mono">
              Systems / {activeTab}
            </span>
          </div>

          <div className="flex items-center gap-4">
            {/* Search Placeholder Bar */}
            <div className="relative hidden md:block w-64">
              <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search portal logs..."
                disabled
                className="w-full pl-9 pr-4 py-1.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg text-xs text-slate-600 focus:outline-none"
              />
            </div>

            {/* Notifications Toggle */}
            <div className="relative">
              <button 
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-105 rounded-lg cursor-pointer transition-colors relative"
              >
                <Bell className="h-4.5 w-4.5" />
                <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              </button>
              {notificationsOpen && (
                <div className="absolute right-0 mt-2.5 w-80 bg-white border border-[#E2E8F0] rounded-xl p-4 shadow-2xl z-40 text-xs text-slate-800">
                  <span className="font-extrabold text-slate-600 block pb-2 border-b border-[#E2E8F0] uppercase tracking-widest text-[9px] font-mono">Notifications Desk</span>
                  <div className="space-y-3 pt-2 text-slate-500">
                    <div className="flex items-start gap-2.5 leading-snug">
                      <span className="h-1.5 w-1.5 bg-emerald-500 rounded-full mt-1.5 shrink-0" />
                      <div>
                        <strong>Database Node Status:</strong> All 24 security log registries verified live.
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Profile Avatar Options Menu */}
            <div className="relative">
              <button 
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 bg-[#F8FAFC] border border-[#E2E8F0] p-1 pr-2.5 rounded-full cursor-pointer hover:border-slate-300 transition-all text-xs"
              >
                <div className="h-6 w-6 rounded-full bg-[#2563EB] text-white font-black text-[10px] flex items-center justify-center font-mono uppercase">
                  {adminUser.name[0]}
                </div>
                <span className="text-slate-705 font-bold hidden sm:inline-block leading-none">System Ops</span>
              </button>
              {profileOpen && (
                <div className="absolute right-0 mt-3 w-48 bg-white border border-[#E2E8F0] rounded-xl p-2.5 shadow-2xl z-40 text-xs text-slate-600 space-y-1">
                  <span className="block px-2.5 py-1 text-[9px] font-extrabold text-slate-400 uppercase tracking-widest font-mono">User Details</span>
                  <div className="px-2.5 py-1 text-slate-800 font-bold truncate">{adminUser.email}</div>
                  <div className="border-t border-slate-100 my-1.5" />
                  <button onClick={handleLogout} className="w-full text-left px-2.5 py-1.5 text-rose-600 hover:bg-rose-50 rounded-lg font-bold flex items-center gap-1.5 cursor-pointer">
                    <LogOut className="h-3.5 w-3.5" />
                    <span>Logout Session</span>
                  </button>
                </div>
              )}
            </div>

          </div>
        </header>

        {/* CONTENT STAGE WINDOW */}
        <main className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6">
          
          {/* Status alerts banner triggers */}
          {actionSuccess && (
            <div className="p-4 bg-emerald-50 border border-emerald-250 text-emerald-800 text-xs font-bold rounded-xl flex items-center gap-2.5 shadow">
              <Check className="h-4.5 w-4.5 text-emerald-650 shrink-0" />
              <span>{actionSuccess}</span>
            </div>
          )}
          {actionError && (
            <div className="p-4 bg-rose-50 border border-rose-250 text-rose-800 text-xs font-bold rounded-xl flex items-center gap-2.5 shadow">
              <ShieldAlert className="h-4.5 w-4.5 text-rose-655 shrink-0" />
              <span>{actionError}</span>
            </div>
          )}

          {/* TAB 1: OVERVIEW STATISTICS WITH RECHARTS GRAPHS */}
          {activeTab === "overview" && (
            <div className="space-y-10">
              
              {/* Header section with quick dashboard controls */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h2 className="text-2xl font-black text-slate-900 font-poppins">Enterprise Dashboard System</h2>
                  <p className="text-slate-505 text-xs">Real-time placement indices and security verification monitoring.</p>
                </div>
                <button 
                  onClick={loadDashboardData}
                  className="flex items-center gap-1.5 px-4.5 py-2.5 bg-white hover:bg-slate-50 text-slate-700 border border-[#E2E8F0] rounded-xl text-xs font-bold transition-all cursor-pointer shadow-sm"
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                  <span>Refresh Endpoint Data</span>
                </button>
              </div>

              {/* Redesigned Dashboard Cards Widget Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                
                <div className="bg-white border-l-4 border-indigo-500 border-y border-r border-[#E2E8F0] p-6 rounded-r-xl shadow-md space-y-3 relative hover:scale-[1.01] transition-transform">
                  <div className="flex items-center justify-between text-slate-500">
                    <span className="text-[10px] font-extrabold uppercase tracking-widest font-mono">Registered Candidates</span>
                    <Users2 className="h-4 w-4 text-indigo-500" />
                  </div>
                  <div className="text-3xl font-black text-slate-900 font-mono">{stats?.totalApplicants || applicants.length}</div>
                  <div className="flex justify-between items-center text-[10px] text-indigo-600 font-mono pt-1">
                    <span>Pending Action: {stats?.pendingApplicants || applicants.filter(a => a.status === "pending").length}</span>
                    <span className="flex items-center gap-0.5 text-emerald-600 font-bold">
                      <TrendingUp className="h-3 w-3" />
                      <span>+12%</span>
                    </span>
                  </div>
                </div>

                <div className="bg-white border-l-4 border-cyan-500 border-y border-r border-[#E2E8F0] p-6 rounded-r-xl shadow-md space-y-3 relative hover:scale-[1.01] transition-transform">
                  <div className="flex items-center justify-between text-slate-500">
                    <span className="text-[10px] font-extrabold uppercase tracking-widest font-mono">Active Service Requests</span>
                    <ClipboardCheck className="h-4 w-4 text-cyan-500" />
                  </div>
                  <div className="text-3xl font-black text-cyan-600 font-mono">{stats?.totalRequests || requests.length}</div>
                  <div className="flex justify-between items-center text-[10px] text-slate-500 font-mono pt-1">
                    <span>New Orders: {stats?.requestStatusNew || requests.filter(r => r.status === "new").length}</span>
                    <span className="flex items-center gap-0.5 text-emerald-600 font-bold">
                      <TrendingUp className="h-3 w-3" />
                      <span>+8%</span>
                    </span>
                  </div>
                </div>

                <div className="bg-white border-l-4 border-emerald-500 border-y border-r border-[#E2E8F0] p-6 rounded-r-xl shadow-md space-y-3 relative hover:scale-[1.01] transition-transform">
                  <div className="flex items-center justify-between text-slate-500">
                    <span className="text-[10px] font-extrabold uppercase tracking-widest font-mono">Verified Vetted Staff</span>
                    <UserCheck className="h-4 w-4 text-emerald-500" />
                  </div>
                  <div className="text-3xl font-black text-emerald-600 font-mono">{stats?.approvedApplicants || applicants.filter(a => a.status === "approved").length}</div>
                  <div className="flex justify-between items-center text-[10px] text-slate-505 font-mono pt-1">
                    <span>Active placement ratio: 94.2%</span>
                    <span className="text-emerald-600 font-bold font-sans">VETTED</span>
                  </div>
                </div>

                <div className="bg-white border-l-4 border-[#2563EB] border-y border-r border-[#E2E8F0] p-6 rounded-r-xl shadow-md space-y-3 relative hover:scale-[1.01] transition-transform">
                  <div className="flex items-center justify-between text-slate-500">
                    <span className="text-[10px] font-extrabold uppercase tracking-widest font-mono">Notices Bulletin Pinned</span>
                    <Bell className="h-4 w-4 text-[#2563EB]" />
                  </div>
                  <div className="text-3xl font-black text-[#2563EB] font-mono">{stats?.totalNotices || notices.length}</div>
                  <div className="flex justify-between items-center text-[10px] text-slate-505 font-mono pt-1">
                    <span>Board active: 100%</span>
                    <span className="text-slate-505 uppercase">OFFICIAL</span>
                  </div>
                </div>

              </div>

              {/* DYNAMIC ANALYTICS CHARTS SECTION (RECHARTS) */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                
                {/* 1. Placement count Bar chart */}
                <div className="bg-white border border-[#E2E8F0] p-6 rounded-xl space-y-4 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-extrabold text-sm text-slate-800 font-poppins uppercase tracking-wide">Placements Distribution</h3>
                      <p className="text-[11px] text-slate-500 leading-snug">Dynamic distribution scale calculated from real-time requests</p>
                    </div>
                    <Layers className="h-4.5 w-4.5 text-[#2563EB]" />
                  </div>
                  <div className="h-64 pt-2">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={placementChartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                        <XAxis dataKey="name" stroke="#64748B" fontSize={10} tickLine={false} />
                        <YAxis stroke="#64748B" fontSize={10} tickLine={false} />
                        <Tooltip 
                          contentStyle={{ bg: "#FFFFFF", border: "#E2E8F0" }}
                          itemStyle={{ color: "#0F172A" }} 
                        />
                        <Bar dataKey="count" fill="#2563EB" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* 2. Applicant vetting ratios area chart */}
                <div className="bg-white border border-[#E2E8F0] p-6 rounded-xl space-y-4 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-extrabold text-sm text-slate-800 font-poppins uppercase tracking-wide">Vetting Registry Metrics</h3>
                      <p className="text-[11px] text-slate-500 leading-snug">Roster parameters parsed by status checks</p>
                    </div>
                    <LucideAreaChart className="h-4.5 w-4.5 text-emerald-555" />
                  </div>
                  <div className="h-64 pt-2">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={monthlyRecruitmentData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                        <XAxis dataKey="name" stroke="#64748B" fontSize={10} tickLine={false} />
                        <YAxis stroke="#64748B" fontSize={10} tickLine={false} />
                        <Tooltip />
                        <Bar dataKey="qty" fill="#10B981" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

              </div>

              {/* Dynamic Categorization Specs list */}
              <div className="bg-white p-8 rounded-xl border border-[#E2E8F0] space-y-6 shadow-sm">
                <div>
                  <h4 className="font-poppins font-black text-base text-slate-830 uppercase tracking-wide">Category Distribution Breakdown</h4>
                  <p className="text-xs text-slate-500">Current live available approved listings in the system.</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  
                  <div className="p-5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                    <div className="space-y-1">
                      <span className="block text-[10px] uppercase font-mono font-bold text-slate-500 leading-none">Helpers Available</span>
                      <span className="block font-bold text-2xl text-slate-900 font-mono pt-1">{stats?.categoryDistribution?.helper || applicants.filter(a => a.category === "helper" && a.status === "approved").length}</span>
                    </div>
                    <div className="h-10 w-10 bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center rounded-lg">
                      <Users2 className="h-5 w-5" />
                    </div>
                  </div>

                  <div className="p-5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                    <div className="space-y-1">
                      <span className="block text-[10px] uppercase font-mono font-bold text-slate-500 leading-none">Security Guards</span>
                      <span className="block font-bold text-2xl text-slate-900 font-mono pt-1">{stats?.categoryDistribution?.security || applicants.filter(a => a.category === "security" && a.status === "approved").length}</span>
                    </div>
                    <div className="h-10 w-10 bg-[#EFF6FF] border border-[#DBEAFE] text-[#2563EB] flex items-center justify-center rounded-lg">
                      <Shield className="h-5 w-5" />
                    </div>
                  </div>

                  <div className="p-5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                    <div className="space-y-1">
                      <span className="block text-[10px] uppercase font-mono font-bold text-slate-500 leading-none">Transit Shuttle Drivers</span>
                      <span className="block font-bold text-2xl text-slate-900 font-mono pt-1">{stats?.categoryDistribution?.pickup || applicants.filter(a => a.category === "pickup" && a.status === "approved").length}</span>
                    </div>
                    <div className="h-10 w-10 bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center rounded-lg">
                      <Target className="h-5 w-5" />
                    </div>
                  </div>

                </div>
              </div>

            </div>
          )}

          {/* TAB 2: APPLICANTS MANAGEMENT GRID */}
          {activeTab === "applicants" && selectedCandidate ? (
            <div className="space-y-6 animate-fadeIn font-sans">
              
              {/* Back navigation banner */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 border border-[#E2E8F0] rounded-xl shadow-xs">
                <button
                  type="button"
                  onClick={() => setSelectedCandidate(null)}
                  className="flex items-center gap-2 text-xs font-bold text-[#2563EB] hover:text-[#1D4ED8] cursor-pointer cursor-pointer"
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span>Back to Candidates Registry List</span>
                </button>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] uppercase font-bold text-slate-500">Security Verification:</span>
                  <span className={`text-[10px] uppercase font-bold px-2.5 py-0.5 rounded border ${
                    selectedCandidate.status === "approved" ? "bg-emerald-50 text-emerald-800 border-emerald-200" :
                    selectedCandidate.status === "suspended" ? "bg-amber-50 text-amber-800 border-amber-200" :
                    selectedCandidate.status === "rejected" ? "bg-rose-50 text-rose-800 border-rose-200" :
                    "bg-blue-50 text-blue-800 border-blue-200"
                  }`}>
                    {selectedCandidate.status}
                  </span>
                </div>
              </div>

              {/* Title & Core Controls */}
              <div className="bg-slate-900 text-white p-6 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <img
                    src={selectedCandidate.photo || "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400"}
                    alt=""
                    className="h-16 w-16 rounded-full object-cover border-2 border-[#2563EB]"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <h2 className="text-xl font-black">{selectedCandidate.full_name}</h2>
                    <p className="text-slate-400 text-xs">ID: {selectedCandidate.id} • Registered {selectedCandidate.created_at ? new Date(selectedCandidate.created_at).toLocaleDateString() : 'N/A'}</p>
                    <span className="inline-block mt-1 bg-blue-900 border border-blue-805 text-blue-200 font-mono text-[9px] font-bold px-2 py-0.5 uppercase tracking-wider rounded">
                      {selectedCandidate.category === "helper" ? "Domestic Helper Division" :
                       selectedCandidate.category === "security" ? "Security Force Division" : "Commuter Coach Division"}
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {selectedCandidate.status !== "approved" && (
                    <button
                      type="button"
                      onClick={() => {
                        const updatedCandidate = { ...selectedCandidate, status: "approved" as const };
                        setSelectedCandidate(updatedCandidate);
                        handleApplicantStatus(selectedCandidate.id, "approved");
                      }}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg cursor-pointer transition-colors uppercase flex items-center gap-1.5"
                    >
                      <Check className="h-4 w-4" />
                      <span>Approve</span>
                    </button>
                  )}
                  {selectedCandidate.status === "approved" && (
                    <button
                      type="button"
                      onClick={() => {
                        const updatedCandidate = { ...selectedCandidate, status: "suspended" as const };
                        setSelectedCandidate(updatedCandidate);
                        handleApplicantStatus(selectedCandidate.id, "suspended");
                      }}
                      className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-lg cursor-pointer transition-colors uppercase flex items-center gap-1.5"
                    >
                      <X className="h-4 w-4" />
                      <span>Suspend</span>
                    </button>
                  )}
                  {selectedCandidate.status !== "rejected" && (
                    <button
                      type="button"
                      onClick={() => {
                        const updatedCandidate = { ...selectedCandidate, status: "rejected" as const };
                        setSelectedCandidate(updatedCandidate);
                        handleApplicantStatus(selectedCandidate.id, "rejected");
                      }}
                      className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-lg cursor-pointer transition-colors uppercase flex items-center gap-1.5"
                    >
                      <X className="h-4 w-4" />
                      <span>Reject</span>
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={async () => {
                      if (window.confirm("Are you positive you wish to remove this candidate registry permanently?")) {
                        await ApiService.deleteApplicant(selectedCandidate.id);
                        setSelectedCandidate(null);
                        loadDashboardData();
                      }
                    }}
                    className="px-4 py-2 bg-red-800 hover:bg-red-900 text-white text-xs font-bold rounded-lg cursor-pointer transition-colors uppercase flex items-center gap-1.5"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span>Delete Profile</span>
                  </button>
                </div>
              </div>

              {/* Grid Work Areas */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Column 1 & 2: Edit Form details */}
                <div className="lg:col-span-2 space-y-6">
                  
                  <div className="bg-white p-6 sm:p-8 border border-[#E2E8F0] rounded-2xl shadow-sm space-y-6">
                    <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-3">Edit Candidate General Profile Info</h3>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div className="space-y-1.5">
                        <label className="block text-[10px] uppercase font-bold text-slate-500 font-sans">Candidate Full Name *</label>
                        <input
                          type="text"
                          value={selectedCandidate.full_name || ""}
                          onChange={(e) => setSelectedCandidate({ ...selectedCandidate, full_name: e.target.value })}
                          className="w-full text-xs p-3 bg-[#F8FAFC] border border-[#E2E8F0] text-slate-900 rounded-xl focus:outline-none focus:border-[#2563EB]"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="block text-[10px] uppercase font-bold text-slate-500 font-sans">Contact Number Line *</label>
                        <input
                          type="text"
                          value={selectedCandidate.phone || ""}
                          onChange={(e) => setSelectedCandidate({ ...selectedCandidate, phone: e.target.value })}
                          className="w-full text-xs p-3 bg-[#F8FAFC] border border-[#E2E8F0] text-slate-900 rounded-xl focus:outline-none focus:border-[#2563EB]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div className="space-y-1.5">
                        <label className="block text-[10px] uppercase font-bold text-slate-505 text-slate-500 font-sans">Email Address</label>
                        <input
                          type="email"
                          value={selectedCandidate.email || ""}
                          onChange={(e) => setSelectedCandidate({ ...selectedCandidate, email: e.target.value })}
                          className="w-full text-xs p-3 bg-[#F8FAFC] border border-[#E2E8F0] text-slate-900 rounded-xl focus:outline-none focus:border-[#2563EB]"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="block text-[10px] uppercase font-bold text-[#2563EB] font-sans">National ID Card Number *</label>
                        <input
                          type="text"
                          value={selectedCandidate.nid || ""}
                          onChange={(e) => setSelectedCandidate({ ...selectedCandidate, nid: e.target.value })}
                          className="w-full text-xs p-3 bg-[#F8FAFC] border border-[#E2E8F0] text-slate-900 rounded-xl focus:outline-none focus:border-[#2563EB]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div className="space-y-1.5">
                        <label className="block text-[10px] uppercase font-bold text-slate-500 font-sans">Father's Name</label>
                        <input
                          type="text"
                          value={selectedCandidate.father_name || ""}
                          onChange={(e) => setSelectedCandidate({ ...selectedCandidate, father_name: e.target.value })}
                          className="w-full text-xs p-3 bg-[#F8FAFC] border border-[#E2E8F0] text-slate-900 rounded-xl focus:outline-none focus:border-[#2563EB]"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="block text-[10px] uppercase font-bold text-slate-500 font-sans">Mother's Name</label>
                        <input
                          type="text"
                          value={selectedCandidate.mother_name || ""}
                          onChange={(e) => setSelectedCandidate({ ...selectedCandidate, mother_name: e.target.value })}
                          className="w-full text-xs p-3 bg-[#F8FAFC] border border-[#E2E8F0] text-slate-900 rounded-xl focus:outline-none focus:border-[#2563EB]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div className="space-y-1.5">
                        <label className="block text-[10px] uppercase font-bold text-slate-500 font-sans">Date of Birth *</label>
                        <input
                          type="date"
                          value={selectedCandidate.dob || ""}
                          onChange={(e) => setSelectedCandidate({ ...selectedCandidate, dob: e.target.value })}
                          className="w-full text-xs p-3 bg-[#F8FAFC] border border-[#E2E8F0] text-slate-900 rounded-xl focus:outline-none focus:border-[#2563EB]"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="block text-[10px] uppercase font-bold text-slate-500 font-sans">Address/Location Region *</label>
                        <input
                          type="text"
                          value={selectedCandidate.location || ""}
                          onChange={(e) => setSelectedCandidate({ ...selectedCandidate, location: e.target.value })}
                          className="w-full text-xs p-3 bg-[#F8FAFC] border border-[#E2E8F0] text-slate-900 rounded-xl focus:outline-none focus:border-[#2563EB]"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-[10px] uppercase font-bold text-slate-550 text-slate-500 font-sans font-sans">Full Address Description</label>
                      <input
                        type="text"
                        value={selectedCandidate.address || ""}
                        onChange={(e) => setSelectedCandidate({ ...selectedCandidate, address: e.target.value })}
                        className="w-full text-xs p-3 bg-[#F8FAFC] border border-[#E2E8F0] text-slate-900 rounded-xl focus:outline-none focus:border-[#2563EB]"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
                      <div className="space-y-1.5">
                        <label className="block text-[10px] uppercase font-bold text-[#2563EB] font-sans">Experience Level Vetting *</label>
                        <select
                          value={selectedCandidate.experience || ""}
                          onChange={(e) => setSelectedCandidate({ ...selectedCandidate, experience: e.target.value })}
                          className="w-full text-xs p-3 bg-[#F8FAFC] border border-[#E2E8F0] text-slate-800 rounded-xl focus:outline-none font-bold"
                        >
                          <option value="No Experience">No Experience</option>
                          <option value="Less than 1 Year">Less than 1 Year</option>
                          <option value="1-3 Years">1-3 Years</option>
                          <option value="3-5 Years">3-5 Years</option>
                          <option value="5-10 Years">5-10 Years</option>
                          <option value="10+ Years">10+ Years</option>
                        </select>
                      </div>
                      {selectedCandidate.category === "pickup" && (
                        <div className="space-y-1.5">
                          <label className="block text-[10px] uppercase font-bold text-slate-500 font-sans">Driving License Number</label>
                          <input
                            type="text"
                            value={selectedCandidate.area || ""}
                            onChange={(e) => setSelectedCandidate({ ...selectedCandidate, area: e.target.value })}
                            className="w-full text-xs p-3 bg-[#F8FAFC] border border-[#E2E8F0] text-slate-900 rounded-xl focus:outline-none focus:border-[#2563EB]"
                          />
                        </div>
                      )}
                    </div>

                    <div className="pt-2 space-y-1.5">
                      <label className="block text-[10px] uppercase font-bold text-slate-550 text-slate-500 font-sans">Dossier Specialty Skills Checklist</label>
                      <div className="flex flex-wrap gap-2 p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl min-h-[3rem]">
                        {selectedCandidate.skills ? (
                          selectedCandidate.skills.split(", ").map(x => x.trim()).filter(Boolean).map(skill => (
                            <span key={skill} className="inline-flex items-center gap-1 bg-[#2563EB]/10 text-[#2563EB] text-[10px] font-bold px-2 py-1 rounded-md border border-[#2563EB]/25 font-sans">
                              {skill}
                              <button
                                type="button"
                                onClick={() => {
                                  const filtered = selectedCandidate.skills
                                    .split(", ")
                                    .map(x => x.trim())
                                    .filter(s => s !== skill)
                                    .join(", ");
                                  setSelectedCandidate({ ...selectedCandidate, skills: filtered });
                                }}
                                className="hover:text-red-500 font-bold font-mono text-[10px] ml-1 cursor-pointer"
                              >
                                ×
                              </button>
                            </span>
                          ))
                        ) : (
                          <span className="text-slate-400 text-xs italic">No dynamic skills assigned to this candidate.</span>
                        )}
                      </div>

                      <select
                        value=""
                        onChange={(e) => {
                          const val = e.target.value;
                          if (val) {
                            const arr = selectedCandidate.skills ? selectedCandidate.skills.split(", ").map(x => x.trim()).filter(Boolean) : [];
                            if (!arr.includes(val)) {
                              arr.push(val);
                              setSelectedCandidate({ ...selectedCandidate, skills: arr.join(", ") });
                            }
                          }
                        }}
                        className="w-full mt-2 text-xs p-3 bg-white border border-[#E2E8F0] rounded-xl text-slate-707"
                      >
                        <option value="">-- Add Specialty Vetted Skills (Optional) --</option>
                        {(selectedCandidate.category === "helper" 
                          ? ["Deep House Cleaning", "Bangladeshi Traditional Cooking", "Chinese & Fusion Cuisine", "Infant/Toddler Care", "Elderly Patient Care", "Laundry & Professional Ironing", "Post-surgery support", "Pet care & exercise", "Spoken English fluency"]
                          : selectedCandidate.category === "security"
                          ? ["Physical Combat & Defense", "CCTV Monitor Control", "Armed Firearm License", "Fire Marshall Certified", "First Aid & CPR trained", "Crowd & Event Patrol", "VIP Bodyguard protocol", "Night-shift patrol vigilance", "Night Vision gear"]
                          : ["Sedan Private Chauffeur", "Toyota HiAce Ambulance", "Large Bus Coaching", "Hilly Road Specialist", "Engine Diagnostics basics", "English Tour Guiding", "Night Transit Expert", "VIP Escort Certified", "GPS Route optimization"]
                        ).map(skill => (
                          <option key={skill} value={skill}>{skill}</option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-[10px] uppercase font-bold text-slate-500 font-sans">Brief Narrative Biography Background</label>
                      <textarea
                        rows={3}
                        value={selectedCandidate.description || ""}
                        onChange={(e) => setSelectedCandidate({ ...selectedCandidate, description: e.target.value })}
                        className="w-full text-xs p-3.5 bg-[#F8FAFC] border border-[#E2E8F0] text-slate-909 text-slate-900 rounded-xl focus:outline-none focus:border-[#2563EB] font-sans"
                      />
                    </div>

                    <div className="pt-4 flex justify-end">
                      <button
                        type="button"
                        onClick={async () => {
                          try {
                            setActionSuccess("");
                            setActionError("");
                            const res = await ApiService.updateApplicant(selectedCandidate.id, selectedCandidate);
                            setActionSuccess(`Candidate ${selectedCandidate.full_name} profile dossier updated successfully.`);
                            setSelectedCandidate(res.applicant);
                            loadDashboardData();
                          } catch (err: any) {
                            setActionError(err.message || "Failed to save candidate updates.");
                          }
                        }}
                        className="px-6 py-3.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold rounded-xl text-xs uppercase cursor-pointer shadow-sm transition-all flex items-center gap-2 font-sans"
                      >
                        <ShieldCheck className="h-4.5 w-4.5 text-[#EAB308]" />
                        <span>Update General Dossier Info</span>
                      </button>
                    </div>

                  </div>

                </div>

                {/* Column 3: Photo & Document updates */}
                <div className="space-y-6">
                  
                  {/* Photo update Card */}
                  <div className="bg-white p-6 border border-[#E2E8F0] rounded-2xl shadow-sm text-center space-y-4">
                    <span className="block text-[11px] font-extrabold text-slate-500 uppercase tracking-widest leading-none border-b border-[#E2E8F0] pb-2 text-left font-mono">Dossier Photograph</span>
                    
                    <div className="flex flex-col items-center justify-center space-y-3">
                      <img
                        src={selectedCandidate.photo || "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400"}
                        alt=""
                        className="h-32 w-32 rounded-full object-cover border-4 border-slate-100 shadow-md"
                        referrerPolicy="no-referrer"
                      />
                      
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onload = () => {
                              if (typeof reader.result === "string") {
                                setSelectedCandidate({ ...selectedCandidate, photo: reader.result });
                              }
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                        className="hidden"
                        id="candidate_photo_picker"
                      />
                      <label
                        htmlFor="candidate_photo_picker"
                        className="px-4 py-2 bg-[#F8FAFC] hover:bg-slate-100 border border-[#E2E8F0] text-slate-700 font-bold text-[10px] uppercase tracking-wider rounded-lg cursor-pointer transition-colors font-sans"
                      >
                        Upload Custom Portrait Photo
                      </label>
                    </div>
                  </div>

                  {/* Document uploads card */}
                  <div className="bg-white p-6 border border-[#E2E8F0] rounded-2xl shadow-sm space-y-6">
                    <span className="block text-[11px] font-extrabold text-slate-505 text-slate-500 uppercase tracking-widest leading-none border-b border-[#E2E8F0] pb-2 font-mono">Scanned NID Verification Docs</span>
                    
                    {/* FRONT NID UPLOAD */}
                    <div className="space-y-3">
                      <label className="block text-[10px] uppercase font-bold text-[#2563EB] tracking-wider font-sans">Front Side National ID Scan *</label>
                      {selectedCandidate.front_nid ? (
                        <div className="border border-[#E2E8F0] p-2 bg-[#F8FAFC]">
                          {selectedCandidate.front_nid.startsWith("data:application/pdf") || selectedCandidate.front_nid.includes("pdf") ? (
                            <div className="p-3 bg-red-50 text-red-808 text-[10px] font-bold font-mono border border-red-200 text-center">
                              PDF DOCUMENT TYPE LOADED
                            </div>
                          ) : (
                            <img src={selectedCandidate.front_nid} alt="" className="max-h-24 mx-auto object-contain border border-slate-205" />
                          )}
                        </div>
                      ) : (
                        <div className="p-4 bg-slate-50 text-slate-405 text-slate-400 text-xs text-center border border-dashed border-slate-200 font-medium font-mono">
                          NO FRONT NID DETECTED
                        </div>
                      )}

                      <input
                        type="file"
                        accept="image/*,application/pdf"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onload = () => {
                              if (typeof reader.result === "string") {
                                setSelectedCandidate({ ...selectedCandidate, front_nid: reader.result });
                              }
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                        className="hidden"
                        id="candidate_front_nid_picker"
                      />
                      <div className="flex justify-center">
                        <label
                          htmlFor="candidate_front_nid_picker"
                          className="px-4.5 py-2 hover:bg-[#2563EB] hover:text-white border border-[#E2E8F0] bg-[#F8FAFC] text-[#2563EB] font-bold text-[9px] uppercase tracking-wider rounded-lg cursor-pointer transition-all inline-block font-sans"
                        >
                          Change Front NID
                        </label>
                      </div>
                    </div>

                    <hr className="border-slate-100" />

                    {/* BACK NID UPLOAD */}
                    <div className="space-y-3">
                      <label className="block text-[10px] uppercase font-bold text-[#2563EB] tracking-wider font-sans">Back Side National ID Scan *</label>
                      {selectedCandidate.back_nid ? (
                        <div className="border border-[#E2E8F0] p-2 bg-[#F8FAFC]">
                          {selectedCandidate.back_nid.startsWith("data:application/pdf") || selectedCandidate.back_nid.includes("pdf") ? (
                            <div className="p-3 bg-red-50 text-red-808 text-[10px] font-bold font-mono border border-red-205 text-center">
                              PDF DOCUMENT TYPE LOADED
                            </div>
                          ) : (
                            <img src={selectedCandidate.back_nid} alt="" className="max-h-24 mx-auto object-contain border border-slate-205" />
                          )}
                        </div>
                      ) : (
                        <div className="p-4 bg-slate-50 text-slate-405 text-slate-400 text-xs text-center border border-dashed border-slate-200 font-medium font-mono">
                          NO BACK NID DETECTED
                        </div>
                      )}

                      <input
                        type="file"
                        accept="image/*,application/pdf"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onload = () => {
                              if (typeof reader.result === "string") {
                                setSelectedCandidate({ ...selectedCandidate, back_nid: reader.result });
                              }
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                        className="hidden"
                        id="candidate_back_nid_picker"
                      />
                      <div className="flex justify-center">
                        <label
                          htmlFor="candidate_back_nid_picker"
                          className="px-4.5 py-2 hover:bg-[#2563EB] hover:text-white border border-[#E2E8F0] bg-[#F8FAFC] text-[#2563EB] font-bold text-[9px] uppercase tracking-wider rounded-lg cursor-pointer transition-all inline-block font-sans"
                        >
                          Change Back NID
                        </label>
                      </div>
                    </div>

                  </div>

                </div>

              </div>

            </div>
          ) : activeTab === "applicants" && (
            <div className="space-y-6 font-sans">
              
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h2 className="text-2xl font-black text-slate-900 font-poppins">Registered Candidates</h2>
                  <p className="text-slate-500 text-xs text-slate-505">Authorize, reject, and inspect background checks here.</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      exportToCSV(applicants, "registered_candidates.csv", candidateHeaders);
                    }}
                    className="flex items-center gap-1.5 px-4 py-3 bg-white border border-[#E2E8F0] hover:bg-slate-50 text-[#0F172A] font-bold rounded-xl text-xs transition-all cursor-pointer shadow-xs font-sans"
                  >
                    <Download className="h-4 w-4 text-slate-500" />
                    <span>Export Candidates CSV</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setEnrollModalOpen(true)}
                    className="flex items-center gap-1.5 px-5 py-3 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold rounded-xl text-xs transition-all cursor-pointer shadow-md shadow-blue-500/10 hover:scale-[1.01] font-sans"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Enroll New Candidate</span>
                  </button>
                </div>
              </div>

              {/* Search Filters Row */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 bg-white p-5 rounded-xl border border-[#E2E8F0] shadow-sm font-sans">
                <div className="relative sm:col-span-2">
                  <Search className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-slate-400" />
                  <input 
                    type="text" 
                    placeholder="Search candidate names, NIDs, mobile lines..."
                    value={applicantSearch}
                    onChange={(e) => { setApplicantSearch(e.target.value); setAppTablePage(1); }}
                    className="w-full pl-10 pr-4 py-3 bg-[#F8FAFC] text-xs border border-[#E2E8F0] text-slate-900 rounded-xl focus:outline-none focus:border-[#2563EB]"
                  />
                </div>
                
                <div>
                  <select
                    value={applicantCategoryFilter}
                    onChange={(e) => { setApplicantCategoryFilter(e.target.value); setAppTablePage(1); }}
                    className="w-full py-3 px-4 bg-[#F8FAFC] text-xs border border-[#E2E8F0] text-slate-700 rounded-xl focus:outline-none font-bold"
                  >
                    <option value="all">All Category Divisions</option>
                    <option value="helper">Domestic Helper</option>
                    <option value="security">Security Guard</option>
                    <option value="pickup">Pickup Transit</option>
                  </select>
                </div>

                <div>
                  <select
                    value={applicantStatusFilter}
                    onChange={(e) => { setApplicantStatusFilter(e.target.value); setAppTablePage(1); }}
                    className="w-full py-3 px-4 bg-[#F8FAFC] text-xs border border-[#E2E8F0] text-slate-700 rounded-xl focus:outline-none font-bold"
                  >
                    <option value="all">All Status Reviews</option>
                    <option value="approved">Approved / Live</option>
                    <option value="pending">Pending Review</option>
                    <option value="rejected">Rejected / Hold</option>
                    <option value="suspended">Suspended</option>
                  </select>
                </div>
              </div>

              {/* Upgraded Table wrapper */}
              <div className="bg-white border border-[#E2E8F0] rounded-xl overflow-hidden shadow">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0] font-bold uppercase tracking-wider text-slate-500 font-mono text-[10px]">
                      <tr>
                        <th className="p-4.5">Candidate Details</th>
                        <th className="p-4.5">Address / Region</th>
                        <th className="p-4.5">National ID</th>
                        <th className="p-4.5 text-center font-sans">Form Review Status</th>
                        <th className="p-4.5 text-right font-sans">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E2E8F0] text-slate-700 font-medium font-sans">
                      {filteredApplicantsList.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="py-12 text-center text-slate-400 font-medium pb-12">
                            No matching candidate profiles logged in database grids.
                          </td>
                        </tr>
                      ) : (
                        filteredApplicantsList
                          .slice((appTablePage - 1) * pageSize, appTablePage * pageSize)
                          .map((app) => (
                            <tr key={app.id} className="hover:bg-slate-50 group">
                              <td className="p-4.5 flex items-center gap-3.5">
                                <img
                                  src={app.photo || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100"}
                                  alt=""
                                  className="h-10 w-10 rounded-lg object-cover shrink-0 border border-slate-200"
                                  referrerPolicy="no-referrer"
                                />
                                <div className="space-y-1">
                                  <span className="block font-black text-slate-900 text-sm leading-none">{app.full_name}</span>
                                  <span className="inline-block text-[9px] font-extrabold px-2 py-0.5 bg-slate-100 border border-slate-200 text-slate-800 rounded uppercase font-mono tracking-wider">
                                    {app.category === "helper" ? `Helper: ${app.helper_type}` : app.category === "security" ? `Guard: ${app.security_type}` : `Pickup: ${app.vehicle_type}`}
                                  </span>
                                </div>
                              </td>
                              <td className="p-4.5">
                                <span className="block leading-tight text-slate-800 font-semibold">{app.phone}</span>
                                <span className="block text-[11px] text-slate-500 mt-1">{app.location || "Dhaka Region"}</span>
                              </td>
                              <td className="p-4.5 font-mono text-slate-600 font-bold">{app.nid || "Verify Pending"}</td>
                              <td className="p-4.5 text-center">
                                <span className={`inline-flex items-center gap-1.5 text-[9px] font-bold px-3 py-1 rounded-full uppercase border ${
                                  app.status === "approved"
                                    ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                                    : app.status === "rejected"
                                    ? "bg-rose-50 text-rose-800 border-rose-200"
                                    : "bg-amber-50 text-amber-800 border-amber-200"
                                }`}>
                                  <span className={`h-1.5 w-1.5 rounded-full ${
                                    app.status === "approved" ? "bg-emerald-500 animate-pulse" : app.status === "rejected" ? "bg-rose-500" : "bg-amber-500"
                                  }`} />
                                  <span>{app.status}</span>
                                </span>
                              </td>
                              <td className="p-4.5 text-right">
                                <div className="flex items-center justify-end gap-2.5">
                                  {/* Open Profile trigger */}
                                  <button
                                    onClick={() => setSelectedCandidate(app)}
                                    className="px-3 py-1.5 border border-blue-200 hover:bg-blue-600 bg-blue-50 hover:text-white text-blue-705 text-blue-700 rounded-lg font-bold text-[10px] uppercase cursor-pointer transition-colors flex items-center gap-1"
                                  >
                                    <Eye className="h-3.5 w-3.5" />
                                    <span>Open Profile</span>
                                  </button>

                                  {/* Approve trigger */}
                                  {app.status !== "approved" && (
                                    <button
                                      onClick={() => handleApplicantStatus(app.id, "approved")}
                                      className="px-3 py-1.5 border border-emerald-200 hover:bg-emerald-600 bg-emerald-50 hover:text-white text-emerald-700 rounded-lg font-bold text-[10px] uppercase cursor-pointer transition-colors"
                                    >
                                      Approve
                                    </button>
                                  )}
                                  
                                  {/* Reject trigger */}
                                  {app.status === "pending" && (
                                    <button
                                      onClick={() => handleApplicantStatus(app.id, "rejected")}
                                      className="px-3 py-1.5 border border-rose-200 hover:bg-rose-600 bg-rose-50 hover:text-white text-rose-700 rounded-lg font-bold text-[10px] uppercase cursor-pointer transition-colors"
                                    >
                                      Reject
                                    </button>
                                  )}

                                  {/* Delete handler */}
                                  <button
                                    onClick={() => handleApplicantDelete(app.id)}
                                    className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg cursor-pointer grayscale hover:grayscale-0 transition-all border border-transparent hover:border-rose-200"
                                    title="Revoke and delete registry"
                                  >
                                    <Trash2 className="h-4.5 w-4.5" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Table Pagination footer block */}
                {filteredApplicantsList.length > pageSize && (
                  <div className="bg-[#F8FAFC] border-t border-[#E2E8F0] p-4 flex items-center justify-between text-xs text-slate-500">
                    <span>
                      Showing {(appTablePage - 1) * pageSize + 1} - {Math.min(appTablePage * pageSize, filteredApplicantsList.length)} of {filteredApplicantsList.length} candidates
                    </span>
                    <div className="flex items-center gap-2">
                      <button 
                        disabled={appTablePage === 1}
                        onClick={() => setAppTablePage(appTablePage - 1)}
                        className="p-1 px-2.5 bg-white border border-[#E2E8F0] hover:bg-slate-50 text-slate-700 disabled:opacity-40 disabled:pointer-events-none rounded-lg cursor-pointer shadow-sm"
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </button>
                      <span className="font-bold text-slate-800 font-mono px-2">{appTablePage}</span>
                      <button 
                        disabled={appTablePage * pageSize >= filteredApplicantsList.length}
                        onClick={() => setAppTablePage(appTablePage + 1)}
                        className="p-1 px-2.5 bg-white border border-[#E2E8F0] hover:bg-slate-50 text-slate-700 disabled:opacity-40 disabled:pointer-events-none rounded-lg cursor-pointer shadow-sm"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                )}

              </div>
            </div>
          )}

          {/* Direct Custom Candidate Registration Modal */}
          {enrollModalOpen && (
            <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 z-50 overflow-y-auto animate-fadeIn">
              <div className="bg-white border border-[#E2E8F0] rounded-2xl w-full max-w-4xl shadow-2xl relative flex flex-col my-8">
                {/* Modal Header */}
                <div className="p-6 border-b border-[#E2E8F0] flex items-center justify-between bg-slate-50">
                  <div>
                    <h3 className="text-lg font-black text-slate-900">Manual Candidate Registration System</h3>
                    <p className="text-xs text-slate-500">Directly bypass public enrollment forms by enrolling background-checked candidates here.</p>
                  </div>
                  <button
                    onClick={() => setEnrollModalOpen(false)}
                    className="p-1.5 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                {/* Modal Body */}
                <form onSubmit={handleEnrollSubmit} className="p-6 sm:p-8 space-y-6 overflow-y-auto max-h-[70vh]">
                  
                  {/* Step 1: Core Profile */}
                  <div className="space-y-4">
                    <span className="block font-bold text-xs text-[#2563EB] uppercase tracking-widest border-b border-[#E2E8F0] pb-1.5 font-mono">1. Primary Biographical Identity</span>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                      <div className="space-y-1.5">
                        <label className="block text-[10px] font-bold text-slate-500 uppercase">Full Name *</label>
                        <input
                          type="text"
                          required
                          value={enrollForm.full_name}
                          onChange={(e) => setEnrollForm({ ...enrollForm, full_name: e.target.value })}
                          className="w-full text-xs p-3.5 bg-[#F8FAFC] border border-[#E2E8F0] text-slate-905 rounded-xl focus:outline-none focus:border-[#2563EB]"
                          placeholder="e.g. Shakib Al Hasan"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="block text-[10px] font-bold text-slate-500 uppercase">Father's Name</label>
                        <input
                          type="text"
                          value={enrollForm.father_name}
                          onChange={(e) => setEnrollForm({ ...enrollForm, father_name: e.target.value })}
                          className="w-full text-xs p-3.5 bg-[#F8FAFC] border border-[#E2E8F0] text-slate-905 rounded-xl focus:outline-none focus:border-[#2563EB]"
                          placeholder="Father's name"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="block text-[10px] font-bold text-slate-505 uppercase">Mother's Name</label>
                        <input
                          type="text"
                          value={enrollForm.mother_name}
                          onChange={(e) => setEnrollForm({ ...enrollForm, mother_name: e.target.value })}
                          className="w-full text-xs p-3.5 bg-[#F8FAFC] border border-[#E2E8F0] text-slate-905 rounded-xl focus:outline-none focus:border-[#2563EB]"
                          placeholder="Mother's name"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                      <div className="space-y-1.5">
                        <label className="block text-[10px] font-bold text-slate-505 uppercase">Date of Birth</label>
                        <input
                          type="date"
                          value={enrollForm.dob}
                          onChange={(e) => setEnrollForm({ ...enrollForm, dob: e.target.value })}
                          className="w-full text-xs p-3.5 bg-[#F8FAFC] border border-[#E2E8F0] text-slate-905 rounded-xl focus:outline-none focus:border-[#2563EB]"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="block text-[10px] font-bold text-slate-505 uppercase">National ID (NID/Birth Cert) *</label>
                        <input
                          type="text"
                          required
                          value={enrollForm.nid}
                          onChange={(e) => setEnrollForm({ ...enrollForm, nid: e.target.value })}
                          className="w-full text-xs p-3.5 bg-[#F8FAFC] border border-[#E2E8F0] text-slate-905 rounded-xl focus:outline-none focus:border-[#2563EB]"
                          placeholder="10 or 17 digit numeric registration"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="block text-[10px] font-bold text-slate-505 uppercase">Category Allocation *</label>
                        <select
                          value={enrollForm.category}
                          onChange={(e) => setEnrollForm({ ...enrollForm, category: e.target.value as any })}
                          className="w-full text-xs p-3.5 bg-[#F8FAFC] border border-[#E2E8F0] text-slate-705 rounded-xl focus:outline-none focus:border-[#2563EB] font-bold"
                        >
                          <option value="helper">Domestic Helper</option>
                          <option value="security">Security Guard Division</option>
                          <option value="pickup">Pickup Logistics Division</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                      <div className="space-y-1.5">
                        <label className="block text-[10px] font-bold text-slate-505 uppercase">Primary Mobile Line *</label>
                        <input
                          type="text"
                          required
                          value={enrollForm.phone}
                          onChange={(e) => setEnrollForm({ ...enrollForm, phone: e.target.value })}
                          className="w-full text-xs p-3.5 bg-[#F8FAFC] border border-[#E2E8F0] text-slate-905 rounded-xl focus:outline-none focus:border-[#2563EB]"
                          placeholder="e.g. 017XXXXXXXX"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="block text-[10px] font-bold text-slate-501 uppercase">Email Address</label>
                        <input
                          type="email"
                          value={enrollForm.email}
                          onChange={(e) => setEnrollForm({ ...enrollForm, email: e.target.value })}
                          className="w-full text-xs p-3.5 bg-[#F8FAFC] border border-[#E2E8F0] text-slate-905 rounded-xl focus:outline-none focus:border-[#2563EB]"
                          placeholder="e.g. sh@gmail.com"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="block text-[10px] font-bold text-slate-501 uppercase">Permanent/Mailing Address</label>
                        <input
                          type="text"
                          value={enrollForm.address}
                          onChange={(e) => setEnrollForm({ ...enrollForm, address: e.target.value })}
                          className="w-full text-xs p-3.5 bg-[#F8FAFC] border border-[#E2E8F0] text-slate-905 rounded-xl focus:outline-none focus:border-[#2563EB]"
                          placeholder="e.g. Mirpur, Dhaka"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Step 2: Experience / Documents */}
                  <div className="space-y-4">
                    <span className="block font-bold text-xs text-[#2563EB] uppercase tracking-widest border-b border-[#E2E8F0] pb-1.5 font-mono">2. Qualifications & Verification</span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div className="space-y-1.5">
                        <label className="block text-[10px] font-bold text-slate-501 uppercase">Years of Verified Experience</label>
                        <input
                          type="text"
                          value={enrollForm.experience}
                          onChange={(e) => setEnrollForm({ ...enrollForm, experience: e.target.value })}
                          className="w-full text-xs p-3.5 bg-[#F8FAFC] border border-[#E2E8F0] text-slate-905 rounded-xl focus:outline-none focus:border-[#2563EB]"
                          placeholder="e.g. 3 Years, Fresher"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="block text-[10px] font-bold text-slate-501 uppercase">Specific Domain Skills (Comma separated)</label>
                        <input
                          type="text"
                          value={enrollForm.skills}
                          onChange={(e) => setEnrollForm({ ...enrollForm, skills: e.target.value })}
                          className="w-full text-xs p-3.5 bg-[#F8FAFC] border border-[#E2E8F0] text-slate-905 rounded-xl focus:outline-none focus:border-[#2563EB]"
                          placeholder="e.g. Cooking, Security protocol, Driving"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div className="space-y-1.5">
                        <label className="block text-[10px] font-bold text-slate-501 uppercase">Face Photo URL</label>
                        <input
                          type="text"
                          value={enrollForm.photo}
                          onChange={(e) => setEnrollForm({ ...enrollForm, photo: e.target.value })}
                          className="w-full text-xs p-3.5 bg-[#F8FAFC] border border-[#E2E8F0] text-slate-905 rounded-xl focus:outline-none focus:border-[#2563EB]"
                          placeholder="Can use standard presets"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="block text-[10px] font-bold text-slate-510 uppercase">Credentials / Audited Files Metadata</label>
                        <input
                          type="text"
                          value={enrollForm.documents}
                          onChange={(e) => setEnrollForm({ ...enrollForm, documents: e.target.value })}
                          className="w-full text-xs p-3.5 bg-[#F8FAFC] border border-[#E2E8F0] text-slate-905 rounded-xl focus:outline-none focus:border-[#2563EB]"
                          placeholder="NID background checking, references verified"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Step 3: Category Specific elements */}
                  <div className="space-y-4">
                    <span className="block font-bold text-xs text-[#2563EB] uppercase tracking-widest border-b border-[#E2E8F0] pb-1.5 font-mono">3. Category Specific Professional Indices</span>
                    
                    {enrollForm.category === "helper" && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 animate-slideUp">
                        <div className="space-y-1.5">
                          <label className="block text-[10px] font-bold text-slate-501 uppercase">Helper Service Specialization</label>
                          <select
                            value={enrollForm.helper_type}
                            onChange={(e) => setEnrollForm({ ...enrollForm, helper_type: e.target.value as any })}
                            className="w-full text-xs p-3.5 bg-[#F8FAFC] border border-[#E2E8F0] text-slate-805 rounded-xl focus:outline-none focus:border-[#2563EB]"
                          >
                            <option value="maid_cleaner">Maid & Modern Cleaner</option>
                            <option value="baby_sitter">Professional Babysitter / Nanny</option>
                            <option value="elderly_care">Elderly Companion & Caregiver</option>
                            <option value="patient_care">Qualified Medical Patient Care</option>
                            <option value="house_cook">Experienced Culinary Cook</option>
                          </select>
                        </div>
                        <div className="space-y-1.5">
                          <label className="block text-[10px] font-bold text-slate-501 uppercase">Target Location / Sub-District</label>
                          <input
                            type="text"
                            value={enrollForm.location}
                            onChange={(e) => setEnrollForm({ ...enrollForm, location: e.target.value })}
                            className="w-full text-xs p-3.5 bg-[#F8FAFC] border border-[#E2E8F0] text-slate-905 rounded-xl focus:outline-none focus:border-[#2563EB]"
                            placeholder="e.g. Gulshan, Dhaka"
                          />
                        </div>
                      </div>
                    )}

                    {enrollForm.category === "security" && (
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 animate-slideUp">
                        <div className="space-y-1.5">
                          <label className="block text-[10px] font-bold text-slate-510 uppercase">Guard Deployment Cadre</label>
                          <select
                            value={enrollForm.security_type}
                            onChange={(e) => setEnrollForm({ ...enrollForm, security_type: e.target.value as any })}
                            className="w-full text-xs p-3.5 bg-[#F8FAFC] border border-[#E2E8F0] text-slate-805 rounded-xl focus:outline-none focus:border-[#2563EB]"
                          >
                            <option value="residential_guard">Residential Security Specialist</option>
                            <option value="commercial_guard">Commercial Complex Asset Defense</option>
                            <option value="event_bouncer">Elite Tactical Event Bouncer</option>
                            <option value="embedded_bodyguard">VVIP Embedded Bodyguard</option>
                          </select>
                        </div>
                        <div className="space-y-1.5">
                          <label className="block text-[10px] font-bold text-slate-510 uppercase">Preferred Schedule Interval</label>
                          <select
                            value={enrollForm.schedule}
                            onChange={(e) => setEnrollForm({ ...enrollForm, schedule: e.target.value as any })}
                            className="w-full text-xs p-3.5 bg-[#F8FAFC] border border-[#E2E8F0] text-slate-805 rounded-xl focus:outline-none focus:border-[#2563EB]"
                          >
                            <option value="day_shift">Day Duty Shift (08:00 AM - 08:00 PM)</option>
                            <option value="night_shift">Night Duty Shift (08:00 PM - 08:00 AM)</option>
                            <option value="full_time">Flexible Full Time Residency</option>
                          </select>
                        </div>
                        <div className="space-y-1.5">
                          <label className="block text-[10px] font-bold text-slate-510 uppercase">Service Deployment Station</label>
                          <input
                            type="text"
                            value={enrollForm.location}
                            onChange={(e) => setEnrollForm({ ...enrollForm, location: e.target.value })}
                            className="w-full text-xs p-3.5 bg-[#F8FAFC] border border-[#E2E8F0] text-slate-905 rounded-xl focus:outline-none focus:border-[#2563EB]"
                            placeholder="e.g. Banani, Dhaka"
                          />
                        </div>
                      </div>
                    )}

                    {enrollForm.category === "pickup" && (
                      <div className="space-y-4 animate-slideUp">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                          <div className="space-y-1.5">
                            <label className="block text-[10px] font-bold text-slate-510 uppercase">Transit Vehicle Class</label>
                            <select
                              value={enrollForm.vehicle_type}
                              onChange={(e) => setEnrollForm({ ...enrollForm, vehicle_type: e.target.value as any })}
                              className="w-full text-xs p-3.5 bg-[#F8FAFC] border border-[#E2E8F0] text-slate-805 rounded-xl focus:outline-none focus:border-[#2563EB]"
                            >
                              <option value="pickup_small">Small Utility Pickup (1.5 Ton)</option>
                              <option value="truck_medium">Medium Logistics Truck (3-5 Ton)</option>
                              <option value="truck_heavy">Heavy Freight Rig (10+ Ton)</option>
                              <option value="freezer_van">Temperature Managed Freezer Van</option>
                            </select>
                          </div>
                          <div className="space-y-1.5">
                            <label className="block text-[10px] font-bold text-slate-510 uppercase">Cargo Volume Capacity (Tons)</label>
                            <input
                              type="number"
                              value={enrollForm.capacity}
                              onChange={(e) => setEnrollForm({ ...enrollForm, capacity: e.target.value })}
                              className="w-full text-xs p-3.5 bg-[#F8FAFC] border border-[#E2E8F0] text-slate-905 rounded-xl focus:outline-none focus:border-[#2563EB]"
                              placeholder="e.g. 2, 5"
                            />
                          </div>
                          <div className="space-y-1.5">
                            <label className="block text-[10px] font-bold text-slate-510 uppercase">Fixed Operational Route</label>
                            <input
                              type="text"
                              value={enrollForm.route}
                              onChange={(e) => setEnrollForm({ ...enrollForm, route: e.target.value })}
                              className="w-full text-xs p-3.5 bg-[#F8FAFC] border border-[#E2E8F0] text-slate-905 rounded-xl focus:outline-none focus:border-[#2563EB]"
                              placeholder="e.g. Dhaka - Chittagong Highway"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Description */}
                  <div className="space-y-2">
                    <label className="block text-[10px] font-bold text-slate-510 uppercase">Professional Bio / Security Records Description</label>
                    <textarea
                      rows={2}
                      value={enrollForm.description}
                      onChange={(e) => setEnrollForm({ ...enrollForm, description: e.target.value })}
                      className="w-full text-xs p-3 bg-[#F8FAFC] border border-[#E2E8F0] text-slate-905 rounded-xl focus:outline-none focus:border-[#2563EB]"
                      placeholder="Introduce the candidate, list any premium client placements, or log physical strength attributes..."
                    />
                  </div>

                  {/* Modal Submit Actions */}
                  <div className="pt-6 border-t border-[#E2E8F0] flex justify-end gap-3.5">
                    <button
                      type="button"
                      onClick={() => setEnrollModalOpen(false)}
                      className="px-5 py-3 hover:bg-slate-50 border border-slate-200 text-slate-700 rounded-xl text-xs font-bold font-sans cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-3 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-black rounded-xl text-xs uppercase cursor-pointer transition-colors"
                    >
                      Authorize enrollment record
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* TAB 3: CUSTOMER REQUESTS PLACEMENTS */}
          {activeTab === "requests" && (
            <div className="space-y-6">
              
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h2 className="text-2xl font-black text-[#0F172A] font-poppins">Customer Placements</h2>
                  <p className="text-slate-500 text-xs">Manage client deployment requests, assign approved staff, and schedule active shifts.</p>
                </div>
              </div>

              {/* Placements specific search filters row */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-white p-5 rounded-xl border border-[#E2E8F0] shadow-sm">
                <div className="relative sm:col-span-2">
                  <Search className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-slate-400" />
                  <input 
                    type="text" 
                    placeholder="Search client names, phone lines, notes, worker tags..."
                    value={requestSearch}
                    onChange={(e) => { setRequestSearch(e.target.value); setReqTablePage(1); }}
                    className="w-full pl-10 pr-4 py-3 bg-[#F8FAFC] text-xs border border-[#E2E8F0] text-slate-900 rounded-xl focus:outline-none focus:border-[#2563EB]"
                  />
                </div>

                <div>
                  <select
                    value={requestStatusFilter}
                    onChange={(e) => { setRequestStatusFilter(e.target.value); setReqTablePage(1); }}
                    className="w-full py-3 px-4 bg-[#F8FAFC] text-xs border border-[#E2E8F0] text-slate-705 rounded-xl focus:outline-none font-bold"
                  >
                    <option value="all">All Placement Stages</option>
                    <option value="new">New Requests</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed Successfully</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              {/* Placements List Upgrade */}
              <div className="bg-white border border-[#E2E8F0] rounded-xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse font-sans">
                    <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0] font-bold uppercase tracking-wider text-slate-500 font-mono text-[10px]">
                      <tr>
                        <th className="p-4.5">Client Identity</th>
                        <th className="p-4.5">Required Division</th>
                        <th className="p-4.5">Placement Status</th>
                        <th className="p-4.5">Assign Approved Employee</th>
                        <th className="p-4.5 text-center">Admin Controls</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E2E8F0] text-slate-700 font-medium">
                      {filteredRequestsList.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="py-12 text-center text-slate-500">
                            No service placements logged under selected criteria.
                          </td>
                        </tr>
                      ) : (
                        filteredRequestsList
                          .slice((reqTablePage - 1) * pageSize, reqTablePage * pageSize)
                          .map((req) => (
                            <tr key={req.id} className="hover:bg-slate-50/70 group transition-colors">
                              <td className="p-4.5">
                                <span className="block font-black text-slate-900 text-sm leading-none">{req.customer_name}</span>
                                <span className="block text-slate-500 text-[11px] mt-1.5 font-mono">{req.phone}</span>
                              </td>
                              <td className="p-4.5">
                                <span className="block font-bold text-slate-850 text-xs">{req.service_type}</span>
                                {req.notes && (
                                  <p className="max-w-[240px] truncate text-[11px] text-slate-500 mt-1" title={req.notes}>
                                    {req.notes}
                                  </p>
                                )}
                              </td>
                              <td className="p-4.5">
                                <span className={`inline-flex items-center gap-1.5 text-[9px] font-bold px-3 py-1 rounded-full uppercase border ${
                                  req.status === "completed"
                                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                    : req.status === "in_progress"
                                    ? "bg-amber-50 text-amber-700 border-amber-200"
                                    : req.status === "cancelled"
                                    ? "bg-rose-50 text-rose-700 border-rose-200"
                                    : "bg-indigo-50 text-indigo-700 border-indigo-200"
                                }`}>
                                  <span className={`h-1.5 w-1.5 rounded-full ${
                                    req.status === "completed" ? "bg-emerald-500" : req.status === "in_progress" ? "bg-amber-500 animate-pulse" : req.status === "cancelled" ? "bg-rose-500" : "bg-indigo-500"
                                  }`} />
                                  <span>{req.status}</span>
                                </span>
                              </td>
                              <td className="p-4.5">
                                {req.assigned_worker_id ? (
                                  <span className="text-emerald-600 font-extrabold text-xs flex items-center gap-1 uppercase tracking-wide">
                                    <Check className="h-4 w-4" />
                                    <span>{req.assigned_worker_name}</span>
                                  </span>
                                ) : (
                                  <select
                                    onChange={(e) => handleAssignWorker(req.id, e.target.value)}
                                    className="text-xs border border-[#E2E8F0] px-3 py-2.5 rounded-xl bg-[#F8FAFC] text-slate-800 focus:outline-none focus:border-[#2563EB] font-bold cursor-pointer"
                                    defaultValue=""
                                  >
                                    <option value="" disabled>-- Assign Worker --</option>
                                    {applicants
                                      .filter((a) => a.status === "approved" && 
                                        ((req.service_type === "Domestic Helper" && a.category === "helper") ||
                                         (req.service_type === "Security Guard" && a.category === "security") ||
                                         (req.service_type === "Pickup Service" && a.category === "pickup"))
                                      )
                                      .map((cand) => (
                                        <option key={cand.id} value={cand.id}>
                                          {cand.full_name} ({cand.experience})
                                        </option>
                                      ))}
                                  </select>
                                )}
                              </td>
                              <td className="p-4.5">
                                <div className="flex items-center justify-center gap-3">
                                  <select
                                    value={req.status}
                                    onChange={(e) => handleRequestStatus(req.id, e.target.value)}
                                    className="text-[10px] border border-[#E2E8F0] px-2 py-1.5 rounded-lg bg-white font-bold text-slate-700 focus:outline-none focus:border-[#2563EB]"
                                  >
                                    <option value="new">New</option>
                                    <option value="in_progress">In Progress</option>
                                    <option value="completed">Completed</option>
                                    <option value="cancelled">Cancelled</option>
                                  </select>
                                  <button
                                    onClick={() => handleRequestDelete(req.id)}
                                    className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg cursor-pointer border border-transparent hover:border-rose-200 transition-all"
                                    title="Delete placement"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Placements table pagination footer */}
                {filteredRequestsList.length > pageSize && (
                  <div className="bg-[#F8FAFC] border-t border-[#E2E8F0] p-4 flex items-center justify-between text-xs text-slate-500">
                    <span>
                      Showing {(reqTablePage - 1) * pageSize + 1} - {Math.min(reqTablePage * pageSize, filteredRequestsList.length)} of {filteredRequestsList.length} placements
                    </span>
                    <div className="flex items-center gap-2">
                      <button 
                        disabled={reqTablePage === 1}
                        onClick={() => setReqTablePage(reqTablePage - 1)}
                        className="p-1 px-2.5 bg-white border border-[#E2E8F0] hover:bg-slate-50 text-slate-705 disabled:opacity-40 disabled:pointer-events-none rounded-lg cursor-pointer shadow-sm"
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </button>
                      <span className="font-bold text-slate-800 font-mono px-2">{reqTablePage}</span>
                      <button 
                        disabled={reqTablePage * pageSize >= filteredRequestsList.length}
                        onClick={() => setReqTablePage(reqTablePage + 1)}
                        className="p-1 px-2.5 bg-white border border-[#E2E8F0] hover:bg-slate-50 text-slate-705 disabled:opacity-40 disabled:pointer-events-none rounded-lg cursor-pointer shadow-sm"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                )}

              </div>
            </div>
          )}

          {/* TAB 4: MANAGE NOTICES BULLETINS */}
          {activeTab === "notices" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[#E2E8F0] pb-4">
                <div>
                  <h2 className="text-2xl font-black text-[#0F172A] font-poppins">Notice Board Announcements</h2>
                  <p className="text-slate-500 text-xs font-sans">Draft, highlight, and manage bulletin publications showcased on the homepage notices.</p>
                </div>
                <button
                  onClick={() => setShowNoticeCreator(!showNoticeCreator)}
                  className="flex items-center gap-1.5 px-4 rounded-xl bg-[#2563EB] text-white font-black text-xs py-3.5 hover:bg-[#1D4ED8] cursor-pointer shadow shadow-blue-500/10"
                >
                  <Plus className="h-4.5 w-4.5 text-white" />
                  <span>Create Official Bulletin</span>
                </button>
              </div>

              {/* Search notices filter bar */}
              <div className="relative">
                <Search className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Filter published notifications title content..."
                  value={noticeSearch}
                  onChange={(e) => setNewNotice({ ...newNotice, title: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 bg-white text-xs border border-[#E2E8F0] text-slate-900 rounded-xl focus:outline-none focus:border-[#2563EB]"
                />
              </div>

              {/* Notice creator drawer */}
              {showNoticeCreator && (
                <form onSubmit={handlePublishNotice} className="p-6 bg-white border border-[#E2E8F0] rounded-xl space-y-5 font-sans shadow-sm">
                  <span className="block font-extrabold text-[10px] text-[#2563EB] uppercase tracking-widest leading-none font-mono">DRAFT NEW SYSTEM NOTICE</span>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase font-mono text-[10px]">Announcement Title</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Bangladesh Ministry of Labor license clearance registration updated"
                        value={newNotice.title}
                        onChange={(e) => setNewNotice({ ...newNotice, title: e.target.value })}
                        className="w-full text-xs p-3.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-slate-900 focus:outline-none focus:border-[#2563EB]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase font-mono text-[10px]">Mark Importance</label>
                      <select
                        value={newNotice.priority}
                        onChange={(e) => setNewNotice({ ...newNotice, priority: e.target.value as any })}
                        className="w-full text-xs p-3.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-slate-900 focus:outline-none focus:border-[#2563EB] font-bold"
                      >
                        <option value="normal">Normal Priority</option>
                        <option value="high">High Priority (Highlight)</option>
                        <option value="low">Low Priority</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase font-mono text-[10px]">Bulletin Body Content</label>
                    <textarea
                      rows={5}
                      required
                      placeholder="Write detailed announcements context here..."
                      value={newNotice.content}
                      onChange={(e) => setNewNotice({ ...newNotice, content: e.target.value })}
                      className="w-full text-xs p-3.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-slate-900 focus:outline-none focus:border-[#2563EB]"
                    />
                  </div>

                  <div className="flex items-center gap-4 pt-1">
                    <label className="flex items-center gap-2.5 font-bold text-xs text-slate-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={newNotice.is_pinned}
                        onChange={(e) => setNewNotice({ ...newNotice, is_pinned: e.target.checked })}
                        className="rounded border-slate-300 text-[#2563EB] focus:ring-[#2563EB] h-5 w-5"
                      />
                      <span>Pin announcement board item onto the top of the feed</span>
                    </label>
                  </div>

                  <div className="flex justify-end gap-3 pt-3 border-t border-[#E2E8F0]">
                    <button
                      type="button"
                      onClick={() => setShowNoticeCreator(false)}
                      className="px-5 py-2.5 border border-slate-200 rounded-xl text-xs font-bold bg-white text-slate-600 hover:bg-slate-50 cursor-pointer"
                    >
                      Cancel Draft
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2.5 rounded-xl bg-[#2563EB] text-white font-black text-xs uppercase cursor-pointer"
                    >
                      Publish to Portal Live
                    </button>
                  </div>
                </form>
              )}

              {/* Announcements grid lists */}
              <div className="bg-white border border-[#E2E8F0] rounded-xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse font-sans">
                    <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0] font-bold uppercase tracking-wider text-slate-500 font-mono text-[10px]">
                      <tr>
                        <th className="p-4.5">Publish Date</th>
                        <th className="p-4.5">Announcement Details</th>
                        <th className="p-4.5 text-center">Priority Status</th>
                        <th className="p-4.5 text-center">Pinned Flag</th>
                        <th className="p-4.5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E2E8F0] text-slate-750 font-medium">
                      {filteredNoticesList.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="py-12 text-center text-slate-500">
                            No published bulletins found holding current query.
                          </td>
                        </tr>
                      ) : (
                        filteredNoticesList.map((notice) => (
                          <tr key={notice.id} className="hover:bg-slate-50/50 transition-colors">
                            <td className="p-4.5 font-mono text-[11px] text-slate-500">
                              {new Date(notice.published_date).toLocaleDateString("en-US", {
                                dateStyle: "medium"
                              })}
                            </td>
                            <td className="p-4.5">
                              <span className="block font-black text-slate-900 text-sm leading-snug">{notice.title}</span>
                              <span className="block text-slate-500 text-xs mt-1.5 max-w-sm sm:max-w-md truncate">{notice.content}</span>
                            </td>
                            <td className="p-4.5 text-center">
                              <span className={`inline-flex text-[9px] font-bold px-2.5 py-0.5 rounded-full uppercase border ${
                                notice.priority === "high"
                                  ? "bg-rose-50 text-rose-700 border-rose-200"
                                  : notice.priority === "normal"
                                  ? "bg-slate-100 text-slate-600 border-slate-200"
                                  : "bg-emerald-50 text-emerald-700 border-emerald-200"
                              }`}>
                                {notice.priority}
                              </span>
                            </td>
                            <td className="p-4.5 text-center">
                              {notice.is_pinned ? (
                                <span className="text-amber-600 font-bold">✓ Pinned</span>
                              ) : (
                                <span className="text-slate-400">No</span>
                              )}
                            </td>
                            <td className="p-4.5 text-right">
                              <button
                                onClick={() => handleNoticeDelete(notice.id)}
                                className="px-3 py-1.5 text-rose-600 border border-slate-200 bg-white hover:bg-rose-50 font-bold hover:border-rose-300 uppercase text-[9px] rounded-lg cursor-pointer transition-all"
                              >
                                Delete Archive
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: SYSTEM SECURITY ACTIVITY AUDIT LOG */}
          {activeTab === "logs" && (
            <div className="space-y-6">
              
              <div>
                <h2 className="text-2xl font-black text-[#0F172A] font-poppins">System Security Audit Trails</h2>
                <p className="text-slate-500 text-xs">A comprehensive system-wide diagnostic trace tracking database operations.</p>
              </div>

              {/* Terminal glowing logs container */}
              <div className="bg-[#0F172A] text-slate-100 p-6 rounded-2xl font-mono text-[11px] leading-relaxed border border-[#1E293B] space-y-4 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/[0.01] rounded-full blur-2xl pointer-events-none" />
                
                <div className="flex items-center justify-between border-b border-emerald-950/40 pb-3 text-slate-400 font-extrabold text-[10px] uppercase tracking-wider">
                  <span>[TIMESTAMP TRACE]</span>
                  <span>[IDENTITY CREDENTIAL]</span>
                  <span className="text-right">[SYS AUDIT ACTION LOG]</span>
                </div>
                
                <div className="space-y-2.5 max-h-[500px] overflow-y-auto">
                  {logs.length === 0 ? (
                    <div className="text-center py-10 text-slate-500 font-bold">
                      No system events captured in audit registers.
                    </div>
                  ) : (
                    logs.map((log) => (
                      <div key={log.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-900/40 pb-2 text-emerald-420/90 font-light hover:bg-[#000]/10 p-1 animate-slideUp">
                        <span className="text-[10px] text-cyan-400 shrink-0 select-none font-bold">
                          [{new Date(log.created_at).toLocaleString()}]
                        </span>
                        <span className="font-bold text-amber-400 uppercase select-none shrink-0 sm:px-3 text-[10px]">
                          {log.user_name} (ID: {log.user_id})
                        </span>
                        <span className="text-slate-300 font-medium text-left flex-1 truncate max-w-sm sm:max-w-none text-xs sm:text-right">
                          :: {log.action}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: GLOBAL SITE SETTINGS */}
          {activeTab === "settings" && settingsForm && (
            <div className="space-y-6 animate-fadeIn">
              
              <div>
                <h2 className="text-2xl font-black text-[#0F172A] font-poppins">Global Platform Configurations</h2>
                <p className="text-slate-500 text-xs font-medium">Update database settings, SMTP routers, brand information, and alert integrations.</p>
              </div>

              {/* SMTP Subtabs control center */}
              <div className="flex gap-2.5 pb-2 border-b border-[#E2E8F0]">
                <button
                  type="button"
                  onClick={() => setSmtpSubTab("general")}
                  className={`px-5 py-2.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                    smtpSubTab === "general"
                      ? "bg-[#2563EB] text-white shadow-sm"
                      : "text-slate-500 hover:text-slate-800 hover:bg-slate-100"
                  }`}
                >
                  Global Brand Configurations
                </button>
                <button
                  type="button"
                  onClick={() => setSmtpSubTab("smtp")}
                  className={`px-5 py-2.5 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                    smtpSubTab === "smtp"
                      ? "bg-[#2563EB] text-white shadow-sm"
                      : "text-slate-500 hover:text-slate-800 hover:bg-slate-150"
                  }`}
                >
                  <span>SMTP & Notifications Server</span>
                  {settingsForm.smtp_host ? (
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  ) : (
                    <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
                  )}
                </button>
              </div>

              <form onSubmit={handleSaveSettings} className="bg-white border border-[#E2E8F0] rounded-xl p-8 sm:p-10 space-y-8 font-sans shadow-sm relative">
                
                {smtpSubTab === "general" ? (
                  <div className="space-y-6">
                    <span className="block font-extrabold text-xs text-[#2563EB] uppercase tracking-widest leading-none border-b border-[#E2E8F0] pb-2.5 font-mono">Central Enterprise Information</span>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wide">Enterprise Display Name</label>
                        <input
                          type="text"
                          required
                          value={settingsForm.company_name}
                          onChange={(e) => setSettingsForm({ ...settingsForm, company_name: e.target.value })}
                          className="w-full text-xs p-3.5 bg-[#F8FAFC] border border-[#E2E8F0] text-slate-900 rounded-xl focus:outline-none focus:border-[#2563EB]"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wide">Brand Logo String Name</label>
                        <input
                          type="text"
                          required
                          value={settingsForm.logo}
                          onChange={(e) => setSettingsForm({ ...settingsForm, logo: e.target.value })}
                          className="w-full text-xs p-3.5 bg-[#F8FAFC] border border-[#E2E8F0] text-slate-900 rounded-xl focus:outline-none focus:border-[#2563EB] font-bold"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wide">Headquarters Central Hotline</label>
                        <input
                          type="text"
                          required
                          value={settingsForm.contact_number}
                          onChange={(e) => setSettingsForm({ ...settingsForm, contact_number: e.target.value })}
                          className="w-full text-xs p-3.5 bg-[#F8FAFC] border border-[#E2E8F0] text-slate-900 rounded-xl focus:outline-none focus:border-[#2563EB]"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wide">Live WhatsApp Secure Sync</label>
                        <input
                          type="text"
                          required
                          value={settingsForm.whatsapp_number}
                          onChange={(e) => setSettingsForm({ ...settingsForm, whatsapp_number: e.target.value })}
                          className="w-full text-xs p-3.5 bg-[#F8FAFC] border border-[#E2E8F0] text-slate-900 rounded-xl focus:outline-none focus:border-[#2563EB]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wide">Corporate Registry Mail</label>
                        <input
                          type="email"
                          required
                          value={settingsForm.email}
                          onChange={(e) => setSettingsForm({ ...settingsForm, email: e.target.value })}
                          className="w-full text-xs p-3.5 bg-[#F8FAFC] border border-[#E2E8F0] text-slate-900 rounded-xl focus:outline-none focus:border-[#2563EB]"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wide">Dhaka HQ Office Address</label>
                        <input
                          type="text"
                          required
                          value={settingsForm.office_address}
                          onChange={(e) => setSettingsForm({ ...settingsForm, office_address: e.target.value })}
                          className="w-full text-xs p-3.5 bg-[#F8FAFC] border border-[#E2E8F0] text-slate-900 rounded-xl focus:outline-none focus:border-[#2563EB]"
                        />
                      </div>
                    </div>

                    <div className="space-y-6 pt-2">
                      <span className="block font-extrabold text-xs text-[#2563EB] uppercase tracking-widest leading-none border-b border-[#E2E8F0] pb-2.5 font-mono">Social Integration Parameters</span>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                        <div className="space-y-2">
                          <label className="block text-[11px] font-bold text-slate-500 mb-1">Facebook Directory</label>
                          <input
                            type="text"
                            value={settingsForm.social_facebook}
                            onChange={(e) => setSettingsForm({ ...settingsForm, social_facebook: e.target.value })}
                            className="w-full text-xs p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-slate-905 focus:outline-none focus:border-[#2563EB]"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="block text-[11px] font-bold text-slate-500 mb-1">Twitter Handle</label>
                          <input
                            type="text"
                            value={settingsForm.social_twitter}
                            onChange={(e) => setSettingsForm({ ...settingsForm, social_twitter: e.target.value })}
                            className="w-full text-xs p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-slate-905 focus:outline-none focus:border-[#2563EB]"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="block text-[11px] font-bold text-slate-500 mb-1">LinkedIn Profile</label>
                          <input
                            type="text"
                            value={settingsForm.social_linkedin}
                            onChange={(e) => setSettingsForm({ ...settingsForm, social_linkedin: e.target.value })}
                            className="w-full text-xs p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-slate-905 focus:outline-none focus:border-[#2563EB]"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-6 pt-2">
                      <span className="block font-extrabold text-xs text-[#2563EB] uppercase tracking-widest leading-none border-b border-[#E2E8F0] pb-2.5 font-mono">Dynamic SEO and Legal Copyright Credits</span>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <label className="block text-[11px] font-bold text-slate-500">SEO Meta Title Title Tag</label>
                          <input
                            type="text"
                            required
                            value={settingsForm.seo_title}
                            onChange={(e) => setSettingsForm({ ...settingsForm, seo_title: e.target.value })}
                            className="w-full text-xs p-3 bg-[#F8FAFC] border border-[#E2E8F0] text-slate-900 rounded-xl focus:outline-none focus:border-[#2563EB]"
                          />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <label className="block text-[11px] font-bold text-slate-500">SEO Meta Description Description Tag</label>
                            <textarea
                              rows={3}
                              value={settingsForm.seo_description}
                              onChange={(e) => setSettingsForm({ ...settingsForm, seo_description: e.target.value })}
                              className="w-full text-xs p-3 bg-[#F8FAFC] border border-[#E2E8F0] text-slate-900 rounded-xl focus:outline-none focus:border-[#2563EB]"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="block text-[11px] font-bold text-slate-500">Legal Copyright Footer Text</label>
                            <textarea
                              rows={3}
                              value={settingsForm.footer_text}
                              onChange={(e) => setSettingsForm({ ...settingsForm, footer_text: e.target.value })}
                              className="w-full text-xs p-3 bg-[#F8FAFC] border border-[#E2E8F0] text-slate-900 rounded-xl focus:outline-none focus:border-[#2563EB]"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6 animate-fadeIn">
                    <span className="block font-extrabold text-xs text-[#2563EB] uppercase tracking-widest leading-none border-b border-[#E2E8F0] pb-2.5 font-mono">Mail Server Credentials (SMTP Router)</span>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                      <div className="space-y-2">
                        <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wide">SMTP Host server</label>
                        <input
                          type="text"
                          placeholder="e.g. mail.exprogroupbd.com"
                          value={settingsForm.smtp_host || ""}
                          onChange={(e) => setSettingsForm({ ...settingsForm, smtp_host: e.target.value })}
                          className="w-full text-xs p-3.5 bg-[#F8FAFC] border border-[#E2E8F0] text-slate-900 rounded-xl focus:outline-none focus:border-[#2563EB]"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wide">SMTP Port</label>
                        <input
                          type="number"
                          placeholder="e.g. 587 or 465"
                          value={settingsForm.smtp_port || ""}
                          onChange={(e) => setSettingsForm({ ...settingsForm, smtp_port: e.target.value ? Number(e.target.value) : undefined })}
                          className="w-full text-xs p-3.5 bg-[#F8FAFC] border border-[#E2E8F0] text-slate-900 rounded-xl focus:outline-none focus:border-[#2563EB]"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wide">Security Mode</label>
                        <select
                          value={settingsForm.smtp_secure ? "secure" : "no-secure"}
                          onChange={(e) => setSettingsForm({ ...settingsForm, smtp_secure: e.target.value === "secure" })}
                          className="w-full text-xs p-3.5 bg-[#F8FAFC] border border-[#E2E8F0] text-slate-850 rounded-xl focus:outline-none focus:border-[#2563EB] font-bold"
                        >
                          <option value="no-secure">None / TLS STARTTLS (Port 587)</option>
                          <option value="secure">SSL / TLS Explicit security (Port 465)</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wide">SMTP Username / auth key</label>
                        <input
                          type="text"
                          placeholder="e.g. notifications@exprogroupbd.com"
                          value={settingsForm.smtp_user || ""}
                          onChange={(e) => setSettingsForm({ ...settingsForm, smtp_user: e.target.value })}
                          className="w-full text-xs p-3.5 bg-[#F8FAFC] border border-[#E2E8F0] text-slate-900 rounded-xl focus:outline-none focus:border-[#2563EB]"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wide">SMTP Password / key passcode</label>
                        <input
                          type="password"
                          placeholder="••••••••••••"
                          value={settingsForm.smtp_pass || ""}
                          onChange={(e) => setSettingsForm({ ...settingsForm, smtp_pass: e.target.value })}
                          className="w-full text-xs p-3.5 bg-[#F8FAFC] border border-[#E2E8F0] text-slate-900 rounded-xl focus:outline-none font-mono focus:border-[#2563EB]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wide">Sender Display Name</label>
                        <input
                          type="text"
                          placeholder="e.g. Nirapotta & Seba Support"
                          value={settingsForm.smtp_sender_name || ""}
                          onChange={(e) => setSettingsForm({ ...settingsForm, smtp_sender_name: e.target.value })}
                          className="w-full text-xs p-3.5 bg-[#F8FAFC] border border-[#E2E8F0] text-slate-900 rounded-xl focus:outline-none focus:border-[#2563EB]"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wide">Sender Authorized Address</label>
                        <input
                          type="email"
                          placeholder="e.g. noreply@exprogroupbd.com"
                          value={settingsForm.smtp_sender_email || ""}
                          onChange={(e) => setSettingsForm({ ...settingsForm, smtp_sender_email: e.target.value })}
                          className="w-full text-xs p-3.5 bg-[#F8FAFC] border border-[#E2E8F0] text-slate-900 rounded-xl focus:outline-none focus:border-[#2563EB]"
                        />
                      </div>
                    </div>

                    <div className="space-y-6 pt-2">
                      <span className="block font-extrabold text-xs text-[#2563EB] uppercase tracking-widest leading-none border-b border-[#E2E8F0] pb-2.5 font-mono">Dynamic Notification subscriptions</span>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
                        <label className="flex items-start gap-4 bg-[#F8FAFC] p-5 rounded-xl border border-[#E2E8F0] hover:bg-slate-50 cursor-pointer select-none transition-colors">
                          <input
                            type="checkbox"
                            checked={!!settingsForm.notify_new_candidate}
                            onChange={(e) => setSettingsForm({ ...settingsForm, notify_new_candidate: e.target.checked })}
                            className="mt-1.5 h-4.5 w-4.5 accent-[#2563EB] rounded"
                          />
                          <div>
                            <span className="block text-xs font-bold text-slate-800">Candidates Registrations Alert</span>
                            <span className="block text-[10px] text-slate-500 mt-1">Dispatch alert mail upon new candidate submission.</span>
                          </div>
                        </label>

                        <label className="flex items-start gap-4 bg-[#F8FAFC] p-5 rounded-xl border border-[#E2E8F0] hover:bg-slate-50 cursor-pointer select-none transition-colors">
                          <input
                            type="checkbox"
                            checked={!!settingsForm.notify_new_request}
                            onChange={(e) => setSettingsForm({ ...settingsForm, notify_new_request: e.target.checked })}
                            className="mt-1.5 h-4.5 w-4.5 accent-[#2563EB] rounded"
                          />
                          <div>
                            <span className="block text-xs font-bold text-slate-800">New Service Requests Alert</span>
                            <span className="block text-[10px] text-slate-500 mt-1">Dispatch alert mail upon new deployment booking.</span>
                          </div>
                        </label>

                        <label className="flex items-start gap-4 bg-[#F8FAFC] p-5 rounded-xl border border-[#E2E8F0] hover:bg-slate-50 cursor-pointer select-none transition-colors">
                          <input
                            type="checkbox"
                            checked={settingsForm.notify_candidate_status !== false}
                            onChange={(e) => setSettingsForm({ ...settingsForm, notify_candidate_status: e.target.checked })}
                            className="mt-1.5 h-4.5 w-4.5 accent-[#2563EB] rounded"
                          />
                          <div>
                            <span className="block text-xs font-bold text-slate-800">Candidates Status Updates</span>
                            <span className="block text-[10px] text-slate-500 mt-1">Dispatch alert mail when any status changes are saved.</span>
                          </div>
                        </label>

                        <label className="flex items-start gap-4 bg-[#F8FAFC] p-5 rounded-xl border border-[#E2E8F0] hover:bg-slate-50 cursor-pointer select-none transition-colors">
                          <input
                            type="checkbox"
                            checked={settingsForm.notify_notice_published !== false}
                            onChange={(e) => setSettingsForm({ ...settingsForm, notify_notice_published: e.target.checked })}
                            className="mt-1.5 h-4.5 w-4.5 accent-[#2563EB] rounded"
                          />
                          <div>
                            <span className="block text-xs font-bold text-slate-800">Notice Board Announcements</span>
                            <span className="block text-[10px] text-slate-500 mt-1">Dispatch alert mail when notices are published live.</span>
                          </div>
                        </label>

                        <label className="flex items-start gap-4 bg-[#F8FAFC] p-5 rounded-xl border border-[#E2E8F0] hover:bg-slate-50 cursor-pointer select-none transition-colors">
                          <input
                            type="checkbox"
                            checked={settingsForm.notify_security_alerts !== false}
                            onChange={(e) => setSettingsForm({ ...settingsForm, notify_security_alerts: e.target.checked })}
                            className="mt-1.5 h-4.5 w-4.5 accent-[#2563EB] rounded"
                          />
                          <div>
                            <span className="block text-xs font-bold text-slate-800">Security Warning Alerts</span>
                            <span className="block text-[10px] text-slate-500 mt-1">Alert administrators on unauthorized sessions, logins, or untrusted devices.</span>
                          </div>
                        </label>
                      </div>
                    </div>

                    {/* Connection dynamic testing handshake */}
                    <div className="bg-[#F8FAFC] p-6 sm:p-8 rounded-xl border border-[#E2E8F0] space-y-4">
                      <div className="flex items-center gap-2">
                        <RefreshCw className={`h-4.5 w-4.5 text-[#2563EB] ${smtpTesting ? 'animate-spin' : ''}`} />
                        <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#2563EB] font-mono leading-none">SMTP Connection Handshake Diagnostic Tool</span>
                      </div>
                      
                      <div className="flex flex-col sm:flex-row items-end gap-4">
                        <div className="flex-1 space-y-1.5 w-full">
                          <label className="block text-[10px] font-bold text-slate-500 uppercase">Handshake Test Destination Recipient Address</label>
                          <input
                            type="email"
                            placeholder="your-admin-email@gmail.com"
                            value={testRecipient}
                            onChange={(e) => setTestRecipient(e.target.value)}
                            className="w-full text-xs p-3 bg-white border border-[#E2E8F0] text-slate-900 rounded-lg focus:outline-none focus:border-[#2563EB]"
                          />
                        </div>
                        <button
                          type="button"
                          disabled={smtpTesting || !settingsForm.smtp_host || !settingsForm.smtp_user || !settingsForm.smtp_pass}
                          onClick={handleTestSmtp}
                          className="px-5 py-3 w-full sm:w-auto bg-slate-100 hover:bg-slate-205 text-slate-700 hover:bg-slate-200 rounded-lg border border-slate-350 text-xs font-bold transition-all uppercase disabled:opacity-40 disabled:pointer-events-none cursor-pointer text-center"
                        >
                          {smtpTesting ? "Handshaking TLS..." : "Trigger active SMTP Test"}
                        </button>
                      </div>

                      {smtpTestResult && (
                        <div className={`p-4.5 rounded-xl border text-xs leading-normal animate-slideUp ${
                          smtpTestResult.success 
                            ? 'bg-emerald-50 border-emerald-200 text-emerald-800' 
                            : 'bg-rose-50 border-rose-200 text-rose-800'
                        }`}>
                          <strong className="block mb-1">{smtpTestResult.success ? "🎉 Test Handshake Successful!" : "❌ Handshake Communications Failure!"}</strong>
                          <p className="font-mono text-[11px] font-medium leading-relaxed">{smtpTestResult.message}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <div className="pt-6 flex justify-end border-t border-[#E2E8F0]">
                  <button
                    type="submit"
                    className="px-8 py-4 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-black rounded-xl text-xs font-bold uppercase transition-all shadow-md shadow-blue-500/10 cursor-pointer"
                  >
                    Save configurations modifications
                  </button>
                </div>
              </form>
            </div>
          )}

        </main>
      </div>

    </div>
  );
}
