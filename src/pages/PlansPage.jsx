import { useCallback, useEffect } from "react";
import { plansApi } from "../api/plans";
import { useResource } from "../hooks/useResource";
import { Loading, ErrorMsg, Empty } from "../components/States";

export function PlansPage() {
  const fetcher = useCallback(() => plansApi.list(), []);
  const { data, loading, error, reload } = useResource(fetcher);

  useEffect(() => {
    const t = setInterval(reload, 5000);
    return () => clearInterval(t);
  }, [reload]);

  return (
    <div>
      <h1>Планы тренировок</h1>
      <p className="subtitle">Сгенерированные планы. Список обновляется автоматически.</p>

      {loading && data.length === 0 && <Loading />}
      {error && <ErrorMsg message={error} />}
      {!loading && !error && data.length === 0 && <Empty>Пока нет планов. Сгенерируй первый во вкладке «Генерация».</Empty>}

      {data.map((p) => (
        <div className="plan" key={p.id}>
          <div className="plan__head">
            <span className="pill pill--accent">{p.accent || "—"}</span>
            {p.skills && <span className="pill">{p.skills}</span>}
            {p.status && <span className="pill">{p.status}</span>}
            <span className="plan__when">
              {p.created_at ? new Date(p.created_at).toLocaleString("ru-RU") : ""}
            </span>
          </div>
          <div className="plan__text">{p.plan}</div>
        </div>
      ))}
    </div>
  );
}
