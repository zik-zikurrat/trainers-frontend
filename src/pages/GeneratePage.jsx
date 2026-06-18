import { useState, useCallback, useRef } from "react";
import { plansApi } from "../api/plans";
import { groupsApi } from "../api/groups";
import { structuresApi } from "../api/structures";
import { useResource } from "../hooks/useResource";
import { useToast } from "../hooks/useToast";
import { Loading } from "../components/States";

const POLL_INTERVAL = 3000;
const POLL_TIMEOUT = 5 * 60 * 1000;

export function GeneratePage() {
  const groupsFetcher = useCallback(() => groupsApi.list(), []);
  const structFetcher = useCallback(() => structuresApi.list(), []);
  const groups = useResource(groupsFetcher);
  const structures = useResource(structFetcher);
  const toast = useToast();

  const [trainType, setTrainType] = useState("");
  const [structureId, setStructureId] = useState("");
  const [busy, setBusy] = useState(false);
  const pollRef = useRef(null);

  function stopPolling() {
    if (pollRef.current) {
      clearTimeout(pollRef.current);
      pollRef.current = null;
    }
  }

  function startPolling(taskId, deadline) {
    if (Date.now() > deadline) {
      setBusy(false);
      toast("Превышено время ожидания генерации", "error");
      return;
    }
    pollRef.current = setTimeout(async () => {
      try {
        const { status } = await plansApi.getTask(taskId);
        if (status === "DONE") {
          setBusy(false);
          toast("Генерация завершена успешно", "ok");
        } else if (status === "ERROR") {
          setBusy(false);
          toast("Ошибка генерации", "error");
        } else {
          startPolling(taskId, deadline);
        }
      } catch {
        startPolling(taskId, deadline);
      }
    }, POLL_INTERVAL);
  }

  async function generate() {
    if (!trainType) { toast("Введи тип тренировки", "error"); return; }
    if (!structureId) { toast("Выбери структуру", "error"); return; }
    stopPolling();
    setBusy(true);
    try {
      const { task_id } = await plansApi.generate({ train_type: trainType, structure_id: structureId });
      toast("Генерация запущена…", "ok");
      startPolling(task_id, Date.now() + POLL_TIMEOUT);
    } catch (e) {
      setBusy(false);
      toast(e.message, "error");
    }
  }

  return (
    <div>
      <h1>Генерация плана</h1>
      <p className="subtitle">Акцент чередуется автоматически по истории группы. Генерация идёт в фоне.</p>

      <div className="card">
        <h2>Параметры</h2>
        {(groups.loading || structures.loading) && <Loading />}

        <label>Тип тренировки (название группы)</label>
        <input list="groups-list" value={trainType} onChange={(e) => setTrainType(e.target.value)} placeholder="upper body" />
        <datalist id="groups-list">
          {groups.data.map((g) => <option key={g.id} value={g.name} />)}
        </datalist>

        <label>Структура</label>
        <select value={structureId} onChange={(e) => setStructureId(e.target.value)}>
          <option value="">— выбери —</option>
          {structures.data.map((s) => (
            <option key={s.id} value={s.id}>{(s.structure || "").slice(0, 60)}</option>
          ))}
        </select>

        <button onClick={generate} disabled={busy}>
          {busy ? "Запуск…" : "Сгенерировать →"}
        </button>
      </div>
    </div>
  );
}
