import { useState } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Services from "./components/Services";
import Sandbox from "./components/Sandbox";
import RoiEstimator from "./components/RoiEstimator";
import LeadForm from "./components/LeadForm";
import Dashboard from "./components/Dashboard";
import Footer from "./components/Footer";

export default function App() {
  const [selectedAgentId, setSelectedAgentId] = useState("web_chatbot");
  const [preFilledBudget, setPreFilledBudget] = useState("");
  const [preFilledNotes, setPreFilledNotes] = useState("");
  const [preFilledRoi, setPreFilledRoi] = useState<number | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleSelectAgent = (agentId: string) => {
    setSelectedAgentId(agentId);
  };

  const handlePreFillForm = (budget: string, notes: string, roi: number) => {
    setPreFilledBudget(budget);
    setPreFilledNotes(notes);
    setPreFilledRoi(roi);
  };

  const handleFormSubmitted = () => {
    // Increment trigger to signal Dashboard to refresh its inquiry data
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 selection:bg-emerald-500/30 selection:text-white antialiased transition-colors duration-200">
      <Navbar />
      <main>
        {/* Hero Section */}
        <Hero />

        {/* Services & Offerings List */}
        <Services onSelectAgent={handleSelectAgent} />

        {/* Live Interactive Chat Sandbox */}
        <Sandbox 
          selectedAgentId={selectedAgentId} 
          onSelectAgentId={handleSelectAgent} 
        />

        {/* Interactive ROI Calculator */}
        <RoiEstimator onPreFillForm={handlePreFillForm} />

        {/* Lead/Order Placement Capture Form */}
        <LeadForm 
          preFilledBudget={preFilledBudget}
          preFilledNotes={preFilledNotes}
          preFilledRoi={preFilledRoi}
          onFormSubmitted={handleFormSubmitted}
        />

        {/* Real-time Operator Client Dashboard */}
        <Dashboard refreshTrigger={refreshTrigger} />
      </main>
      <Footer />
    </div>
  );
}

