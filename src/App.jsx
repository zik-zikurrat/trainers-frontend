import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ToastProvider } from "./hooks/useToast";
import { Sidebar } from "./components/Sidebar";
import { PlansPage } from "./pages/PlansPage";
import { GeneratePage } from "./pages/GeneratePage";
import { ExercisesPage } from "./pages/ExercisesPage";
import { GroupsPage } from "./pages/GroupsPage";
import { StructuresPage } from "./pages/StructuresPage";

export default function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <div className="layout">
          <Sidebar />
          <main className="main">
            <Routes>
              <Route path="/" element={<Navigate to="/plans" replace />} />
              <Route path="/plans" element={<PlansPage />} />
              <Route path="/generate" element={<GeneratePage />} />
              <Route path="/exercises" element={<ExercisesPage />} />
              <Route path="/groups" element={<GroupsPage />} />
              <Route path="/structures" element={<StructuresPage />} />
            </Routes>
          </main>
        </div>
      </ToastProvider>
    </BrowserRouter>
  );
}
