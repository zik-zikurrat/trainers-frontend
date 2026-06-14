export function ShortId({ id }) {
  if (!id) return null;
  return <span className="id">{String(id).slice(0, 8)}…</span>;
}
