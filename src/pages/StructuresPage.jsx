import { useState, useCallback } from "react";
import { structuresApi } from "../api/structures";
import { useResource } from "../hooks/useResource";
import { useToast } from "../hooks/useToast";
import { Loading, ErrorMsg, Empty } from "../components/States";

export function StructuresPage() {
  const fetcher = useCallback(() => structuresApi.list(), []);
  const { data, loading, error, reload } = useResource(fetcher);
  const toast = useToast();

  const [structure, setStructure] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [editStructure, setEditStructure] = useState("");

  function startEdit(s) {
    setEditingId(s.id);
    setEditStructure(s.structure);
  }

  async function saveEdit(id) {
    if (!editStructure.trim()) { return; }
    try {
      await structuresApi.update(id, { structure: editStructure });
      toast("Saved", "ok");
      setEditingId(null);
      reload();
    } catch (e) { toast(e.message, "error"); }
  }

  async function create() {
    if (!structure.trim()) {
      toast("Enter a structure", "error");
      return;
    }
    try {
      await structuresApi.create({ structure });
      setStructure("");
      toast("Structure created", "ok");
      reload();
    } catch (e) { toast(e.message, "error"); }
  }

  async function remove(id) {
    try {
      await structuresApi.remove(id);
      toast("Deleted", "ok");
      reload();
    } catch (e) { toast(e.message, "error"); }
  }

  return (
    <div>
      <h1>Structures</h1>
      <p className="subtitle">Section layout for a training session. Usually one for all.</p>

      <div className="card">
        <h2>New structure</h2>
        <label>Section description</label>
        <textarea value={structure} onChange={(e) => setStructure(e.target.value)}
          placeholder="Cardio warm-up, strength block, endurance, core" />
        <button onClick={create}>Create</button>
      </div>

      <div className="card">
        <h2>All structures</h2>
        {loading && <Loading />}
        {error && <ErrorMsg message={error} />}
        {!loading && !error && data.length === 0 && <Empty>Nothing here yet.</Empty>}
        {data.map((s) => (
          <div className="item" key={s.id}
            style={editingId === s.id ? { flexDirection: "column", alignItems: "stretch" } : undefined}>
            {editingId === s.id ? (
              <>
                <label>Section description</label>
                <textarea value={editStructure}
                  onChange={(e) => setEditStructure(e.target.value)} />
                <div className="row" style={{ marginTop: 10 }}>
                  <button onClick={() => saveEdit(s.id)}>Save</button>
                  <button className="ghost" style={{ marginTop: 16 }}
                    onClick={() => setEditingId(null)}>Cancel</button>
                </div>
              </>
            ) : (
              <>
                <div className="item__main">
                  {s.structure}
                </div>
                <div style={{ display: "flex", gap: 6 }}>
                  <button className="ghost" onClick={() => startEdit(s)}>Edit</button>
                  <button className="danger" onClick={() => remove(s.id)}>Delete</button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
