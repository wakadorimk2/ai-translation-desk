import { Routes, Route, Navigate } from "react-router-dom";
import MobileNav from "./components/layout/MobileNav";
import FragmentManagement from "./pages/FragmentManagement";
import ConversationSupport from "./pages/ConversationSupport";
import ReviewScreen from "./pages/ReviewScreen";

export default function App() {
  return (
    <div className="min-h-screen pb-16">
      <Routes>
        <Route path="/" element={<Navigate to="/support" replace />} />
        <Route path="/fragments" element={<FragmentManagement />} />
        <Route path="/support" element={<ConversationSupport />} />
        <Route path="/review" element={<ReviewScreen />} />
      </Routes>
      <MobileNav />
    </div>
  );
}
