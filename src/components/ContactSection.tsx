import React, { useState } from "react";
import { Mail, Phone, MapPin, CheckCircle, Send, HelpCircle } from "lucide-react";
import { translations } from "../translations";
import { SystemSettings } from "../types";

interface ContactSectionProps {
  currentLanguage: "en" | "bn";
  settings: SystemSettings | null;
}

export default function ContactSection({ currentLanguage, settings }: ContactSectionProps) {
  const t = translations[currentLanguage];

  // Message form states
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [msgTitle, setMsgTitle] = useState("");
  const [message, setMessage] = useState("");
  
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleMessageSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setTimeout(() => {
      setSending(false);
      setSent(true);
      setUserName("");
      setUserEmail("");
      setMsgTitle("");
      setMessage("");
    }, 1000);
  };

  return (
    <div id="contact_view_container" className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-12">
      
      {/* Title */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          {t.contactTitle}
        </h2>
        <p className="text-slate-500 text-sm sm:text-base leading-relaxed">
          {t.contactSub}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        
        {/* Col 1: Contact Details & Visual Map Block */}
        <div className="space-y-8">
          
          <div className="bg-white border p-6 rounded-2xl shadow-sm grid grid-cols-1 sm:grid-cols-3 gap-6">
            
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400">Head Office</span>
              <div className="flex gap-2 text-xs font-semibold text-slate-800 font-sans leading-tight">
                <MapPin className="h-4 w-4 text-indigo-500 shrink-0 mt-0.5" />
                <span>Expro complex, House 42/A, Road 11, Banani, Dhaka</span>
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400">Contact Helplines</span>
              <div className="flex gap-2 text-xs font-bold text-slate-800 font-sans">
                <Phone className="h-4 w-4 text-emerald-500 shrink-0" />
                <span>{settings?.contact_number || "+8801700001122"}</span>
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400">Email Address</span>
              <div className="flex gap-2 text-xs font-semibold text-slate-800 font-sans truncate">
                <Mail className="h-4 w-4 text-orange-500 shrink-0" />
                <span className="truncate">{settings?.email || "info@exprogroupbd.com"}</span>
              </div>
            </div>

          </div>

          {/* Styled Geographic Map Box placeholder to ensure standard accessibility */}
          <div className="bg-slate-50 p-4 rounded-3xl border border-gray-150 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wide text-slate-500 font-sans flex items-center gap-1.5">
                <MapPin className="h-4 w-4 text-red-500" />
                <span>Banani Headquarters Map Directions</span>
              </span>
              <span className="text-[10px] font-mono text-emerald-600 bg-emerald-50 border border-emerald-2 px-2 py-0.5 rounded">
                Active Zone
              </span>
            </div>
            
            <div className="aspect-video w-full rounded-2xl overflow-hidden border border-gray-200 shadow-inner bg-indigo-50 relative flex items-center justify-center">
              {/* Dynamic Styled Canvas or visual vector mockup for high aesthetic pairing */}
              <div className="absolute inset-0 bg-slate-100 flex flex-col justify-between p-6">
                <div className="space-y-1 text-slate-650">
                  <span className="block font-bold text-xs text-slate-900">Nirapotta & Seba Headquarters</span>
                  <span className="block text-[11px] font-medium leading-tight">Close to Banani Graveyard, Block C, Banani, Dhaka-1213</span>
                </div>
                <div className="h-32 w-full border border-slate-200 bg-slate-50 rounded-xl relative overflow-hidden flex items-center justify-center text-slate-350 text-[10px] uppercase font-mono">
                  <div className="absolute top-1/2 left-1/3 h-1.5 w-1.5 bg-red-650 rounded-full animate-ping"></div>
                  <div className="absolute top-1/2 left-1/3 h-1.5 w-1.5 bg-red-600 rounded-full"></div>
                  <span className="tracking-widest">MAP NAVIGATION GRID</span>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Col 2: Online Message Form Box */}
        <div className="bg-white border rounded-2xl border-gray-150 p-6 sm:p-8 space-y-5">
          <div>
            <h3 className="font-bold text-lg text-slate-900 tracking-tight leading-none">
              {currentLanguage === "en" ? "Send an Instant Enquiry" : "অনলাইন সরাসরি মেসেজ পাঠান"}
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              {currentLanguage === "en"
                ? "Got general questions? Submit details below and our service team will email replies within 24 hours."
                : "যেকোনো সাধারণ প্রশ্ন বা মতামতের জন্য নিচের ফর্মটি পূরণ করুন। ২৪ ঘণ্টার মধ্যে যোগাযোগ করা হবে।"}
            </p>
          </div>

          {sent ? (
            <div className="p-6 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl space-y-2 text-center max-w-sm mx-auto">
              <CheckCircle className="h-8 w-8 text-emerald-600 mx-auto" />
              <span className="block font-bold text-xs">Message Received!</span>
              <p className="text-[11px] text-emerald-700">
                Thank you for reaching out. We will get back to you soon.
              </p>
              <button
                onClick={() => setSent(false)}
                className="mt-3 px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-[10px] font-bold"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleMessageSubmit} className="space-y-4 font-sans">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-650 mb-1">Your Name</label>
                  <input
                    type="text"
                    required
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    placeholder="e.g. Sajib Chowdhury"
                    className="w-full text-xs p-2.5 rounded-xl border border-gray-150 focus:outline-none focus:border-indigo-500 bg-slate-50"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-650 mb-1">Your Email</label>
                  <input
                    type="email"
                    required
                    value={userEmail}
                    onChange={(e) => setUserEmail(e.target.value)}
                    placeholder="e.g. sajib@gmail.com"
                    className="w-full text-xs p-2.5 rounded-xl border border-gray-150 focus:outline-none focus:border-indigo-500 bg-slate-50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-650 mb-1">Message Subject</label>
                <input
                  type="text"
                  required
                  value={msgTitle}
                  onChange={(e) => setMsgTitle(e.target.value)}
                  placeholder="e.g. Question about helper security vetting"
                  className="w-full text-xs p-2.5 rounded-xl border border-gray-150 focus:outline-none focus:border-indigo-500 bg-slate-50"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-650 mb-1">Your Detailed Message</label>
                <textarea
                  rows={4}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Write your questions or enquiry in detail..."
                  className="w-full text-xs p-2.5 rounded-xl border border-gray-150 focus:outline-none focus:border-indigo-500 bg-slate-50"
                />
              </div>

              <button
                type="submit"
                disabled={sending}
                className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow cursor-pointer uppercase flex items-center justify-center gap-2 transition-transform active:scale-98"
              >
                <Send className="h-3.5 w-3.5" />
                <span>{sending ? "Sending..." : "Submit Inquiry Msg"}</span>
              </button>

            </form>
          )}

        </div>

      </div>

    </div>
  );
}
