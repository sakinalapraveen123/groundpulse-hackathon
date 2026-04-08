import React, { useState } from "react";
import type { Volunteer } from "../types";

interface Props {
  volunteers: Volunteer[];
  setVolunteers: (v: Volunteer[]) => void;
}

const VolunteerView: React.FC<Props> = ({ volunteers, setVolunteers }) => {
  const [name, setName] = useState("");
  const [skills, setSkills] = useState("");
  const [location, setLocation] = useState("");
  const [maxDistanceKm, setMaxDistanceKm] = useState(5);

  const handleAdd = () => {
    if (!name || !location) {
      alert("Name and location are required.");
      return;
    }
    const v: Volunteer = {
      id: crypto.randomUUID(),
      name,
      skills: skills
        .split(",")
        .map((s: string) => s.trim())
        .filter(Boolean),
      location,
      maxDistanceKm,
      availability: "Flexible",
      languages: []
    };
    setVolunteers([v, ...volunteers]);
    setName("");
    setSkills("");
    setLocation("");
    setMaxDistanceKm(5);
  };

  return (
    <div className="p-6">
      <h2 className="text-lg font-semibold mb-3">Volunteer Directory</h2>
      <input
        className="w-full border rounded-md p-2 mb-2 bg-slate-950 border-slate-700 text-slate-50"
        placeholder="Volunteer name"
        value={name}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
      />
      <input
        className="w-full border rounded-md p-2 mb-2 bg-slate-950 border-slate-700 text-slate-50"
        placeholder="Location (area / city)"
        value={location}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLocation(e.target.value)}
      />
      <input
        className="w-full border rounded-md p-2 mb-2 bg-slate-950 border-slate-700 text-slate-50"
        placeholder="Skills (comma separated)"
        value={skills}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSkills(e.target.value)}
      />
      <input
        type="number"
        className="w-full border rounded-md p-2 mb-2 bg-slate-950 border-slate-700 text-slate-50"
        placeholder="Max distance (km)"
        value={maxDistanceKm}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setMaxDistanceKm(Number(e.target.value))}
      />
      <button
        className="px-3 py-1 text-xs rounded-full bg-emerald-500 hover:bg-emerald-600"
        onClick={handleAdd}
      >
        Add Volunteer
      </button>

      <p className="mt-4 text-xs text-slate-400">
        {volunteers.length} volunteers registered
      </p>
    </div>
  );
};

export default VolunteerView;