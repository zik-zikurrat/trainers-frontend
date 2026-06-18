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
      toast("Сохранено", "ok");
      setEditingId(null);
      reload();
    } catch (e) { toast(e.message, "error"); }
  }

  async function create() {
    if (!structure.trim()) {
      toast("Введи структуру", "error");
      return;
    }
    try {
      await structuresApi.create({ structure });
      setStructure("");
      toast("Структура создана", "ok");
      reload();
    } catch (e) { toast(e.message, "error"); }
  }

  async function remove(id) {
    try {
      await structuresApi.remove(id);
      toast("Удалено", "ok");
      reload();
    } catch (e) { toast(e.message, "error"); }
  }

  return (
    <div>
      <h1>Структуры</h1>
      <p className="subtitle">Каркас секций тренировки. Обычно одна на всё.</p>

      <div className="card">
        <h2>Новая структура</h2>
        <label>Описание секций</label>
        <textarea value={structure} onChange={(e) => setStructure(e.target.value)}
          placeholder="Кардио разминка, силовая часть, выносливость, пресс" />
        <button onClick={create}>Создать</button>
      </div>

      <div className="card">
        <h2>Все структуры</h2>
        {loading && <Loading />}
        {error && <ErrorMsg message={error} />}
        {!loading && !error && data.length === 0 && <Empty>Пока пусто.</Empty>}
        {data.map((s) => (
          <div className="item" key={s.id}
            style={editingId === s.id ? { flexDirection: "column", alignItems: "stretch" } : undefined}>
            {editingId === s.id ? (
              <>
                <label>Описание секций</label>
                <textarea value={editStructure}
                  onChange={(e) => setEditStructure(e.target.value)} />
                <div className="row" style={{ marginTop: 10 }}>
                  <button onClick={() => saveEdit(s.id)}>Сохранить</button>
                  <button className="ghost" style={{ marginTop: 16 }}
                    onClick={() => setEditingId(null)}>Отмена</button>
                </div>
              </>
            ) : (
              <>
                <div className="item__main">
                  {s.structure}
                </div>
                <div style={{ display: "flex", gap: 6 }}>
                  <button className="ghost" onClick={() => startEdit(s)}>Изменить</button>
                  <button className="danger" onClick={() => remove(s.id)}>Удалить</button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
