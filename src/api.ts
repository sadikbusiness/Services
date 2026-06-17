const API_BASE = ""; // Relative paths since Vite's Express dev server proxies it automatically

export class ApiService {
  private static getToken(): string | null {
    return localStorage.getItem("ns_manpower_admin_token");
  }

  private static getHeaders(isMultipart = false): HeadersInit {
    const headers: Record<string, string> = {};
    if (!isMultipart) {
      headers["Content-Type"] = "application/json";
    }
    const token = this.getToken();
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
    return headers;
  }

  // Public APIs
  public static async getSettings() {
    const res = await fetch(`${API_BASE}/api/public/settings`);
    if (!res.ok) throw new Error("Failed to load settings");
    return res.json();
  }

  public static async getPublicNotices() {
    const res = await fetch(`${API_BASE}/api/public/notices`);
    if (!res.ok) throw new Error("Failed to load notices");
    return res.json();
  }

  public static async getPublicApplicants(category?: string) {
    const query = category ? `?category=${category}` : "";
    const res = await fetch(`${API_BASE}/api/public/applicants${query}`);
    if (!res.ok) throw new Error("Failed to load listings");
    return res.json();
  }

  public static async getPublicApplicantDetails(id: string) {
    const res = await fetch(`${API_BASE}/api/public/applicants/${id}`);
    if (!res.ok) throw new Error("Failed to load candidate details");
    return res.json();
  }

  public static async submitApplication(data: any) {
    const res = await fetch(`${API_BASE}/api/public/apply`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || "Failed to submit application");
    }
    return res.json();
  }

  public static async submitCustomerRequest(data: any) {
    const res = await fetch(`${API_BASE}/api/public/request`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || "Failed to save request");
    }
    return res.json();
  }

  public static async login(credentials: any) {
    const res = await fetch(`${API_BASE}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || "Login validation failed");
    }
    return res.json();
  }

  // Auth Guard verification helper
  public static async verifySession() {
    const res = await fetch(`${API_BASE}/api/auth/me`, {
      headers: this.getHeaders(),
    });
    if (!res.ok) throw new Error("Session invalid");
    return res.json();
  }

  /* Admin & Restricted APIs */
  public static async getAdminStats() {
    const res = await fetch(`${API_BASE}/api/admin/stats`, {
      headers: this.getHeaders(),
    });
    if (!res.ok) throw new Error("Failed to parse statistics dashboard data");
    return res.json();
  }

  public static async getApplicantsAdmin() {
    const res = await fetch(`${API_BASE}/api/applicants`, {
      headers: this.getHeaders(),
    });
    if (!res.ok) throw new Error("Failed to fetch all applications");
    return res.json();
  }

  public static async getUsersAdmin() {
    const res = await fetch(`${API_BASE}/api/users`, {
      headers: this.getHeaders(),
    });
    if (!res.ok) throw new Error("Failed to fetch admin users list");
    return res.json();
  }

  public static async updateApplicant(id: string, updates: any) {
    const res = await fetch(`${API_BASE}/api/applicants/${id}`, {
      method: "PUT",
      headers: this.getHeaders(),
      body: JSON.stringify(updates),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || "Failed to update profile");
    }
    return res.json();
  }

  public static async deleteApplicant(id: string) {
    const res = await fetch(`${API_BASE}/api/applicants/${id}`, {
      method: "DELETE",
      headers: this.getHeaders(),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || "Failed to remove applicant");
    }
    return res.json();
  }

  public static async getServiceRequestsAdmin() {
    const res = await fetch(`${API_BASE}/api/requests`, {
      headers: this.getHeaders(),
    });
    if (!res.ok) throw new Error("Failed to load customer requests");
    return res.json();
  }

  public static async updateServiceRequest(id: string, updates: any) {
    const res = await fetch(`${API_BASE}/api/requests/${id}`, {
      method: "PUT",
      headers: this.getHeaders(),
      body: JSON.stringify(updates),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || "Failed to update request state");
    }
    return res.json();
  }

  public static async deleteServiceRequest(id: string) {
    const res = await fetch(`${API_BASE}/api/requests/${id}`, {
      method: "DELETE",
      headers: this.getHeaders(),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || "Failed to delete request");
    }
    return res.json();
  }

  public static async getNoticesAdmin() {
    const res = await fetch(`${API_BASE}/api/notices`, {
      headers: this.getHeaders(),
    });
    if (!res.ok) throw new Error("Failed to load notices");
    return res.json();
  }

  public static async createNotice(noticeData: any) {
    const res = await fetch(`${API_BASE}/api/notices`, {
      method: "POST",
      headers: this.getHeaders(),
      body: JSON.stringify(noticeData),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || "Failed to publish notice");
    }
    return res.json();
  }

  public static async updateNotice(id: string, updates: any) {
    const res = await fetch(`${API_BASE}/api/notices/${id}`, {
      method: "PUT",
      headers: this.getHeaders(),
      body: JSON.stringify(updates),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || "Failed to edit notice");
    }
    return res.json();
  }

  public static async deleteNotice(id: string) {
    const res = await fetch(`${API_BASE}/api/notices/${id}`, {
      method: "DELETE",
      headers: this.getHeaders(),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || "Failed to delete notice");
    }
    return res.json();
  }

  public static async getSecurityLogs() {
    const res = await fetch(`${API_BASE}/api/logs`, {
      headers: this.getHeaders(),
    });
    if (!res.ok) throw new Error("Failed to load system activity logs");
    return res.json();
  }

  public static async updateSystemSettings(settings: any) {
    const res = await fetch(`${API_BASE}/api/settings`, {
      method: "PUT",
      headers: this.getHeaders(),
      body: JSON.stringify(settings),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || "Failed to update configuration settings");
    }
    return res.json();
  }

  // Manual Candidate Creation by Authorized Admins
  public static async enrollApplicantAdmin(applicantData: any) {
    const res = await fetch(`${API_BASE}/api/admin/applicants`, {
      method: "POST",
      headers: this.getHeaders(),
      body: JSON.stringify(applicantData),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || "Failed to manually register applicant profile");
    }
    return res.json();
  }

  // Active SMTP Connection Verification Diagnostic Test
  public static async testSmtpSettings(testData: any) {
    const res = await fetch(`${API_BASE}/api/admin/test-smtp`, {
      method: "POST",
      headers: this.getHeaders(),
      body: JSON.stringify(testData),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || "Failed secure handshake communication to SMTP mail server");
    }
    return res.json();
  }
}
export default ApiService;
