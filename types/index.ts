export type ServiceCategory =
  | "hospital"
  | "police"
  | "passport"
  | "municipal"
  | "school"
  | "blood-bank"
  | "post-office"
  | "fire-station"
  | "phc";

export interface CivicService {
  id: string;
  name: string;
  category: ServiceCategory;
  lat: number;
  lng: number;
  address: string;
  distanceKm: number;
  openHours: string;
  phone?: string;
  rating?: number;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string | any;
  timestamp: number;
}

export interface SuggestedPrompt {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export interface ChatRequestBody {
  message: string;
  context?: string;
  language?: string;
}

export interface ChatResponseBody {
  reply: unknown;
}

export interface DocumentsRequestBody {
  serviceName: string;
  context?: string;
  language?: string;
}

export interface DocumentsResponseBody {
  error?: string;
  requiredDocuments?: string[];
  estimatedFees?: string;
  processingTime?: string;
  importantTips?: string[];
  timeline?: Record<string, string>;
  reply: unknown;
}

export const CATEGORY_META: Record<
  ServiceCategory,
  { label: string; color: string; icon: string }
> = {
  hospital: { label: "Government Hospital", color: "#EF4444", icon: "hospital" },
  police: { label: "Police Station", color: "#2563EB", icon: "shield" },
  passport: { label: "Passport Office", color: "#06B6D4", icon: "book-user" },
  municipal: { label: "Municipal Office", color: "#8B5CF6", icon: "landmark" },
  school: { label: "Government School", color: "#F59E0B", icon: "school" },
  "blood-bank": { label: "Blood Bank", color: "#DC2626", icon: "droplet" },
  "post-office": { label: "Post Office", color: "#0EA5E9", icon: "mail" },
  "fire-station": { label: "Fire Station", color: "#F97316", icon: "flame" },
  phc: { label: "Primary Health Centre", color: "#10B981", icon: "heart-pulse" },
};
