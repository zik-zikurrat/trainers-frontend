import { useState, useCallback } from "react";
import { groupsApi } from "../api/groups";
import { useResource } from "../hooks/useResource";
import { useToast } from "../hooks/useToast";
import { Loading, ErrorMsg, Empty } from "../components/States";

// Циклы вводятся через ; — порядок задаёт чередование по неделям.
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

  async function create() {
    const accent_cycle = splitCycle(accent);
    const skill_cycle = splitCycle(skills);
    if (!name || !accent_cycle.length || !skill_cycle.length) {
      toast("Заполни все поля", "error");
      return;
    }
    try {
      await groupsApi.create({ name, accent_cycle, skill_cycle });
      setName(""); setAccent(""); setSkills("");
      toast("Группа создана", "ok");
      reload();
    } catch (e) { toast(e.message, "error"); }
  }

  async function remove(id) {
    try {
      await groupsApi.remove(id);
      toast("Удалено", "ok");
      reload();
    } catch (e) { toast(e.message, "error"); }
  }

  return (
    <div>
      <h1>Группы тренировок</h1>
      <p className="subtitle">Название (его вводят при генерации) и циклы акцентов/навыков. Порядок в цикле = чередование по неделям.</p>

      <div className="card">
        <h2>Новая группа</h2>
        <label>Название</label>
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="upper body" />
        <label>Цикл акцентов (через ;)</label>
        <input value={accent} onChange={(e) => setAccent(e.target.value)} placeholder="спина, бицепс; грудь, трицепс; плечи" />
        <label>Цикл навыков (через ;)</label>
        <input value={skills} onChange={(e) => setSkills(e.target.value)} placeholder="баланс, взрывная сила; координация, выносливость" />
        <button onClick={create}>Создать</button>
      </div>

      <div className="card">
        <h2>Все группы</h2>
        {loading && <Loading />}
        {error && <ErrorMsg message={error} />}
        {!loading && !error && data.length === 0 && <Empty>Пока пусто.</Empty>}
        {data.map((g) => (
          <div className="item" key={g.id}>
            <div className="item__main">
              <b>{g.name}</b>
              <div className="item__meta">
                акценты: {(g.accentCycle || g.accent_cycle || []).join(" → ")}
              </div>
              <div className="item__meta">
                навыки: {(g.skillCycle || g.skill_cycle || []).join(" → ")}
              </div>
            </div>
            <button className="danger" onClick={() => remove(g.id)}>Удалить</button>
          </div>
        ))}
      </div>
    </div>
  );
}
