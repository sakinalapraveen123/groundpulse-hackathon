import React, { useState } from "react";
import type { Need } from "../types";
import { extractNeedFromReport } from "../lib/geminiClient";

interface Props {
  needs: Need[];
  setNeeds: (needs: Need[]) => void;
}

const NgoNeedView: React.FC<Props> = ({ needs, setNeeds }) => {
  const [rawReport, setRawReport] = useState("");
  const [draft, setDraft] = useState<Partial<Need>>({});
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!rawReport.trim()) return;
    setLoading(true);
    try {
      const data = await extractNeedFromReport(rawReport);
      setDraft({
        title: data.title,
        category: data.category,
        location: data.location,
        urgency: data.urgency,
        requiredSkills: data.requiredSkills,
        peopleNeeded: data.peopleNeeded
      });
    } catch (err) {
      console.error(err);
      alert("AI understanding failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = () => {
    if (!draft.title || !draft.location || !draft.peopleNeeded) {
      alert("Please fill all fields.");
      return;
    }
    const newNeed: Need = {
      id: crypto.randomUUID(),
      rawReport,
      title: draft.title!,
      category: draft.category || "Other",
      location: draft.location!,
      urgency: draft.urgency ?? 3,
      requiredSkills: draft.requiredSkills || [],
      peopleNeeded: draft.peopleNeeded!,
      status: "open"
    };
    setNeeds([newNeed, ...needs]);
    setRawReport("");
    setDraft({});
  };

  return (
    <div className="p-6">
      <h2 className="text-lg font-semibold mb-3">
        Report a Community Need (AI assisted)
      </h2>
      <textarea
        className="w-full border rounded-md p-2 text-sm mb-2 bg-slate-950 border-slate-700 text-slate-50"
        rows={5}
        placeholder="Paste a field report / WhatsApp message here…"
        value={rawReport}
        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setRawReport(e.target.value)}
      />
      <button
        className="px-3 py-1 text-xs rounded-full bg-sky-500 hover:bg-sky-600 mr-2"
        onClick={handleGenerate}
        disabled={loading}
      >
        {loading ? "Understanding…" : "AI · Extract Need"}
      </button>

      {draft.title && (
        <div className="mt-4 space-y-2 text-sm">
          <input
            className="w-full border rounded-md p-2 bg-slate-950 border-slate-700 text-slate-50"
            placeholder="Title"
            value={draft.title}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDraft({ ...draft, title: e.target.value })}
          />
          <input
            className="w-full border rounded-md p-2 bg-slate-950 border-slate-700 text-slate-50"
            placeholder="Location"
            value={draft.location}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDraft({ ...draft, location: e.target.value })}
          />
          <input
            className="w-full border rounded-md p-2 bg-slate-950 border-slate-700 text-slate-50"
            placeholder="Category"
            value={draft.category}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDraft({ ...draft, category: e.target.value })}
          />
          <input
            type="number"
            min={1}
            max={5}
            className="w-full border rounded-md p-2 bg-slate-950 border-slate-700 text-slate-50"
            placeholder="Urgency (1-5)"
            value={draft.urgency ?? 3}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setDraft({ ...draft, urgency: Number(e.target.value) })
            }
          />
          <input
            className="w-full border rounded-md p-2 bg-slate-950 border-slate-700 text-slate-50"
            placeholder="Required skills (comma separated)"
            value={draft.requiredSkills?.join(", ") ?? ""}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setDraft({
                ...draft,
                requiredSkills: e.target.value
                  .split(",")
                  .map((s: string) => s.trim())
                  .filter(Boolean)
              })
            }
          />
          <input
            type="number"
            className="w-full border rounded-md p-2 bg-slate-950 border-slate-700 text-slate-50"
            placeholder="People needed"
            value={draft.peopleNeeded ?? 1}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setDraft({ ...draft, peopleNeeded: Number(e.target.value) })
            }
          />
          <button
            className="px-3 py-1 text-xs rounded-full bg-emerald-500 hover:bg-emerald-600"
            onClick={handleSave}
          >
            Save Need
          </button>
        </div>
      )}
    </div>
  );
};

export default NgoNeedView;