import { useState, useCallback } from "react";
import { exercisesApi } from "../api/exercises";
import { useResource } from "../hooks/useResource";
import { useToast } from "../hooks/useToast";
import { Loading, ErrorMsg, Empty } from "../components/States";

export function ExercisesPage() {
  const fetcher = useCallback(() => exercisesApi.list(), []);
  const { data, loading, error, reload } = useResource(fetcher);
  const toast = useToast();

  const [muscle, setMuscle] = useState("");
  const [position, setPosition] = useState("");
  const [description, setDescription] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [editFields, setEditFields] = useState({});

  function startEdit(e) {
    setEditingId(e.id);
    setEditFields({ muscle: e.muscle, position: e.position || "", description: e.description });
  }

  async function saveEdit(id) {
    try {
      await exercisesApi.update(id, editFields);
      toast("Saved", "ok");
      setEditingId(null);
      reload();
    } catch (e) { toast(e.message, "error"); }
  }

  async function create() {
    if (!muscle || !position || !description) {
      toast("Fill in all fields", "error");
      return;
    }
    try {
      await exercisesApi.create({ muscle, position, description });
      setMuscle(""); setPosition(""); setDescription("");
      toast("Exercise added", "ok");
      reload();
    } catch (e) { toast(e.message, "error"); }
  }

  async function remove(id) {
    try {
      await exercisesApi.remove(id);
      toast("Deleted", "ok");
      reload();
    } catch (e) { toast(e.message, "error"); }
  }

  return (
    <div>
      <h1>Exercises</h1>
      <p className="subtitle">Exercise library used to build training sessions.</p>

      <div className="card">
        <h2>New exercise</h2>
        <div className="row">
          <div>
            <label>Muscle</label>
            <input value={muscle} onChange={(e) => setMuscle(e.target.value)} placeholder="back" />
          </div>
          <div>
            <label>Position</label>
            <input value={position} onChange={(e) => setPosition(e.target.value)} placeholder="standing" />
          </div>
        </div>
        <label>Description</label>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Barbell row, 4x10" />
        <button onClick={create}>Add</button>
      </div>

      <div className="card">
        <h2>All exercises</h2>
        {loading && <Loading />}
        {error && <ErrorMsg message={error} />}
        {!loading && !error && data.length === 0 && <Empty>Nothing here yet.</Empty>}
        {data.map((e) => (
          <div className="item" key={e.id}
            style={editingId === e.id ? { flexDirection: "column", alignItems: "stretch" } : undefined}>
            {editingId === e.id ? (
              <>
                <div className="row">
                  <div>
                    <label>Muscle</label>
                    <input value={editFields.muscle}
                      onChange={(ev) => setEditFields(f => ({ ...f, muscle: ev.target.value }))} />
                  </div>
                  <div>
                    <label>Position</label>
                    <input value={editFields.position}
                      onChange={(ev) => setEditFields(f => ({ ...f, position: ev.target.value }))} />
                  </div>
                </div>
                <label>Description</label>
                <textarea value={editFields.description}
                  onChange={(ev) => setEditFields(f => ({ ...f, description: ev.target.value }))} />
                <div className="row" style={{ marginTop: 10 }}>
                  <button onClick={() => saveEdit(e.id)}>Save</button>
                  <button className="ghost" style={{ marginTop: 16 }}
                    onClick={() => setEditingId(null)}>Cancel</button>
                </div>
              </>
            ) : (
              <>
                <div className="item__main">
                  <span className="pill">{e.muscle}</span>
                  {e.position && <span className="pill">{e.position}</span>}
                  {e.description}
                </div>
                <div style={{ display: "flex", gap: 6 }}>
                  <button className="ghost" onClick={() => startEdit(e)}>Edit</button>
                  <button className="danger" onClick={() => remove(e.id)}>Delete</button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
