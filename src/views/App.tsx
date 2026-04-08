import React, { useState } from "react";
import Layout from "../components/Layout";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import type { Need, Volunteer, MatchResult } from "../types";
import NgoNeedView from "./NgoNeedView";
import VolunteerView from "./VolunteerView";
import MatchView from "./MatchView";

type Tab = "needs" | "volunteers" | "match";

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>("needs");
  const [needs, setNeeds] = useState<Need[]>([]);
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [matches, setMatches] = useState<MatchResult[]>([]);

  const renderContent = () => {
    if (activeTab === "needs") {
      return <NgoNeedView needs={needs} setNeeds={setNeeds} />;
    }
    if (activeTab === "volunteers") {
      return (
        <VolunteerView
          volunteers={volunteers}
          setVolunteers={setVolunteers}
        />
      );
    }
    return (
      <MatchView
        needs={needs}
        volunteers={volunteers}
        matches={matches}
        setMatches={setMatches}
      />
    );
  };

  return (
    <Layout>
      <div className="flex h-screen">
        <Sidebar
          activeTab={activeTab}
          onChangeTab={setActiveTab}
        />
        <div className="flex-1 flex flex-col">
          <Topbar />
          <main className="flex-1 overflow-y-auto bg-slate-950">
            {renderContent()}
          </main>
        </div>
      </div>
    </Layout>
  );
};

export default App;