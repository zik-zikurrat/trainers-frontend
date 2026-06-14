export function Loading() {
  return <div className="spinner">Загрузка…</div>;
}
export function ErrorMsg({ message }) {
  return <div className="error">Ошибка: {message}</div>;
}
export function Empty({ children }) {
  return <div className="empty">{children}</div>;
}
