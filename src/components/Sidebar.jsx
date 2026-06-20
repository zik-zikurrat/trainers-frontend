import { NavLink } from "react-router-dom";

const links = [
  { to: "/plans", label: "Plans" },
  { to: "/generate", label: "Generate" },
  { to: "/exercises", label: "Exercises" },
  { to: "/groups", label: "Groups" },
  { to: "/structures", label: "Structures" },
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
