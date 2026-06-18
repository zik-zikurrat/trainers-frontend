import { useCallback, useEffect, useState } from "react";
import { plansApi } from "../api/plans";
import { useResource } from "../hooks/useResource";
import { useToast } from "../hooks/useToast";
import { Loading, ErrorMsg, Empty } from "../components/States";

export function PlansPage() {
  const fetcher = useCallback(() => plansApi.list(), []);
  const { data, loading, error, reload } = useResource(fetcher);
  const toast = useToast();

  const [editingId, setEditingId] = useState(null);
  const [editFields, setEditFields] = useState({});

  // Pause auto-refresh while editing to avoid overwriting form state
  useEffect(() => {
    if (editingId) return;
    const t = setInterval(reload, 5000);
    return () => clearInterval(t);
  }, [reload, editingId]);

  function startEdit(p) {
    setEditingId(p.id);
    setEditFields({ plan: p.plan || "", accent: p.accent || "", skills: p.skills || "" });
  }

  async function saveEdit(id) {
    try {
      await plansApi.update(id, editFields);
      toast("Сохранено", "ok");
      setEditingId(null);
      reload();
    } catch (e) { toast(e.message, "error"); }
  }

  return (
    <div>
      <h1>Планы тренировок</h1>
      <p className="subtitle">Сгенерированные планы. Список обновляется автоматически.</p>

      {loading && data.length === 0 && <Loading />}
      {error && <ErrorMsg message={error} />}
      {!loading && !error && data.length === 0 && (
        <Empty>Пока нет планов. Сгенерируй первый во вкладке «Генерация».</Empty>
      )}

      {data.map((p) => (
        <div className="plan" key={p.id}>
          {editingId === p.id ? (
            <>
              <div className="row">
                <div>
                  <label>Акцент</label>
                  <input value={editFields.accent}
                    onChange={(e) => setEditFields(f => ({ ...f, accent: e.target.value }))} />
                </div>
                <div>
                  <label>Навыки</label>
                  <input value={editFields.skills}
                    onChange={(e) => setEditFields(f => ({ ...f, skills: e.target.value }))} />
                </div>
              </div>
              <label>Текст плана</label>
              <textarea value={editFields.plan} style={{ minHeight: 200 }}
                onChange={(e) => setEditFields(f => ({ ...f, plan: e.target.value }))} />
              <div className="row" style={{ marginTop: 10 }}>
                <button onClick={() => saveEdit(p.id)}>Сохранить</button>
                <button className="ghost" style={{ marginTop: 16 }}
                  onClick={() => setEditingId(null)}>Отмена</button>
              </div>
            </>
          ) : (
            <>
              <div className="plan__head">
                <span className="pill pill--accent">{p.accent || "—"}</span>
                {p.skills && <span className="pill">{p.skills}</span>}
                {p.status && <span className="pill">{p.status}</span>}
                <span className="plan__when">
                  {p.created_at ? new Date(p.created_at).toLocaleString("ru-RU") : ""}
                </span>
                <button className="ghost" style={{ marginLeft: "auto" }}
                  onClick={() => startEdit(p)}>Изменить</button>
              </div>
              <div className="plan__text">{p.plan}</div>
            </>
          )}
        </div>
      ))}
    </div>
  );
}
