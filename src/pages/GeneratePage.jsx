import { useState, useCallback } from "react";
import { plansApi } from "../api/plans";
import { groupsApi } from "../api/groups";
import { structuresApi } from "../api/structures";
import { useResource } from "../hooks/useResource";
import { useToast } from "../hooks/useToast";
import { Loading } from "../components/States";

export function GeneratePage() {
  const groupsFetcher = useCallback(() => groupsApi.list(), []);
  const structFetcher = useCallback(() => structuresApi.list(), []);
  const groups = useResource(groupsFetcher);
  const structures = useResource(structFetcher);
  const toast = useToast();

  const [trainType, setTrainType] = useState("");
  const [structureId, setStructureId] = useState("");
  const [busy, setBusy] = useState(false);

  async function generate() {
    if (!trainType) { toast("Введи тип тренировки", "error"); return; }
    if (!structureId) { toast("Выбери структуру", "error"); return; }
    setBusy(true);
    try {
      await plansApi.generate({ train_type: trainType, structure_id: structureId });
      toast("Генерация запущена — план появится во вкладке «Планы»", "ok");
    } catch (e) {
      toast(e.message, "error");
    } finally {
      setBusy(false);
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
