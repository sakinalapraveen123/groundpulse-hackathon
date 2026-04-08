import React, { useState } from "react";
import type { Need, Volunteer, MatchResult } from "../types";
import { rankVolunteersForNeed } from "../lib/geminiClient";

interface Props {
  needs: Need[];
  volunteers: Volunteer[];
  matches: MatchResult[];
  setMatches: (m: MatchResult[]) => void;
}

const MatchView: React.FC<Props> = ({
  needs,
  volunteers,
  matches,
  setMatches
}) => {
  const [selectedNeedId, setSelectedNeedId] = useState("");
  const [loading, setLoading] = useState(false);

  const selectedNeed = needs.find(n => n.id === selectedNeedId) || null;

  const handleMatch = async () => {
    if (!selectedNeed) return;
    if (!volunteers.length) {
      alert("Please add volunteers first.");
      return;
    }
    setLoading(true);
    try {
      const aiMatches = await rankVolunteersForNeed(selectedNeed, volunteers);
      const newMatches: MatchResult[] = aiMatches.map(m => ({
        needId: selectedNeed.id,
        volunteerId: m.volunteerId,
        score: m.score,
        reason: m.reason
      }));
      setMatches(newMatches);
    } catch (err) {
      console.error(err);
      alert("AI matching failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-lg font-semibold mb-3">AI Volunteer Allocation</h2>

      <select
        aria-label="Select a need"
        className="w-full border rounded-md p-2 mb-2 bg-slate-950 border-slate-700 text-slate-50"
        value={selectedNeedId}
        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedNeedId(e.target.value)}
      >
        <option value="">Select a need</option>
        {needs.map(n => (
          <option key={n.id} value={n.id}>
            {n.title} · {n.location} · urgency {n.urgency}
          </option>
        ))}
      </select>

      <button
        className="px-3 py-1 text-xs rounded-full bg-sky-500 hover:bg-sky-600"
        onClick={handleMatch}
        disabled={loading || !selectedNeed}
      >
        {loading ? "Matching…" : "AI · Match Volunteers"}
      </button>

      <div className="mt-4 space-y-2 max-h-64 overflow-y-auto">
        {matches.map(m => {
          const v: Volunteer | undefined = volunteers.find(
            vol => vol.id === m.volunteerId
          );
          if (!v) return null;
          return (
            <div
              key={m.volunteerId}
              className="border border-slate-700 rounded-md p-2 text-sm bg-slate-950"
            >
              <div className="flex justify-between mb-1">
                <span className="font-medium">{v.name}</span>
                <span className="px-2 py-0.5 text-xs rounded-full bg-slate-800">
                  {m.score}%
                </span>
              </div>
              <p className="text-xs text-slate-300">{m.reason}</p>
            </div>
          );
        })}
        {!matches.length && (
          <p className="text-xs text-slate-400">
            No matches yet. Select a need and run the matcher.
          </p>
        )}
      </div>
    </div>
  );
};

export default MatchView;