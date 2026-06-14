import { NavLink } from "react-router-dom";

const links = [
  { to: "/plans", label: "Планы" },
  { to: "/generate", label: "Генерация" },
  { to: "/exercises", label: "Упражнения" },
  { to: "/groups", label: "Группы" },
  { to: "/structures", label: "Структуры" },
];

export function Sidebar() {
  return (
    <aside className="sidebar">
      <h1 className="brand">Trainers<span>·</span>Mgr</h1>
      <nav className="nav">
        {links.map((l) => (
          <NavLink key={l.to} to={l.to}>
            {l.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
