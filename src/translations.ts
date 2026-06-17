export interface TranslationSchema {
  navHome: string;
  navAbout: string;
  navHelpers: string;
  navGuards: string;
  navPickup: string;
  navNotices: string;
  navContact: string;
  navApplyWork: string;
  navHireNow: string;
  navAdmin: string;
  heroTitle: string;
  heroSub: string;
  btnHireNow: string;
  btnApplyWork: string;
  servicesTitle: string;
  servicesSubtitle: string;
  helpersTitle: string;
  helpersDesc: string;
  guardsTitle: string;
  guardsDesc: string;
  pickupTitle: string;
  pickupDesc: string;
  whyChooseUsTitle: string;
  whyChooseUsSub: string;
  verifiedStaff: string;
  verifiedStaffDesc: string;
  exprTeam: string;
  exprTeamDesc: string;
  affordPrice: string;
  affordPriceDesc: string;
  support24: string;
  support24Desc: string;
  latestNotices: string;
  testimonialsTitle: string;
  testimonialsSub: string;
  contactCTATitle: string;
  contactCTASub: string;
  aboutTitle: string;
  aboutSub: string;
  mission: string;
  missionText: string;
  vision: string;
  visionText: string;
  statsCandidates: string;
  statsPlacements: string;
  statsGuards: string;
  statsSatisfied: string;
  filterTitle: string;
  searchPlaceholder: string;
  age: string;
  experience: string;
  location: string;
  skills: string;
  availability: string;
  viewProfile: string;
  requestContact: string;
  applyFormTitle: string;
  applyFormSub: string;
  requestFormTitle: string;
  requestFormSub: string;
  fullName: string;
  phone: string;
  email: string;
  address: string;
  nid: string;
  dob: string;
  fatherName: string;
  motherName: string;
  workExperience: string;
  uploadPhoto: string;
  uploadNID: string;
  uploadCertificates: string;
  submitButton: string;
  contactTitle: string;
  contactSub: string;
  officeHours: string;
  officeHoursVal: string;
}

export const translations: Record<"en" | "bn", TranslationSchema> = {
  en: {
    navHome: "Home",
    navAbout: "About Us",
    navHelpers: "Domestic Helpers",
    navGuards: "Security Guards",
    navPickup: "Pickup Services",
    navNotices: "Notice Board",
    navContact: "Contact",
    navApplyWork: "Apply for Work",
    navHireNow: "Hire Now",
    navAdmin: "Admin Panel",
    heroTitle: "Supreme Quality Manpower & Protection Services",
    heroSub: "Connecting households and enterprises with vetted domestic helpers, professional security protection, and reliable daily transits across Bangladesh.",
    btnHireNow: "Hire Verified Staff",
    btnApplyWork: "Join as Candidate",
    servicesTitle: "Our Core Service Divisions",
    servicesSubtitle: "Professional, reliable, and background-checked support tailored to your security and domestic needs.",
    helpersTitle: "Domestic Helpers",
    helpersDesc: "Vetted Housemaids, Babysitters, Caregivers, and Cleaners for home management.",
    guardsTitle: "Security Guards",
    guardsDesc: "Highly disciplined residential, commercial complex, and elite event protection personnel.",
    pickupTitle: "Pickup Services",
    pickupDesc: "Pre-arranged daily AC transport, corporate shuttles, & school transits with certified drivers.",
    whyChooseUsTitle: "Why Choose Us",
    whyChooseUsSub: "We prioritize security, reliability, and human dignity in all service placements.",
    verifiedStaff: "100% Verified Staff",
    verifiedStaffDesc: "Mandatory biometric record mapping, police clearance checks, and neighborhood reference verifications.",
    exprTeam: "Experienced Team",
    exprTeamDesc: "Professional training modules and work etiquette courses provided before service deployments.",
    affordPrice: "Affordable Pricing",
    affordPriceDesc: "Fully transparent service charging structures with absolutely zero hidden agent feed cuts.",
    support24: "24/7 Priority Support",
    support24Desc: "Direct call and WhatsApp helpline coverage for clients to resolve issues immediately.",
    latestNotices: "Latest Notices & Updates",
    testimonialsTitle: "What Clients Say",
    testimonialsSub: "Real feedback from households and companies who trust our manpower solutions.",
    contactCTATitle: "Need Immediate Services?",
    contactCTASub: "Contact our client relation helpdesks in Dhaka directly or coordinate via live WhatsApp chat.",
    aboutTitle: "About Our Enterprise",
    aboutSub: "Licenced manpower provider bringing safety and employment opportunities to Bangladesh.",
    mission: "Our Mission",
    missionText: "To provide world-class, background-verified security and household manpower solutions while maintaining strict workspace ethics, fair wages, and customer delight.",
    vision: "Our Vision",
    visionText: "To become the most reliable and premium protection and hospitality management marketplace, generating dignified livelihoods for thousands of citizens.",
    statsCandidates: "Total Candidates",
    statsPlacements: "Monthly Placements",
    statsGuards: "Vetted Guards on Duty",
    statsSatisfied: "Satisfied Clients",
    filterTitle: "Filter Listing",
    searchPlaceholder: "Search names, skills, areas, or routes...",
    age: "Age",
    experience: "Experience",
    location: "Location",
    skills: "Key Skills",
    availability: "Availability",
    viewProfile: "View Resume Resume",
    requestContact: "Hire/Request Details",
    applyFormTitle: "Worker Application Form",
    applyFormSub: "Submit your details. Only fully vetted and approved candidates are displayed to customers.",
    requestFormTitle: "Customer Service Request Form",
    requestFormSub: "Let us know your precise requirements. Our coordination desk will call you with matches.",
    fullName: "Full Name",
    phone: "Mobile Phone Number",
    email: "Email Address (Optional)",
    address: "Present Address",
    nid: "National ID Card (NID) Number",
    dob: "Date of Birth",
    fatherName: "Father's Name",
    motherName: "Mother's Name",
    workExperience: "Working Experience",
    uploadPhoto: "Upload Passport Photo",
    uploadNID: "NID Card Copy (PDF/JPG)",
    uploadCertificates: "Certificates / Training proof",
    submitButton: "Submit Form",
    contactTitle: "Contact Us",
    contactSub: "Feel free to drop by our central office or reach us directly at any time.",
    officeHours: "Office Hours",
    officeHoursVal: "Sat - Thu: 9:00 AM - 6:00 PM, Friday Closed"
  },
  bn: {
    navHome: "হোম",
    navAbout: "আমাদের সম্পর্কে",
    navHelpers: "গৃহকর্মী সেবা",
    navGuards: "সিকিউরিটি গার্ড",
    navPickup: "পিকআপ অ্যান্ড ট্রান্সপোর্ট",
    navNotices: "নোটিশ বোর্ড",
    navContact: "যোগাযোগ",
    navApplyWork: "চাকরির আবেদন",
    navHireNow: "কর্মী নিয়োগ করুন",
    navAdmin: "অ্যাডমিন প্যানেল",
    heroTitle: "সেরা মানের জনশক্তি ও নিরাপত্তা সেবা",
    heroSub: "বাংলাদেশে নির্ভরযোগ্য গৃহকর্মী, পেশাদার সিকিউরিটি গার্ড এবং দৈনন্দিন নিরাপদ যাতায়াত ব্যবস্থার একমাত্র বিশ্বস্ত সমাধান।",
    btnHireNow: "ভেরিফাইড কর্মী খুঁজুন",
    btnApplyWork: "প্রার্থী হিসেবে যোগ দিন",
    servicesTitle: "আমাদের সেবা সমূহ",
    servicesSubtitle: "আপনার নিরাপত্তা এবং পারিবারিক প্রয়োজনে সঠিকভাবে দক্ষ ও ভেরিফাইড জনশক্তির যোগান।",
    helpersTitle: "গৃহকর্মী ও কেয়ারগিভার",
    helpersDesc: "বাসার টুকিটাকি কাজে দক্ষ গৃহকর্মী, অভিজ্ঞ বেবিসিটার ও প্রবীণদের সেবায় কেয়ারগিভার।",
    guardsTitle: "নিরাপত্তা কর্মী",
    guardsDesc: "আবাসিক এলাকা, বাণিজ্যিক কমপ্লেক্স ও বড় ইভেন্টের জন্য সুপ্রশিক্ষিত নিরাপত্তা প্রহরী।",
    pickupTitle: "পিকআপ অ্যান্ড যাতায়াত",
    pickupDesc: "অভিজ্ঞ ড্রাইভার সহ অফিস বা স্কুলের জন্য দৈনিক সিডিউল ভিত্তিক নিরাপদ মাইক্রোবাস ও কার সার্ভিস।",
    whyChooseUsTitle: "কেন আমাদের বেছে নেবেন?",
    whyChooseUsSub: "নিরাপত্তা, সততা ও মানবিক মর্যাদাকে আমরা সর্বোচ্চ প্রাধান্য দিয়ে থাকি।",
    verifiedStaff: "শতভাগ ভেরিফাইড স্টাফ",
    verifiedStaffDesc: "পুলিশ ভেরিফিকেশন, বায়োমেট্রিক আইডি ম্যাপিং এবং স্থানীয় চেয়ারম্যান ক্লিয়ারেন্স সার্টিফিকেট বাধ্যতামূলক।",
    exprTeam: "প্রশিক্ষণপ্রাপ্ত সুদক্ষ টিম",
    exprTeamDesc: "কাজে নিয়োগের পূর্বে আচরণ, নিয়মানুবর্তিতা এবং পেশাগত কাজের বিশেষ ট্রেনিং প্রদান করা হয়।",
    affordPrice: "স্বচ্ছ ও সাশ্রয়ী মূল্য",
    affordPriceDesc: "সকল ধরনের চার্জ এবং পেমেন্ট পলিসি একদম উন্মুক্ত ও স্বচ্ছ, কোনো গোপন ফি নেই।",
    support24: "২৪/৭ সার্বক্ষণিক সহায়তা",
    support24Desc: "যেকোনো জরুরি প্রয়োজনে আমাদের হটলাইন ও সরাসরি হোয়াটসঅ্যাপে তাৎক্ষণিক সেবা।",
    latestNotices: "সর্বশেষ নোটিশ ও আপডেট",
    testimonialsTitle: "গ্রাহকদের মতামত",
    testimonialsSub: "আমাদের কর্মীবাহিনীর পেশাদারিত্বে সন্তুষ্ট গ্রাহকদের কিছু বাস্তব প্রতিক্রিয়া।",
    contactCTATitle: "জরুরি সেবা লাগবে?",
    contactCTASub: "আমাদের ঢাকা সদর দপ্তরে সরাসরি ফোন করুন অথবা হোয়াটসঅ্যাপে সাথে সাথে চ্যাট শুরু করুন।",
    aboutTitle: "আমাদের প্রতিষ্ঠান পরিচিতি",
    aboutSub: "গণপ্রজাতন্ত্রী বাংলাদেশ সরকার অনুমোদিত বিশ্বস্ত লাইসেন্সপ্রাপ্ত আধুনিক জনশক্তি আউটসোর্সিং প্রতিষ্ঠান।",
    mission: "আমাদের লক্ষ্য",
    missionText: "পেশাদারি সততা বজায় রেখে, কর্মীদের ন্যায্য মজুরি নিশ্চিত করে বাংলাদেশের ঘরে ঘরে ও ব্যবসা প্রতিষ্ঠানে সেরা সেবা ও নিরাপত্তা নিশ্চিত করা।",
    vision: "আমাদের স্বপ্ন",
    visionText: "নিরাপদ কর্মসংস্থান সৃষ্টির মাধ্যমে হাজারো মানুষের সচ্ছল জীবনযাপন গড়ে তোলা এবং দেশের ১ নম্বর সেবামূলক প্ল্যাটফর্ম হিসেবে প্রতিষ্ঠিত হওয়া।",
    statsCandidates: "মোট নিবন্ধিত প্রার্থী",
    statsPlacements: "সফল মাসিক নিয়োগ",
    statsGuards: "অন-ডিউটি গার্ড সংখ্যা",
    statsSatisfied: "সন্তুষ্ট গ্রাহক পরিবার",
    filterTitle: "ফিল্টার করুন",
    searchPlaceholder: "নাম, দক্ষতা, এলাকা বা রুট দিয়ে খুঁজুন...",
    age: "বয়স",
    experience: "অভিজ্ঞতা",
    location: "অবস্থান / এলাকা",
    skills: "প্রধান দক্ষতা সমূহ",
    availability: "কাজের সময়সূচী",
    viewProfile: "জীবনবৃত্তান্ত দেখুন",
    requestContact: "নিয়োগ আবেদনপত্র",
    applyFormTitle: "অনলাইন প্রার্থীর আবেদন ফরম",
    applyFormSub: "সঠিক তথ্য প্রদান করে ফরমটি পূরণ করুন। আমাদের যাচাইকরণ শেষে ভেরিফাইড হলে প্রোফাইলটি ওয়েবসাইটে প্রদর্শিত হবে।",
    requestFormTitle: "পেশাদার কর্মী সরাসরি নিয়োগ ফরম",
    requestFormSub: "আপনার সুনির্দিষ্ট প্রয়োজনের কথা জানান। আমাদের কাস্টমার কেয়ার টিম দ্রুততম সময়ে যোগ্য প্রার্থীদের তালিকা সহ কল করবে।",
    fullName: "আবেদনকারীর পূর্ণ নাম",
    phone: "মোবাইল ফোন নম্বর",
    email: "ইমেইল এড্রেস (ঐচ্ছিক)",
    address: "বর্তমান ঠিকানা",
    nid: "জাতীয় পরিচয়পত্র (NID) নম্বর",
    dob: "জন্ম তারিখ",
    fatherName: "পিতার নাম",
    motherName: "মাতার নাম",
    workExperience: "কাজের বাস্তব অভিজ্ঞতা",
    uploadPhoto: "পাসপোর্ট সাইজ ছবি আপলোড করুন",
    uploadNID: "এনআইডি কার্ডের কপি দিন",
    uploadCertificates: "প্রশিক্ষণ বা কাজের প্রশংসাপত্র",
    submitButton: "আবেদন জমা দিন",
    contactTitle: "যোগাযোগ করুন",
    contactSub: "সরাসরি অফিসে এসে যোগাযোগ করতে পারেন অথবা যেকোনো জরুরি প্রয়োজনে ফোন করুন।",
    officeHours: "অফিস সময়সূচী",
    officeHoursVal: "শনিবার - বৃহস্পতিবার: সকাল ৯:০০ - সন্ধ্যা ৬:০০, শুক্রবার বন্ধ"
  }
};
