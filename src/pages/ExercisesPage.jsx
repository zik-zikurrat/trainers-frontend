import { useState, useCallback } from "react";
import { exercisesApi } from "../api/exercises";
import { useResource } from "../hooks/useResource";
import { useToast } from "../hooks/useToast";
import { Loading, ErrorMsg, Empty } from "../components/States";
import { ShortId } from "../components/ShortId";

export function ExercisesPage() {
  const fetcher = useCallback(() => exercisesApi.list(), []);
  const { data, loading, error, reload } = useResource(fetcher);
  const toast = useToast();

  const [muscle, setMuscle] = useState("");
  const [position, setPosition] = useState("");
  const [description, setDescription] = useState("");

  async function create() {
    if (!muscle || !position || !description) {
      toast("Заполни все поля", "error");
      return;
    }
    try {
      await exercisesApi.create({ muscle, position, description });
      setMuscle(""); setPosition(""); setDescription("");
      toast("Упражнение добавлено", "ok");
      reload();
    } catch (e) { toast(e.message, "error"); }
  }

  async function remove(id) {
    try {
      await exercisesApi.remove(id);
      toast("Удалено", "ok");
      reload();
    } catch (e) { toast(e.message, "error"); }
  }

  return (
    <div>
      <h1>Упражнения</h1>
      <p className="subtitle">Библиотека упражнений, из которой собираются тренировки.</p>

      <div className="card">
        <h2>Новое упражнение</h2>
        <div className="row">
          <div>
            <label>Мышца</label>
            <input value={muscle} onChange={(e) => setMuscle(e.target.value)} placeholder="спина" />
          </div>
          <div>
            <label>Позиция</label>
            <input value={position} onChange={(e) => setPosition(e.target.value)} placeholder="стоя" />
          </div>
        </div>
        <label>Описание</label>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Тяга штанги в наклоне, 4x10" />
        <button onClick={create}>Добавить</button>
      </div>

      <div className="card">
        <h2>Все упражнения</h2>
        {loading && <Loading />}
        {error && <ErrorMsg message={error} />}
        {!loading && !error && data.length === 0 && <Empty>Пока пусто.</Empty>}
        {data.map((e) => (
          <div className="item" key={e.id}>
            <div className="item__main">
              <span className="pill">{e.muscle}</span>
              {e.position && <span className="pill">{e.position}</span>}
              {e.description}
              <div className="item__meta"><ShortId id={e.id} /></div>
            </div>
            <button className="danger" onClick={() => remove(e.id)}>Удалить</button>
          </div>
        ))}
      </div>
    </div>
  );
}
