export const translations = {
  English: {
    navbar: {
      platform: "Platform",
      howItWorks: "How it works",
      services: "Services",
      openDashboard: "Open Dashboard",
    },
    footer: {
      platform: "Platform",
      services: "Services",
      legal: "Legal",
      contact: "Contact",
      privacy: "Privacy Policy",
      terms: "Terms of Service",
      disclaimer: "Government Disclaimer: This is an AI-powered assistant. Please verify critical information with official government sources.",
    },
    dashboard: {
      searchPlaceholder: "Search: nearest passport office, blood bank...",
      currentLocation: "Current Location",
      allServices: "All Services",
    },
    sidebar: {
      title: "Civic AI Assistant",
      active: "Active",
      greeting: "Namaste 👋",
      intro: "I can help you understand documents, find offices, and complete government processes in your preferred language.",
      suggestedQuestions: "Suggested Questions",
      quickActions: "Quick Actions",
      recentQueries: "Recent Queries",
      explainOffice: "Explain Office",
      nearbyInfo: "Nearby Info",
      documentHelp: "Document Help",
      askPlaceholder: "Ask AI in English...",
      thinking: "Thinking in English...",
      q1: "How to get a Ration Card?",
      q2: "Apply for Senior Citizen Certificate",
      q3: "What is the procedure for a Marriage Certificate?",
    },
    quickActions: {
      findServices: "Find Services",
      findServicesDesc: "Search local civic offices & locations",
      reportIssue: "Report Issue",
      reportIssueDesc: "File civic complaints with GenAI reporter",
      findSchemes: "Find Schemes",
      findSchemesDesc: "Personalized government scheme matches",
      docs: "Document Assistant",
      docsDesc: "Required docs, fees & procedures",
      journey: "Citizen Journey",
      journeyDesc: "AI mapped step-by-step roadmap",
      emergency: "Emergency Services",
      emergencyDesc: "Immediate national helpline directory",
      emergencyTitle: "Emergency Helpline Directory",
      emergencyDesc2: "These are official direct-dial helpline numbers operating in India. Tap to dial.",
      close: "Close"
    }
  },
  Hindi: {
    navbar: {
      platform: "प्लेटफ़ॉर्म",
      howItWorks: "यह कैसे काम करता है",
      services: "सेवाएं",
      openDashboard: "डैशबोर्ड खोलें",
    },
    footer: {
      platform: "प्लेटफ़ॉर्म",
      services: "सेवाएं",
      legal: "कानूनी",
      contact: "संपर्क",
      privacy: "गोपनीयता नीति",
      terms: "सेवा की शर्तें",
      disclaimer: "सरकारी अस्वीकरण: यह एक एआई-संचालित सहायक है। कृपया आधिकारिक सरकारी स्रोतों से महत्वपूर्ण जानकारी को सत्यापित करें।",
    },
    dashboard: {
      searchPlaceholder: "खोजें: निकटतम पासपोर्ट कार्यालय, ब्लड बैंक...",
      currentLocation: "वर्तमान स्थान",
      allServices: "सभी सेवाएं",
    },
    sidebar: {
      title: "नागरिक एआई सहायक",
      active: "सक्रिय",
      greeting: "नमस्ते 👋",
      intro: "मैं आपको दस्तावेज़ समझने, कार्यालय खोजने और सरकारी प्रक्रियाओं को आपकी पसंदीदा भाषा में पूरा करने में मदद कर सकता हूँ।",
      suggestedQuestions: "सुझाए गए प्रश्न",
      quickActions: "त्वरित कार्रवाई",
      recentQueries: "हाल के प्रश्न",
      explainOffice: "कार्यालय के बारे में बताएं",
      nearbyInfo: "आसपास की जानकारी",
      documentHelp: "दस्तावेज़ सहायता",
      askPlaceholder: "हिंदी में एआई से पूछें...",
      thinking: "हिंदी में सोच रहा है...",
      q1: "राशन कार्ड कैसे प्राप्त करें?",
      q2: "वरिष्ठ नागरिक प्रमाण पत्र के लिए आवेदन करें",
      q3: "विवाह प्रमाण पत्र के लिए क्या प्रक्रिया है?",
    },
    quickActions: {
      findServices: "सेवाएं खोजें",
      findServicesDesc: "स्थानीय नागरिक कार्यालय और स्थान खोजें",
      reportIssue: "समस्या दर्ज करें",
      reportIssueDesc: "GenAI रिपोर्टर के साथ नागरिक शिकायतें दर्ज करें",
      findSchemes: "योजनाएं खोजें",
      findSchemesDesc: "व्यक्तिगत सरकारी योजना मिलान",
      docs: "दस्तावेज़ सहायक",
      docsDesc: "आवश्यक दस्तावेज़, शुल्क और प्रक्रियाएं",
      journey: "नागरिक यात्रा",
      journeyDesc: "एआई द्वारा तैयार चरण-दर-चरण रोडमैप",
      emergency: "आपातकालीन सेवाएं",
      emergencyDesc: "तत्काल राष्ट्रीय हेल्पलाइन निर्देशिका",
      emergencyTitle: "आपातकालीन हेल्पलाइन निर्देशिका",
      emergencyDesc2: "ये भारत में संचालित आधिकारिक डायरेक्ट-डायल हेल्पलाइन नंबर हैं। डायल करने के लिए टैप करें।",
      close: "बंद करें"
    }
  }
};

export type TranslationKey = keyof typeof translations.English;
export function getTranslation(lang: "English" | "Hindi") {
  return translations[lang] || translations.English;
}
