import React, { useState } from "react";
import { Search, Flame, Calendar, MapPin, ArrowLeft, ArrowRight, ShieldAlert, FileText, CheckCircle, Pin, Inbox, ChevronRight, X } from "lucide-react";
import { translations } from "../translations";
import { Notice } from "../types";

interface NoticeSectionProps {
  currentLanguage: "en" | "bn";
  notices: Notice[];
}

export default function NoticeSection({ currentLanguage, notices }: NoticeSectionProps) {
  const t = translations[currentLanguage];

  // States
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedNotice, setSelectedNotice] = useState<Notice | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const noticesPerPage = 4;

  const filteredNotices = notices.filter((notice) => {
    const titleMatch = notice.title.toLowerCase().includes(searchQuery.toLowerCase());
    const contentMatch = notice.content.toLowerCase().includes(searchQuery.toLowerCase());
    return titleMatch || contentMatch;
  });

  // Pagination Logic
  const totalNotices = filteredNotices.length;
  const totalPages = Math.ceil(totalNotices / noticesPerPage) || 1;
  const indexOfLastNotice = currentPage * noticesPerPage;
  const indexOfFirstNotice = indexOfLastNotice - noticesPerPage;
  const currentNotices = filteredNotices.slice(indexOfFirstNotice, indexOfLastNotice);

  const handlePageChange = (pageNo: number) => {
    if (pageNo >= 1 && pageNo <= totalPages) {
      setCurrentPage(pageNo);
    }
  };

  return (
    <div id="notices_view_container" className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8 space-y-10">
      
      {/* Search Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-gray-150 pb-5">
        <div className="space-y-1.5">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <Flame className="h-6 w-6 text-indigo-650 shrink-0" />
            <span>{t.navNotices}</span>
          </h2>
          <p className="text-slate-500 text-xs">
            {currentLanguage === "en"
              ? "Official recruitment policies, holiday bulletins, training course schedules, and service news from Nirapotta & Seba."
              : "আমাদের দাপ্তরিক কাজের ঘোষণা, প্রার্থী নির্বাচনী নোটিশ, ট্রেনিং সিডিউল ও বিভিন্ন নির্দেশিকা সরাসরি নোটিশ বোর্ড থেকে জানুন।"}
          </p>
        </div>

        {/* Live notice search input */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            id="notices_search_bar"
            placeholder="Search notice titles or terms..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1); // Reset page to 1
            }}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-gray-200 focus:outline-none focus:border-indigo-500 bg-slate-50"
          />
        </div>
      </div>

      {currentNotices.length === 0 ? (
        <div className="text-center py-24 bg-slate-50 rounded-2xl border border-dashed border-gray-200 space-y-4">
          <Inbox className="h-10 w-10 text-gray-300 mx-auto" />
          <p className="text-gray-500 text-sm font-medium">No bulletins published match your query on board.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {currentNotices.map((notice) => (
            <div
              key={notice.id}
              id={`notice_card_item_${notice.id}`}
              onClick={() => setSelectedNotice(notice)}
              className={`bg-white p-6 rounded-2xl border transition-all cursor-pointer flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:border-indigo-455 hover:shadow-sm ${
                notice.is_pinned ? "border-amber-200 bg-amber-50/10 shadow-sm" : "border-gray-150"
              }`}
            >
              
              {/* Left text info */}
              <div className="space-y-2 flex-1 md:pr-4">
                <div className="flex flex-wrap items-center gap-2">
                  
                  {/* Pin tag */}
                  {notice.is_pinned && (
                    <span className="bg-amber-100 text-amber-900 border border-amber-300 text-[9px] font-extrabold px-2 py-0.5 rounded-full flex items-center gap-0.5">
                      <Pin className="h-2.5 w-2.5 fill-amber-900" />
                      PINNED
                    </span>
                  )}

                  {/* Priority mark */}
                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase border ${
                    notice.priority === "high"
                      ? "bg-rose-50 text-rose-800 border-rose-200"
                      : notice.priority === "normal"
                      ? "bg-slate-50 text-slate-700 border-slate-250"
                      : "bg-emerald-50 text-emerald-800 border-emerald-200"
                  }`}>
                    {notice.priority} Priority
                  </span>

                  {/* Publish Date */}
                  <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {new Date(notice.published_date).toLocaleDateString(currentLanguage === "en" ? "en-US" : "bn-BD", {
                      dateStyle: "medium"
                    })}
                  </span>

                </div>

                <h3 className="text-lg font-bold text-slate-900 hover:text-indigo-650 transition-colors tracking-tight line-clamp-1 mt-1">
                  {notice.title}
                </h3>

                <p className="text-slate-655 text-xs line-clamp-2 leading-relaxed">
                  {notice.content}
                </p>
              </div>

              {/* Right View action */}
              <div className="hidden md:flex items-center gap-1 text-xs font-bold text-indigo-600 group shrink-0">
                <span>Read Full</span>
                <ChevronRight className="h-4 w-4 transform group-hover:translate-x-0.5 transition-transform" />
              </div>

            </div>
          ))}
        </div>
      )}

      {/* Pagination controls footer */}
      {totalPages > 1 && (
        <div id="notice_pagination_controls" className="pt-6 border-t border-gray-150 flex items-center justify-between text-xs font-medium text-slate-700">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-255 bg-white hover:bg-gray-50 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Previous</span>
          </button>

          <span className="font-mono text-xs">
            Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong>
          </span>

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-255 bg-white hover:bg-gray-50 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
          >
            <span>Next</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* FULL RECORD MODAL WINDOW DETAILS */}
      {selectedNotice && (
        <div id="notice_modal_details_dialog" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-gray-100 relative">
            
            {/* Close Button */}
            <button
              onClick={() => setSelectedNotice(null)}
              className="absolute top-4 right-4 bg-slate-50 hover:bg-slate-100 text-slate-600 p-2 rounded-full cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Modal headers info */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                {selectedNotice.is_pinned && (
                  <span className="bg-amber-100 text-amber-900 text-[10px] font-bold px-2.5 py-0.5 rounded-md">
                    PINNED BULLETIN
                  </span>
                )}
                <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-md uppercase ${
                  selectedNotice.priority === "high"
                    ? "bg-rose-50 text-rose-800"
                    : selectedNotice.priority === "normal"
                    ? "bg-slate-50 text-slate-700"
                    : "bg-emerald-50 text-emerald-850"
                }`}>
                  {selectedNotice.priority} priority
                </span>
                <span className="text-slate-400 font-mono text-[10px] flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5" />
                  Published {new Date(selectedNotice.published_date).toLocaleString(currentLanguage === "en" ? "en-US" : "bn-BD", {
                    dateStyle: "medium",
                    timeStyle: "short"
                  })}
                </span>
              </div>

              <h3 className="text-xl sm:text-2xl font-extrabold text-slate-950 tracking-tight leading-snug">
                {selectedNotice.title}
              </h3>
            </div>

            {/* Content paragraph (supporting safe preformatting or whitespace lines) */}
            <div className="p-4 bg-slate-50/50 rounded-2xl border border-gray-100">
              <p className="text-slate-700 text-xs sm:text-sm whitespace-pre-line leading-relaxed font-sans">
                {selectedNotice.content}
              </p>
            </div>

            <div className="pt-2 border-t border-gray-100 flex justify-end">
              <button
                onClick={() => setSelectedNotice(null)}
                className="rounded-xl px-5 py-2.5 bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Close bulletin
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
