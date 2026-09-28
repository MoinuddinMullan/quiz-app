import { Navigate, Route, Routes } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import DashboardPage from './pages/DashboardPage';
import HistoryPage from './pages/HistoryPage';
import LoginPage from './pages/LoginPage';
import ProfilePage from './pages/ProfilePage';
import QuizPage from './pages/QuizPage';
import RegisterPage from './pages/RegisterPage';
import ResultsPage from './pages/ResultsPage';
import ReviewPage from './pages/ReviewPage';

const App = () => {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/quiz/:subject" element={<QuizPage />} />
          <Route path="/results/:id" element={<ResultsPage />} />
          <Route path="/review/:id" element={<ReviewPage />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Route>

        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </AuthProvider>
  );
};

export default App;
