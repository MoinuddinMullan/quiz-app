import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('quizToken');
    const storedStudent = localStorage.getItem('quizStudent');

    if (storedToken && storedStudent) {
      try {
        setStudent(JSON.parse(storedStudent));
      } catch (error) {
        localStorage.removeItem('quizToken');
        localStorage.removeItem('quizStudent');
      }
    }

    setLoading(false);
  }, []);

  const login = (token, studentData) => {
    localStorage.setItem('quizToken', token);
    localStorage.setItem('quizStudent', JSON.stringify(studentData));
    setStudent(studentData);
  };

  const logout = () => {
    localStorage.removeItem('quizToken');
    localStorage.removeItem('quizStudent');
    setStudent(null);
  };

  const value = useMemo(
    () => ({ student, login, logout, loading, isAuthenticated: !!student }),
    [student, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export default AuthContext;
