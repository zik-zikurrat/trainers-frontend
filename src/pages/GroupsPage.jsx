import { useState, useCallback } from "react";
import { groupsApi } from "../api/groups";
import { useResource } from "../hooks/useResource";
import { useToast } from "../hooks/useToast";
import { Loading, ErrorMsg, Empty } from "../components/States";

// Cycles are separated by ; — order defines weekly rotation.
function splitCycle(s) {
  return s.split(";").map((x) => x.trim()).filter(Boolean);
}

export function GroupsPage() {
  const fetcher = useCallback(() => groupsApi.list(), []);
  const { data, loading, error, reload } = useResource(fetcher);
  const toast = useToast();

  const [name, setName] = useState("");
  const [accent, setAccent] = useState("");
  const [skills, setSkills] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [editFields, setEditFields] = useState({});

  function startEdit(g) {
    setEditingId(g.id);
    setEditFields({
      name: g.name,
      accent: (g.accentCycle || g.accent_cycle || []).join("; "),
      skills: (g.skillCycle || g.skill_cycle || []).join("; "),
    });
  }

  async function saveEdit(id) {
    const accent_cycle = splitCycle(editFields.accent);
    const skill_cycle = splitCycle(editFields.skills);
    if (!editFields.name || !accent_cycle.length || !skill_cycle.length) {
      toast("Fill in all fields", "error");
      return;
    }
    try {
      await groupsApi.update(id, { name: editFields.name, accent_cycle, skill_cycle });
      toast("Saved", "ok");
      setEditingId(null);
      reload();
    } catch (e) { toast(e.message, "error"); }
  }

  async function create() {
    const accent_cycle = splitCycle(accent);
    const skill_cycle = splitCycle(skills);
    if (!name || !accent_cycle.length || !skill_cycle.length) {
      toast("Fill in all fields", "error");
      return;
    }
    try {
      await groupsApi.create({ name, accent_cycle, skill_cycle });
      setName(""); setAccent(""); setSkills("");
      toast("Group created", "ok");
      reload();
    } catch (e) { toast(e.message, "error"); }
  }

  async function remove(id) {
    try {
      await groupsApi.remove(id);
      toast("Deleted", "ok");
      reload();
    } catch (e) { toast(e.message, "error"); }
  }

  return (
    <div>
      <h1>Training Groups</h1>
      <p className="subtitle">Name (used during generation) and accent/skill cycles. Cycle order = weekly rotation.</p>

      <div className="card">
        <h2>New group</h2>
        <label>Name</label>
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="upper body" />
        <label>Accent cycle (semicolon-separated)</label>
        <input value={accent} onChange={(e) => setAccent(e.target.value)} placeholder="back, biceps; chest, triceps; shoulders" />
        <label>Skill cycle (semicolon-separated)</label>
        <input value={skills} onChange={(e) => setSkills(e.target.value)} placeholder="balance, explosive power; coordination, endurance" />
        <button onClick={create}>Create</button>
      </div>

      <div className="card">
        <h2>All groups</h2>
        {loading && <Loading />}
        {error && <ErrorMsg message={error} />}
        {!loading && !error && data.length === 0 && <Empty>Nothing here yet.</Empty>}
        {data.map((g) => (
          <div className="item" key={g.id}
            style={editingId === g.id ? { flexDirection: "column", alignItems: "stretch" } : undefined}>
            {editingId === g.id ? (
              <>
                <label>Name</label>
                <input value={editFields.name}
                  onChange={(e) => setEditFields(f => ({ ...f, name: e.target.value }))} />
                <label>Accent cycle (semicolon-separated)</label>
                <input value={editFields.accent}
                  onChange={(e) => setEditFields(f => ({ ...f, accent: e.target.value }))} />
                <label>Skill cycle (semicolon-separated)</label>
                <input value={editFields.skills}
                  onChange={(e) => setEditFields(f => ({ ...f, skills: e.target.value }))} />
                <div className="row" style={{ marginTop: 10 }}>
                  <button onClick={() => saveEdit(g.id)}>Save</button>
                  <button className="ghost" style={{ marginTop: 16 }}
                    onClick={() => setEditingId(null)}>Cancel</button>
                </div>
              </>
            ) : (
              <>
                <div className="item__main">
                  <b>{g.name}</b>
                  <div className="item__meta">
                    accents: {(g.accentCycle || g.accent_cycle || []).join(" → ")}
                  </div>
                  <div className="item__meta">
                    skills: {(g.skillCycle || g.skill_cycle || []).join(" → ")}
                  </div>
                </div>
                <div style={{ display: "flex", gap: 6 }}>
                  <button className="ghost" onClick={() => startEdit(g)}>Edit</button>
                  <button className="danger" onClick={() => remove(g.id)}>Delete</button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
