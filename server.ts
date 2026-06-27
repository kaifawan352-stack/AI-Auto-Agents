import express from "express";
import path from "path";
import fs from "fs/promises";
import { fileURLToPath } from "url";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Path helper for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Inquiries database path
const INQUIRIES_FILE = path.join(__dirname, "data-inquiries.json");

// Safe lazy initializer for Gemini API client
let genAIClient: GoogleGenAI | null = null;
function getGenAI(): GoogleGenAI {
  if (!genAIClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      throw new Error("GEMINI_API_KEY environment variable is required but missing. Please add it via the Settings > Secrets panel.");
    }
    genAIClient = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return genAIClient;
}

// Robust fallback mechanism for model generation to handle temporary demand spikes
async function generateContentWithFallback(ai: GoogleGenAI, config: any) {
  const models = ["gemini-3.5-flash", "gemini-flash-latest", "gemini-3.1-flash-lite"];
  let lastError: any = null;

  for (const model of models) {
    try {
      console.log(`Attempting Gemini generation using model: ${model}`);
      const response = await ai.models.generateContent({
        ...config,
        model: model
      });
      console.log(`Gemini generation succeeded with model: ${model}`);
      return response;
    } catch (error: any) {
      console.warn(`Model ${model} failed:`, error.message || error);
      lastError = error;
      
      // If error indicates an API key failure (e.g. invalid API key, 403, 400 bad API key), 
      // do not continue to try other models as it's a structural key issue.
      const msg = (error.message || "").toLowerCase();
      if (msg.includes("api key") || msg.includes("api_key") || msg.includes("key is invalid") || msg.includes("unauthorized")) {
        break;
      }
    }
  }
  throw lastError;
}

// Ensure database file exists
async function initInquiriesFile() {
  try {
    await fs.access(INQUIRIES_FILE);
  } catch {
    await fs.writeFile(INQUIRIES_FILE, JSON.stringify([], null, 2));
  }
}

// 1. Chat Sandbox Endpoint
app.post("/api/chat", async (req, res) => {
  const { agentType, messages } = req.body;

  if (!agentType || !messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: "Missing agentType or messages array." });
  }

  try {
    const ai = getGenAI();

    // Mapping agent types to custom system instructions
    const systemInstructions: Record<string, string> = {
      web_chatbot: `You are 'SiteAgent', the official website chatbot for 'AI Auto Agents'. 
Your goal is to explain how AI Auto Agents builds custom web chatbots that automate 24/7 client support, capture leads, and slash support ticket volumes by up to 70%.
Keep responses warm, professional, and relatively brief (1-3 sentences).
Encourage the user to fill out the Lead Form at the bottom of the page or play with our pricing/ROI calculator!`,

      whatsapp_insta: `You are 'SocialAgent', a WhatsApp & Instagram conversational expert for 'AI Auto Agents'.
You speak in an enthusiastic, modern, and friendly tone. Use 1-2 relevant emojis per message to keep things engaging.
Keep responses very punchy and short (maximum 2-3 sentences), perfectly styled for mobile messaging bubbles.
Focus on explaining how we connect AI directly to Meta APIs to automate DM replies, recover abandoned carts, and turn story replies into qualified buyers.
Politely offer to book an expert call by asking for their WhatsApp number or Email.`,

      email_chatbot: `You are 'InboxAgent', an incredibly skilled cold outbound and inbound email strategist for 'AI Auto Agents'.
Your tone is professional, strategic, and high-impact.
Your goal is to show off your email drafting capabilities. Ask the user briefly what they sell and who their target client is.
Once they provide details, write a compelling, concise, and highly personalized cold outbound email template (including an eye-catching Subject Line) that they can use immediately.`,

      b2b_leadgen: `You are 'LeadScout', an autonomous B2B Lead Generation specialist.
You help companies discover, enrich, and contact fresh prospects automatically without manual databases.
Your tone is consultive, intelligent, and ROI-driven.
Ask the user what industry they are in and their ideal client profile. Then outline a brief, high-level, 3-step automated funnel we could deploy for them (e.g., automated LinkedIn sourcing, personalized enrichment, and AI-tailored outreach).`,

      lead_qualification: `You are 'BANT Qualify Agent', a quick diagnostic auditor for lead flows.
Your goal is to run a fun, hyper-speed 3-question audit to evaluate if AI agency systems can scale the user's business.
If the user is just starting, ask them:
1) What is your average product/service ticket price?
2) Approximately how many manual inquiries or leads do you get per month?
3) What is your biggest bottleneck (e.g., response time, manual booking, unqualified spammers)?
Analyze their response and provide a simulated 'Automation Viability Score' (e.g., 85/100) and a brief 2-sentence expert action recommendation. Keep it encouraging and direct.`
    };

    const activeInstruction = systemInstructions[agentType] || "You are a helpful AI agent representative for AI Auto Agents.";

    // Convert client message format into Gemini contents format
    // Filter to handle standard roles and match expected schema
    const contents = messages.map((m: { role: string; content: string }) => {
      return {
        role: m.role === "assistant" ? "model" : "user",
        parts: [{ text: m.content }]
      };
    });

    const response = await generateContentWithFallback(ai, {
      contents: contents,
      config: {
        systemInstruction: activeInstruction,
        temperature: 0.7,
      }
    });

    const replyText = response.text || "I'm processing your request. Let me think about that.";
    res.json({ reply: replyText });

  } catch (error: any) {
    console.error("Gemini API Error:", error);
    res.status(500).json({ 
      error: error.message || "An error occurred while communicating with the AI agent." 
    });
  }
});

// 2. Lead/Inquiry Submission Endpoint
app.post("/api/inquiries", async (req, res) => {
  const { name, email, company, phone, selectedAgent, notes, budget, roiEstimated } = req.body;

  if (!name || !email) {
    return res.status(400).json({ error: "Name and email are required." });
  }

  try {
    await initInquiriesFile();
    const dataStr = await fs.readFile(INQUIRIES_FILE, "utf-8");
    const inquiries = JSON.parse(dataStr);

    const newInquiry = {
      id: `inq_${Date.now()}`,
      name,
      email,
      company: company || "N/A",
      phone: phone || "N/A",
      selectedAgent: selectedAgent || "General Chatbot",
      notes: notes || "",
      budget: budget || "Not Specified",
      roiEstimated: roiEstimated || null,
      submittedAt: new Date().toISOString(),
      status: "New"
    };

    inquiries.push(newInquiry);
    await fs.writeFile(INQUIRIES_FILE, JSON.stringify(inquiries, null, 2));

    res.status(201).json({ success: true, inquiry: newInquiry });
  } catch (error: any) {
    console.error("Error saving inquiry:", error);
    res.status(500).json({ error: "Failed to store submission." });
  }
});

// 3. Get Saved Inquiries (to showcase live Client Admin Dashboard / proposals)
app.get("/api/inquiries", async (req, res) => {
  try {
    await initInquiriesFile();
    const dataStr = await fs.readFile(INQUIRIES_FILE, "utf-8");
    const inquiries = JSON.parse(dataStr);
    res.json(inquiries);
  } catch (error: any) {
    console.error("Error fetching inquiries:", error);
    res.status(500).json({ error: "Failed to read submissions." });
  }
});

// 4. Vite Dev/Prod Setup
async function setupVite() {
  await initInquiriesFile();

  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`AI Auto Agents server running on http://0.0.0.0:${PORT}`);
  });
}

setupVite().catch((err) => {
  console.error("Failed to start server:", err);
});
