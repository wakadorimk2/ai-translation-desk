import { Routes, Route, Navigate } from "react-router-dom";
import MobileNav from "./components/layout/MobileNav";
import FragmentManagement from "./pages/FragmentManagement";
import ConversationSupport from "./pages/ConversationSupport";
import ReviewScreen from "./pages/ReviewScreen";
import LoginPage from "./pages/LoginPage";
import { useAuth } from "./hooks/useAuth";

function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-slate-400 text-sm">読み込み中...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/*"
        element={
          <AuthGuard>
            <div className="min-h-screen pb-16">
              <Routes>
                <Route path="/" element={<Navigate to="/support" replace />} />
                <Route path="/fragments" element={<FragmentManagement />} />
                <Route path="/support" element={<ConversationSupport />} />
                <Route path="/review" element={<ReviewScreen />} />
              </Routes>
              <MobileNav />
            </div>
          </AuthGuard>
        }
      />
    </Routes>
  );
}
