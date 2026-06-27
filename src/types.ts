export interface AgentProfile {
  id: string;
  name: string;
  title: string;
  description: string;
  badge: string;
  platform: "WhatsApp" | "Instagram" | "Email" | "Web" | "B2B Outreach";
  suggestedPrompts: string[];
  avatarColor: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

export interface ClientInquiry {
  id: string;
  name: string;
  email: string;
  company: string;
  phone: string;
  selectedAgent: string;
  notes: string;
  budget: string;
  roiEstimated?: number | null;
  submittedAt: string;
  status: "New" | "Reviewed" | "In Contact";
}
