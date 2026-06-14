import { useState, useCallback } from "react";
import { structuresApi } from "../api/structures";
import { useResource } from "../hooks/useResource";
import { useToast } from "../hooks/useToast";
import { Loading, ErrorMsg, Empty } from "../components/States";
import { ShortId } from "../components/ShortId";

export function StructuresPage() {
  const fetcher = useCallback(() => structuresApi.list(), []);
  const { data, loading, error, reload } = useResource(fetcher);
  const toast = useToast();
  const [structure, setStructure] = useState("");

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
        <textarea value={structure} onChange={(e) => setStructure(e.target.value)} placeholder="Кардио разминка, силовая часть, выносливость, пресс" />
        <button onClick={create}>Создать</button>
      </div>

      <div className="card">
        <h2>Все структуры</h2>
        {loading && <Loading />}
        {error && <ErrorMsg message={error} />}
        {!loading && !error && data.length === 0 && <Empty>Пока пусто.</Empty>}
        {data.map((s) => (
          <div className="item" key={s.id}>
            <div className="item__main">
              {s.structure}
              <div className="item__meta"><ShortId id={s.id} /></div>
            </div>
            <button className="danger" onClick={() => remove(s.id)}>Удалить</button>
          </div>
        ))}
      </div>
    </div>
  );
}
