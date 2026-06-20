export function Loading() {
  return <div className="spinner">Loading…</div>;
}
export function ErrorMsg({ message }) {
  return <div className="error">Error: {message}</div>;
}
export function Empty({ children }) {
  return <div className="empty">{children}</div>;
}
