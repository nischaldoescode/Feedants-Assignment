// screen translations
export const copy = {
  en: {
    goBack: "Go back",
    registered: "Registered",
    certificate: "Winners get certificate",
    prizePool: "Prize Pool",
    entryFee: "Entry Fee",
    spotsLeft: "Only {count} spots left",
    booked: "{booked} / {total} Booked",
    judge: "Judge",
    introVideo: "Intro Video",
    registrationClosed: "Registration closed",
    registrationClosesIn: "Registration closes in",
    hurry: "Hurry up!",
    done: "Done",
    importantDates: "Important Dates",
    registerBefore: "Register Before",
    submissionStarts: "Submission Starts",
    submissionEnds: "Submission Ends",
    resultDate: "Result Date",
    previousWinners: "Previous Winners",
    rewards: "Rewards",
    allPositions: "(All Positions)",
    disclaimer: "Disclaimer:",
    copyLink: "Copy Link",
    referNow: "Refer Now",
    earnEverySignup: "You earn ₹{amount} for every signup",
    adHere: "Ad Here",
    cancelRegistration: "Cancel registration",
    performanceTitle: "Performance title",
    videoLink: "Video link",
    notesForJudge: "Notes for judge",
    updateSubmission: "Update Submission",
    registerNow: "Register Now",
    completePayment: "Complete Payment",
    viewResults: "View Results",
    registeredWaiting: "Registered",
    judging: "Judging In Progress",
    joinWaitlist: "Join Waitlist",
    registrationSoon: "Registration Soon",
    registrationClosedAction: "Registration Closed",
    unavailable: "Unavailable",
    uploadSubmission: "Upload Submission",
    submitEntry: "Submit Entry",
    updateEntry: "Update Entry",
    titleError: "Add a clear title for your performance.",
    urlError: "Paste a valid http or https video link.",
    savedTitle: "Submission saved",
    savedBody: "Your entry is ready for judging.",
    actionFailed: "Action failed",
    registeredTitle: "Registered",
    registeredBody: "Your spot is booked.",
    resultsTitle: "Results",
    resultsBody: "Results will open from this action in production.",
    paymentTitle: "Payment pending",
    paymentBody: "The backend is ready for a payment provider webhook.",
    cancelTitle: "Cancel registration",
    cancelBody: "Your booked spot will be released for another participant.",
    keepRegistration: "Keep registration",
    cancellationFailed: "Cancellation failed",
    home: "Home",
    explore: "Explore",
    create: "Create",
    competitions: "Competitions",
    profile: "Profile",
  },
  hi: {
    goBack: "वापस जाएं",
    registered: "पंजीकृत",
    certificate: "विजेताओं को प्रमाणपत्र मिलेगा",
    prizePool: "पुरस्कार राशि",
    entryFee: "प्रवेश शुल्क",
    spotsLeft: "केवल {count} स्थान बचे",
    booked: "{booked} / {total} बुक",
    judge: "निर्णायक",
    introVideo: "परिचय वीडियो",
    registrationClosed: "पंजीकरण बंद",
    registrationClosesIn: "पंजीकरण बंद होने में",
    hurry: "जल्दी करें!",
    done: "पूरा",
    importantDates: "महत्वपूर्ण तिथियां",
    registerBefore: "इससे पहले पंजीकरण",
    submissionStarts: "सबमिशन शुरू",
    submissionEnds: "सबमिशन समाप्त",
    resultDate: "परिणाम तिथि",
    previousWinners: "पिछले विजेता",
    rewards: "पुरस्कार",
    allPositions: "(सभी स्थान)",
    disclaimer: "सूचना:",
    copyLink: "लिंक कॉपी करें",
    referNow: "अभी रेफर करें",
    earnEverySignup: "हर साइनअप पर ₹{amount} मिलेंगे",
    adHere: "विज्ञापन यहां",
    cancelRegistration: "पंजीकरण रद्द करें",
    performanceTitle: "प्रदर्शन शीर्षक",
    videoLink: "वीडियो लिंक",
    notesForJudge: "निर्णायक के लिए नोट्स",
    updateSubmission: "सबमिशन अपडेट करें",
    registerNow: "अभी पंजीकरण करें",
    completePayment: "भुगतान पूरा करें",
    viewResults: "परिणाम देखें",
    registeredWaiting: "पंजीकृत",
    judging: "जजिंग जारी है",
    joinWaitlist: "वेटलिस्ट में जुड़ें",
    registrationSoon: "पंजीकरण जल्द",
    registrationClosedAction: "पंजीकरण बंद",
    unavailable: "उपलब्ध नहीं",
    uploadSubmission: "सबमिशन अपलोड करें",
    submitEntry: "एंट्री जमा करें",
    updateEntry: "एंट्री अपडेट करें",
    titleError: "अपने प्रदर्शन के लिए साफ शीर्षक जोड़ें.",
    urlError: "मान्य http या https वीडियो लिंक डालें.",
    savedTitle: "सबमिशन सेव हुआ",
    savedBody: "आपकी एंट्री जजिंग के लिए तैयार है.",
    actionFailed: "कार्रवाई विफल",
    registeredTitle: "पंजीकरण हुआ",
    registeredBody: "आपका स्थान बुक हो गया.",
    resultsTitle: "परिणाम",
    resultsBody: "प्रोडक्शन में यह बटन परिणाम खोलेगा.",
    paymentTitle: "भुगतान लंबित",
    paymentBody: "बैकएंड भुगतान वेबहुक के लिए तैयार है.",
    cancelTitle: "पंजीकरण रद्द करें",
    cancelBody: "आपका बुक किया गया स्थान दूसरे प्रतिभागी के लिए खुल जाएगा.",
    keepRegistration: "पंजीकरण रखें",
    cancellationFailed: "रद्द नहीं हो पाया",
    home: "होम",
    explore: "एक्सप्लोर",
    create: "बनाएं",
    competitions: "प्रतियोगिताएं",
    profile: "प्रोफाइल",
  },
};

// pick translation by language

export function pickCopy(language) {
  return copy[language] || copy.en;
}

// replace translation placeholders

export function fill(template, values) {
  return Object.entries(values).reduce(
    (message, [key, value]) => message.replace(`{${key}}`, String(value)),
    template,
  );
}

// map action types to translated labels

export function actionCopy(action, text) {
  const labels = {
    register: text.registerNow,
    upload_submission: text.uploadSubmission,
    update_submission: text.updateSubmission,
    complete_payment: text.completePayment,
    view_results: text.viewResults,
    registered_waiting: text.registeredWaiting,
    judging: text.judging,
    full: text.joinWaitlist,
    not_open: text.registrationSoon,
    closed: text.registrationClosedAction,
    unavailable: text.unavailable,
  };

  return {
    ...action,
    label: labels[action.kind] || action.label,
  };
}
// translate competition content

export function localizeCompetition(competition, language) {
  if (language !== "hi") {
    return competition;
  }

  // hindi-only competition content
  const tabCopy = {
    about: {
      label: "प्रतियोगिता के बारे में",
      body: "यह ऑनलाइन शास्त्रीय नृत्य प्रतियोगिता सभी आयु वर्गों के लिए खुली है. कहीं से भी भाग लें और अपनी प्रतिभा दिखाएं. पारंपरिक नृत्य से अपना जुनून व्यक्त करें.",
    },
    judging: {
      label: "जजिंग पैरामीटर",
      body: "एंट्री को ताल, अभिव्यक्ति, मुद्रा, पोशाक की साफ-सफाई, कैमरा फ्रेमिंग और प्रस्तुति के प्रभाव के आधार पर आंका जाएगा.",
    },
    rules: {
      label: "नियम और पात्रता",
      body: "एक मौलिक सोलो प्रदर्शन जमा करें. वीडियो साफ होना चाहिए, पांच मिनट से कम होना चाहिए, और सबमिशन समय खत्म होने से पहले अपलोड होना चाहिए.",
    },
  };
  // hindi reward names
  const rewardTitles = {
    1: "पहला विजेता",
    2: "दूसरा विजेता",
    3: "तीसरा विजेता",
    4: "चौथा विजेता",
    5: "पांचवां विजेता",
    6: "छठा विजेता",
  };

  return {
    ...competition,
    title: "फीडैंट्स शास्त्रीय नृत्य",
    tags: ["नृत्य", "मल्टी-विन"],
    tabs: competition.tabs.map((tab) => ({
      ...tab,
      ...(tabCopy[tab.key] || {}),
    })),
    rewards: competition.rewards.map((reward) => ({
      ...reward,
      title: rewardTitles[reward.rank] || reward.title,
    })),
    previousWinners: competition.previousWinners.map((winner) => ({
      ...winner,
      position: winner.position
        .replace("1st Winner", "पहला विजेता")
        .replace("2nd Winner", "दूसरा विजेता")
        .replace("3rd Winner", "तीसरा विजेता"),
    })),
    disclaimer:
      "केवल भुगतान करने वाले प्रतिभागियों की एंट्री जजिंग के लिए मानी जाएगी.",
    referral: {
      ...competition.referral,
      discountText: "रेफर करें और अधिक छूट पाएं",
    },
    supportVideo: {
      ...competition.supportVideo,
      title: "आपको पुरस्कार राशि कैसे मिलेगी?",
      subtitle: "जानने के लिए वीडियो देखें",
    },
    trustItems: competition.trustItems.map((item, index) => ({
      ...item,
      label: index === 0 ? "रिफंड नीति" : "सुरक्षित भुगतान",
      value:
        index === 0
          ? "सबमिशन शुरू होने से पहले रिफंड उपलब्ध"
          : "Razorpay द्वारा संचालित",
    })),
    testimonialSummary: {
      title: "हमारे यूजर्स की राय",
      subtitle: "देखें प्रतिभागी Feedants के बारे में क्या कहते हैं",
    },
  };
}
