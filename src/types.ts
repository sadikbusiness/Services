export type UserRole = "super_admin" | "admin" | "editor";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

export type ApplicantCategory = "helper" | "security" | "pickup";
export type ApplicantStatus = "pending" | "approved" | "rejected" | "suspended";

export interface Applicant {
  id: string;
  full_name: string;
  father_name: string;
  mother_name: string;
  dob: string;
  age?: number;
  nid: string;
  phone: string;
  email: string;
  address: string;
  category: ApplicantCategory;
  experience: string; // e.g., "5 years" or "5"
  skills: string; // comma-separated or text description
  photo: string; // base64 or URL
  documents: string; // comma-separated titles or URLs, e.g. "NID copy, Certificate"
  front_nid?: string; // Front Side NID Scanned Copy
  back_nid?: string; // Back Side NID Scanned Copy
  status: ApplicantStatus;
  created_at?: string;

  // Specific optional fields for detailed profiles
  helper_type?: "Housemaid" | "Babysitter" | "Caregiver" | "Cleaner";
  security_type?: "Residential Security" | "Commercial Security" | "Event Security";
  location?: string; // location or primary area of service
  training?: string; // security/helper training certifications

  // Pickup service specific
  vehicle_type?: string; // e.g., "Microbus", "Minivan", "Car"
  vehicle_photo?: string;
  route?: string; // e.g., "Mirpur to Gulshan"
  capacity?: number; // seating capacity
  schedule?: string; // e.g., "7:00 AM - 5:00 PM"
  area?: string; // e.g., "Dhaka"
  description?: string; // Driver background or intro
}

export type RequestStatus = "new" | "in_progress" | "completed" | "cancelled";

export interface ServiceRequest {
  id: string;
  customer_name: string;
  phone: string;
  email: string;
  address: string;
  service_type: "Domestic Helper" | "Security Guard" | "Pickup Service";
  duration: string; // e.g., "6 Months"
  budget: string; // budget details
  notes?: string;
  status: RequestStatus;
  created_at: string;
  assigned_worker_id?: string;
  assigned_worker_name?: string;
}

export type NoticePriority = "high" | "normal" | "low";

export interface Notice {
  id: string;
  title: string;
  content: string;
  priority: NoticePriority;
  status: "draft" | "published";
  is_pinned: boolean;
  published_date: string;
  created_at: string;
}

export interface ActivityLog {
  id: string;
  user_id: string;
  user_name: string;
  action: string;
  created_at: string;
}

export interface SystemSettings {
  company_name: string;
  logo: string; // text representation or data-url
  contact_number: string;
  whatsapp_number: string;
  email: string;
  office_address: string;
  social_facebook: string;
  social_twitter: string;
  social_linkedin: string;
  seo_title: string;
  seo_description: string;
  footer_text: string;

  // SMTP Settings Config Area
  smtp_host?: string;
  smtp_port?: number;
  smtp_secure?: boolean;
  smtp_user?: string;
  smtp_pass?: string;
  smtp_sender_name?: string;
  smtp_sender_email?: string;
  smtp_recipient_emails?: string; // Comma separated notification list
  
  // SMTP Alert Preferences
  notify_new_candidate?: boolean;
  notify_new_request?: boolean;
  notify_candidate_status?: boolean;
  notify_notice_published?: boolean;
  notify_security_alerts?: boolean;
}
