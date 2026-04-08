import React from "react";

interface SidebarProps {
  activeTab: "needs" | "volunteers" | "match";
  onChangeTab: (tab: "needs" | "volunteers" | "match") => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, onChangeTab }) => {
  const tabs = [
    { id: "needs" as const, label: "NGO Needs" },
    { id: "volunteers" as const, label: "Volunteers" },
    { id: "match" as const, label: "Match" },
  ];

  return (
    <div className="w-64 bg-slate-800 border-r border-slate-700">
      <div className="p-4">
        <h1 className="text-xl font-bold mb-6">Hackathon App</h1>
        <nav className="space-y-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onChangeTab(tab.id)}
              className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
                activeTab === tab.id
                  ? "bg-sky-600 text-white"
                  : "text-slate-300 hover:bg-slate-700"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
